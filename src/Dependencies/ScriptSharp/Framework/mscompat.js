function __loadCompatLayer(c){var q=window.navigator.userAgent.indexOf("Opera")>=0,p=window.navigator.userAgent.indexOf("Gecko")>=0;c.__getNonTextNode=function(a){try{while(a&&a.nodeType!=1)a=a.parentNode}catch(b){a=null}return a};c.__getLocation=function(a){var b={x:0,y:0};while(a){b.x+=a.offsetLeft;b.y+=a.offsetTop;a=a.offsetParent}return b};function a(a,b,c){if(!a[b])a[b]=c}function b(a,b,c){(!a.__lookupGetter__||a.__lookupGetter__(b)===undefined)&&a.__defineGetter__(b,c)}function g(a,b,c){(!a.__lookupSetter__||a.__lookupSetter__(b)===undefined)&&a.__defineSetter__(b,c)}a(c,"navigate",function(a){window.setTimeout('window.location = "'+a+'";',0)});function o(a){window.event=a}var i=function(a,b){var a=a.slice(2);if(a=="mousewheel"&&(q||p))a="DOMMouseScroll";this.addEventListener(a,o,true);this.addEventListener(a,b,false);return true},j=function(a,b){var a=a.slice(2);if(a=="mousewheel"&&(q||p))a="DOMMouseScroll";this.removeEventListener(a,o,true);this.removeEventListener(a,b,false)};a(c,"attachEvent",i);a(c,"detachEvent",j);a(c.HTMLDocument.prototype,"attachEvent",i);a(c.HTMLDocument.prototype,"detachEvent",j);a(c.HTMLElement.prototype,"attachEvent",i);a(c.HTMLElement.prototype,"detachEvent",j);var d=c.Event.prototype;b(d,"srcElement",function(){return __getNonTextNode(this.target)||this.currentTarget});b(d,"cancelBubble",function(){return this._bubblingCanceled||false});g(d,"cancelBubble",function(a){if(a){this._bubblingCanceled=true;this.stopPropagation()}});b(d,"returnValue",function(){return this._cancelDefault});g(d,"returnValue",function(a){!a&&this.preventDefault();this._cancelDefault=a;return a});b(d,"fromElement",function(){var a;if(this.type=="mouseover")a=this.relatedTarget;else if(this.type=="mouseout")a=this.target;return __getNonTextNode(a)});b(d,"toElement",function(){var a;if(this.type=="mouseout")a=this.relatedTarget;else if(this.type=="mouseover")a=this.target;return __getNonTextNode(a)});b(d,"button",function(){return this.which==1?1:this.which==3?2:0});b(d,"offsetX",function(){return window.pageXOffset+this.clientX-__getLocation(this.srcElement).x});b(d,"offsetY",function(){return window.pageYOffset+this.clientY-__getLocation(this.srcElement).y});var e=c.HTMLElement.prototype;b(e,"parentElement",function(){return this.parentNode});b(e,"children",function(){for(var c=[],d=this.childNodes.length,a=0;a<d;a++){var b=this.childNodes[a];b.nodeType==1&&c.push(b)}return c});b(e,"innerText",function(){try{return this.textContent}catch(c){for(var b="",a=0;a<this.childNodes.length;a++)if(this.childNodes[a].nodeType==3)b+=this.childNodes[a].textContent;return str}});g(e,"innerText",function(b){var a=document.createTextNode(b);this.innerHTML="";this.appendChild(a)});b(e,"currentStyle",function(){return window.getComputedStyle(this,null)});b(e,"runtimeStyle",function(){return window.getOverrideStyle(this,null)});a(e,"removeNode",function(){return this.parentNode?this.parentNode.removeChild(this):this});a(e,"contains",function(a){while(a!=null&&a!=this)a=a.parentElement;return a!=null});b(c.HTMLStyleElement.prototype,"styleSheet",function(){return this.sheet});var h=c.CSSStyleSheet.prototype;b(h,"rules",function(){return this.cssRules});a(h,"addRule",function(a,c,b){this.insertRule(a+"{"+c+"}",b)});a(h,"removeRule",function(a){this.deleteRule(a)});var m=c.CSSStyleDeclaration.prototype;b(m,"styleFloat",function(){return this.cssFloat});g(m,"styleFloat",function(a){this.cssFloat=a});var k=DocumentFragment.prototype;a(k,"getElementById",function(e){for(var d=[],c=this.childNodes,a,b=0;b<c.length;b++){a=c[b];a.nodeType==1&&d.push(a)}while(d.length){a=Array.dequeue(d);if(a.id==e)return a;c=a.childNodes;if(c.length!=0)for(b=0;b<c.length;b++){a=c[b];a.nodeType==1&&d.push(a)}}return null});a(k,"getElementsByTagName",function(f){for(var e=[],d=[],c=this.childNodes,a,b=0;b<c.length;b++){a=c[b];a.nodeType==1&&d.push(a)}while(d.length){a=Array.dequeue(d);(f=="*"||a.tagName==f)&&Array.add(e,a);c=a.childNodes;if(c.length!=0)for(b=0;b<c.length;b++){a=c[b];a.nodeType==1&&d.push(a)}}return e});a(k,"createElement",function(a){return document.createElement(a)});var n=function(b,g,a){if(!b.documentElement)return[];a=a?a:b;for(var f=new XPathEvaluator,d=f.evaluate(g,a,b.createNSResolver(b.documentElement),XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null),e=new Array(d.snapshotLength),c=0;c<d.snapshotLength;c++)e[c]=d.snapshotItem(c);return e},r=function(e,c,d){c+="[1]";var a=n(e,c,d);if(a.length!=0)for(var b=0;b<a.length;b++)if(a[b])return a[b];return null},l=c.XMLDocument.prototype;a(l,"selectNodes",function(b,a){return n(this,b,a)});a(l,"selectSingleNode",function(b,a){return r(this,b,a)});a(l,"transformNode",function(c){var a=new XSLTProcessor;a.importStylesheet(c);var d=document.implementation.createDocument("","",null),b=a.transformToDocument(this);return b.xml});var f=Node.prototype;a(f,"selectNodes",function(a){var b=this.ownerDocument;return b.selectNodes(a,this)});a(f,"selectSingleNode",function(a){var b=this.ownerDocument;return b.selectSingleNode(a,this)});b(f,"baseName",function(){return this.localName});b(f,"text",function(){return this.textContent});g(f,"text",function(a){this.textContent=a});b(f,"xml",function(){return(new XMLSerializer).serializeToString(this)})}function __supportsCompatLayer(a){return a.indexOf("Gecko")>=0||a.indexOf("AppleWebKit")>=0||a.indexOf("Opera")>=0}if(__supportsCompatLayer(window.navigator.userAgent))try{__loadCompatLayer(window)}catch(e){}