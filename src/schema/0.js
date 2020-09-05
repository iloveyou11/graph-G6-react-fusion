const schema0 = {
    "componentName": "Page",
    "fileName": "index",
    "props": {},
    "children": [{
        "componentName": "Div",
        "props": {
            "style": {
                "fontWeight": "bold",
                "fontSize": "18px",
                "color": "#000"
            },
            "id": "div",
            "key": "div-key",
            "ref": "div",
            "className": "div",
            "color": "red",
            "onClick": function onClick(e) {
                console.log('div event')
            }
        },
        "children": [{
            "componentName": "Text",
            "props": {
                "text": "hello"
            },
            "onClick": function onClick(e) {
                console.log('div event')
            }
        }, {
            "componentName": "Div",
            "props": {},
            "children": [{
                "componentName": "Text",
                "props": {
                    "style": {
                        "display": "flex",
                        "flexDirection": "row",
                        "justifyContent": "flex-start",
                        "flexWrap": "nowrap",
                        "marginTop": 12,
                        "fontWeight": "bold",
                        "opacity": 0.59,
                        "float": "none",
                        "borderRadius": 15
                    }
                },
            }, {
                "componentName": "Div",
                "props": {
                    "style": {
                        "display": "flex",
                        "flexDirection": "row",
                        "justifyContent": "flex-start",
                        "flexWrap": "nowrap",
                        "marginTop": 12,
                        "fontWeight": "bold",
                        "opacity": 0.59,
                        "float": "none",
                        "borderRadius": 15
                    }
                },
                "condition": "{{this.state.hello}}",
                "children": [{
                    "componentName": "Div",
                    "props": {},
                    "children": [{
                        "componentName": "Text",
                        "props": {
                            "text": "hello"
                        }
                    }]
                }]
            }]
        }, {
            "componentName": "Div",
            "props": {},
            "children": [{
                "componentName": "Text",
                "props": {
                    "text": "hello",
                    "style": {
                        "color": "#089"
                    }
                },
                "condition": "{{this.state.hello}}"
            }]
        }]
    }, {
        "componentName": "Div",
        "props": {},
        "children": [{
            "componentName": "Text",
            "props": {
                "text": "hello"
            }
        }, {
            "componentName": "Div",
            "props": {},
            "children": [{
                "componentName": "Text",
                "props": {
                    "text": "hello"
                }
            }]
        }]
    }, {
        "componentName": "Div",
        "props": {},
        "children": [{
            "componentName": "Text",
            "props": {
                "text": "hello"
            }
        }]
    }],
    "methods": {
        "page_event": function page_event() {
            return 'page_event'
        }
    },
    "dataSource": {
        "list": [{
            "id": "data1",
            "isInit": true,
            "type": "fetch",
            "options": {
                "method": "GET",
                "params": {},
                "uri": "http://www.sds.getCole"
            }
        }],
        "list2": [{
            "id": "data1",
            "isInit": true,
            "type": "fetch",
            "options": {
                "method": "GET",
                "params": {},
                "uri": "http://www.sds.getCole"
            }
        }]
    }
}
export default schema0