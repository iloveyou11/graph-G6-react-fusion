const schema4 = {
    "componentName": "Page",
    "fileName": "page_pitPlan_planCreate_cateSet",
    "props": {
        "autoLoading": true
    },
    "children": [{
        "componentName": "CreatePlanLayout",
        "props": {
            "step": 1,
            "pitPlanId": "{{this.location.query.pitPlanId}}"
        },
        "children": [{
            "componentName": "ButtonGroup",
            "props": {
                "style": {
                    "marginBottom": 12
                }
            },
            "children": [{
                "componentName": "Button",
                "props": {
                    "type": "primary",
                    "style": {
                        "marginTop": "0",
                        "marginRight": 12,
                        "marginBottom": "0",
                        "marginLeft": "5px"
                    },
                    "disabled": false,
                    "onClick": function onClick(e) {
                        this.history.push(`/page/pitPlan/planCreate/pitNumSet?pitPlanId=${this.location.query.pitPlanId}&pitPlanRecordId=${this.location.query.pitPlanRecordId}`)
                    },
                    "htmlType": "button",
                    "component": "a",
                    "href": "{{`/page/pitPlan/planCreate/pitNumSet?pitPlanId=${this.location.query.pitPlanId}&pitPlanRecordId=${this.location.query.pitPlanRecordId}&attachId=${this.location.query.attachId}&attachType=${this.location.query.attachType}`}}"
                },
                "children": "下一步"
            }, {
                "componentName": "Button",
                "props": {
                    "type": "normal",
                    "component": "a",
                    "href": "{{`/page/pitPlan/planCreate/time?pitPlanId=${this.location.query.pitPlanId}&pitPlanRecordId=${this.location.query.pitPlanRecordId}&attachId=${this.location.query.attachId}&attachType=${this.location.query.attachType}`}}",
                    "style": {
                        "marginRight": 12
                    }
                },
                "children": "上一步"
            }]
        }, {
            "componentName": "Div",
            "props": {
                "style": {
                    "display": "flex",
                    "height": 580
                }
            },
            "children": [{
                "componentName": "Div",
                "props": {
                    "style": {
                        "marginRight": 12,
                        "width": "30%",
                        "overflowY": "auto"
                    }
                },
                "children": [{
                    "componentName": "CategorySelector",
                    "props": {
                        "onAdd": function onAdd(nodeData) {
                            //节点数据
                            // console.log('add', nodeData);

                            this.dataSourceMap['addDimensionInRecord'].load({
                                    dimensionId: nodeData.value,
                                    type: 1 //添加本级
                                })
                                .then(res => {
                                    if (res.success) {
                                        this.utils.Message.success('添加成功')
                                        this.reloadDataSource();
                                    } else {
                                        this.utils.Message.error(res.message);
                                    }
                                })
                                .catch(err => {
                                    console.log(err)
                                })
                        },
                        "onAddAllChildren": function onAddAllChildren(nodeData) {
                            //nodeData：节点数据
                            this.dataSourceMap['addDimensionInRecord'].load({
                                    dimensionId: nodeData.value,
                                    type: 2 //添加下一级
                                })
                                .then(res => {
                                    if (res.success) {
                                        this.utils.Message.success('添加成功')
                                        this.reloadDataSource();
                                    } else {
                                        this.utils.Message.error(res.message);
                                    }
                                })
                                .catch(err => {
                                    console.log(err)
                                })
                        },
                        "style": {
                            "width": "100%"
                        },
                        "dimensionType": "{{this.state.listInit.dimensionType}}"
                    }
                }]
            }, {
                "componentName": "Div",
                "props": {
                    "style": {
                        "flex": 1,
                        "minWidth": "100px"
                    }
                },
                "children": [{
                    "componentName": "Table",
                    "props": {
                        "hasBorder": false,
                        "hasHeader": true,
                        "style": {
                            "marginBottom": 12
                        },
                        "dataSource": "{{this.state.getPitPlanRecord.dimensions.values}}",
                        "useVirtual": false,
                        "hasExpandedRowCtrl": false,
                        "fixedHeader": false,
                        "stickyHeader": false
                    },
                    "children": [{
                        "componentName": "TableColumn",
                        "props": {
                            "title": "维度",
                            "dataIndex": "name"
                        }
                    }, {
                        "componentName": "TableColumn",
                        "props": {
                            "title": "操作",
                            "cell": {
                                "type": "JSSlot",
                                "value": [{
                                    "componentName": "Button",
                                    "props": {
                                        "type": "primary",
                                        "size": "small",
                                        "text": true,
                                        "onClick": function onClick(e) {
                                            this.utils.Dialog.confirm({
                                                title: '删除',
                                                content: `确认要删除「${this.record.name}」吗？`,
                                                onOk: () => {
                                                    this.dataSourceMap['deleteDimensionInRecord'].load({
                                                        planDimensionId: this.record.id
                                                    }).then(res => {
                                                        if (res.success) {
                                                            this.utils.Message.success('删除成功');
                                                            this.reloadDataSource();
                                                        } else {
                                                            this.utils.Message.error(res.message);
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    },
                                    "children": "删除"
                                }],
                                "params": ["value", "index", "record"]
                            },
                            "width": 200,
                            "dataIndex": "delete"
                        }
                    }]
                }, {
                    "componentName": "Pagination",
                    "props": {
                        "shape": "normal",
                        "type": "normal",
                        "size": "medium",
                        "pageSize": 10,
                        "onChange": function onChange(value, e) {
                            this.setState({
                                currentPage: value
                            }, () => {
                                this.reloadDataSource();
                            })
                        },
                        "style": {
                            "textAlign": "center"
                        },
                        "current": "{{this.state.currentPage}}",
                        "defaultCurrent": 1,
                        "total": "{{this.state.getPitPlanRecord.dimensions.totalCount}}"
                    }
                }]
            }],
            "condition": true
        }]
    }],
    "dataSource": {
        "list": [{
            "id": "addDimensionInRecord",
            "isInit": false,
            "type": "bzb",
            "options": {
                "method": "POST",
                "params": {
                    "planRecordId": "{{this.location.query.pitPlanRecordId}}"
                },
                "uri": "bzb.api.tmc.pitplan.addDimensionInRecord:do",
                "env": "{{this.utils.getEnv()}}"
            },
            "description": "在一个规划记录下增加一个维度"
        }, {
            "id": "deleteDimensionInRecord",
            "isInit": false,
            "type": "bzb",
            "options": {
                "method": "GET",
                "params": {
                    "planRecordId": "{{this.location.query.pitPlanRecordId}}"
                },
                "uri": "bzb.api.tmc.pitplan.deleteDimensionInRecord:do",
                "env": "{{this.utils.getEnv()}}"
            },
            "description": "删除某个规划记录下的维度"
        }, {
            "id": "getPitPlanRecord",
            "isInit": true,
            "type": "bzb",
            "options": {
                "method": "GET",
                "params": {
                    "pitPlanRecordId": "{{this.location.query.pitPlanRecordId}}",
                    "withDimension": true,
                    "page": "{{this.state.currentPage}}"
                },
                "uri": "bzb.api.tmc.pitplan.getPitPlanRecord:do",
                "env": "{{this.utils.getEnv()}}"
            },
            "dataHandler": function dataHandler(data, error) {
                if (data.success) {
                    return data.data
                } else {
                    this.utils.Message.error(data.message);
                }
                return data;
            }
        }, {
            "id": "listInit",
            "isInit": "{{!this.state.listInit}}",
            "type": "bzb",
            "options": {
                "method": "GET",
                "params": {},
                "uri": "bzb.api.tmc.pitplancontrol.listInit:do",
                "env": "{{this.utils.getEnv()}}"
            },
            "dataHandler": function dataHandler(data, error) {
                if (data.success) {
                    return data.data;
                }
                return data;
            }
        }]
    }
}
export default schema4