import {
    v4 as uuidv4
} from "uuid";
import {
    isEvent
} from './utils'
import {
    isJson,
    stringify
} from './utils'

export function handleNodeClick(event, graph) {
    const item = event.item;
    graph.focusItem(item, true, {
        easing: 'easeCubic',
        duration: 500
    });
}
// 数据源图谱中获取dataSourceMap数据
export function getDataSourceData(datasource, getColor) {
    let child = [];
    for (const key in datasource) {
        let tempjson = {};
        if (Object.prototype.hasOwnProperty.call(datasource, key)) {
            const element = datasource[key];
            if (Array.isArray(element)) {
                tempjson.id = uuidv4();
                tempjson.label = key;
                tempjson.style = getColor("data_child");
                tempjson.children = [];
                element.forEach((value) => {
                    tempjson.children.push(...getDataSourceData(value, getColor));
                });
                element.uuid = tempjson.id;
            } else if (
                typeof element === "object" &&
                Object.prototype.toString.call(element).toLowerCase() ==
                "[object object]" &&
                !element.length
            ) {
                tempjson.id = uuidv4();
                tempjson.label = key;
                // allNodesArr.push(key)
                tempjson.style = getColor("data_child");
                if (Object.keys(element).length > 0) {
                    tempjson.children = getDataSourceData(element, getColor);
                } else {
                    tempjson.label = `${key}:{}`;
                    // allNodesArr.push(key)
                }
                element.uuid = tempjson.id;
            } else {
                tempjson.id = uuidv4();
                tempjson.label = `${key}:${element}`;
                // allNodesArr.push(key)
                tempjson.style = getColor("data_child");
            }
        }
        child.push(tempjson);
    }
    return child;
}

export function parseData(children, type, getColor, compTypes) {
    const COMP_TYPE = "comp_type";
    const BLOCK_TYPE = "block_type";
    const STYLE_TYPE = "style_type";
    const PROPS_TYPE = "props_type";
    const EVENT_TYPE = "event_type";
    const DATA_TYPE = "data_type";

    let child = [];
    if (Array.isArray(children) && children.length !== 0) {
        for (let index = 0; index < children.length; index++) {
            const element = children[index];
            if (type === BLOCK_TYPE) {
                if (element.componentName !== "Page" && element.componentName !== "Block")
                    continue
            }
            let tempjson = {};
            tempjson.id = uuidv4();
            tempjson.label = element.componentName
            compTypes.push(tempjson.label)
            element.uuid = tempjson.id;
            if (!Object.prototype.hasOwnProperty.call(tempjson, "children")) {
                tempjson.children = [];
            }
            tempjson.style = getColor(element.componentName, true);
            switch (type) {
                case COMP_TYPE:
                    break;
                case DATA_TYPE:
                    if (Object.prototype.hasOwnProperty.call(element, "dataSource")) {
                        let node = {
                            id: uuidv4(),
                            label: "data",
                            style: getColor("data"),
                            children: getDataSourceData(element.dataSource, getColor),
                        };
                        tempjson.children.push(node);
                        element.dataSource.uuid = node.id;
                    }
                    break;
                case STYLE_TYPE:
                    if (Object.prototype.hasOwnProperty.call(element, "props")) {
                        if (
                            Object.prototype.hasOwnProperty.call(element.props, "style")
                        ) {
                            let node = {
                                id: uuidv4(),
                                label: "style",
                                style: getColor("style"),
                                children: [],
                            };
                            for (const key in element.props.style) {
                                if (
                                    Object.prototype.hasOwnProperty.call(
                                        element.props.style,
                                        key
                                    )
                                ) {
                                    const styleValue = element.props.style[key];
                                    node.children.push({
                                        id: uuidv4(),
                                        label: `${key}:${styleValue}`,
                                        style: getColor("style_child"),
                                    });
                                    // allNodesArr.push(key)
                                }
                            }
                            tempjson.children.push(node);
                            element.props.style.uuid = node.id;
                        }
                    }
                    break;
                case PROPS_TYPE:
                    let hasCondition = false;
                    if (Object.prototype.hasOwnProperty.call(element, "condition")) {
                        hasCondition = true;
                        let node = {
                            id: uuidv4(),
                            label: "props",
                            style: getColor("props"),
                            children: [{
                                id: uuidv4(),
                                label: `condition:${element.condition}`,
                                style: getColor("props_child"),
                            }]
                        };
                        tempjson.children.push(node);
                    }

                    if (Object.prototype.hasOwnProperty.call(element, "props")) {
                        Object.prototype.hasOwnProperty.call(element.props, "style") &&
                            delete element.props.style;
                        for (const key in element.props) {
                            if (
                                Object.prototype.hasOwnProperty.call(element.props, key)
                            ) {
                                if (isEvent(key)) delete element.props[key];
                            }
                        }
                        if (!hasCondition && Object.keys(element.props).length === 0) {
                            break;
                        }
                        if (!hasCondition) {
                            let node = {
                                id: uuidv4(),
                                label: "props",
                                style: getColor("props_child"),
                                children: [],
                            };
                            for (const key in element.props) {
                                if (
                                    Object.prototype.hasOwnProperty.call(element.props, key)
                                ) {
                                    let value = element.props[key];
                                    if (Array.isArray(value) && isJson(value[0])) {
                                        value = stringify(value);
                                    }
                                    node.children.push({
                                        id: uuidv4(),
                                        label: `${key}:${value}`,
                                        style: getColor("props_child"),
                                    });
                                }
                            }

                            tempjson.children.push(node);
                            element.props.uuid = node.id;
                        }
                    }
                    break;
                case EVENT_TYPE:
                    if (Object.prototype.hasOwnProperty.call(element, "methods")) {
                        let node = {
                            id: uuidv4(),
                            label: "methods",
                            style: getColor("event"),
                            children: [],
                        };
                        for (const key in element.methods) {
                            if (element.methods.hasOwnProperty(key)) {
                                const methodsValue = element.methods[key];
                                node.children.push({
                                    id: uuidv4(),
                                    label: `${key}:${methodsValue}`,
                                    style: getColor("event"),
                                });
                            }
                        }
                        tempjson.children.push(node);
                        element.methods.uuid = node.id;
                    }
                    if (Object.prototype.hasOwnProperty.call(element, "props")) {
                        for (const key in element.props) {
                            if (
                                Object.prototype.hasOwnProperty.call(element.props, key)
                            ) {
                                const value = element.props[key];
                                if (isEvent(key)) {
                                    tempjson.children.push({
                                        id: uuidv4(),
                                        style: getColor("event"),
                                        label: `${key}:${value}`,
                                    });
                                }
                            }
                        }
                    }
                    break;
                default:
                    break;
            }
            if (Object.prototype.hasOwnProperty.call(element, "children")) {
                Array.prototype.push.apply(
                    tempjson.children,
                    parseData(element.children, type, getColor, compTypes)
                );
            }
            tempjson.children.length === 0 && delete tempjson.children;
            child.push(tempjson);
        }
        return child;
    }
}