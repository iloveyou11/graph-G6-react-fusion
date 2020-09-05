// style
// 均在props的stype字段中
let style = {
    "componentName": "Page",
    "fileName": "index",
    "props": {},
    "children": [{
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
        "children": []
    }]
}

// props
// props属性下除style、onClick的其他属性+和componentName同级的属性
let props = {
    "componentName": "Page",
    "fileName": "index",
    "props": {},
    "children": [{
        "componentName": "Div",
        "props": {
            "style": {
                "display": "flex",
            },
            //这里是props
            "id": "div",
            "key": "div-key",
            "ref": "div",
            "className": "div",
            "color": "red"
        },
        //这里是props
        "condition": "{{this.state.hello}}"
    }]
}

//event
let event = {
    "componentName": "Page",
    "fileName": "index",
    "props": {},
    "children": [{
        "componentName": "Div",
        "props": {
            // 在这里
            "onClick": function onClick(e) {
                console.log('div event')
            }
        },
        "children": [{
            "componentName": "Text",
            "props": {
                // 在这里
                "text": "文本",
                "onClick": function onClick(e) {
                    console.log('text event')
                }
            }
        }]
    }],
    "methods": {
        // 在这里
        "page_event": function page_event() {
            return 'page_event'
        }
    }
}

// data
let data = {
    "componentName": "Page",
    "fileName": "index",
    "props": {},
    "children": [{
        "componentName": "Div"
    }],
    // 在这里
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