import G6 from '@antv/g6';

export function stringify(s) {
    return JSON.stringify(s, function(key, val) {
        if (typeof val === "function") {
            return val + "";
        }
        return val;
    });
}
export function parse(s) {
    console.log(s);
    JSON.parse(s, function(k, v) {
        if (v.indexOf && v.indexOf('function') > -1) {
            return eval("(function(){return " + v + " })()")
        }
        return v;
    })
}
export function isEvent(e) {
    return /on+/.test(e);
}
export function isJson(element) {
    return (
        typeof element === "object" &&
        Object.prototype.toString.call(element).toLowerCase() ==
        "[object object]" &&
        !element.length
    );
}
// 去除粘贴格式
export function textInit(e) {
    e.preventDefault();
    let text;
    let clp = (e.originalEvent || e).clipboardData;
    if (clp === undefined || clp === null) {
        text = window.clipboardData.getData("text") || "";
        if (text !== "") {
            if (window.getSelection) {
                let newNode = document.createElement("span");
                newNode.innerHTML = text;
                window
                    .getSelection()
                    .getRangeAt(0)
                    .insertNode(newNode);
            } else {
                document.selection.createRange().pasteHTML(text);
            }
        }
    } else {
        text = clp.getData("text/plain") || "";
        if (text !== "") {
            document.execCommand("insertText", false, text);
        }
    }
}
//rgb颜色随机
export function rgb(isComp) {
    let r, g, b;
    if (isComp) {
        // 140 185 243 组件库是蓝色域
        r = Math.floor(120 + Math.random() * 40);
        g = Math.floor(160 + Math.random() * 40);
        b = Math.floor(220 + Math.random() * 36);
    } else {
        r = Math.floor(150 + Math.random() * 100);
        g = Math.floor(150 + Math.random() * 100);
        b = Math.floor(150 + Math.random() * 100);
    }
    return "rgb(" + r + "," + g + "," + b + ")";
}
// 处理超长文本
export function fittingString(str, maxWidth, fontSize) {
    const ellipsis = '...';
    const ellipsisLength = G6.Util.getTextSize(ellipsis, fontSize)[0];
    let currentWidth = 0;
    let res = str;
    const pattern = new RegExp("[\u4E00-\u9FA5]+");
    str.split('').forEach((letter, i) => {
        if (currentWidth > maxWidth - ellipsisLength) return;
        if (pattern.test(letter)) {
            currentWidth += fontSize;
        } else {
            currentWidth += G6.Util.getLetterWidth(letter, fontSize);
        }
        if (currentWidth > maxWidth - ellipsisLength) {
            res = `${str.substr(0, i)}${ellipsis}`;
        }
    });
    return res;
}

export function isValidHtmlTag(str) {
    const allHtmlTags = ["a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi", "bdo", "big", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "command", "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset", "h1> - <h6", "head", "header", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "menu", "menuitem", "meta", "meter", "nav", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "small", "source", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]
    return allHtmlTags.includes(str.toLowerCase())
}

export function isValidCompTag(str) {
    // 这里要加入iceluna自定义的组件tag
    //TODO
    return ['text', 'block', 'formitem'].includes(str.toLowerCase())
}

export function isValidStyleKey(key) {
    let validKeys = ["-webkit-line-clamp", ":active", "additive-symbols(@counter-style)", "::after(:after)", "align-content", "align-items", "align-self", "all", "animation", "animation-delay", "animation-direction", "animation-duration", "animation-fill-mode", "animation-iteration-count", "animation-name", "animation-play-state", "animation-timing-function", "@annotation", "annotation()", "attr()", "::backdrop", "backface-visibility", "background", "background-attachment", "background-blend-mode", "background-clip", "background-color", "background-image", "background-origin", "background-position", "background-repeat", "background-size", "::before(:before)", "block-size", "blur()", "border", "border-block", "border-block-color", "border-block-end", "border-block-end-color", "border-block-end-style", "border-block-end-width", "border-block-start", "border-block-start-color", "border-block-start-style", "border-block-start-width", "border-block-style", "border-block-width", "border-bottom", "border-bottom-color", "border-bottom-left-radius", "border-bottom-right-radius", "border-bottom-style", "border-bottom-width", "border-collapse", "border-color", "border-end-end-radius", "border-end-start-radius", "border-image", "border-image-outset", "border-image-repeat", "border-image-slice", "border-image-source", "border-image-width", "border-inline", "border-inline-color", "border-inline-end", "border-inline-end-color", "border-inline-end-style", "border-inline-end-width", "border-inline-start", "border-inline-start-color", "border-inline-start-style", "border-inline-start-width", "border-inline-style", "border-inline-width", "border-left", "border-left-color", "border-left-style", "border-left-width", "border-radius", "border-right", "border-right-color", "border-right-style", "border-right-width", "border-spacing", "border-start-end-radius", "border-start-start-radius", "border-style", "border-top", "border-top-color", "border-top-left-radius", "border-top-right-radius", "border-top-style", "border-top-width", "border-width", "bottom", "@bottom-center", "box-decoration-break", "box-shadow", "box-sizing", "break-after", "break-before", "break-inside", "brightness()", "calc()", "caption-side", "caret-color", "ch", "@character-variant", "character-variant()", "@charset", ":checked", "circle()", "clamp()", "clear", "clip", "clip-path", "cm", "color", "color-adjust", "column-count", "column-fill", "column-gap", "column-rule", "column-rule-color", "column-rule-style", "column-rule-width", "column-span", "column-width", "columns", "conic-gradient()", "content", "contrast()", "counter-increment", "counter-reset", "counter-set", "@counter-style", "counters()", "cross-fade()", "cubic-bezier()", "::cue", "cursor", ":default", "deg", ":dir", "direction", ":disabled", "display", "dpcm", "dpi", "dppx", "drop-shadow()", "element()", "ellipse()", "em", ":empty", "empty-cells", ":enabled", "env()", "ex", "fallback(@counter-style)", "filter", ":first", ":first-child", "::first-letter(:first-letter)", "::first-line(:first-line)", ":first-of-type", "fit-content()", "flex", "flex-basis", "flex-direction", "flex-flow", "flex-grow", "flex-shrink", "flex-wrap", "float", ":focus", "font", "@font-face", "font-family", "font-family(@font-face)", "font-feature-settings", "font-feature-settings(@font-face)", "@font-feature-values", "font-kerning", "font-language-override", "font-optical-sizing", "font-size", "font-size-adjust", "font-stretch", "font-stretch(@font-face)", "font-style", "font-style(@font-face)", "font-synthesis", "font-variant", "font-variant(@font-face)", "font-variant-alternates", "font-variant-caps", "font-variant-east-asian", "font-variant-ligatures", "font-variant-numeric", "font-variant-position", "font-variation-settings(@font-face)", "font-weight", "font-weight(@font-face)", "format()", "fr", ":fullscreen", "gap", "grad", "grayscale()", "grid", "grid-area", "grid-auto-columns", "grid-auto-flow", "grid-auto-rows", "grid-column", "grid-column-end", "grid-column-start", "grid-row", "grid-row-end", "grid-row-start", "grid-template", "grid-template-areas", "grid-template-columns", "grid-template-rows", "Hz", "hanging-punctuation", "height", "height(@viewport)", "@historical-forms", ":hover", "hsl()", "hsla()", "hue-rotate()", "hyphens", "image()", "image-orientation", "image-rendering", "image-set()", "@import", "in", ":in-range", ":indeterminate", "inherit", "initial", "inline-size", "inset", "inset()", "inset-block", "inset-block-end", "inset-block-start", "inset-inline", "inset-inline-end", "inset-inline-start", ":invalid", "invert()", "isolation", "justify-content", "justify-items", "justify-self", "kHz", "@keyframes", ":lang", ":last-child", ":last-of-type", "leader()", ":left", "left", "@left-bottom", "letter-spacing", "line-break", "line-height", "linear-gradient()", ":link", "list-style", "list-style-image", "list-style-position", "list-style-type", "local()", "margin", "margin-block", "margin-block-end", "margin-block-start", "margin-bottom", "margin-inline", "margin-inline-end", "margin-inline-start", "margin-left", "margin-right", "margin-top", "::marker", "mask", "mask-clip", "mask-composite", "mask-image", "mask-mode", "mask-origin", "mask-position", "mask-repeat", "mask-size", "mask-type", "matrix()", "matrix3d()", "max()", "max-height", "max-height(@viewport)", "max-width", "max-width(@viewport)", "max-zoom(@viewport)", "@media", "min()", "min-block-size", "min-height", "min-height(@viewport)", "min-inline-size", "min-width", "min-width(@viewport)", "min-zoom(@viewport)", "minmax()", "mix-blend-mode", "mm", "ms", "@namespace", "negative(@counter-style)", ":not", ":nth-child", ":nth-last-child", ":nth-last-of-type", ":nth-of-type", "object-fit", "object-position", ":only-child", ":only-of-type", "opacity", "opacity()", ":optional", "order", "orientation(@viewport)", "@ornaments", "ornaments()", "orphans", ":out-of-range", "outline", "outline-color", "outline-offset", "outline-style", "outline-width", "overflow", "overflow-wrap", "overflow-x", "overflow-y", "pad(@counter-style)", "padding", "padding-block", "padding-block-end", "padding-block-start", "padding-bottom", "padding-inline", "padding-inline-end", "padding-inline-start", "padding-left", "padding-right", "padding-top", "@page", "page-break-after", "page-break-before", "page-break-inside", "pc", "perspective", "perspective()", "perspective-origin", "place-content", "place-items", "place-self", "::placeholder", "pointer-events", "polygon()", "position", "prefix(@counter-style)", "pt", "px", "quotes", "rad", "radial-gradient()", "range(@counter-style)", ":read-only", ":read-write", "rect()", "rem", "repeat()", "repeating-linear-gradient()", "repeating-radial-gradient()", ":required", "resize", "revert", "rgb()", "rgba()", ":right", "right", "@right-bottom", ":root", "rotate", "rotate()", "rotate3d()", "rotateX()", "rotateY()", "rotateZ()", "row-gap", "saturate()", "scale", "scale()", "scale3d()", "scaleX()", "scaleY()", "scaleZ()", ":scope", "scroll-behavior", "scroll-margin", "scroll-margin-block", "scroll-margin-block-end", "scroll-margin-block-start", "scroll-margin-bottom", "scroll-margin-inline", "scroll-margin-inline-end", "scroll-margin-inline-start", "scroll-margin-left", "scroll-margin-right", "scroll-margin-top", "scroll-padding", "scroll-padding-block", "scroll-padding-block-end", "scroll-padding-block-start", "scroll-padding-bottom", "scroll-padding-inline", "scroll-padding-inline-end", "scroll-padding-inline-start", "scroll-padding-left", "scroll-padding-right", "scroll-padding-top", "scroll-snap-align", "scroll-snap-stop", "scroll-snap-type", "scrollbar-color", "scrollbar-width", "::selection", "selector()", "sepia()", "shape-image-threshold", "shape-margin", "shape-outside", "skew()", "skewX()", "skewY()", "::slotted", "speak-as(@counter-style)", "src(@font-face)", "steps()", "@styleset", "styleset()", "@stylistic", "stylistic()", "suffix(@counter-style)", "@supports", "@swash", "swash()", "symbols(@counter-style)", "symbols()", "system(@counter-style)", "tab-size", "table-layout", ":target", "target-counter()", "target-counters()", "target-text()", "text-align", "text-align-last", "text-combine-upright", "text-decoration", "text-decoration-color", "text-decoration-line", "text-decoration-style", "text-emphasis", "text-emphasis-color", "text-emphasis-position", "text-emphasis-style", "text-indent", "text-justify", "text-orientation", "text-overflow", "text-rendering", "text-shadow", "text-transform", "text-underline-position", "top", "@top-center", "touch-action", "transform", "transform-box", "transform-origin", "transform-style", "transition", "transition-delay", "transition-duration", "transition-property", "transition-timing-function", "translate", "translate()", "translate3d()", "translateX()", "translateY()", "translateZ()", "turn", "unicode-bidi", "unicode-range(@font-face)", "unset", "url()", "user-zoom(@viewport)", ":valid", "var()", "vertical-align", "vh", "@viewport", "visibility", ":visited", "vmax", "vmin", "vw", "white-space", "widows", "width", "width(@viewport)", "will-change", "word-break", "word-spacing", "word-wrap", "writing-mode", "z-index", "zoom(@viewport)", ":active", ":any-link", ":blank", ":checked", ":current", ":default", ":defined", ":dir()", ":disabled", ":drop", ":empty", ":enabled", ":first", ":first-child", ":first-of-type", ":fullscreen", ":future", ":focus", ":focus-visible", ":focus-within", ":has()", ":host", ":host()", ":host-context()", ":hover", ":indeterminate", ":in-range", ":invalid", ":is()", ":lang()", ":last-child", ":last-of-type", ":left", ":link", ":local-link", ":not()", ":nth-child()", ":nth-col()", ":nth-last-child()", ":nth-last-col()", ":nth-last-of-type()", ":nth-of-type()", ":only-child", ":only-of-type", ":optional", ":out-of-range", ":past", ":placeholder-shown", ":read-only", ":read-write", ":required", ":right", ":root", ":scope", ":target", ":target-within", ":user-invalid", ":valid", ":visited", ":where()", "::after(:after)", "::backdrop", "::before(:before)", "::cue(:cue)", "::first-letter(:first-letter)", "::first-line(:first-line)", "::grammar-error", "::marker", "::placeholder", "::selection", "::slotted()", "::spelling-error"]
    return validKeys.includes(key)
}

//TODO 验证value是否正确

export function isValidFunction(str) {
    return /^function(.*){.*}$/.test(str) || /^(.*)=>{.*}$/.test(str)
}