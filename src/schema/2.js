const schema2 = {
    "componentName": "Page",
    "fileName": "page_pitPlan_planList",
    "props": {},
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
            "onChange": function onChange(key) {
                //选项卡发生切换时的事件回调
                //@param {String|Number} key 改变后的 key
                if (key === 'sum') {
                    this.history.push('/page/pitPlan/pitSum')
                }
            },
            "activeKey": "plan"
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
            "condition": "{{this.state.listInit. supportTabs.includes('pitcontrol')}}"
        }]
    }, {
        "componentName": "Div",
        "props": {
            "style": {
                "marginRight": 12,
                "marginLeft": 12
            }
        },
        "children": [{
            "componentName": "Form",
            "props": {
                "onSubmit": function onSubmit(value, error, field) {
                    // pitPlanInfo  
                    return this.submit(value);
                },
                "style": {
                    "marginBottom": 12
                },
                "inline": true,
                "ref": "filterForm"
            },
            "children": [{
                "componentName": "FormItem",
                "props": {
                    "name": "attachType",
                    "style": {
                        "marginRight": 12
                    },
                    "initValue": "{{this.location.query.attachType || '3'}}"
                },
                "children": [{
                    "componentName": "Select",
                    "props": {
                        "dataSource": [{
                            "label": "频道",
                            "value": "1"
                        }, {
                            "label": "业务类型",
                            "value": "2"
                        }, {
                            "label": "活动",
                            "value": "3"
                        }],
                        "autoWidth": true,
                        "hasBorder": true,
                        "onChange": function onChange(value, actionType, item) {
                            //Select发生改变时触发的回调
                            //@param {*} value 选中的值
                            //@param {String} actionType 触发的方式, 'itemClick', 'enter', 'tag'
                            //@param {*} item 选中的值的对象数据 (useDetailValue=false有效)
                            this.field.reset(['attachId']);

                        }
                    }
                }]
            }, {
                "componentName": "FormItem",
                "props": {
                    "name": "attachId",
                    "style": {
                        "marginRight": 12
                    },
                    "initValue": "{{this.location.query.activityId ? Number(this.location.query.activityId) : (this.location.query.attachId ? Number(this.location.query.attachId) : undefined)}}"
                },
                "children": [{
                    "componentName": "Select",
                    "props": {
                        "autoWidth": false,
                        "hasBorder": true,
                        "dataSource": "{{this.state[this.getMenu(this.field.getValue('attachType'))]}}",
                        "hasClear": true,
                        "showSearch": true,
                        "onSearch": function onSearch(value) {
                            //当搜索框值变化时回调
                            //@param {String} value 数据
                            this.utils.debounce(() => {
                                this.doSearch(value, this.field.getValue('attachType'))
                            });
                        },
                        "filterLocal": false
                    }
                }]
            }, {
                "componentName": "Button",
                "props": {
                    "type": "secondary",
                    "style": {
                        "margin": "0 5px 0 5px"
                    },
                    "htmlType": "submit"
                },
                "children": "查询"
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
        }, {
            "componentName": "Div",
            "props": {
                "0": {
                    "value": "1",
                    "lable": "频道"
                },
                "1": {
                    "value": "2",
                    "lable": "业务类型"
                },
                "2": {
                    "value": "3",
                    "lable": "活动小皮"
                },
                "style": {}
            },
            "children": [{
                "componentName": "Dialog",
                "props": {
                    "title": "发起规划",
                    "visible": "{{this.state.initPlanVisible}}",
                    "onOk": function onOk() {
                        this.planInitForm.field.validate((error, value) => {
                            if (error) return;
                            value = {
                                ...value,
                                ...this.state.search
                            };
                            this.dataSourceMap['addPitPlan'].load(value)
                                .then(res => {
                                    if (res.success) {
                                        this.setState({
                                            initPlanVisible: false
                                        })
                                        delete this.state.planContent;
                                        this.submit(this.state.search);
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
                        delete this.state.planContent;
                        this.setState({
                            initPlanVisible: false
                        })
                    },
                    "onClose": function onClose(trigger, event) {
                        //对话框关闭时触发的回调函数
                        //@param {String} trigger 关闭触发行为的描述字符串
                        //@param {Object} event 关闭时事件对象
                        delete this.state.planContent;
                        this.setState({
                            initPlanVisible: false
                        })
                    },
                    "style": {
                        "width": "600px"
                    },
                    "footer": true,
                    "shouldUpdatePosition": true
                },
                "children": [{
                    "componentName": "Form",
                    "props": {
                        "labelCol": 4,
                        "ref": "planInitForm"
                    },
                    "children": [{
                        "componentName": "FormItem",
                        "props": {
                            "label": "业务模版：",
                            "style": {
                                "display": "flex"
                            },
                            "name": "pitPlanTemplateId",
                            "asterisk": true,
                            "rules": [{
                                "required": true,
                                "message": "请选择模版"
                            }]
                        },
                        "children": [{
                            "componentName": "Select",
                            "props": {
                                "autoWidth": false,
                                "hasBorder": true,
                                "dataSource": "{{this.state.InitiatePlan}}",
                                "onChange": function onChange(value, actionType, item) {
                                    //Select发生改变时触发的回调
                                    //@param {*} value 选中的值
                                    //@param {String} actionType 触发的方式, 'itemClick', 'enter', 'tag'
                                    //@param {*} item 选中的值的对象数据 (useDetailValue=false有效)
                                    this.setState({
                                        planContent: item.content
                                    })

                                }
                            }
                        }]
                    }, {
                        "componentName": "Div",
                        "props": {},
                        "children": [{
                            "componentName": "FormItem",
                            "props": {
                                "name": "pitPlanType",
                                "label": "规划类型：",
                                "style": {
                                    "display": "flex"
                                },
                                "asterisk": true,
                                "rules": [{
                                    "required": true,
                                    "message": "请选择规划类型"
                                }]
                            },
                            "children": [{
                                "componentName": "RadioGroup",
                                "props": {
                                    "itemDirection": "hoz",
                                    "dataSource": "{{this.state.planContent.pitPlanType.dataSource}}"
                                }
                            }],
                            "condition": "{{!this.state.planContent.pitPlanType.hide}}"
                        }, {
                            "componentName": "FormItem",
                            "props": {
                                "name": "pitPlanTimeType",
                                "label": "规划维度：",
                                "style": {
                                    "display": "flex"
                                },
                                "rules": [{
                                    "required": true,
                                    "message": "请选择规划维度"
                                }],
                                "asterisk": true
                            },
                            "children": [{
                                "componentName": "RadioGroup",
                                "props": {
                                    "dataSource": "{{this.state.planContent.pitPlanTimeType.dataSource}}"
                                }
                            }],
                            "condition": "{{!this.state.planContent.pitPlanTimeType.hide}}"
                        }, {
                            "componentName": "FormItem",
                            "props": {
                                "name": "pitPlanOperType",
                                "label": "规划方式：",
                                "style": {
                                    "display": "flex"
                                },
                                "rules": [{
                                    "required": true,
                                    "message": "请选择规划方式"
                                }],
                                "asterisk": true
                            },
                            "children": [{
                                "componentName": "RadioGroup",
                                "props": {
                                    "dataSource": "{{this.state.planContent.pitPlanOperType.dataSource}}"
                                }
                            }],
                            "condition": "{{!this.state.planContent.pitPlanOperType.hide}}"
                        }],
                        "condition": "{{this.field.getValue('pitPlanTemplateId')}}"
                    }]
                }]
            }, {
                "componentName": "StatusPageLN",
                "props": {
                    "type": "empty",
                    "title": "当前无内容",
                    "desc": "请输入条件进行查询，或『发起规划』",
                    "footers": {
                        "type": "JSSlot",
                        "value": [{
                            "componentName": "Button",
                            "props": {
                                "type": "primary",
                                "onClick": function onClick(e) {
                                    let [attachId, attachType] = [this.filterForm.field.getValue("attachId"), this.filterForm.field.getValue("attachType")]
                                    // 选择两个下拉框后才能”发起规划“
                                    if (attachId && attachType) {
                                        this.setState({
                                            initPlanVisible: true
                                        })
                                    } else {
                                        this.utils.Message.error("请先选择业务类型！");
                                    }
                                }
                            },
                            "children": "发起规划",
                            "condition": "{{this.state.search}}"
                        }]
                    },
                    "style": {
                        "marginTop": 60
                    }
                },
                "condition": "{{!this.state.pitPlanId}}"
            }]
        }, {
            "componentName": "Div",
            "props": {},
            "children": [{
                "componentName": "Dialog",
                "props": {
                    "onOk": function onOk() {
                        // 授权操作
                        this.ownersForm.field.validate((error, value) => {
                            if (error) return;
                            let owners = [] //保存添加的授权人
                            if (value.newOwners) {
                                value.newOwners.forEach(o => {
                                    owners.push(o.stageName)
                                })
                            }
                            // this.state.owners为已有的授权人
                            owners = [...owners, ...this.state.owners]
                            let ownersData = {
                                owners: owners.join(','),
                                pitPlanRecordId: this.state.pitPlanRecordId
                            }
                            this.dataSourceMap['addPitPlanRecordOwners'].load(ownersData)
                                .then(res => {
                                    if (res.success) {
                                        this.setState({
                                            ownersVisible: false
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
                        this.setState({
                            ownersVisible: false
                        })
                    },
                    "onClose": function onClose(trigger, event) {
                        this.setState({
                            ownersVisible: false
                        })
                    },
                    "style": {
                        "width": "600px"
                    },
                    "footer": true,
                    "shouldUpdatePosition": true,
                    "title": "规划授权",
                    "visible": "{{this.state.ownersVisible}}"
                },
                "children": [{
                    "componentName": "Form",
                    "props": {
                        "labelCol": 4,
                        "ref": "ownersForm"
                    },
                    "children": [{
                        "componentName": "FormItem",
                        "props": {
                            "style": {
                                "display": "flex"
                            },
                            "name": "newOwners",
                            "asterisk": true,
                            "label": "添加操作人："
                        },
                        "children": [{
                            "componentName": "StaffSelector",
                            "props": {}
                        }]
                    }, {
                        "componentName": "FormItem",
                        "props": {
                            "style": {
                                "display": "flex"
                            },
                            "name": "owners",
                            "asterisk": true,
                            "label": "已有操作人："
                        },
                        "children": [{
                            "componentName": "TagCloseable",
                            "props": {
                                "closeArea": "tail",
                                "size": "medium",
                                "onClose": function onClose() {
                                    //点击关闭按钮时的回调
                                    let deletedOwners = this.state.owners
                                    deletedOwners.splice(this.index, 1)
                                    this.setState({
                                        owners: deletedOwners
                                    })
                                },
                                "key": "{{this.item}}",
                                "style": {
                                    "marginRight": 4
                                }
                            },
                            "children": "{{this.item}}",
                            "loop": "{{this.state.owners}}"
                        }]
                    }]
                }]
            }, {
                "componentName": "PitTitle",
                "props": {
                    "style": {
                        "marginBottom": 24
                    },
                    "desc": "{{this.state.desc}}",
                    "title": "{{`${this.state.name}的规划`}}",
                    "ref": "pitTitle"
                }
            }, {
                "componentName": "ListLN",
                "props": {
                    "type": "table",
                    "filter": {
                        "items": [{
                            "title": "选择月份",
                            "name": "validTime",
                            "component": "MonthPicker",
                            "componentProps": {
                                "dataSource": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                                "autoWidth": false,
                                "style": {
                                    "width": "200px"
                                }
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
                        }
                    },
                    "actions": [{
                        "name": "新增规划",
                        "component": "button",
                        "otherProps": {
                            "component": "a",
                            "taget": "_blank",
                            "href": "{{`/page/pitPlan/planCreate/time?pitPlanId=${this.state.pitPlanId || this.location.query.pitPlanId}&attachId=${this.state.search.attachId}&attachType=${this.state.search.attachType}`}}"
                        }
                    }],
                    "columns": [{
                        "title": "规划记录ID",
                        "dataIndex": "id"
                    }, {
                        "title": "名称",
                        "dataIndex": "name"
                    }, {
                        "title": "规划月份",
                        "dataIndex": "validTime"
                    }, {
                        "title": "生效状态",
                        "dataIndex": "status"
                    }, {
                        "title": "创建者",
                        "dataIndex": "creator"
                    }, {
                        "title": "创建时间",
                        "dataIndex": "gmtCreate"
                    }, {
                        "title": "修改时间",
                        "dataIndex": "gmtModified"
                    }, {
                        "title": "操作",
                        "cell": {
                            "type": "JSSlot",
                            "value": [{
                                "componentName": "Button",
                                "props": {
                                    "type": "secondary",
                                    "size": "small",
                                    "component": "a",
                                    "href": "{{`/page/pitPlan/planCreate/time?pitPlanId=${this.state.pitPlanId}&pitPlanRecordId=${this.record.id}&attachId=${this.state.search.attachId}&attachType=${this.state.search.attachType}`}}",
                                    "style": {
                                        "marginRight": 12
                                    }
                                },
                                "children": "查看"
                            }, {
                                "componentName": "Button",
                                "props": {
                                    "type": "secondary",
                                    "size": "small",
                                    "onClick": function onClick(e) {
                                        // 这里需要校验是否能授权
                                        this.dataSourceMap['authenticateRecordOwners'].load({
                                                pitPlanRecordId: this.record.id
                                            })
                                            .then(res => {
                                                if (res.success) {
                                                    // 打开授权弹窗
                                                    this.setState({
                                                        ownersVisible: true,
                                                        pitPlanRecordId: this.record.id,
                                                        owners: this.record.owners ? this.record.owners.split(',') : []
                                                    })
                                                } else {
                                                    this.utils.Message.error(res.message);
                                                }
                                            })
                                            .catch(err => {
                                                console.log(err)
                                            })
                                    },
                                    "component": "button"
                                },
                                "children": "授权"
                            }],
                            "params": ["value", "index", "record"]
                        }
                    }],
                    "showConfig": {
                        "hasBorder": false
                    },
                    "dataSource": "{{this.dataSourceMap.queryPitPlanRecords}}",
                    "dataHandler": function dataHandler(res) {
                        //对接口返回的数据进行处理
                        //注意必须返回对象，对象中包含 data、page、pageSize、total
                        return {
                            pageSize: 20,
                            total: res.totalCount,
                            data: res.values || []
                        }
                    },
                    "beforeLoad": function beforeLoad(params) {
                        if (params.validTime) {
                            params.validTime = this.utils.moment(params.validTime).format('YYYY-MM-DD 00:00:00');
                        }
                        return params;
                    },
                    "ref": "list"
                }
            }],
            "condition": "{{this.state.pitPlanId}}"
        }]
    }],
    "dataSource": {
        "list": [{
            "id": "InitiatePlan",
            "isInit": true,
            "type": "bzb",
            "options": {
                "method": "GET",
                "params": {},
                "uri": "bzb.api.tmc.pitplan.addPitPlanInit:do",
                "env": "{{this.utils.getEnv()}}"
            },
            "description": "发起规划的初始请求",
            "dataHandler": function dataHandler(data, error) {
                if (data.success) {
                    return (data.data || []).map(item => {
                        return {
                            label: item.tempName,
                            value: item.tempId,
                            content: item.tempContent
                        }
                    })
                }
                return data;
            }
        }, {
            "id": "queryPitPlanRecords",
            "isInit": "{{this.location.query.pitPlanId}}",
            "type": "bzb",
            "options": {
                "method": "GET",
                "params": "{{{...this.state.search, planId: this.state.pitPlanId || this.location.query.pitPlanId }}}",
                "uri": "bzb.api.tmc.pitplan.queryPitPlanRecords:do",
                "env": "{{this.utils.getEnv()}}"
            },
            "description": "获取单个规划记录的信息",
            "dataHandler": function dataHandler(data, error) {
                if (data && data.success) {
                    return data.data;
                }
                return data;
            }
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
            "description": "请求频道",
            "dataHandler": function dataHandler(data, error) {
                let Children = []
                let json = data.data.list
                for (const key in json) {
                    if (json.hasOwnProperty(key)) {
                        const element = json[key];
                        Children.push({
                            value: json[key].id,
                            label: json[key].name
                        })
                    }
                }
                return Children;
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
            "description": "请求业务类型",
            "dataHandler": function dataHandler(data, error) {
                let Children = []
                let json = data.data.list
                for (const key in json) {
                    if (json.hasOwnProperty(key)) {
                        const element = json[key];
                        Children.push({
                            value: json[key].id,
                            label: json[key].bizName
                        })
                    }
                }
                return Children;
            }
        }, {
            "id": "getMerActs",
            "isInit": true,
            "type": "bzb",
            "options": {
                "method": "GET",
                "params": {},
                "uri": "bzb.api.tmc.activityinfo.json.getMerActs:do",
                "env": "{{this.utils.getEnv()}}"
            },
            "description": "请求招商活动",
            "dataHandler": function dataHandler(data, error) {
                if (data && data.success) {
                    return (data.data && data.data.list || []).map(item => {
                        return {
                            label: item.activityName,
                            value: item.activityId
                        }
                    })
                }
                return data;
            }
        }, {
            "id": "addPitPlan",
            "isInit": false,
            "type": "bzb",
            "options": {
                "method": "POST",
                "params": {},
                "uri": "bzb.api.tmc.pitplan.addPitPlan:do",
                "env": "{{this.utils.getEnv()}}"
            },
            "description": " 新增品类规划  "
        }, {
            "id": "deleteDimensionInRecord",
            "isInit": false,
            "type": "bzb",
            "options": {
                "method": "GET",
                "params": {},
                "uri": "bzb.api.tmc.pitplan.deleteDimensionInRecord:do",
                "env": "{{this.utils.getEnv()}}"
            },
            "description": " 删除某个规划记录下的维度"
        }, {
            "id": "pitPlanInfo",
            "isInit": false,
            "type": "bzb",
            "options": {
                "method": "GET",
                "params": "{{{...this.state.search,id:1}}}",
                "uri": "bzb.api.tmc.pitplan.pitPlanInfo:do",
                "env": "{{this.utils.getEnv()}}"
            },
            "dataHandler": function dataHandler(data, error) {
                return data.data;
            }
        }, {
            "id": "getPitPlanRecord",
            "isInit": false,
            "type": "bzb",
            "options": {
                "method": "GET",
                "params": {},
                "uri": "bzb.api.tmc.pitplan.getPitPlanRecord:do",
                "env": "{{this.utils.getEnv()}}"
            }
        }, {
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
        }, {
            "id": "addPitPlanRecordOwners",
            "isInit": false,
            "type": "bzb",
            "options": {
                "method": "POST",
                "params": {},
                "uri": "bzb.api.tmc.pitplan.addPitPlanRecordOwners:do",
                "env": "{{this.utils.getEnv()}}"
            },
            "description": "保存授权人"
        }, {
            "id": "authenticateRecordOwners",
            "isInit": false,
            "type": "bzb",
            "options": {
                "method": "POST",
                "params": {},
                "uri": "bzb.api.tmc.pitplan.authenticateRecordOwners:do",
                "env": "{{this.utils.getEnv()}}"
            },
            "description": "校验是否允许授权"
        }]
    },
    "methods": {
        "getActionName": function getActionName(key) {
            let map = {
                "edit": "编辑"
            }
            return map[key] || key;
        },
        "getMenu": function getMenu(type) {
            const menuMap = {
                '1': 'getChannels',
                '2': 'getBizInfos',
                '3': 'getMerActs'
            }
            return menuMap[type]
        },
        "showDetail": function showDetail(pitPlanId) {
            this.dataSourceMap["getPitPlanRecord"].load({
                "pitPlanRecordId": pitPlanId
            }).then(res => {
                this.setState({
                    pitDetailVisible: true,
                    pitDetail: res.data
                })
            })
        },
        "submit": function submit(value) {
            this.state.search = value;
            let search = value;
            this.dataSourceMap['pitPlanInfo'].load(search)
                .then(infoRes => {
                    let {
                        planTypeStr,
                        timeTypeStr,
                        operTypeStr,
                        id,
                        name
                    } = infoRes

                    let s1 = `坑位类型：${planTypeStr}`,
                        s2 = `规划类型：${timeTypeStr}`,
                        s3 = `规划方式：${operTypeStr}`
                    this.setState({
                        desc: [s1, s2, s3],
                        name: name,
                        pitPlanId: id
                    })
                    this.list && this.list.reload();
                })
                .catch(err => {
                    console.log(err)
                })
        },
        "doSearch": function doSearch(value, type) {
            const actionName = this.getMenu(type);
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
        }
    },
    "lifeCycles": {
        "componentDidMount": function componentDidMount() {
            let activityId = this.location.query.actId || this.location.query.activityId;
            let attachId = this.location.query.attachId;
            let attachType = this.location.query.attachType;
            // 如果有小皮id，需要做回填
            if (activityId) {
                attachId = activityId;
                attachType = 3;
            }
            if (attachId && attachType) {
                // 小皮下拉
                this.doSearch(activityId, attachType);
                // 搜索
                this.submit({
                    attachType,
                    attachId
                })
            }
        }
    }
}
export default schema2