const schema3 = {
    "componentName": "Page",
    "fileName": "page_pitPlan_planCreate_time",
    "props": {
        "autoLoading": true
    },
    "children": [{
        "componentName": "CreatePlanLayout",
        "props": {
            "step": 0,
            "pitPlanId": "{{this.location.query.pitPlanId}}"
        },
        "children": [{
            "componentName": "Form",
            "props": {
                "labelCol": 5,
                "onSubmit": function onSubmit(value, error, field) {
                    //form内有htmlType="submit"的元素的时候会触发
                    if (error) {
                        return;
                    }
                    if (value.validTime) {
                        value.validTime = this.utils.moment(value.validTime).format('YYYY-MM')
                    }
                    this.dataSourceMap['savePitPlanRecord'].load({
                            ...value,
                            pitPlanId: this.location.query.pitPlanId,
                            pitPlanRecordId: this.location.query.pitPlanRecordId,
                        })
                        .then(res => {
                            if (res.success) {
                                this.history.push(`/page/pitPlan/planCreate/cateSet?pitPlanId=${this.location.query.pitPlanId}&pitPlanRecordId=${res.data}&attachId=${this.location.query.attachId}&attachType=${this.location.query.attachType}`);
                            } else {
                                this.utils.Message.error(res.message);
                            }
                            console.log(res)
                        })
                        .catch(err => {
                            console.log(err)
                        })
                },
                "ref": "pitPlanRecordForm"
            },
            "children": [{
                "componentName": "FormItem",
                "props": {
                    "label": "规划记录名称：",
                    "name": "name",
                    "initValue": "{{this.state.getPitPlanRecord.name}}",
                    "asterisk": true,
                    "rules": [{
                        "required": true,
                        "message": "请输入名称"
                    }]
                },
                "children": [{
                    "componentName": "Input",
                    "props": {
                        "placeholder": "请输入",
                        "size": "medium",
                        "maxLength": 20,
                        "hasBorder": true,
                        "hasLimitHint": true,
                        "style": {
                            "width": "300px"
                        }
                    }
                }]
            }, {
                "componentName": "FormItem",
                "props": {
                    "name": "validTime",
                    "label": "选择月份：",
                    "initValue": "{{this.state.getPitPlanRecord.validTime}}",
                    "asterisk": true,
                    "rules": [{
                        "required": true,
                        "message": "请选择月份"
                    }]
                },
                "children": [{
                    "componentName": "MonthPicker",
                    "props": {
                        "hasClear": true,
                        "disabled": "{{this.location.query.pitPlanRecordId}}"
                    }
                }],
                "condition": "{{this.state.addPitPlanRecordInit.recordSplitType===1}}"
            }, {
                "componentName": "FormItem",
                "props": {
                    "name": "validTime",
                    "label": "活动时间：",
                    "style": {
                        "display": "flex",
                        "marginLeft": 100
                    }
                },
                "children": [{
                    "componentName": "Text",
                    "props": {
                        "text": "2020/01/01 00:00:00 - 2020/02/02 23:59:59",
                        "style": {
                            "fontSize": "12px"
                        }
                    }
                }],
                "condition": "{{this.state.addPitPlanRecordInit.data.recordSplitType===2}}"
            }, {
                "componentName": "ButtonGroup",
                "props": {
                    "style": {
                        "position": "relative",
                        "left": "20.83%"
                    }
                },
                "children": [{
                    "componentName": "Button",
                    "props": {
                        "type": "primary",
                        "style": {
                            "marginRight": 12
                        },
                        "htmlType": "submit"
                    },
                    "children": "保存并下一步"
                }, {
                    "componentName": "Button",
                    "props": {
                        "type": "normal",
                        "style": {
                            "margin": "0 5px 0 5px"
                        },
                        "component": "a",
                        "href": "{{`/page/pitPlan/planList?pitPlanId=${this.location.query.pitPlanId}&attachId=${this.location.query.attachId}&attachType=${this.location.query.attachType}`}}"
                    },
                    "children": "取消"
                }]
            }]
        }],
        "condition": true
    }],
    "dataSource": {
        "list": [{
            "id": "addPitPlanRecordInit",
            "isInit": true,
            "type": "bzb",
            "options": {
                "method": "GET",
                "params": {
                    "pitPlanId": "{{this.location.query.pitPlanId}}"
                },
                "uri": "bzb.api.tmc.pitplan.addPitPlanRecordInit:do",
                "env": "{{this.utils.getEnv()}}"
            },
            "description": "新增规划记录的初始请求",
            "dataHandler": function dataHandler(data, error) {
                if (data && data.success) {
                    return data.data;
                }
                return data;
            }
        }, {
            "id": "savePitPlanRecord",
            "isInit": false,
            "type": "bzb",
            "options": {
                "method": "POST",
                "params": {},
                "uri": "bzb.api.tmc.pitplan.savePitPlanRecord:do",
                "env": "{{this.utils.getEnv()}}"
            },
            "description": "新增规划记录"
        }, {
            "id": "getPitPlanRecord",
            "isInit": "{{this.location.query.pitPlanRecordId}}",
            "type": "bzb",
            "options": {
                "method": "GET",
                "params": {
                    "pitPlanRecordId": "{{this.location.query.pitPlanRecordId}}"
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
        }]
    }
}
export default schema3