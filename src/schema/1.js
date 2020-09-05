const schema1 = {
    "componentName": "Page",
    "fileName": "page_pitPlan_pitSum",
    "props": {
        "autoLoading": true
    },
    "children": [{
        "componentName": "Tab",
        "props": {
            "shape": "pure",
            "contentStyle": {
                "padding": "12px"
            },
            "className": "fake-tab",
            "style": {
                "marginBottom": 12
            },
            "activeKey": "sum",
            "onChange": function onChange(key) {
                //选项卡发生切换时的事件回调
                //@param {String|Number} key 改变后的 key
                if (key === 'plan') {
                    this.history.push('/page/pitPlan/planList')
                }
            }
        },
        "children": [{
            "componentName": "TabItem",
            "props": {
                "title": "规划列表",
                "key": "plan"
            },
            "children": []
        }, {
            "componentName": "TabItem",
            "props": {
                "title": "总量设置",
                "key": "sum"
            },
            "children": []
        }]
    }, {
        "componentName": "Block",
        "props": {
            "autoLoading": true
        },
        "fileName": "listBlock",
        "children": [{
            "componentName": "Div",
            "props": {
                "style": {
                    "paddingRight": 12,
                    "paddingLeft": 12
                }
            },
            "children": [{
                "componentName": "Form",
                "props": {
                    "onSubmit": function onSubmit(value, error, field) {
                        //form内有htmlType="submit"的元素的时候会触发
                        this.state.search = value;
                        this.list.reload();
                    },
                    "style": {},
                    "inline": true,
                    "labelAlign": "left"
                },
                "children": [{
                    "componentName": "FormItem",
                    "props": {
                        "name": "attach_type",
                        "initValue": "{{this.state.addInitPitPlanControl.data.availableAttachs[0].value}}"
                    },
                    "children": [{
                        "componentName": "Select",
                        "props": {
                            "autoWidth": true,
                            "hasBorder": true,
                            "dataSource": "{{this.state.addInitPitPlanControl.data.availableAttachs}}",
                            "onChange": function onChange(value, actionType, item) {
                                //Select发生改变时触发的回调
                                //@param {*} value 选中的值
                                //@param {String} actionType 触发的方式, 'itemClick', 'enter', 'tag'
                                //@param {*} item 选中的值的对象数据 (useDetailValue=false有效)
                                this.field.reset(['attach_id']);

                            }
                        }
                    }]
                }, {
                    "componentName": "FormItem",
                    "props": {
                        "name": "attach_id"
                    },
                    "children": [{
                        "componentName": "Select",
                        "props": {
                            "autoWidth": false,
                            "hasBorder": true,
                            "dataSource": "{{this.getDataSource(this.field.getValue('attach_type'))}}",
                            "filterLocal": false,
                            "onSearch": function onSearch(value) {
                                //当搜索框值变化时回调
                                //@param {String} value 数据
                                this.utils.debounce(() => {
                                    this.doSearch(value, this.field.getValue('attach_type'))
                                });

                            },
                            "hasClear": true,
                            "showSearch": true,
                            "placeholder": "请选择或搜索"
                        }
                    }]
                }, {
                    "componentName": "ButtonGroup",
                    "props": {},
                    "children": [{
                        "componentName": "Button",
                        "props": {
                            "type": "secondary",
                            "style": {
                                "margin": "0 5px 0 5px"
                            },
                            "htmlType": "submit"
                        },
                        "children": "提交"
                    }, {
                        "componentName": "Button",
                        "props": {
                            "type": "normal",
                            "style": {
                                "margin": "0 5px 0 5px"
                            },
                            "htmlType": "reset"
                        },
                        "children": "重置"
                    }]
                }]
            }, {
                "componentName": "Tab",
                "props": {
                    "shape": "wrapped",
                    "contentStyle": {
                        "padding": "12px"
                    }
                },
                "children": [{
                    "componentName": "TabItem",
                    "props": {
                        "title": "总控明细"
                    },
                    "children": [{
                        "componentName": "Dialog",
                        "props": {
                            "visible": "{{this.state.visible}}",
                            "onOk": function onOk() {
                                this.addForm.field.validate((errors, values) => {
                                    if (errors) {
                                        return;
                                    }
                                    const attachType = values.attachType;
                                    if (values.file && values.file[0]) {
                                        values.fileKey = values.file[0].response.data
                                    }
                                    if (values.validTime) {
                                        values.validTime = this.utils.moment(values.validTime).format('YYYY-MM-DD HH:mm:ss')
                                    }
                                    this.dataSourceMap['addTotal'].load(values)
                                        .then(res => {
                                            if (res.success) {
                                                this.setState({
                                                    visible: false
                                                })
                                                this.list.reload();
                                            } else {
                                                this.utils.Message.error(res.message);
                                            }
                                        })
                                        .catch(err => {
                                            console.log(err)
                                        })
                                })
                            },
                            "onCancel": function onCancel(event) {
                                //在点击取消按钮时触发的回调函数
                                //@param {Object} event 点击事件对象
                                this.setState({
                                    visible: false
                                })
                            },
                            "onClose": function onClose(trigger, event) {
                                //对话框关闭时触发的回调函数
                                //@param {String} trigger 关闭触发行为的描述字符串
                                //@param {Object} event 关闭时事件对象
                                this.setState({
                                    visible: false
                                })
                            },
                            "style": {
                                "width": "600px"
                            },
                            "footer": true,
                            "title": "总控配置"
                        },
                        "children": [{
                            "componentName": "Form",
                            "props": {
                                "labelCol": 4,
                                "onSubmit": function onSubmit(values, error, field) {
                                    //form内有htmlType="submit"的元素的时候会触发
                                    if (error) {
                                        return;
                                    }
                                    this.dataSourceMap['addTotal'].load(values).then(res => {
                                        if (res.success) {
                                            this.list.reload();
                                            this.setState({
                                                visible: false
                                            })
                                        } else {
                                            this.utils.Message.error(res.message);
                                        }
                                    })
                                },
                                "ref": "addForm"
                            },
                            "children": [{
                                "componentName": "FormItem",
                                "props": {
                                    "name": "controlType",
                                    "label": "控制维度：",
                                    "style": {
                                        "fontSize": 12,
                                        "color": "#666",
                                        "lineHeight": 18,
                                        "float": "none"
                                    },
                                    "asterisk": true,
                                    "rules": [{
                                        "required": true,
                                        "message": "请选择控制维度"
                                    }]
                                },
                                "children": [{
                                    "componentName": "RadioGroup",
                                    "props": {
                                        "dataSource": "{{this.state.addInitPitPlanControl.data.availableControls}}"
                                    }
                                }]
                            }, {
                                "componentName": "FormItem",
                                "props": {
                                    "name": "attachType",
                                    "label": "作用维度：",
                                    "style": {
                                        "fontSize": 12,
                                        "color": "#666",
                                        "lineHeight": 18,
                                        "float": "none"
                                    },
                                    "rules": [{
                                        "required": true,
                                        "message": "请选择作用维度"
                                    }],
                                    "asterisk": true
                                },
                                "children": [{
                                    "componentName": "RadioGroup",
                                    "props": {
                                        "dataSource": "{{this.state.addInitPitPlanControl.data.availableAttachs}}",
                                        "onChange": function onChange(value, e) {
                                            //选中值改变时的事件
                                            //@param {String/Number} value 选中项的值
                                            //@param {Event} e Dom 事件对象
                                            this.field.reset(['attachId']);
                                            // 将作用对象的下拉数据复原
                                            this.doSearch('', value);
                                        }
                                    }
                                }]
                            }, {
                                "componentName": "FormItem",
                                "props": {
                                    "label": "作用对象：",
                                    "name": "attachId",
                                    "rules": [{
                                        "required": true,
                                        "message": "请选择作用对象"
                                    }],
                                    "asterisk": true
                                },
                                "children": [{
                                    "componentName": "Select",
                                    "props": {
                                        "autoWidth": true,
                                        "hasBorder": true,
                                        "style": {
                                            "width": "100%"
                                        },
                                        "dataSource": "{{this.getDataSource(this.field.getValue('attachType'))}}",
                                        "onSearch": function onSearch(value) {
                                            //当搜索框值变化时回调
                                            //@param {String} value 数据
                                            let attachType = this.field.getValue('attachType');
                                            if (attachType === undefined) {
                                                return;
                                            }
                                            this.utils.debounce(() => {
                                                this.doSearch(value, attachType)
                                            });
                                        },
                                        "showSearch": true,
                                        "filterLocal": false
                                    }
                                }]
                            }, {
                                "componentName": "FormItem",
                                "props": {
                                    "name": "attachSignType",
                                    "label": "招商模式：",
                                    "style": {
                                        "fontSize": 12,
                                        "color": "#0364ff",
                                        "lineHeight": 18,
                                        "float": "none"
                                    },
                                    "asterisk": true,
                                    "rules": [{
                                        "required": true,
                                        "message": "请选择招商模式"
                                    }]
                                },
                                "children": [{
                                    "componentName": "RadioGroup",
                                    "props": {
                                        "dataSource": [{
                                            "label": "单品团",
                                            "value": "1"
                                        }, {
                                            "label": "品牌团",
                                            "value": "2"
                                        }, {
                                            "label": "主题团",
                                            "value": "3"
                                        }]
                                    }
                                }],
                                "condition": "{{this.field.getValue('attachType') !== '2'}}"
                            }, {
                                "componentName": "FormItem",
                                "props": {
                                    "name": "addType",
                                    "label": "新增方式：",
                                    "style": {
                                        "fontSize": 12,
                                        "color": "#666",
                                        "lineHeight": 18,
                                        "float": "none"
                                    },
                                    "asterisk": true,
                                    "rules": [{
                                        "required": true,
                                        "message": "请选择招商方式"
                                    }]
                                },
                                "children": [{
                                    "componentName": "RadioGroup",
                                    "props": {
                                        "dataSource": [{
                                            "label": "手动增加",
                                            "value": "1"
                                        }, {
                                            "label": "上传Excel",
                                            "value": "2"
                                        }]
                                    }
                                }, {
                                    "componentName": "Div",
                                    "props": {
                                        "style": {
                                            "backgroundColor": "#fafafa"
                                        }
                                    },
                                    "children": [{
                                        "componentName": "FormItem",
                                        "props": {
                                            "name": "file",
                                            "label": "上传文件：",
                                            "asterisk": true,
                                            "rules": [{
                                                "required": true,
                                                "message": "请上传文件"
                                            }],
                                            "labelCol": 5
                                        },
                                        "children": [{
                                            "componentName": "Upload",
                                            "props": {
                                                "action": "bzb.api.tmc.upload.fileToOss:do",
                                                "multiple": true,
                                                "style": {
                                                    "display": "inline-block"
                                                },
                                                "request": function request(option) {
                                                    //自定义上传方法
                                                    //@param {Object} option
                                                    //@return {Object} object with abort method
                                                    return this.utils.upload.fusion(option, this.utils.getEnv())

                                                },
                                                "limit": 1,
                                                "listType": "text"
                                            },
                                            "children": [{
                                                "componentName": "Button",
                                                "props": {
                                                    "type": "primary",
                                                    "style": {
                                                        "color": "#000",
                                                        "backgroundColor": "#fff",
                                                        "borderRadius": 2
                                                    },
                                                    "onClick": function onClick(file, error) {
                                                        if (error) return;
                                                        // submitApi是在容器上定义的数据源id
                                                        this.dataSourceMap['uploadFile'].load(file)
                                                            .then(res => {
                                                                // res为接口返回数据
                                                                console.log(res)
                                                            })
                                                            .catch(err => {
                                                                console.log(err)
                                                            })
                                                    }
                                                },
                                                "children": "选择"
                                            }]
                                        }, {
                                            "componentName": "Button",
                                            "props": {
                                                "style": {
                                                    "marginLeft": 10,
                                                    "color": "#0364ff",
                                                    "backgroundColor": "#fafafa",
                                                    "borderRadius": 2
                                                },
                                                "text": true,
                                                "loading": false,
                                                "component": "a",
                                                "href": "https://files.alicdn.com/tpsservice/5694e5266c2b86a733c09e9ef5cf961f.xlsx",
                                                "target": "_blank"
                                            },
                                            "children": "下载模板"
                                        }]
                                    }],
                                    "condition": "{{this.field.getValue('addType')===\"2\"}}"
                                }]
                            }, {
                                "componentName": "FormItem",
                                "props": {
                                    "name": "dimensionInfo",
                                    "label": "增加类目：",
                                    "asterisk": true,
                                    "rules": [{
                                        "required": true,
                                        "message": "请完善类目坑位信息"
                                    }]
                                },
                                "children": [{
                                    "componentName": "CateNumList",
                                    "props": {
                                        "dimensionType": "{{this.state.addInitPitPlanControl.data.dimensionType}}"
                                    }
                                }],
                                "condition": "{{this.field.getValue('addType')===\"1\"}}"
                            }, {
                                "componentName": "FormItem",
                                "props": {
                                    "name": "validTime",
                                    "label": "生效时间：",
                                    "rules": [{
                                        "required": true,
                                        "message": "请选择生效时间"
                                    }],
                                    "asterisk": true
                                },
                                "children": [{
                                    "componentName": "DatePicker",
                                    "props": {
                                        "placeholder": "Please Select Date",
                                        "hasClear": true,
                                        "style": {
                                            "width": "100%"
                                        }
                                    }
                                }]
                            }],
                            "condition": true
                        }],
                        "condition": true
                    }, {
                        "componentName": "ListLN",
                        "props": {
                            "type": "table",
                            "filter": {
                                "items": [{
                                    "title": "类目",
                                    "name": "dimension_id",
                                    "component": "CateSelector",
                                    "componentProps": {
                                        "dataSource": "{{this.state.getGenericDimensionData.data}}",
                                        "autoWidth": false,
                                        "hasClear": true,
                                        "showSearch": true,
                                        "onChange": function onChange(value, e) {
                                            //
                                        },
                                        "style": {
                                            "width": "200px"
                                        }
                                    }
                                }, {
                                    "title": "时间",
                                    "name": "validTime",
                                    "component": "DatePicker",
                                    "componentProps": {
                                        "showTime": false
                                    }
                                }],
                                "buttons": [{
                                    "htmlType": "submit",
                                    "children": "查询",
                                    "type": "secondary"
                                }, {
                                    "htmlType": "reset",
                                    "children": "重置"
                                }],
                                "layoutProps": {
                                    "inline": true,
                                    "grid": false
                                },
                                "customComponents": {
                                    "CateSelector": "{{this.context.components['CateSelector']}}"
                                }
                            },
                            "actions": [{
                                "name": "新增总控信息",
                                "component": "button",
                                "onClick": function onClick(filterParams, dataSource, selectedId, selectedItems) {
                                    /* filterParams 筛选参数
                                     ** dataSource 列表数据
                                     ** selectedId 勾选项的id
                                     ** selectedItems 勾选的项
                                     */
                                    this.setState({
                                        visible: true
                                    })
                                }
                            }, {
                                "name": "批量删除",
                                "component": "button",
                                "onClick": function onClick(filterParams, dataSource, selectedId, selectedItems) {
                                    /* filterParams 筛选参数
                                     ** dataSource 列表数据
                                     ** selectedId 勾选项的id
                                     ** selectedItems 勾选的项
                                     */
                                    this.doDelete(selectedId)
                                }
                            }],
                            "columns": [{
                                "title": "类目ID",
                                "dataIndex": "dimensionId"
                            }, {
                                "title": "类目信息",
                                "dataIndex": "dimensionName"
                            }, {
                                "title": "作用维度",
                                "dataIndex": "attachTypeStr"
                            }, {
                                "title": "作用对象",
                                "dataIndex": "attachName"
                            }, {
                                "title": "坑位数量",
                                "dataIndex": "controlNum"
                            }, {
                                "title": "招商类型",
                                "dataIndex": "attachSignTypeName"
                            }, {
                                "title": "开始时间",
                                "dataIndex": "validTimeStart"
                            }, {
                                "title": "结束时间",
                                "dataIndex": "validTimeEnd"
                            }, {
                                "title": "操作人",
                                "dataIndex": "creator"
                            }, {
                                "title": "操作",
                                "cell": {
                                    "type": "JSSlot",
                                    "value": [{
                                        "componentName": "Button",
                                        "props": {
                                            "type": "secondary",
                                            "size": "small",
                                            "onClick": function onClick(e) {
                                                console.log(this.record.id);
                                                this.doDelete(this.record.id);
                                            }
                                        },
                                        "children": "删除"
                                    }],
                                    "params": ["value", "index", "record"]
                                }
                            }],
                            "selection": {
                                "key": "id",
                                "mode": "multiple",
                                "onChange": function onChange(selectedRowKeys, records) {
                                    //
                                }
                            },
                            "showConfig": {
                                "hasBorder": false
                            },
                            "dataSource": "{{this.dataSourceMap.total}}",
                            "dataHandler": function dataHandler(res) {
                                //对接口返回的数据进行处理
                                //注意必须返回对象，对象中包含 data、page、pageSize、total
                                // console.log(res);
                                return {
                                    ...res,
                                    data: res.list || []
                                }
                            },
                            "beforeLoad": function beforeLoad(params) {
                                if (params.validTime) {
                                    params.validTime = this.utils.moment(params.validTime).format('YYYY-MM-DD')
                                }
                                return params;
                            },
                            "ref": "list"
                        },
                        "condition": true
                    }],
                    "condition": "{{this.page.state.listInit.supportTabs.includes('pitcontrol')}}"
                }, {
                    "componentName": "TabItem",
                    "props": {
                        "title": "更新记录"
                    },
                    "children": [{
                        "componentName": "Iframe",
                        "props": {
                            "src": "https://cas.alibaba-inc.com/oplog/logList.htm?noMenu=true&log_id=505261410000&log_type=ACTIVITY",
                            "style": {
                                "width": "100%",
                                "height": 400,
                                "border": "none"
                            }
                        }
                    }],
                    "condition": "{{this.page.state.listInit.supportTabs.includes(\"planlist\")}}"
                }],
                "condition": true
            }],
            "condition": true
        }],
        "methods": {
            "doDelete": function doDelete(ids) {
                let text = '本条';
                if (Array.isArray(ids)) {
                    text = `选中的${ids.length}条`
                    ids = ids.join(',');
                }
                this.utils.Dialog.confirm({
                    title: '删除',
                    content: `删除${text}总控信息将会影响相同类目的其他总控生效时间，确认是否要删除?`,
                    onOk: () => {
                        this.dataSourceMap['deletePitControls'].load({
                            ids: ids
                        }).then(res => {
                            if (res.success) {
                                this.list.reload();
                            } else {
                                this.utils.Message.error(res.message);
                                this.list.reload()
                            }
                        })
                    }
                })
            },
            "getDataSource": function getDataSource(value) {
                const dataSourceMap = {
                    '1': "getChannels",
                    "2": "getBizInfos"
                }
                return this.state[dataSourceMap[value] || ''] || []
            },
            "doSearch": function doSearch(value, type) {
                const actionName = this.getMenu(type);
                if (window.searchTimer) {
                    clearTimeout(window.searchTimer);
                }
                window.searchTimer = setTimeout(() => {
                    this.dataSourceMap[actionName].load({
                        'actNameOrId': value,
                        'name': value,
                        'bizName': value
                    }).then(res => {
                        if (res) {
                            this.setState({
                                [actionName]: res
                            })
                        }
                    })
                }, 300);
            },
            "getMenu": function getMenu(type) {
                const menuMap = {
                    '1': 'getChannels',
                    '2': 'getBizInfos'
                }
                return menuMap[type]
            }
        },
        "dataSource": {
            "list": [{
                "id": "total",
                "isInit": true,
                "type": "bzb",
                "options": {
                    "method": "GET",
                    "params": "{{this.state.search}}",
                    "uri": "bzb.api.tmc.pitplancontrol.queryPitPlanControl:do",
                    "env": "{{this.utils.getEnv()}}"
                },
                "description": "获取总量数据",
                "dataHandler": function dataHandler(data, error) {
                    if (data.success) {
                        return data.data;
                    }
                    return data;
                }
            }, {
                "id": "uploadFile",
                "isInit": false,
                "type": "bzb",
                "options": {
                    "method": "POST",
                    "params": {
                        "bucket": "String"
                    },
                    "uri": "bzb.api.tmc.upload.fileToOss:do",
                    "env": "{{this.utils.getEnv()}}"
                },
                "description": "上传文件"
            }, {
                "id": "addTotal",
                "isInit": false,
                "type": "bzb",
                "options": {
                    "method": "POST",
                    "params": {},
                    "uri": "bzb.api.tmc.pitplancontrol.addPitPlanControl:do",
                    "env": "{{this.utils.getEnv()}}"
                },
                "description": "新增总控记录"
            }, {
                "id": "getChannels",
                "isInit": true,
                "type": "bzb",
                "options": {
                    "method": "GET",
                    "params": {},
                    "uri": "bzb.api.tmc.platform.bizchannel.ajax.getChannels:do",
                    "env": "{{this.utils.getEnv()}}"
                },
                "dataHandler": function dataHandler(data, error) {
                    if (data.success) {
                        let list = data.data && data.data.list || [];
                        return list.map(item => {
                            return {
                                label: item.name,
                                value: item.id
                            }
                        })
                    } else {
                        this.utils.Message.error(data.message);
                    }
                    return data;
                }
            }, {
                "id": "getBizInfos",
                "isInit": true,
                "type": "bzb",
                "options": {
                    "method": "GET",
                    "params": {},
                    "uri": "bzb.api.tmc.platform.nbizinfo.ajax.getBizInfos:do",
                    "env": "{{this.utils.getEnv()}}"
                },
                "description": "请求类目信息",
                "dataHandler": function dataHandler(data, error) {
                    if (data.success) {
                        let list = data.data && data.data.list || [];
                        return list.map(item => {
                            return {
                                label: item.bizName,
                                value: item.id
                            }
                        })
                    } else {
                        this.utils.Message.error(data.message);
                    }
                    return data;
                }
            }, {
                "id": "getDimension",
                "isInit": true,
                "type": "bzb",
                "options": {
                    "method": "GET",
                    "params": {},
                    "uri": "bzb.api.tmc.category.getGenericDimensionData:do",
                    "env": "{{this.utils.getEnv()}}"
                },
                "description": "请求类目数据"
            }, {
                "id": "deletePitControls",
                "isInit": false,
                "type": "bzb",
                "options": {
                    "method": "GET",
                    "params": {},
                    "uri": "bzb.api.tmc.pitplancontrol.deletePitControls:do",
                    "env": "{{this.utils.getEnv()}}"
                },
                "description": "删除一个或多个总控记录"
            }, {
                "id": "addInitPitPlanControl",
                "isInit": true,
                "type": "bzb",
                "options": {
                    "method": "GET",
                    "params": {},
                    "uri": "bzb.api.tmc.pitplancontrol.addInitPitPlanControl:do",
                    "env": "{{this.utils.getEnv()}}"
                }
            }, {
                "id": "getGenericDimensionData",
                "isInit": true,
                "type": "bzb",
                "options": {
                    "method": "GET",
                    "params": {
                        "dimensionType": "{{this.page.state.listInit.dimensionType}}"
                    },
                    "uri": "bzb.api.tmc.category.getGenericDimensionData:do",
                    "env": "{{this.utils.getEnv()}}"
                }
            }]
        }
    }, {
        "componentName": "CateSelector",
        "props": {},
        "condition": false
    }],
    "dataSource": {
        "list": [{
            "id": "listInit",
            "isInit": true,
            "type": "bzb",
            "options": {
                "method": "GET",
                "params": {},
                "uri": "bzb.api.tmc.pitplancontrol.listInit:do",
                "env": "{{this.utils.getEnv()}}"
            },
            "dataHandler": function dataHandler(data, error) {
                if (data && data.success) {
                    return data.data;
                }
                return data;
            }
        }]
    },
    "methods": {
        "getDataSource": function getDataSource(value) {
            const dataSourceMap = {
                '1': "getChannels",
                "2": "getBizInfos"
            }
            return this.state[dataSourceMap[value] || ''] || []
        }
    }
}
export default schema1