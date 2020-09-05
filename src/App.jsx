import React, { Component } from 'react';
import './App.css'
import { Grid, Button, Input, Icon, Dialog, Form, Notification, Select } from '@alifd/next';

// 图谱面板，左侧仍为逻辑图谱，右侧为schema源码编辑框

import { v4 as uuidv4 } from "uuid";
import G6 from "@antv/g6";
import _ from 'lodash'
import {
    stringify,
    parse,
    textInit,
    isJson,
    rgb,
    fittingString,
    isValidHtmlTag,
    isValidStyleKey,
    isValidFunction,
    isValidCompTag,
} from "./scripts/utils";
import { parseData } from "./scripts/graph";

// 测试使用，实际拿到的应该是iceluna平台传来的json格式的schema
import schema0 from "./schema/0";
import schema1 from "./schema/1";
import schema2 from "./schema/2";
import schema3 from "./schema/3";
import schema4 from "./schema/4";
import schema5 from "./schema/5";

const { Row, Col } = Grid;
const FormItem = Form.Item;

let schema = null; //加uuid的schema
let pureSchema = null; //iceluna生成的schema
let graph;
let newUuid;
let timestamp = Date.now();

class App extends Component {
    constructor(props) {
        super(props);
        this.inputRef = React.createRef();
        this.containerRef = React.createRef();
        this.schemaRef = React.createRef();

        this.state = {
            colorDic: {},
            graphType: "comp_type",
            input: "",
            nodeEditVisible: false,
            curEditUuid: "",
            curEditItem: {},
            curEditModel: {},
            curEditKey: "",
            curEditValue: "",
            isLeafNode: false,
            operationType: "",
            isFunction: false,
            compTypes: [],
            dataSource: [],//存储全部的搜索数据
            selectOptions: []//存储根据输入值筛选的搜索数据
        };
    }

    componentDidMount() {
        // 初始化时读取iceluna传递的schema填充至右侧编辑框
        this.schemaRef.current.innerHTML = stringify(schema1)
    }

    // 弹窗控制
    onOpen = () => {
        this.setState({
            nodeEditVisible: true
        });
    }

    onClose = () => {
        this.setState({
            nodeEditVisible: false
        });
    }
    // 搜索
    handleSearch(value) {
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        this.searchTimeout = setTimeout(() => {
            if (value) {
                const select = [...this.state.dataSource].filter(item => item.toLowerCase().includes(value.toLowerCase()))
                this.setState({
                    selectOptions: select.map(item => ({
                        label: item, value: item
                    }))
                });
            } else {
                this.setState({ selectOptions: [] })
            }
        }, 100);
    }
    // 定义函数
    hightlight(label) {
        const searched = graph.findAllByState("node", "Searched");
        searched.forEach((node) => {
            graph.clearItemStates(node);
        });
        graph.fitView();
        const nodes = graph.findAll("node", (node) => {
            return node.get("model").label.toLowerCase() === label.toLowerCase();
        });
        nodes.forEach((label) => {
            graph.setItemState(label, "Searched", true);
        });
        return nodes;
    }
    // 获取图谱类型
    getGraphType() {
        const graphTypeJson = {
            comp_type: "组件图谱",
            style_type: "样式图谱",
            props_type: "属性图谱",
            event_type: "事件图谱",
            data_type: "数据源图谱",
        };
        return graphTypeJson[this.state.graphType];
    }
    // 切换图谱类型
    selectGraphType(type) {
        let blockHighlight = false;
        if (type === "block_type") {
            type = "comp_type";
            blockHighlight = true;
        }
        this.setState({
            graphType: type
        }, () => {
            this.genGraph();
            if (blockHighlight) this.hightlight("Block");
        })
    }
    // 编辑弹窗点击确定
    edit() {
        let newLabel = "";
        this.state.isLeafNode
            ? (newLabel = `{"${this.state.curEditKey}":"${this.state.curEditValue}"}`)
            : (newLabel = this.state.curEditKey);

        // 输入label正确性校验 graphType
        if (!this.state.isLeafNode) {
            // html标签正确性校验
            if (
                !(
                    isValidHtmlTag(newLabel.toLowerCase()) ||
                    isValidCompTag(newLabel.toLowerCase())
                )
            ) {
                this._error("输入内容格式不正确");
                return;
            } else {
                newLabel =
                    newLabel.charAt(0).toUpperCase() + newLabel.slice(1).toLowerCase();
            }
        } else {
            if (this.state.graphType === "style_type") {
                newLabel = newLabel.replace(/([A-Z])/g, "-$1").toLowerCase();
                let json = JSON.parse(newLabel);
                if (!isValidStyleKey(Object.keys(json)[0])) {
                    this._error("输入style的key不正确");
                    return;
                }
            }
            if (this.state.graphType === "event_type") {
                let json = parse(newLabel);

                if (!isValidFunction(Object.keys(json)[1])) {
                    this._error("输入的函数function格式不正确");
                    return;
                }
            }
        }
        let copyCurEditModel = Object.assign({}, this.state.curEditModel)
        copyCurEditModel.label = newLabel
        this.setState({
            nodeEditVisible: false,
            curEditModel: copyCurEditModel
        })
        //console.log(this.state.curEditModel, newLabel);

        let uuid = this.state.curEditItem.get("id");
        let oldkey;
        if (this.state.isLeafNode) {
            uuid = this.state.curEditItem.getNeighbors("source")[0].get("id");
            oldkey = this.state.curEditItem
                .get("model")
                .label.replace(/{|}|\"/g, "")
                .split(":")[0];
            newLabel = parse(newLabel);
        }

        this.updateSchema(schema, uuid, newLabel, this.state.isLeafNode, oldkey);

        pureSchema = _.cloneDeep(schema);
        this._formatSchema(pureSchema);
        this.schemaRef.current.innerHTML = stringify(pureSchema);
        // 更新画布
        graph.updateItem(this.state.curEditItem, copyCurEditModel);
        this._success("节点内容修改成功");
    }
    // 更新schema
    updateSchema(json, id, newLable, isLeaf = false, oldkey = "") {
        if (!json) return;
        if (json.uuid === id) {
            switch (this.state.operationType) {
                case "add":
                    if (!json.children) json.children = [];
                    console.log(json.children, json);
                    if (!isJson(newLable)) {
                        json.children.push({
                            componentName: newLable,
                            uuid: newUuid,
                        });
                    } else {
                        newLable.uuid = newUuid;
                        json.children.push(newLable);
                    }
                    break;
                case "delete":
                    if (json.hasOwnProperty(newLable)) delete json[newLable];
                    else if (json.hasOwnProperty("children")) {
                        json.children.forEach((element, index) => {
                            if (element.uuid === oldkey) {
                                json.children.splice(index, 1);
                                return;
                            }
                        });
                    }
                    this._success("节点删除成功！");
                    break;
                case "edit":
                    if (!isLeaf) {
                        json.componentName = newLable;
                    } else {
                        delete json[oldkey];
                        for (const newkey in newLable) {
                            if (newLable.hasOwnProperty(newkey)) {
                                const element = newLable[newkey];
                                json[newkey] = element;
                            }
                        }
                    }
                    break;
            }
        } else {
            for (const key in json) {
                if (json.hasOwnProperty(key)) {
                    let element = json[key];
                    if (Array.isArray(element)) {
                        element.forEach((value) => {
                            this.updateSchema(value, id, newLable, isLeaf, oldkey);
                        });
                    } else if (isJson(element)) {
                        this.updateSchema(element, id, newLable, isLeaf, oldkey);
                    }
                }
            }
        }
    }
    // 根据schema数据生成可视化图谱
    genGraph() {
        // 1.读取schema
        let text = this.schemaRef.current.innerHTML;
        let textCopy = text;
        if (textCopy.trim() === "") {
            this._error("输入内容不能为空");
            return;
        }
        text = text.replace(/<div>|<\/div>|&nbsp;/g, "");
        schema = JSON.parse(text);

        // 2.确定生成的类型GraphType（左上侧的按钮组）
        if (!this.state.graphType) {
            this._error("请先点击左侧按钮选择逻辑图谱类型");
            return;
        }
        // 3.处理old JSON到标准格式{id:xx,label:xx,children:[]},这里根据graphType和schema生成指定格式的json
        let data = parseData(
            [schema],
            this.state.graphType,
            this._getColor.bind(this),
            this.state.compTypes
        )[0];

        // 更新视图，注意这里需要使用this.setState重新赋值，才能使视图内容更新
        const obj = [...new Set(this.state.compTypes)];
        this.setState({
            compTypes: obj
        })

        // 4.根据标准json格式生成树
        graph ? graph.changeData(data) : this.createTreeFromData(data)
        const nodes = graph.getNodes();
        this.setState({
            dataSource: new Set([...nodes.map(item => item.get('model').label)])
        })
    }
    // 传入G6所需的json格式生成可视化图谱
    createTreeFromData(data) {
        // 清空画布
        document.getElementById("container").innerHTML = "";
        const COLLAPSE_ICON = function COLLAPSE_ICON(x, y, r) {
            return [
                ["M", x - r, y - r],
                ["a", r, r, 0, 1, 0, r * 2, 0],
                ["a", r, r, 0, 1, 0, -r * 2, 0],
                ["M", x + 2 - r, y - r],
                ["L", x + r - 2, y - r],
            ];
        };
        const EXPAND_ICON = function EXPAND_ICON(x, y, r) {
            return [
                ["M", x - r, y - r],
                ["a", r, r, 0, 1, 0, r * 2, 0],
                ["a", r, r, 0, 1, 0, -r * 2, 0],
                ["M", x + 2 - r, y - r],
                ["L", x + r - 2, y - r],
                ["M", x, y - 2 * r + 2],
                ["L", x, y - 2],
            ];
        };
        const HIDE_ICON = function HIDE_ICON(x, y, r) {
            return [
                ["M", x - r, y - r],
                ["a", r, r, 0, 1, 0, r * 2, 0],
                ["a", r, r, 0, 1, 0, -r * 2, 0],
                ["M", x + 2 - r, y - r],
                ["L", x + r - 2, y - r],
            ];
        };

        G6.Util.traverseTree(data, (d) => {
            let label = d.label;
            const type = ["props", "data", "style", "event"];
            let compIcon = "";
            if (label.includes(":")) {
                compIcon = "/img/utils.png";
            } else if (type.includes(label.toLowerCase())) {
                compIcon = "/img/type.png";
            } else {
                compIcon = "/img/comp.png";
            }

            d.leftIcon = {
                style: {
                    fill: "#e6fffb",
                    stroke: "#e6fffb",
                },
                // 左侧图标
                img: compIcon,
            };
            return true;
        });

        G6.registerNode(
            "icon-node",
            {
                options: {
                    size: [60, 20],
                    stroke: "#91d5ff",
                    fill: "#91d5ff",
                },
                draw(cfg, group) {
                    const styles = this.getShapeStyle(cfg);
                    const { labelCfg = {} } = cfg;

                    const keyShape = group.addShape("rect", {
                        attrs: {
                            ...styles,
                            x: 0,
                            y: 0,
                        },
                    });
                    if (cfg.leftIcon) {
                        const { style, img } = cfg.leftIcon;
                        group.addShape("rect", {
                            attrs: {
                                x: 1,
                                y: 1,
                                width: 38,
                                height: styles.height - 2,
                                fill: "#8c8c8c",
                                ...style,
                            },
                        });

                        group.addShape("image", {
                            attrs: {
                                x: 8,
                                y: 8,
                                width: 24,
                                height: 24,
                                img:
                                    img ||
                                    "https://g.alicdn.com/cm-design/arms-trace/1.0.155/styles/armsTrace/images/TAIR.png",
                            },
                            name: "image-shape",
                        });
                    }

                    // 动态增加或删除元素
                    group.addShape("marker", {
                        attrs: {
                            x: 40,
                            y: 52,
                            r: 6,
                            stroke: "#73d13d",
                            cursor: "pointer",
                            symbol: EXPAND_ICON,
                        },
                        name: "add-item",
                    });

                    group.addShape("marker", {
                        attrs: {
                            x: 60,
                            y: 52,
                            r: 6,
                            stroke: "#ff9b9f",
                            cursor: "pointer",
                            symbol: COLLAPSE_ICON,
                        },
                        name: "remove-item",
                    });

                    group.addShape("marker", {
                        attrs: {
                            x: 80,
                            y: 52,
                            r: 6,
                            stroke: "#647aea",
                            cursor: "pointer",
                            symbol: HIDE_ICON,
                        },
                        name: "hide-item",
                    });

                    group.addShape("text", {
                        attrs: {
                            ...labelCfg.style,
                            text: cfg.label ? fittingString(cfg.label, 50, 12) : "",
                            x: 50,
                            y: 25,
                        },
                    });

                    return keyShape;
                },
                update(cfg, node) {
                    const group = node.getContainer(); // 获取容器
                    const label = group.get("children")[6]; // 按照添加的顺序
                    //更新文本
                    label.attr({ text: fittingString(cfg.label, 50, 12) });
                },
            },
            "rect"
        );

        G6.registerEdge("flow-line", {
            draw(cfg, group) {
                const startPoint = cfg.startPoint;
                const endPoint = cfg.endPoint;

                const { style } = cfg;
                const shape = group.addShape("path", {
                    attrs: {
                        stroke: style.stroke,
                        endArrow: style.endArrow,
                        path: [
                            ["M", startPoint.x, startPoint.y],
                            ["L", startPoint.x, (startPoint.y + endPoint.y) / 2],
                            ["L", endPoint.x, (startPoint.y + endPoint.y) / 2],
                            ["L", endPoint.x, endPoint.y],
                        ],
                    },
                });

                return shape;
            },
        });

        const defaultStateStyles = {
            hover: {
                stroke: "#1890ff",
                lineWidth: 2,
            },
        };

        const defaultNodeStyle = {
            fill: "#91d5ff",
            stroke: "#40a9ff",
            radius: 5,
        };

        const defaultEdgeStyle = {
            stroke: "#91d5ff",
            endArrow: {
                path: "M 0,0 L 12, 6 L 9,0 L 12, -6 Z",
                fill: "#91d5ff",
                d: -20,
            },
        };

        const defaultLayout = {
            type: "compactBox",
            direction: "LR", // H / V / LR / RL / TB / BT
            getId: function getId(d) {
                return d.id;
            },
            getHeight: function getHeight() {
                return 16;
            },
            getWidth: function getWidth() {
                return 16;
            },
            getVGap: function getVGap() {
                return 40;
            },
            getHGap: function getHGap() {
                return 70;
            },
        };

        const defaultLabelCfg = {
            style: {
                fill: "#000",
                fontSize: 12,
            },
        };

        const width = document.getElementById("container").scrollWidth;
        const height = document.getElementById("container").scrollHeight || 800;

        graph = new G6.TreeGraph({
            container: "container",
            width,
            height,
            linkCenter: true,
            modes: {
                default: [
                    "drag-canvas",
                    "zoom-canvas",
                    {
                        type: "drag-node",
                        enableDelegate: true,
                    },
                ],
                edit: [],
            },
            defaultNode: {
                type: "icon-node",
                size: [130, 40],
                style: defaultNodeStyle,
                labelCfg: defaultLabelCfg,
            },
            defaultEdge: {
                type: "flow-line",
                style: defaultEdgeStyle,
            },
            nodeStateStyles: {
                Searched: {
                    stroke: "#f00",
                    lineWidth: 3,
                },
                defaultStateStyles,
            },
            edgeStateStyles: defaultStateStyles,
            layout: defaultLayout,
            fitView: true,
        });

        //收起或展开子节点
        function collapseOrExpandItem(item, type) {
            item.getNeighbors("target").forEach((node) => {
                type === "collapse" ? graph.hideItem(node) : graph.showItem(node);
                collapseOrExpandItem(node, type);
            });
        }
        graph.data(data);

        graph.render();

        graph.fitView();

        // 图事件
        graph.on("node:mouseenter", (evt) => {
            const { item } = evt;
            graph.setItemState(item, "hover", true);
        });

        graph.on("node:mouseleave", (evt) => {
            const { item } = evt;
            graph.setItemState(item, "hover", false);
        });

        graph.on("node:click", (evt) => {
            const { item, target } = evt;
            const targetType = target.get("type");
            const name = target.get("name");
            // 增加、删除、隐藏元素
            if (targetType === "marker") {
                const model = item.getModel();
                // 新增
                if (name === "add-item") {
                    this.setState({
                        operationType: "add"
                    })
                    this._success("新增节点成功！请点击节点输入节点名称");
                    graph.refresh();
                    if (!model.children) {
                        model.children = [];
                    }
                    const id = uuidv4();
                    newUuid = id;
                    model.children.push({
                        id,
                        lable: "newNode",
                        leftIcon: {
                            style: {
                                fill: "#e6fffb",
                                stroke: "#e6fffb",
                            },
                            img: "/img/comp.png",
                        },
                    });
                    graph.updateChild(model, model.id);
                    graph.refresh();

                    const types = ["style", "event", "props", "data"];
                    this.updateSchema(
                        schema,
                        item.get("id"),
                        "newNode" + newUuid,
                        types.includes(item.getNeighbors("source")[0].get("model").label)
                    );
                } else if (name === "remove-item") {
                    // 删除
                    this.setState({
                        operationType: "delete"
                    })
                    this._success("删除节点成功！");
                    graph.removeChild(model.id);
                    let newLabel = model.label;
                    let uuid = "";
                    let fatherNodes = item.getNeighbors("source");
                    fatherNodes.length === 0
                        ? (schema = {})
                        : (uuid = fatherNodes[0].get("id"));
                    this.updateSchema(schema, uuid, newLabel, false, model.id);
                } else if (name === "hide-item") {
                    // 节点隐藏
                    collapseOrExpandItem(item, "collapse");
                    target.cfg.name = "expand-item";
                    target.attr({ symbol: EXPAND_ICON });
                } else if (name === "expand-item") {
                    // 展开
                    collapseOrExpandItem(item, "expand");
                    target.cfg.name = "hide-item";
                    target.attr({ symbol: HIDE_ICON });
                }
                pureSchema = _.cloneDeep(schema);
                this._formatSchema(pureSchema);
                this.schemaRef.current.innerHTML = stringify(pureSchema);
            } else {
                // 点击节点，弹出编辑框
                let model = evt.item.get("model");
                let label = model.label;
                const unEditable = ["style", "event", "props", "data", "page"];
                const types = ["style", "event", "props", "data"];
                if (!label) {
                    let parentNode = evt.item.getNeighbors("source");
                    if (parentNode) {
                        if (types.includes(parentNode[0].get("model").label)) {
                            this.setState({
                                isLeafNode: true
                            })
                        } else {
                            this.setState({
                                isLeafNode: false
                            })
                        }
                        this.setState({
                            nodeEditVisible: true,
                            curEditKey: "",
                            curEditItem: evt.item,
                            curEditModel: evt.item.get("model")
                        })
                    }
                    return;
                }
                if (!unEditable.includes(label.toLowerCase())) {
                    this.setState({
                        operationType: "edit",
                        curEditItem: evt.item,
                        curEditUuid: evt.item.get("id"),
                        curEditModel: evt.item.get("model"),
                        nodeEditVisible: true
                    })

                    if (label && label.includes(":")) {
                        this.setState({
                            isLeafNode: true,
                            curEditKey: label.slice(0, label.indexOf(":")),
                            curEditValue: label.slice(label.indexOf(":") + 1)
                        })
                    } else {
                        this.setState({
                            isLeafNode: false,
                            curEditKey: this.state.curEditModel.label
                        })
                    }
                    if (
                        label.includes("function") ||
                        label.includes("Function") ||
                        label.includes(")=>{") ||
                        label.length > 30
                    ) {
                        this.setState({
                            isFunction: true
                        })
                    }
                }
            }
        });

        // 支持拖拽节点
        let minDisNode;
        graph.on("node:dragstart", (e) => {
            minDisNode = undefined;
            graph.layout();
        });
        graph.on("node:drag", (e) => {
            minDisNode = undefined;
            const item = e.item;
            const model = item.getModel();
            const nodes = graph.getNodes();
            let minDis = Infinity;
            nodes.forEach((inode) => {
                graph.setItemState(inode, "closest", false);
                const node = inode.getModel();
                if (node.id === model.id) return;
                const dis =
                    (node.x - e.x) * (node.x - e.x) + (node.y - e.y) * (node.y - e.y);
                if (dis < minDis) {
                    minDis = dis;
                    minDisNode = inode;
                }
            });
            if (minDis < 10000) graph.setItemState(minDisNode, "closest", true);
            else minDisNode = undefined;
        });

        graph.on("node:dragend", (e) => {
            if (!minDisNode) {
                this._error("节点移动失败：没有节点靠近拖动的节点");
                graph.layout();
                return;
            }
            const item = e.item;
            const id = item.getID();
            const data = graph.findDataById(id);
            let isDescent = false;
            const minDisNodeId = minDisNode.getID();
            G6.Util.traverseTree(data, (d) => {
                if (d.id === minDisNodeId) isDescent = true;
            });
            if (isDescent) {
                this._error("节点移动失败：目标节点是被拖动节点的后代");
                graph.layout();
                return;
            }
            graph.removeChild(id);
            setTimeout(() => {
                const newParentData = graph.findDataById(minDisNodeId);
                if (newParentData.children) newParentData.children.push(data);
                else newParentData.children = [data];
                graph.layout();
                this._success("节点移动成功");
            }, 600);
        });
    }

    // 辅助方法系列
    // 根据节点类型获取颜色
    _getColor(type, isComp = false) {
        if (!Object.prototype.hasOwnProperty.call(this.state.colorDic, type)) {
            this.state.colorDic[type] = rgb(isComp);
        }
        return { fill: this.state.colorDic[type] };
    }
    // 删除schema全部的uuid
    _formatSchema(json) {
        if (!json) return;
        if (json.uuid) {
            delete json.uuid;
        }
        for (const key in json) {
            if (json.hasOwnProperty(key)) {
                let element = json[key];
                if (Array.isArray(element)) {
                    element.forEach((value) => {
                        this._formatSchema(value);
                    });
                } else if (isJson(element)) {
                    if (json.uuid) {
                        delete json.uuid;
                    }
                    this._formatSchema(element);
                }
            }
        }
    }
    _success(text) {
        Notification.open({
            title: '成功',
            content: text,
            duration: 1000,
            type: 'success'
        });
    }
    _error(text) {
        Notification.open({
            title: '失败',
            content: text,
            duration: 1000,
            type: 'error'
        });
    }

    // 页面
    render() {
        let MyDialogForm
        let { isLeafNode, isFunction } = this.state
        if (!isLeafNode) {
            MyDialogForm = (<FormItem label="内容:">
                <Input value={this.state.curEditKey} onChange={value => { this.setState({ curEditKey: value }) }} />
            </FormItem>)
        } else {
            if (!isFunction) {
                MyDialogForm = (<FormItem label="内容:">
                    <Input value={this.state.curEditKey} onChange={value => { this.setState({ curEditKey: value }) }} />
                    <Input value={this.state.curEditValue} ref={this.editInputValueRef} onChange={value => { this.setState({ curEditValue: value }) }} />
                </FormItem>)
            } else {
                MyDialogForm = (<FormItem label="内容:">
                    <Input value={this.state.curEditKey} onChange={value => { this.setState({ curEditKey: value }) }} />
                    <Input.TextArea value={this.state.curEditValue} onChange={value => { this.setState({ curEditValue: value }) }} />
                </FormItem>)
            }
        }

        return (
            <>
                <Row className="panel">
                    <Col className="panel-left" span="14">
                        {/* 左上角按钮组、组件快速定位栏 */}
                        <div className="left-head">
                            <div className="graph">
                                <div className="item1">
                                    <Button type="secondary" className="button" onClick={() => this.selectGraphType('comp_type')}>组件图谱</Button>
                                    <Button type="secondary" className="button" onClick={() => this.selectGraphType('block_type')}>区块图谱</Button>
                                    <Button type="secondary" className="button" onClick={() => this.selectGraphType('style_type')}>样式图谱</Button>
                                    <Button type="secondary" className="button" onClick={() => this.selectGraphType('props_type')}>属性图谱</Button>
                                    <Button type="secondary" className="button" onClick={() => this.selectGraphType('event_type')}>事件图谱</Button>
                                    <Button type="secondary" className="button" onClick={() => this.selectGraphType('data_type')}>数据源图谱</Button>
                                </div>
                                <div className="item2">
                                    <span className="graph-type-tip">当前模式：<span className="type">{this.getGraphType()}</span></span>
                                </div>
                                <div className="item3">
                                    <Select showSearch placeholder="请输入" filterLocal={false} dataSource={this.state.selectOptions} onSearch={value => this.handleSearch(value)} onChange={(value) => this.hightlight(value)} style={{ width: 200 }} />
                                    {/* onSelect={(value) => this.hightlight(value)} */}
                                    {/* <Input
                                        innerAfter={<Icon type="search" style={{ margin: 4 }} />}
                                        hasClear
                                        aria-label="input with config of hasClear"
                                        onChange={value => { this.inputOnchange(value) }}
                                        ref={this.inputRef}
                                    /> */}
                                </div>
                            </div>
                            <div className="comps">
                                {
                                    this.state.compTypes.map((item, index) => {
                                        return <Button className="comps-btn" key={index} onClick={() => this.hightlight(item)}>{item}</Button>
                                    })
                                }
                            </div>
                        </div>
                        {/* 左下角图谱 */}
                        <div className="left-body">
                            <div className="container" ref={this.containerRef} id="container"></div>
                        </div>
                    </Col>
                    <Col className="panel-right" span="10">
                        {/* 右上角按钮 */}
                        <div className="right-head">
                            <Button type="secondary" className="button" onClick={() => this.genGraph()}>生成图谱</Button>
                        </div>
                        {/* 右下角schema展示框 */}
                        <div className="right-body"
                            contentEditable="true"
                            onPaste={e => textInit(e)}
                            ref={this.schemaRef}
                        >
                        </div>
                    </Col>
                </Row>

                <Dialog
                    title="编辑"
                    visible={this.state.nodeEditVisible}
                    onOk={() => this.edit()}
                    onCancel={() => this.setState({ nodeEditVisible: false })}
                    onClose={() => this.setState({ nodeEditVisible: false })}>
                    <Form className="dialog">
                        {MyDialogForm}
                    </Form>
                </Dialog>
            </>
        )
    }
}

export default App;