//! Script# Browser Compat Layer
//!


function __loadCompatLayer(w) {
    var opera = (window.navigator.userAgent.indexOf('Opera') >= 0);
    var firefox = (window.navigator.userAgent.indexOf('Gecko') >= 0);

    w.__getNonTextNode = function(node) {
        try {
            while (node && (node.nodeType != 1)) {
                node = node.parentNode;
            }
        }
        catch (ex) {
            node = null;
        }
        return node;
    };
    
    w.__getLocation = function(e) {
        var loc = {x : 0, y : 0};
        while (e) {
            loc.x += e.offsetLeft;
            loc.y += e.offsetTop;
            e = e.offsetParent;
        }
        return loc;
    };
    
    function addFunction(object, name, callback) {
        if (!object[name]) {
            object[name] = callback;
        }
    }
    
    function addGetter(proto, name, callback) {
        if (!proto.__lookupGetter__ || (proto.__lookupGetter__(name) === undefined)) {
            proto.__defineGetter__(name, callback);
        }    
    }
    
    function addSetter(proto, name, callback) {
        if (!proto.__lookupSetter__ || (proto.__lookupSetter__(name) === undefined)) {
            proto.__defineSetter__(name, callback);
        }    
    }

    addFunction(w, 'navigate', function(url) {
        window.setTimeout('window.location = "' + url + '";', 0);
    });
    
    function saveEvent(e) {
        window.event = e;
    }

    var attachEventProxy = function(eventName, eventHandler) {
        var eventName = eventName.slice(2);

        if ((eventName == 'mousewheel') && (opera || firefox)) {
            eventName = 'DOMMouseScroll';
        }
        
        this.addEventListener(eventName, saveEvent, true);
        this.addEventListener(eventName, eventHandler, false);
        return true;
    };

    var detachEventProxy = function (eventName, eventHandler) {
        var eventName = eventName.slice(2);

        if ((eventName == 'mousewheel') && (opera || firefox)) {
            eventName = 'DOMMouseScroll';
        }
        
        this.removeEventListener(eventName, saveEvent, true);
        this.removeEventListener(eventName, eventHandler, false);
    };

    addFunction(w, 'attachEvent', attachEventProxy);
    addFunction(w, 'detachEvent', detachEventProxy);
    addFunction(w.HTMLDocument.prototype, 'attachEvent', attachEventProxy);
    addFunction(w.HTMLDocument.prototype, 'detachEvent', detachEventProxy);
    addFunction(w.HTMLElement.prototype, 'attachEvent', attachEventProxy);
    addFunction(w.HTMLElement.prototype, 'detachEvent', detachEventProxy);
    
    var eventPrototype = w.Event.prototype;
    
    addGetter(eventPrototype, 'srcElement', function() {
        // __getNonTextNode(this.target) is the expected implementation.
        // However script.load has target set to the Document object... so we
        // need to throw in currentTarget as well.
        return __getNonTextNode(this.target) || this.currentTarget;
    });
    addGetter(eventPrototype, 'cancelBubble', function() {
        return this._bubblingCanceled || false;
    });
    addSetter(eventPrototype, 'cancelBubble', function(v) {
        if (v) {
            this._bubblingCanceled = true;
            this.stopPropagation();
        }
    });
    addGetter(eventPrototype, 'returnValue', function() {
        return this._cancelDefault;
    });
    addSetter(eventPrototype, 'returnValue', function(v) {
        if (!v) {
            this.preventDefault();
        }
        this._cancelDefault = v;
        return v;
    });
    addGetter(eventPrototype, 'fromElement', function () {
        var n;
        if (this.type == 'mouseover') {
            n = this.relatedTarget;
        }
        else if (this.type == 'mouseout') {
            n = this.target;
        }
        return __getNonTextNode(n);
    });
    addGetter(eventPrototype, 'toElement', function () {
        var n;
        if (this.type == 'mouseout') {
            n = this.relatedTarget;
        }
        else if (this.type == 'mouseover') {
            n = this.target;
        }
        return __getNonTextNode(n);
    });
    addGetter(eventPrototype, 'button', function() {
        return (this.which == 1) ? 1 : (this.which == 3) ? 2 : 0
    });
    addGetter(eventPrototype, 'offsetX', function() {
        return window.pageXOffset + this.clientX - __getLocation(this.srcElement).x;
    });
    addGetter(eventPrototype, 'offsetY', function() {
        return window.pageYOffset + this.clientY - __getLocation(this.srcElement).y;
    });
    
    var elementPrototype = w.HTMLElement.prototype;

    addGetter(elementPrototype, 'parentElement', function() {
        return this.parentNode;
    });
    addGetter(elementPrototype, 'children', function() {
        var children = [];
        var childCount = this.childNodes.length;
        for (var i = 0; i < childCount; i++) {
            var childNode = this.childNodes[i];
            if (childNode.nodeType == 1) {
                children.push(childNode);
            }
        }
        return children;
    });
    addGetter(elementPrototype, 'innerText', function() {    
        try {
            return this.textContent
        } 
        catch (ex) {
            var text = '';
            for (var i=0; i < this.childNodes.length; i++) {
                if (this.childNodes[i].nodeType == 3) {
                    text += this.childNodes[i].textContent;
                }
            }
            return str;
        }
    });
    addSetter(elementPrototype, 'innerText', function(v) {
        var textNode = document.createTextNode(v);
        this.innerHTML = '';
        this.appendChild(textNode);
    });
    addGetter(elementPrototype, 'currentStyle', function() {
        return window.getComputedStyle(this, null);
    });
    addGetter(elementPrototype, 'runtimeStyle', function() {
        return window.getOverrideStyle(this, null);
    });
    addFunction(elementPrototype, 'removeNode', function(b) {
        return this.parentNode ? this.parentNode.removeChild(this) : this;
    });
    addFunction(elementPrototype, 'contains', function(el) {
        while (el != null && el != this) {
            el = el.parentElement;
        }
        return (el != null);
    });

    addGetter(w.HTMLStyleElement.prototype, 'styleSheet', function() {
        return this.sheet;
    });
    
    var cssSheetPrototype = w.CSSStyleSheet.prototype;
    
    addGetter(cssSheetPrototype, 'rules', function() {
        return this.cssRules;
    });
    addFunction(cssSheetPrototype, 'addRule', function(selector, style, index) {
        this.insertRule(selector + '{' + style + '}', index);
    });
    addFunction(cssSheetPrototype, 'removeRule', function(index) {
        this.deleteRule(index);
    });
    
    var cssDecPrototype = w.CSSStyleDeclaration.prototype;
    
    addGetter(cssDecPrototype, 'styleFloat', function() {
        return this.cssFloat;
    });
    addSetter(cssDecPrototype, 'styleFloat', function(v) {
        this.cssFloat = v;
    });
    
    var docFragPrototype = DocumentFragment.prototype;
    
    addFunction(docFragPrototype, 'getElementById', function(id) {
        var nodeQueue = [];
        var childNodes = this.childNodes;
        var node;
        var c;
        
        for (c = 0; c < childNodes.length; c++) {
            node = childNodes[c];
            if (node.nodeType == 1) {
                nodeQueue.push(node);
            }
        }

        while (nodeQueue.length) {
            node = Array.dequeue(nodeQueue);
            if (node.id == id) {
                return node;
            }
            childNodes = node.childNodes;
            if (childNodes.length != 0) {
                for (c = 0; c < childNodes.length; c++) {
                    node = childNodes[c];
                    if (node.nodeType == 1) {
                        nodeQueue.push(node);
                    }
                }
            }
        }

        return null;
    });

    addFunction(docFragPrototype, 'getElementsByTagName', function(tagName) {
        var elements = [];
        var nodeQueue = [];
        var childNodes = this.childNodes;
        var node;
        var c;

        for (c = 0; c < childNodes.length; c++) {
            node = childNodes[c];
            if (node.nodeType == 1) {
                nodeQueue.push(node);
            }
        }

        while (nodeQueue.length) {
            node = Array.dequeue(nodeQueue);
            if (tagName == '*' || node.tagName == tagName) {
                Array.add(elements, node);
            }
            childNodes = node.childNodes;
            if (childNodes.length != 0) {
                for (c = 0; c < childNodes.length; c++) {
                    node = childNodes[c];
                    if (node.nodeType == 1) {
                        nodeQueue.push(node);
                    }
                }
            }
        }

        return elements;
    });

    addFunction(docFragPrototype, 'createElement', function(tagName) {
        return document.createElement(tagName);
    });

    var selectNodes = function(doc, path, contextNode) {
        if (!doc.documentElement) {
            return [];
        }

        contextNode = contextNode ? contextNode : doc;
        var xpath = new XPathEvaluator();
        var result = xpath.evaluate(path, contextNode,
                                    doc.createNSResolver(doc.documentElement),
                                    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        var nodeList = new Array(result.snapshotLength);
        for(var i = 0; i < result.snapshotLength; i++) {
            nodeList[i] = result.snapshotItem(i);
        }

        return nodeList;
    };

    var selectSingleNode = function(doc, path, contextNode) {
        path += '[1]';
        var nodes = selectNodes(doc, path, contextNode);
        if (nodes.length != 0) {
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i]) {
                    return nodes[i];
                }
            }
        }
        return null;
    };
    
    var xmlDocPrototype = w.XMLDocument.prototype;

    addFunction(xmlDocPrototype, 'selectNodes', function(path, contextNode) {
        return selectNodes(this, path, contextNode);
    });

    addFunction(xmlDocPrototype, 'selectSingleNode', function(path, contextNode) {
        return selectSingleNode(this, path, contextNode);
    });

    addFunction(xmlDocPrototype, 'transformNode', function(xsl) {
        var xslProcessor = new XSLTProcessor();
        xslProcessor.importStylesheet(xsl);

        var ownerDocument = document.implementation.createDocument("", "", null);
        var transformedDoc = xslProcessor.transformToDocument(this);
        
        return transformedDoc.xml;
    });
    
    var nodePrototype = Node.prototype;

    addFunction(nodePrototype, 'selectNodes', function(path) {
        var doc = this.ownerDocument;
        return doc.selectNodes(path, this);
    });
    addFunction(nodePrototype, 'selectSingleNode', function(path) {
        var doc = this.ownerDocument;
        return doc.selectSingleNode(path, this);
    });
    addGetter(nodePrototype, 'baseName', function() {
        return this.localName;
    });
    addGetter(nodePrototype, 'text', function() {
        return this.textContent;
    });
    addSetter(nodePrototype, 'text', function(value) {
        this.textContent = value;
    });
    addGetter(nodePrototype, 'xml', function() {
        return (new XMLSerializer()).serializeToString(this);
    });
}
function __supportsCompatLayer(ua) {
    // Supported browsers:
    //  - Firefox 1.5+
    //  - WebKit 500+
    //  - Opera 9.5+
    return (ua.indexOf('Gecko') >= 0) || (ua.indexOf('AppleWebKit') >= 0) || (ua.indexOf('Opera') >= 0);
}

if (__supportsCompatLayer(window.navigator.userAgent)) {
    try {
        __loadCompatLayer(window);
    }
    catch (e) {
    }
}
