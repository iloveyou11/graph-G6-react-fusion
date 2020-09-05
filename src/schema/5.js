const schema5 = {
    "componentName": "Page",
    "fileName": "page_pitPlan_planCreate_pitNumSet",
    "props": {
        "autoLoading": true
    },
    "children": [{
        "componentName": "CreatePlanLayout",
        "props": {
            "step": 2,
            "pitPlanId": "{{this.location.query.pitPlanId}}"
        },
        "children": [{
            "componentName": "Div",
            "props": {
                "style": {
                    "display": "flex",
                    "justifyContent": "space-between"
                }
            },
            "children": [{
                "componentName": "Div",
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
                            "marginRight": 12
                        },
                        "onClick": function onClick(e) {
                            this.dataSourceMap['enablePits'].load({
                                pitPlanRecordId: this.location.query.pitPlanRecordId
                            }).then(res => {
                                if (res.success) {
                                    this.history.push(`/page/pitPlan/planList?pitPlanId=${this.location.query.pitPlanId}&attachId=${this.location.query.attachId}&attachType=${this.location.query.attachType}`);
                                } else {
                                    this.utils.Message.error(res.message);
                                }
                            })
                        }
                    },
                    "children": "完成并生效"
                }, {
                    "componentName": "Button",
                    "props": {
                        "type": "normal",
                        "style": {
                            "marginRight": 12
                        },
                        "component": "a",
                        "href": "{{`/page/pitPlan/planCreate/cateSet?pitPlanId=${this.location.query.pitPlanId}&pitPlanRecordId=${this.location.query.pitPlanRecordId}&attachId=${this.location.query.attachId}&attachType=${this.location.query.attachType}`}}"
                    },
                    "children": "上一步"
                }]
            }, {
                "componentName": "FormItem",
                "props": {
                    "name": "name",
                    "label": "选择规划时间：",
                    "style": {
                        "display": "flex",
                        "float": "none"
                    }
                },
                "children": [{
                    "componentName": "DatePicker",
                    "props": {
                        "disabledDate": function disabledDate(value, view) {
                            //禁用日期函数
                            //@param {MomentObject} 日期值
                            //@param {String} view 当前视图类型，year: 年， month: 月, date: 日\n@return {Boolean} 是否禁用
                            let minTime = this.state.getPitPlanRecordSummary && this.state.getPitPlanRecordSummary.minTime;
                            let maxTime = this.state.getPitPlanRecordSummary && this.state.getPitPlanRecordSummary.maxTime;
                            if (minTime && !maxTime) {
                                return value < this.utils.moment(minTime);
                            }
                            if (maxTime && !minTime) {
                                return value > this.utils.moment(maxTime);
                            }
                            if (maxTime && minTime) {
                                return value < this.utils.moment(minTime) || value > this.utils.moment(maxTime);
                            }
                            return false;
                        },
                        "onChange": function onChange(value) {
                            //日期值改变时的回调
                            //@param {MomentObject|String} value 日期值
                            this.state.search = {
                                startTime: this.utils.moment(value).format('YYYY-MM-DD HH:mm:ss')
                            }
                            this.reloadDataSource();
                        }
                    }
                }]
            }]
        }, {
            "componentName": "Table",
            "props": {
                "hasBorder": true,
                "hasHeader": true,
                "dataSource": "{{this.state.getPitPlanRecordSummary.rows}}"
            },
            "children": [{
                "componentName": "TableColumnGroup",
                "props": {
                    "title": "分类",
                    "style": {
                        "textAlign": "center"
                    }
                },
                "children": [{
                    "componentName": "TableColumn",
                    "props": {
                        "title": "一级分类",
                        "dataIndex": "cate1",
                        "cell": {
                            "type": "JSSlot",
                            "value": [{
                                "componentName": "Text",
                                "props": {
                                    "text": "{{this.record.col.level === 1 ? this.record.col.name : '-'}}"
                                }
                            }],
                            "params": ["value", "index", "record"]
                        },
                        "lock": "left"
                    },
                    "condition": true
                }, {
                    "componentName": "TableColumn",
                    "props": {
                        "title": "二级分类",
                        "dataIndex": "cate2",
                        "cell": {
                            "type": "JSSlot",
                            "value": [{
                                "componentName": "Text",
                                "props": {
                                    "text": "{{this.record.col.level === 2 ? this.record.col.name : '-'}}"
                                }
                            }],
                            "params": ["value", "index", "record"]
                        },
                        "lock": "left"
                    },
                    "condition": true
                }, {
                    "componentName": "TableColumn",
                    "props": {
                        "title": "三级分类",
                        "dataIndex": "cate3",
                        "cell": {
                            "type": "JSSlot",
                            "value": [{
                                "componentName": "Text",
                                "props": {
                                    "text": "{{this.record.col.level === 3 ? this.record.col.name : '-'}}"
                                }
                            }],
                            "params": ["value", "index", "record"]
                        },
                        "lock": "left"
                    }
                }]
            }, {
                "componentName": "TableColumnGroup",
                "props": {
                    "title": {
                        "type": "JSSlot",
                        "value": [{
                            "componentName": "Div",
                            "props": {
                                "style": {
                                    "display": "flex"
                                }
                            },
                            "children": [{
                                "componentName": "Div",
                                "props": {
                                    "style": {
                                        "textAlign": "left",
                                        "flex": 1
                                    }
                                },
                                "children": [{
                                    "componentName": "Button",
                                    "props": {
                                        "type": "primary",
                                        "text": true,
                                        "onClick": function onClick(e) {
                                            this.doWeekChange('pre');
                                        },
                                        "disabled": "{{this.state.getPitPlanRecordSummary.head[0].value === this.state.getPitPlanRecordSummary.minTime}}"
                                    },
                                    "children": "< 上一周"
                                }]
                            }, {
                                "componentName": "Div",
                                "props": {
                                    "style": {
                                        "textAlign": "center",
                                        "flex": 1
                                    }
                                },
                                "children": [{
                                    "componentName": "Text",
                                    "props": {
                                        "text": "开团时间",
                                        "style": {}
                                    }
                                }]
                            }, {
                                "componentName": "Div",
                                "props": {
                                    "style": {
                                        "textAlign": "right",
                                        "flex": 1
                                    }
                                },
                                "children": [{
                                    "componentName": "Button",
                                    "props": {
                                        "type": "primary",
                                        "text": true,
                                        "onClick": function onClick(e) {
                                            this.doWeekChange('next');
                                        },
                                        "disabled": "{{this.state.getPitPlanRecordSummary.head[this.state.getPitPlanRecordSummary.head.length - 1].value === this.state.getPitPlanRecordSummary.maxTime}}"
                                    },
                                    "children": "下一周 >"
                                }]
                            }]
                        }]
                    },
                    "style": {}
                },
                "children": [{
                    "componentName": "TableColumn",
                    "props": {
                        "dataIndex": "name",
                        "cell": {
                            "type": "JSSlot",
                            "value": [{
                                "componentName": "NumSet",
                                "props": {
                                    "num": "{{this.record.datas[this.colIdx].totalCount || 0}}",
                                    "isMuti": "{{this.record.datas[this.colIdx].multiPit}}",
                                    "onSubmit": function onSubmit(newNum, oldNum, callback) {
                                        //newNum: 修改后的数字
                                        //oldNum：修改之前的数字
                                        //TODO: 需要考虑性能问题，看看是不是前端的数字一定要准确
                                        this.dataSourceMap['setPitNum'].load({
                                            pitPlanDimensionId: this.record.col && this.record.col.pitPlanDimensionId,
                                            onlineStartTime: this.item.value,
                                            pitId: this.record.datas[this.colIdx].pitId,
                                            pitNum: newNum,
                                            attachType: this.location.query.attachType,
                                            attachId: this.location.query.attachId
                                        }).then(res => {
                                            if (res.success) {
                                                callback(true);
                                                // 第一次创建pit，需要刷新列表拿到pitId
                                                if (!this.record.datas[this.colIdx].pitId) {
                                                    this.reloadDataSource();
                                                }
                                            } else {
                                                this.utils.Message.error(res.message);
                                            }
                                        })
                                    },
                                    "rowData": "{{this.record.col || {}}}",
                                    "colData": "{{this.item}}",
                                    "pitPlanRecordId": "{{this.location.query.pitPlanRecordId}}",
                                    "style": {
                                        "marginTop": -12,
                                        "marginRight": -16,
                                        "marginBottom": -12,
                                        "marginLeft": -16,
                                        "paddingTop": 12,
                                        "paddingRight": 16,
                                        "paddingBottom": 12,
                                        "paddingLeft": 16
                                    },
                                    "className": "{{this.record.datas[this.colIdx].hasWaitValid ? 'invalid': ''}}",
                                    "key": "{{`${this.record.col.pitPlanDimensionId}_${this.item.value}`}}"
                                },
                                "condition": true
                            }],
                            "params": ["value", "index", "record"]
                        },
                        "style": {
                            "width": 150
                        },
                        "title": {
                            "type": "JSSlot",
                            "value": [{
                                "componentName": "Html",
                                "props": {
                                    "html": "{{this.item.label}}"
                                }
                            }]
                        },
                        "align": "center"
                    },
                    "loopArgs": ["", "colIdx"],
                    "loop": "{{this.state.getPitPlanRecordSummary.head || []}}"
                }],
                "condition": true
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
                                "text": true,
                                "onClick": function onClick(e) {
                                    this.setState({
                                        batchData: this.record,
                                        visible: true
                                    })
                                }
                            },
                            "children": "批量操作"
                        }],
                        "params": ["value", "index", "record"]
                    },
                    "style": {
                        "textAlign": "center"
                    },
                    "align": "center",
                    "lock": "right"
                }
            }]
        }, {
            "componentName": "Dialog",
            "props": {
                "visible": "{{this.state.visible}}",
                "onOk": function onOk(event) {
                    //在点击确定按钮时触发的回调函数
                    //@param {Object} event 点击事件对象
                    this.batchForm.field.validate((errors, value) => {
                        if (errors) {
                            return;
                        }

                        if (value.targetDate) {
                            if (typeof value.targetDate === 'object') {
                                value.targetDate = this.utils.moment(value.targetDate).format('YYYY-MM-DD')
                            }
                        } else {
                            value.targetDate = this.utils.moment(this.state.getPitPlanRecordSummary.head[0].value).format('YYYY-MM-DD')
                        }
                        value = {
                            ...value,
                            pitPlanDimensionId: this.state.batchData && this.state.batchData.col && this.state.batchData.col.pitPlanDimensionId,
                            pitPlanId: this.location.query.pitPlanId
                        }
                        this.dataSourceMap['copyPit'].load(value).then(res => {
                            if (res.success) {
                                this.utils.Message.success('设置成功');
                                this.state.visible = false;
                                delete this.state.batchData;
                                delete this.state.getCopyPitRestDay;
                                delete this.state.getTargetWeeks;
                                delete this.state.targetWeekVisible;
                                this.reloadDataSource();
                                this.page.reloadDataSource();
                            } else {
                                this.utils.Message.error(res.message);
                            }
                        })
                    })
                },
                "onCancel": function onCancel(event) {
                    //在点击取消按钮时触发的回调函数
                    //@param {Object} event 点击事件对象
                    delete this.state.batchData;
                    delete this.state.getCopyPitRestDay;
                    delete this.state.getTargetWeeks;
                    delete this.state.targetWeekVisible;
                    this.setState({
                        visible: false
                    })
                },
                "onClose": function onClose(trigger, event) {
                    //对话框关闭时触发的回调函数
                    //@param {String} trigger 关闭触发行为的描述字符串
                    //@param {Object} event 关闭时事件对象
                    delete this.state.batchData;
                    delete this.state.getCopyPitRestDay;
                    delete this.state.getTargetWeeks;
                    delete this.state.targetWeekVisible;
                    this.setState({
                        visible: false
                    })
                },
                "style": {
                    "width": "600px"
                },
                "footer": true,
                "title": "{{`【${this.state.batchData.col.name}】批量设置`}}"
            },
            "children": [{
                "componentName": "Form",
                "props": {
                    "onSubmit": function onSubmit(value, error, field) {
                        //form内有htmlType="submit"的元素的时候会触发
                        // alert(JSON.stringify(value))
                    },
                    "ref": "batchForm",
                    "labelCol": 4,
                    "wrapperCol": 20
                },
                "children": [{
                    "componentName": "FormItem",
                    "props": {
                        "style": {
                            "display": "flex",
                            "float": "none"
                        },
                        "label": "复制方式：",
                        "name": "copyType",
                        "rules": [{
                            "required": true,
                            "message": "请选择复制方式"
                        }],
                        "asterisk": true
                    },
                    "children": [{
                        "componentName": "RadioGroup",
                        "props": {
                            "dataSource": [{
                                "label": "日维度",
                                "value": "1"
                            }, {
                                "label": "周维度",
                                "value": "2"
                            }],
                            "onChange": function onChange(value, e) {
                                //选中值改变时的事件
                                //@param {String/Number} value 选中项的值
                                //@param {Event} e Dom 事件对象
                                this.setState({
                                    copyType: value
                                })
                                if (value === "1") {
                                    this.setState({
                                        targetWeekVisible: true
                                    })
                                }

                                if (value === '2') {
                                    this.setState({
                                        targetWeekVisible: false
                                    })
                                    this.dataSourceMap['getTargetWeeks'].load({
                                        copyType: value,
                                        targetDate: this.state.batchData && this.state.batchData.datas && this.state.batchData.datas[0] && this.state.batchData.datas[0].label,
                                        pitPlanId: this.location.query.pitPlanId
                                    }).then(res => {
                                        if (res.success) {
                                            this.setState({
                                                getTargetWeeks: res.data && res.data.targetWeeks || [],
                                                restWeekOrLongTime: res.data && res.data.restWeekOrLongTime || 0
                                            })
                                        }
                                    })
                                } else {
                                    this.getCopyPitRestDay({
                                        ...this.field.getValues(),
                                        pitPlanDimensionId: this.state.batchData && this.state.batchData.col && this.state.batchData.col.pitPlanDimensionId
                                    });
                                }
                            }
                        }
                    }]
                }, {
                    "componentName": "FormItem",
                    "props": {
                        "style": {
                            "display": "flex",
                            "float": "none"
                        },
                        "label": "目标坑位：",
                        "name": "targetDate",
                        "rules": [{
                            "required": true,
                            "message": "请选择要复制的坑位"
                        }],
                        "asterisk": true
                    },
                    "children": [{
                        "componentName": "DatePicker",
                        "props": {
                            "style": {},
                            "disabledDate": function disabledDate(value, view) {
                                //禁用日期函数
                                //@param {MomentObject} 日期值
                                //@param {String} view 当前视图类型，year: 年， month: 月, date: 日
                                //@return {Boolean} 是否禁用
                                let minTime = this.state.getPitPlanRecordSummary && this.state.getPitPlanRecordSummary.minTime;
                                let maxTime = this.state.getPitPlanRecordSummary && this.state.getPitPlanRecordSummary.maxTime;
                                if (minTime && !maxTime) {
                                    return value < this.utils.moment(minTime);
                                }
                                if (maxTime && !minTime) {
                                    return value > this.utils.moment(maxTime);
                                }
                                if (maxTime && minTime) {
                                    return value < this.utils.moment(minTime) || value > this.utils.moment(maxTime);
                                }
                                return false;

                            },
                            "onChange": function onChange(value) {
                                //日期值改变时的回调
                                //@param {MomentObject|String} value 日期值
                                this.getCopyPitRestDay({
                                    ...this.field.getValues(),
                                    pitPlanDimensionId: this.state.batchData && this.state.batchData.col && this.state.batchData.col.pitPlanDimensionId
                                });
                            }
                        }
                    }],
                    "condition": "{{this.field.getValue('copyType') === '1'}}"
                }, {
                    "componentName": "FormItem",
                    "props": {
                        "name": "targetWeek",
                        "style": {
                            "display": "flex",
                            "float": "none"
                        },
                        "label": "目标周：",
                        "rules": [{
                            "required": true,
                            "message": "请选择要复制的周"
                        }],
                        "asterisk": true
                    },
                    "children": [{
                        "componentName": "Select",
                        "props": {
                            "onChange": function onChange(value, actionType, item) {
                                if (this.state.copyType === "2" && value) {
                                    this.setState({
                                        targetWeekVisible: true
                                    })
                                }

                                let targetDate = this.state.getPitPlanRecordSummary && this.state.getPitPlanRecordSummary.head && this.state.getPitPlanRecordSummary.head[0] && this.state.getPitPlanRecordSummary.head[0].value;
                                targetDate = targetDate && this.utils.moment(targetDate).format('YYYY-MM-01');
                                this.getCopyPitRestDay({
                                    ...this.field.getValues(),
                                    pitPlanDimensionId: this.state.batchData && this.state.batchData.col && this.state.batchData.col.pitPlanDimensionId,
                                    targetDate
                                })
                            },
                            "autoWidth": false,
                            "hasBorder": true,
                            "dataSource": "{{this.state.getTargetWeeks}}"
                        },
                        "condition": true
                    }],
                    "condition": "{{this.field.getValue('copyType') === '2'}}"
                }, {
                    "componentName": "FormItem",
                    "props": {
                        "style": {
                            "display": "flex",
                            "float": "none"
                        },
                        "label": "复制到：",
                        "name": "copyPitDayDimension",
                        "asterisk": true,
                        "rules": [{
                            "required": true,
                            "message": "请选择复制到的时间"
                        }],
                        "initValue": "{{this.state.restWeekOrLongTime.toString()}}"
                    },
                    "children": [{
                        "componentName": "RadioGroup",
                        "props": {
                            "dataSource": "{{this.getCopyPitDayDimension(this.field.getValue('copyType'))}}"
                        }
                    }],
                    "condition": "{{this.state.targetWeekVisible}}"
                }, {
                    "componentName": "FormItem",
                    "props": {
                        "style": {
                            "position": "relative",
                            "left": "16.67%",
                            "float": "none"
                        },
                        "label": "现在开始到",
                        "labelCol": {
                            "span": 3
                        },
                        "name": "endWeek"
                    },
                    "children": [{
                        "componentName": "Select",
                        "props": {
                            "autoWidth": true,
                            "hasBorder": true,
                            "dataSource": "{{this.state.getCopyPitRestDay.longTime}}",
                            "style": {
                                "marginBottom": 8
                            },
                            "onChange": function onChange(value, actionType, item) {
                                //Select发生改变时触发的回调
                                //@param {*} value 选中的值
                                //@param {String} actionType 触发的方式, 'itemClick', 'enter', 'tag'
                                //@param {*} item 选中的值的对象数据 (useDetailValue=false有效)
                                let time = item.time;
                                let getCopyPitRestDay = this.state.getCopyPitRestDay || {};
                                getCopyPitRestDay.custom = time;
                                this.setState({
                                    getCopyPitRestDay: {
                                        ...getCopyPitRestDay
                                    }
                                })
                            }
                        }
                    }],
                    "condition": "{{this.field.getValue('copyType') === '2' && this.field.getValue('copyPitDayDimension') === '2'}}"
                }, {
                    "componentName": "Div",
                    "props": {
                        "style": {
                            "marginTop": 12,
                            "width": 440,
                            "position": "relative",
                            "left": "16.67%"
                        }
                    },
                    "children": [{
                        "componentName": "Text",
                        "props": {
                            "style": {
                                "display": "block",
                                "paddingTop": 12,
                                "paddingRight": 12,
                                "paddingBottom": 12,
                                "paddingLeft": 12,
                                "width": "100%",
                                "fontSize": "12px",
                                "color": "#666",
                                "backgroundColor": "#F7F8FA"
                            },
                            "text": "{{this.getText()}}"
                        },
                        "condition": "{{!!this.getText()}}"
                    }]
                }],
                "condition": true
            }]
        }]
    }],
    "dataSource": {
        "list": [{
            "id": "getPitPlanRecordSummary",
            "isInit": true,
            "type": "bzb",
            "options": {
                "method": "GET",
                "params": "{{{...this.state.search, planRecordId: this.location.query.pitPlanRecordId}}}",
                "uri": "bzb.api.tmc.pitplan.getPitPlanRecordSummary:do",
                "env": "{{this.utils.getEnv()}}"
            },
            "dataHandler": function dataHandler(data, error) {
                if (data.success) {
                    return data.data;
                } else {
                    this.utils.Message.error(data.message);
                }
                return data;
            }
        }, {
            "id": "setPitNum",
            "isInit": false,
            "type": "bzb",
            "options": {
                "method": "GET",
                "params": {},
                "uri": "bzb.api.tmc.pitplan.setPitNum:do",
                "env": "{{this.utils.getEnv()}}"
            }
        }, {
            "id": "copyPit",
            "isInit": false,
            "type": "bzb",
            "options": {
                "method": "GET",
                "params": {
                    "planRecordId": "{{this.location.query.pitPlanRecordId}}"
                },
                "uri": "bzb.api.tmc.pitplan.copyPit:do",
                "env": "{{this.utils.getEnv()}}"
            }
        }, {
            "id": "enablePits",
            "isInit": false,
            "type": "bzb",
            "options": {
                "method": "GET",
                "params": {},
                "uri": "bzb.api.tmc.pitplan.enablePits:do",
                "env": "{{this.utils.getEnv()}}"
            }
        }, {
            "id": "getCopyPitRestDay",
            "isInit": false,
            "type": "bzb",
            "options": {
                "method": "GET",
                "params": {
                    "pitPlanId": "{{this.location.query.pitPlanId}}",
                    "planRecordId": "{{this.location.query.pitPlanRecordId}}"
                },
                "uri": "bzb.api.tmc.pitplan.getCopyPitRestDay:do",
                "env": "{{this.utils.getEnv()}}"
            }
        }, {
            "id": "getTargetWeeks",
            "isInit": false,
            "type": "bzb",
            "options": {
                "method": "GET",
                "params": {},
                "uri": "bzb.api.tmc.pitplan.getTargetWeeks:do",
                "env": "{{this.utils.getEnv()}}"
            }
        }]
    },
    "scss": ".luna-page_pit-plan_plan-create_pit-num-set {\n  .invalid {\n    background-color: #FFF2E6;\n  }\n}",
    "methods": {
        "getCopyPitRestDay": function getCopyPitRestDay(values) {
            if ((!values.targetDate && !values.targetWeek) || !values.copyType) {
                return;
            }
            if (values.targetDate && typeof values.targetDate === 'object') {
                values.targetDate = this.utils.moment(values.targetDate).format('YYYY-MM-DD')
            }
            this.dataSourceMap['getCopyPitRestDay'].load(values).then(res => {
                if (res.success) {
                    this.setState({
                        getCopyPitRestDay: res.data
                    })
                } else {
                    this.utils.Message.error(res.message);
                }
            })
        },
        "getCopyPitDayDimension": function getCopyPitDayDimension(copyType = '1') {
            let type = null
            if (copyType === '1') type = '1'
            if (copyType === '2' && this.state.restWeekOrLongTime === 1) type = '2'
            if (copyType === '2' && this.state.restWeekOrLongTime === 2) type = '3'
            let options = {
                "1": [{
                    label: '本周剩余日期',
                    value: '1'
                }, {
                    label: '本月剩余日期',
                    value: '2'
                }],
                "2": [{
                    label: '本月剩余周',
                    value: '1'
                }],
                "3": [{
                    label: '长期',
                    value: '2'
                }]
            }[type]
            return options
        },
        "getRestDaysKey": function getRestDaysKey(pos = '1-1') {
            return {
                '1-1': 'restDaysOfWeek',
                '1-2': 'restDaysOfMonth',
                '2-1': 'restDaysOfMonth',
                '2-2': 'custom'
            }[pos];
        },
        "doWeekChange": function doWeekChange(type) {
            const getPitPlanRecordSummary = this.state.getPitPlanRecordSummary || {};
            const head = getPitPlanRecordSummary && getPitPlanRecordSummary.head || [];
            const firstDay = head[0] && head[0].value;
            const lastDay = head && head.length && head[head.length - 1] && head[head.length - 1].value;
            let targetDate;
            if (type === 'next') {
                targetDate = this.utils.moment(lastDay).format('YYYY-MM-DD');
            } else if (type === 'pre') {
                targetDate = this.utils.moment(firstDay).format('YYYY-MM-DD');
            };
            this.state.search = {
                targetDate,
                beforeOrNextWeek: type === 'pre' ? 1 : 2
            }
            this.reloadDataSource();
        },
        "getText": function getText() {
            return `最终结果：${(this.state.getCopyPitRestDay[this.getRestDaysKey(this.batchForm.field.getValue('copyType') + '-' + this.batchForm.field.getValue('copyPitDayDimension'))] || []).join('、') || ''}`
        }
    }
}
export default schema5