window.ss={version:"0.6.3.0",isUndefined:function(a){return a===undefined},isNull:function(a){return a===null},isNullOrUndefined:function(a){return a===null||a===undefined}};(function(){function i(b){b=b||{};a(arguments,function(a){a&&w(a,function(c,a){b[a]=c})},1);return b}function w(a,c){for(var b in a)c(a[b],b)}function a(a,d,e){var c;if(a){if(!(a instanceof Array||typeof a.length==="number"&&(typeof a.callee==="function"||a.item&&typeof a.nodeType==="undefined"&&!a.addEventListener&&!a.attachEvent)))a=[a];for(var b=e||0,f=a.length;b<f;b++)if(d(a[b],b)){c=true;break}}return!c}var A=0,u=1,d=2,v=3,g=!!document.attachEvent;function o(a,d){var c;if(a)for(var b=0,f=a.length;b<f;b++)if(d(e(a[b]))){c=true;break}return!c}function y(c){var b={};a(c,function(a){b[a]=true});return b}function p(b,a){return c(b,a?"executionDependencies":"dependencies")}function q(a){w(a._parents,function(a){k(a,null,null,true)})}function e(a){return j(a)||(ss.scripts[a]={name:a})}function k(a,b,d,c){return ss.loader._requireScript(a,b,d,c)}function m(c,d,f,e){var b;a(c,function(a){a=j(a);b|=k(a,d,f,e)});return b}function j(a){var b=typeof a==="string"?ss.scripts[a]:a?a.script||a:null;if(b&&!b._isScript)b=null;return b}function b(a,b){return(a._state=b||a._state)||0}function n(a){return!a||b(a)>d}function l(b,a){var c=b[a];delete b[a];return c}function s(d,b,c){a(l(d,b),function(a){a.apply(null,c||[])})}function c(a,c,b){return a?(a[c]=a[c]||b):b}function t(d,b,a){c(d,b,[]).push(a)}function x(e,b,d,a){c(e,b,{})[d]=a}function h(a,c,e,h,f,d){function b(){if(!g||!f||/loaded|complete/.test(a.readyState)){if(g)a.detachEvent(e||"on"+c,b);else{a.removeEventListener(c,b,false);d&&a.removeEventListener("error",b,false)}h.apply(a);a=null}}if(g)a.attachEvent(e||"on"+c,b);else{a.addEventListener(c,b,false);d&&a.addEventListener("error",b,false)}}function r(){if(ss._domReady){var b=l(ss,"_domReadyQueue");a(b,function(a){a()})}}function f(){var b=ss._ready;if(!b&&ss._domReady&&!(ss.loader&&ss.loader._loading))ss._ready=b=true;if(b){var c=l(ss,"_readyQueue");a(c,function(a){a()})}}var z={debug:true,scripts:{},_domLoaded:function(){function a(){if(!ss._domReady){ss._domReady=true;r();f()}}h(window,"load",null,a);var b;if(g)if(window==window.top&&document.documentElement.doScroll){var d,e,c=document.createElement("div");b=function(){try{c.doScroll("left")}catch(e){d=window.setTimeout(b,0);return}c=null;a()};b()}else h(document,null,"onreadystatechange",a,true);else document.addEventListener&&h(document,"DOMContentLoaded",null,a)},onDomReady:function(a){t(this,"_domReadyQueue",a);r()},onReady:function(a){t(this,"_readyQueue",a);f()},"require":function(e,c,i){var l=ss.loader._session++,b,g;function h(){if(c)ss.onDomReady(function(){c(e,i)})}function d(){if(!g&&!b&&!k()){g=true;h()}f()}function k(){b=true;var c=[];a(e,function(a){a=j(a);if(a){var b=a.contains;if(b)o(b,function(a){c.push(a)});else c.push(a)}});var f=m(c,d,l);b=false;return f}d()},loadScripts:function(c,a,b){this.loader._loadScripts(c,a,b)},loader:{basePath:null,_loading:0,_session:0,_init:function(){var a=document.getElementsByTagName("script"),b=a.length?a[a.length-1].src:null;this.basePath=b?b.slice(0,b.lastIndexOf("/")):""},_loadSrc:function(f,d){var b=i(document.createElement("script"),{type:"text/javascript",src:f}),e=c(this,"_loadedScripts",{});a(document.getElementsByTagName("script"),function(b){var a=b.src;if(a)e[a]=true});if(e[b.src])d&&d();else{h(b,"load","onreadystatechange",d,true,true);this._loading++;e[b.src]=true;document.getElementsByTagName("head")[0].appendChild(b)}},_load:function(a,e,h){var f;if(n(a))e();else{f=true;var d=c(a,"_notify",[]),g="session"+h;if(!d[g]){d[g]=true;d.push(e)}if(b(a)<u){b(a,u);this._loadSrc(this._getUrl(a),this._getHandler(a))}}return f},_getUrl:function(a){var e=ss.debug,f=a.name,b=(e?a.debugUrl||a.releaseUrl:a.releaseUrl).replace(/\{0\}/,f)||"";if(b.substr(0,2)==="%/"){var c=this.basePath,d=c.charAt(c.length-1)==="/";b=c+(d?"":"/")+b.substr(2)}return b},_getHandler:function(a){return function(){ss.loader._loading--;b(a)<d&&b(a,d);s(a,"_notify")}},_loadScripts:function(a,b,g){var e=-1,h=c(this,"_loadedScripts",{});a=a instanceof Array?Array.apply(null,a):[a];function d(c){if(!c)ss.loader._loading--;if(++e<a.length)ss.loader._loadSrc(a[e],d);else{b&&b(a,g);f()}}d(true)},_requireScript:function(a,g,h,c){var k;if(!n(a)){var f=m(p(a),g,h,c),i=m(p(a,true),g,h,c);if(!f&&!i&&b(a)===d){b(a,v);s(a,"_callback");if(c){var j=a.contains;if(j)o(j,function(a){q(a)});else q(e(a))}}else!c&&!f&&this._load(a,g,h);k|=f||i}return k||!n(a)},_registerParents:function(b){function c(a){var c=e(a);x(c,"_parents",b.name,b)}a(b.dependencies,c);a(b.executionDependencies,c)},defineScript:function(a){var b=ss.scripts,c=a.name;a=b[c]=i(b[c],a);this._registerParents(a);if(a.isLoaded)a._state=v;a._isScript=true},defineScripts:function(b,c){a(c,function(a){ss.loader.defineScript(i(null,b,a))})},registerScript:function(l,h,i){var f=e(l);f._callback=i;var g=c(f,"executionDependencies",[]),j=y(g);a(h,function(a){!j[a]&&g.push(a)});this._registerParents(f);b(f,d);k(f,null,null,true)}}};i(ss,z);ss.loader._init();ss._domLoaded()})();Object.__typeName="Object";Object.__baseType=null;Object.getKeyCount=function(b){var a=0;for(var c in b)a++;return a};Object.clearKeys=function(a){for(var b in a)delete a[b]};Object.keyExists=function(b,a){return b[a]!==undefined};Function.prototype.invoke=function(){return this.apply(null,arguments)};Boolean.__typeName="Boolean";Boolean.parse=function(a){return a.toLowerCase()=="true"};Number.__typeName="Number";Number.parse=function(a){return!a||!a.length?0:a.indexOf(".")>=0||a.indexOf("e")>=0||a.endsWith("f")||a.endsWith("F")?parseFloat(a):parseInt(a,10)};Number.prototype.format=function(a){return ss.isNullOrUndefined(a)||a.length==0||a=="i"?this.toString():this._netFormat(a,false)};Number.prototype.localeFormat=function(a){return ss.isNullOrUndefined(a)||a.length==0||a=="i"?this.toLocaleString():this._netFormat(a,true)};Number._commaFormat=function(a,i,n,o){var c=null,h=a.indexOf(n);if(h>0){c=a.substr(h);a=a.substr(0,h)}var j=a.startsWith("-");if(j)a=a.substr(1);var f=0,g=i[f];if(a.length<g)return c?a+c:a;var k=a.length,b="",l=false;while(!l){var e=g,d=k-e;if(d<0){g+=d;e+=d;d=0;l=true}if(!e)break;var m=a.substr(d,e);if(b.length)b=m+o+b;else b=m;k-=e;if(f<i.length-1){f++;g=i[f]}}if(j)b="-"+b;return c?b+c:b};Number.prototype._netFormat=function(f,g){var b=g?ss.CultureInfo.CurrentCulture.numberFormat:ss.CultureInfo.InvariantCulture.numberFormat,a="",c=-1;if(f.length>1)c=parseInt(f.substr(1));var e=f.charAt(0);switch(e){case"d":case"D":a=parseInt(Math.abs(this)).toString();if(c!=-1)a=a.padLeft(c,"0");if(this<0)a="-"+a;break;case"x":case"X":a=parseInt(Math.abs(this)).toString(16);if(e=="X")a=a.toUpperCase();if(c!=-1)a=a.padLeft(c,"0");break;case"e":case"E":if(c==-1)a=this.toExponential();else a=this.toExponential(c);if(e=="E")a=a.toUpperCase();break;case"f":case"F":case"n":case"N":if(c==-1)c=b.numberDecimalDigits;a=this.toFixed(c).toString();if(c&&b.numberDecimalSeparator!="."){var d=a.indexOf(".");a=a.substr(0,d)+b.numberDecimalSeparator+a.substr(d+1)}if(e=="n"||e=="N")a=Number._commaFormat(a,b.numberGroupSizes,b.numberDecimalSeparator,b.numberGroupSeparator);break;case"c":case"C":if(c==-1)c=b.currencyDecimalDigits;a=Math.abs(this).toFixed(c).toString();if(c&&b.currencyDecimalSeparator!="."){var d=a.indexOf(".");a=a.substr(0,d)+b.currencyDecimalSeparator+a.substr(d+1)}a=Number._commaFormat(a,b.currencyGroupSizes,b.currencyDecimalSeparator,b.currencyGroupSeparator);if(this<0)a=String.format(b.currencyNegativePattern,a);else a=String.format(b.currencyPositivePattern,a);break;case"p":case"P":if(c==-1)c=b.percentDecimalDigits;a=(Math.abs(this)*100).toFixed(c).toString();if(c&&b.percentDecimalSeparator!="."){var d=a.indexOf(".");a=a.substr(0,d)+b.percentDecimalSeparator+a.substr(d+1)}a=Number._commaFormat(a,b.percentGroupSizes,b.percentDecimalSeparator,b.percentGroupSeparator);if(this<0)a=String.format(b.percentNegativePattern,a);else a=String.format(b.percentPositivePattern,a)}return a};String.__typeName="String";String.Empty="";String.compare=function(a,b,c){if(c){if(a)a=a.toUpperCase();if(b)b=b.toUpperCase()}a=a||"";b=b||"";return a==b?0:a<b?-1:1};String.prototype.compareTo=function(b,a){return String.compare(this,b,a)};String.concat=function(){return arguments.length===2?arguments[0]+arguments[1]:Array.prototype.join.call(arguments,"")};String.prototype.endsWith=function(a){return!a.length?true:a.length>this.length?false:this.substr(this.length-a.length)==a};String.equals=function(b,c,a){return String.compare(b,c,a)==0};String._format=function(b,c,a){if(!String._formatRE)String._formatRE=/(\{[^\}^\{]+\})/g;return b.replace(String._formatRE,function(h,d){var g=parseInt(d.substr(1)),b=c[g+1];if(ss.isNullOrUndefined(b))return"";if(b.format){var e=null,f=d.indexOf(":");if(f>0)e=d.substring(f+1,d.length-1);return a?b.localeFormat(e):b.format(e)}else return a?b.toLocaleString():b.toString()})};String.format=function(a){return String._format(a,arguments,false)};String.fromChar=function(a,d){for(var c=a,b=1;b<d;b++)c+=a;return c};String.prototype.htmlDecode=function(){var a=document.createElement("div");a.innerHTML=this;return a.textContent||a.innerText};String.prototype.htmlEncode=function(){var a=document.createElement("div");a.appendChild(document.createTextNode(this));return a.innerHTML.replace(/\"/g,"&quot;")};String.prototype.indexOfAny=function(f,a,e){var b=this.length;if(!b)return-1;a=a||0;e=e||b;var d=a+e-1;if(d>=b)d=b-1;for(var c=a;c<=d;c++)if(f.indexOf(this.charAt(c))>=0)return c;return-1};String.prototype.insert=function(a,b){if(!b)return this;if(!a)return b+this;var c=this.substr(0,a),d=this.substr(a);return c+b+d};String.isNullOrEmpty=function(a){return!a||!a.length};String.prototype.lastIndexOfAny=function(f,a,e){var d=this.length;if(!d)return-1;a=a||d-1;e=e||d;var c=a-e+1;if(c<0)c=0;for(var b=a;b>=c;b--)if(f.indexOf(this.charAt(b))>=0)return b;return-1};String.localeFormat=function(a){return String._format(a,arguments,true)};String.prototype.padLeft=function(b,a){if(this.length<b){a=a||" ";return String.fromChar(a,b-this.length)+this}return this};String.prototype.padRight=function(b,a){if(this.length<b){a=a||" ";return this+String.fromChar(a,b-this.length)}return this};String.prototype.remove=function(a,b){return!b||a+b>this.length?this.substr(0,a):this.substr(0,a)+this.substr(a+b)};String.prototype.replaceAll=function(b,a){a=a||"";return this.split(b).join(a)};String.prototype.startsWith=function(a){return!a.length?true:a.length>this.length?false:this.substr(0,a.length)==a};if(!String.prototype.trim){String.prototype.trim=function(){return this.trimEnd().trimStart()};String.prototype.trimEnd=function(){return this.replace(/\s*$/,"")};String.prototype.trimStart=function(){return this.replace(/^\s*/,"")}}Array.__typeName="Array";Array.__interfaces=[ss.IEnumerable];Array.prototype.add=function(a){this[this.length]=a};Array.prototype.addRange=function(a){this.push.apply(this,a)};Array.prototype.aggregate=function(b,c,d){for(var e=this.length,a=0;a<e;a++)if(a in this)b=c.call(d,b,this[a],a,this);return b};Array.prototype.clear=function(){this.length=0};Array.prototype.clone=function(){return this.length===1?[this[0]]:Array.apply(null,this)};Array.prototype.contains=function(b){var a=this.indexOf(b);return a>=0};Array.prototype.dequeue=function(){return this.shift()};Array.prototype.enqueue=function(a){this._queue=true;this.push(a)};Array.prototype.peek=function(){if(this.length){var a=this._queue?0:this.length-1;return this[a]}return null};if(!Array.prototype.every)Array.prototype.every=function(b,c){for(var d=this.length,a=0;a<d;a++)if(a in this&&!b.call(c,this[a],a,this))return false;return true};Array.prototype.extract=function(a,b){return!b?this.slice(a):this.slice(a,a+b)};if(!Array.prototype.filter)Array.prototype.filter=function(d,e){for(var f=this.length,b=[],a=0;a<f;a++)if(a in this){var c=this[a];d.call(e,c,a,this)&&b.push(c)}return b};if(!Array.prototype.forEach)Array.prototype.forEach=function(b,c){for(var d=this.length,a=0;a<d;a++)a in this&&b.call(c,this[a],a,this)};Array.prototype.getEnumerator=function(){return new ss.ArrayEnumerator(this)};Array.prototype.groupBy=function(f,g){for(var h=this.length,d=[],e={},b=0;b<h;b++)if(b in this){var c=f.call(g,this[b],b);if(String.isNullOrEmpty(c))continue;var a=e[c];if(!a){a=[];a.key=c;e[c]=a;d.add(a)}a.add(this[b])}return d};Array.prototype.index=function(d,e){for(var f=this.length,b={},a=0;a<f;a++)if(a in this){var c=d.call(e,this[a],a);if(String.isNullOrEmpty(c))continue;b[c]=this[a]}return b};if(!Array.prototype.indexOf)Array.prototype.indexOf=function(d,b){b=b||0;var c=this.length;if(c)for(var a=b;a<c;a++)if(this[a]===d)return a;return-1};Array.prototype.insert=function(a,b){this.splice(a,0,b)};Array.prototype.insertRange=function(c,b){if(c===0)this.unshift.apply(this,b);else for(var a=0;a<b.length;a++)this.splice(c+a,0,b[a])};if(!Array.prototype.map)Array.prototype.map=function(d,e){for(var b=this.length,c=new Array(b),a=0;a<b;a++)if(a in this)c[a]=d.call(e,this[a],a,this);return c};Array.parse=function(a){return eval("("+a+")")};Array.prototype.remove=function(b){var a=this.indexOf(b);if(a>=0){this.splice(a,1);return true}return false};Array.prototype.removeAt=function(a){this.splice(a,1)};Array.prototype.removeRange=function(b,a){return this.splice(b,a)};if(!Array.prototype.some)Array.prototype.some=function(b,c){for(var d=this.length,a=0;a<d;a++)if(a in this&&b.call(c,this[a],a,this))return true;return false};Array.toArray=function(a){return Array.prototype.slice.call(a)};RegExp.__typeName="RegExp";RegExp.parse=function(a){if(a.startsWith("/")){var b=a.lastIndexOf("/");if(b>1){var c=a.substring(1,b),d=a.substr(b+1);return new RegExp(c,d)}}return null};Date.__typeName="Date";Date.empty=null;Date.get_now=function(){return new Date};Date.get_today=function(){var a=new Date;return new Date(a.getFullYear(),a.getMonth(),a.getDate())};Date.isEmpty=function(a){return a===null||a.valueOf()===0};Date.prototype.format=function(a){return ss.isNullOrUndefined(a)||a.length==0||a=="i"?this.toString():a=="id"?this.toDateString():a=="it"?this.toTimeString():this._netFormat(a,false)};Date.prototype.localFormat=function(a){return ss.isNullOrUndefined(a)||a.length==0||a=="i"?this.toLocaleString():a=="id"?this.toLocaleDateString():a=="it"?this.toLocaleTimeString():this._netFormat(a,true)};Date.prototype._netFormat=function(d,j){var c=j?ss.CultureInfo.CurrentCulture.dateFormat:ss.CultureInfo.InvariantCulture.dateFormat,f=false;if(d.length==1)switch(d){case"f":d=c.longDatePattern+" "+c.shortTimePattern;case"F":d=c.dateTimePattern;break;case"d":d=c.shortDatePattern;break;case"D":d=c.longDatePattern;break;case"t":d=c.shortTimePattern;break;case"T":d=c.longTimePattern;break;case"g":d=c.shortDatePattern+" "+c.shortTimePattern;break;case"G":d=c.shortDatePattern+" "+c.longTimePattern;break;case"R":case"r":d=c.gmtDateTimePattern;f=true;break;case"u":d=c.universalDateTimePattern;f=true;break;case"U":d=c.dateTimePattern;f=true;break;case"s":d=c.sortableDateTimePattern}if(d.charAt(0)=="%")d=d.substr(1);if(!Date._formatRE)Date._formatRE=/dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|fff|ff|f|zzz|zz|z/g;var h=Date._formatRE,i=new ss.StringBuilder,b=this;if(f)b=new Date(Date.UTC(b.getUTCFullYear(),b.getUTCMonth(),b.getUTCDate(),b.getUTCHours(),b.getUTCMinutes(),b.getUTCSeconds(),b.getUTCMilliseconds()));h.lastIndex=0;while(true){var k=h.lastIndex,g=h.exec(d);i.append(d.slice(k,g?g.index:d.length));if(!g)break;var e=g[0],a=e;switch(e){case"dddd":a=c.dayNames[b.getDay()];break;case"ddd":a=c.shortDayNames[b.getDay()];break;case"dd":a=b.getDate().toString().padLeft(2,"0");break;case"d":a=b.getDate();break;case"MMMM":a=c.monthNames[b.getMonth()];break;case"MMM":a=c.shortMonthNames[b.getMonth()];break;case"MM":a=(b.getMonth()+1).toString().padLeft(2,"0");break;case"M":a=b.getMonth()+1;break;case"yyyy":a=b.getFullYear();break;case"yy":a=(b.getFullYear()%100).toString().padLeft(2,"0");break;case"y":a=b.getFullYear()%100;break;case"h":case"hh":a=b.getHours()%12;if(!a)a="12";else if(e=="hh")a=a.toString().padLeft(2,"0");break;case"HH":a=b.getHours().toString().padLeft(2,"0");break;case"H":a=b.getHours();break;case"mm":a=b.getMinutes().toString().padLeft(2,"0");break;case"m":a=b.getMinutes();break;case"ss":a=b.getSeconds().toString().padLeft(2,"0");break;case"s":a=b.getSeconds();break;case"t":case"tt":a=b.getHours()<12?c.amDesignator:c.pmDesignator;if(e=="t")a=a.charAt(0);break;case"fff":a=b.getMilliseconds().toString().padLeft(3,"0");break;case"ff":a=b.getMilliseconds().toString().padLeft(3).substr(0,2);break;case"f":a=b.getMilliseconds().toString().padLeft(3).charAt(0);break;case"z":a=b.getTimezoneOffset()/60;a=(a>=0?"-":"+")+Math.floor(Math.abs(a));break;case"zz":case"zzz":a=b.getTimezoneOffset()/60;a=(a>=0?"-":"+")+Math.floor(Math.abs(a)).toString().padLeft(2,"0");if(e=="zzz")a+=c.timeSeparator+Math.abs(b.getTimezoneOffset()%60).toString().padLeft(2,"0")}i.append(a)}return i.toString()};Date.parseDate=function(a){return new Date(Date.parse(a))};Error.__typeName="Error";Error.prototype.popStackFrame=function(){if(ss.isNullOrUndefined(this.stack)||ss.isNullOrUndefined(this.fileName)||ss.isNullOfUndefined(this.lineNumber))return;var a=this.stack.split("\n"),c=a[0],e=this.fileName+":"+this.lineNumber;while(!ss.isNullOrUndefined(c)&&c.indexOf(e)===-1){a.shift();c=a[0]}var d=a[1];if(isNullOrUndefined(d))return;var b=d.match(/@(.*):(\d+)$/);if(ss.isNullOrUndefined(b))return;a.shift();this.stack=a.join("\n");this.fileName=b[1];this.lineNumber=parseInt(b[2])};Error.createError=function(e,b,c){var a=new Error(e);if(b)for(var d in b)a[d]=b[d];if(c)a.innerException=c;a.popStackFrame();return a};ss.Debug=window.Debug||function(){};ss.Debug.__typeName="Debug";if(!ss.Debug.writeln)ss.Debug.writeln=function(a){if(window.console){if(window.console.debug){window.console.debug(a);return}else if(window.console.log){window.console.log(a);return}}else if(window.opera&&window.opera.postError){window.opera.postError(a);return}};ss.Debug._fail=function(a){ss.Debug.writeln(a);eval("debugger;")};ss.Debug.assert=function(b,a){if(!b){a="Assert failed: "+a;confirm(a+"\r\n\r\nBreak into debugger?")&&ss.Debug._fail(a)}};ss.Debug.fail=function(a){ss.Debug._fail(a)};window.Type=Function;Type.__typeName="Type";window.__Namespace=function(a){this.__typeName=a};__Namespace.prototype={__namespace:true,getName:function(){return this.__typeName}};Type.registerNamespace=function(e){if(!window.__namespaces)window.__namespaces={};if(!window.__rootNamespaces)window.__rootNamespaces=[];if(window.__namespaces[e])return;for(var c=window,d=e.split("."),a=0;a<d.length;a++){var f=d[a],b=c[f];if(!b){c[f]=b=new __Namespace(d.slice(0,a+1).join("."));a==0&&window.__rootNamespaces.add(b)}c=b}window.__namespaces[e]=c};Type.prototype.registerClass=function(d,c,a){this.prototype.constructor=this;this.__typeName=d;this.__class=true;this.__baseType=c||Object;if(c)this.__basePrototypePending=true;if(a){this.__interfaces=[];for(var b=2;b<arguments.length;b++){a=arguments[b];this.__interfaces.add(a)}}};Type.prototype.registerInterface=function(a){this.__typeName=a;this.__interface=true};Type.prototype.registerEnum=function(c,b){for(var a in this.prototype)this[a]=this.prototype[a];this.__typeName=c;this.__enum=true;if(b)this.__flags=true;this.toString=ss.Enum._enumToString};Type.prototype.setupBase=function(){if(this.__basePrototypePending){var a=this.__baseType;a.__basePrototypePending&&a.setupBase();for(var b in a.prototype){var c=a.prototype[b];if(!this.prototype[b])this.prototype[b]=c}delete this.__basePrototypePending}};if(!Type.prototype.resolveInheritance)Type.prototype.resolveInheritance=Type.prototype.setupBase;Type.prototype.initializeBase=function(a,b){this.__basePrototypePending&&this.setupBase();if(!b)this.__baseType.apply(a);else this.__baseType.apply(a,b)};Type.prototype.callBaseMethod=function(b,d,c){var a=this.__baseType.prototype[d];return!c?a.apply(b):a.apply(b,c)};Type.prototype.get_baseType=function(){return this.__baseType||null};Type.prototype.get_fullName=function(){return this.__typeName};Type.prototype.get_name=function(){var a=this.__typeName,b=a.lastIndexOf(".");return b>0?a.substr(b+1):a};Type.prototype.getInterfaces=function(){return this.__interfaces};Type.prototype.isInstanceOfType=function(a){if(ss.isNullOrUndefined(a))return false;if(this==Object||a instanceof this)return true;var b=Type.getInstanceType(a);return this.isAssignableFrom(b)};Type.prototype.isAssignableFrom=function(c){if(this==Object||this==c)return true;if(this.__class){var a=c.__baseType;while(a){if(this==a)return true;a=a.__baseType}}else if(this.__interface){var b=c.__interfaces;if(b&&b.contains(this))return true;var a=c.__baseType;while(a){b=a.__interfaces;if(b&&b.contains(this))return true;a=a.__baseType}}return false};Type.isClass=function(a){return a.__class==true};Type.isEnum=function(a){return a.__enum==true};Type.isFlags=function(a){return a.__enum==true&&a.__flags==true};Type.isInterface=function(a){return a.__interface==true};Type.isNamespace=function(a){return a.__namespace==true};Type.canCast=function(a,b){return b.isInstanceOfType(a)};Type.safeCast=function(a,b){return b.isInstanceOfType(a)?a:null};Type.getInstanceType=function(b){var a=null;try{a=b.constructor}catch(c){}if(!a||!a.__typeName)a=Object;return a};Type.getType=function(a){if(!a)return null;if(!Type.__typeCache)Type.__typeCache={};var b=Type.__typeCache[a];if(!b){b=eval(a);Type.__typeCache[a]=b}return b};Type.parse=function(a){return Type.getType(a)};ss.Enum=function(){};ss.Enum.registerClass("Enum");ss.Enum.parse=function(d,i){var a=d.prototype;if(!d.__flags){for(var b in a)if(b===i)return a[b]}else{for(var g=i.split("|"),h=0,e=true,c=g.length-1;c>=0;c--){var j=g[c].trim(),f=false;for(var b in a)if(b===j){h|=a[b];f=true;break}if(!f){e=false;break}}if(e)return h}throw"Invalid Enumeration Value";};ss.Enum._enumToString=function(d){var b=this.prototype;if(!this.__flags||d===0){for(var c in b)if(b[c]===d)return c;throw"Invalid Enumeration Value";}else{var a=[];for(var c in b)if(b[c]&d){a.length&&a.add(" | ");a.add(c)}if(!a.length)throw"Invalid Enumeration Value";return a.join("")}};ss.Delegate=function(){};ss.Delegate.registerClass("Delegate");ss.Delegate.Null=function(){};ss.Delegate._contains=function(b,d,c){for(var a=0;a<b.length;a+=2)if(b[a]===d&&b[a+1]===c)return true;return false};ss.Delegate._create=function(a){var b=function(){if(a.length==2)return a[1].apply(a[0],arguments);else{for(var c=a.clone(),b=0;b<c.length;b+=2)ss.Delegate._contains(a,c[b],c[b+1])&&c[b+1].apply(c[b],arguments);return null}};b.invoke=b;b._targets=a;return b};ss.Delegate.create=function(b,a){if(!b){a.invoke=a;return a}return ss.Delegate._create([b,a])};ss.Delegate.combine=function(a,b){if(!a)return!b._targets?ss.Delegate.create(null,b):b;if(!b)return!a._targets?ss.Delegate.create(null,a):a;var c=a._targets?a._targets:[null,a],d=b._targets?b._targets:[null,b];return ss.Delegate._create(c.concat(d))};ss.Delegate.remove=function(c,a){if(!c||c===a)return null;if(!a)return c;var b=c._targets,f=null,e;if(a._targets){f=a._targets[0];e=a._targets[1]}else e=a;for(var d=0;d<b.length;d+=2)if(b[d]===f&&b[d+1]===e){if(b.length==2)return null;b.splice(d,2);return ss.Delegate._create(b)}return c};ss.Delegate.createExport=function(b,c){var a="__"+(new Date).valueOf();ss.Delegate[a]=function(){!c&&ss.Delegate.deleteExport(a);b.apply(null,arguments)};return a};ss.Delegate.deleteExport=function(a){if(ss.Delegate[a])delete ss.Delegate[a]};ss.Delegate.clearExport=function(a){if(ss.Delegate[a])ss.Delegate[a]=Delegate.Null};ss.CultureInfo=function(c,a,b){this.name=c;this.numberFormat=a;this.dateFormat=b};ss.CultureInfo.registerClass("CultureInfo");ss.CultureInfo.InvariantCulture=new ss.CultureInfo("en-US",{naNSymbol:"NaN",negativeSign:"-",positiveSign:"+",negativeInfinityText:"-Infinity",positiveInfinityText:"Infinity",percentSymbol:"%",percentGroupSizes:[3],percentDecimalDigits:2,percentDecimalSeparator:".",percentGroupSeparator:",",percentPositivePattern:"{0} %",percentNegativePattern:"-{0} %",currencySymbol:"$",currencyGroupSizes:[3],currencyDecimalDigits:2,currencyDecimalSeparator:".",currencyGroupSeparator:",",currencyNegativePattern:"(${0})",currencyPositivePattern:"${0}",numberGroupSizes:[3],numberDecimalDigits:2,numberDecimalSeparator:".",numberGroupSeparator:","},{amDesignator:"AM",pmDesignator:"PM",dateSeparator:"/",timeSeparator:":",gmtDateTimePattern:"ddd, dd MMM yyyy HH:mm:ss 'GMT'",universalDateTimePattern:"yyyy-MM-dd HH:mm:ssZ",sortableDateTimePattern:"yyyy-MM-ddTHH:mm:ss",dateTimePattern:"dddd, MMMM dd, yyyy h:mm:ss tt",longDatePattern:"dddd, MMMM dd, yyyy",shortDatePattern:"M/d/yyyy",longTimePattern:"h:mm:ss tt",shortTimePattern:"h:mm tt",firstDayOfWeek:0,dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],shortDayNames:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],minimizedDayNames:["Su","Mo","Tu","We","Th","Fr","Sa"],monthNames:["January","February","March","April","May","June","July","August","September","October","November","December",""],shortMonthNames:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",""]});ss.CultureInfo.CurrentCulture=ss.CultureInfo.InvariantCulture;ss.IEnumerator=function(){};ss.IEnumerator.getEnumerator=function(a){return a?a.getEnumerator?a.getEnumerator():new ss.ArrayEnumerator(a):null};ss.IEnumerator.registerInterface("IEnumerator");ss.IEnumerable=function(){};ss.IEnumerable.registerInterface("IEnumerable");ss.ArrayEnumerator=function(a){this._array=a;this._index=-1};ss.ArrayEnumerator.prototype={get_current:function(){return this._array[this._index]},moveNext:function(){this._index++;return this._index<this._array.length},reset:function(){this._index=-1}};ss.ArrayEnumerator.registerClass("ArrayEnumerator",null,ss.IEnumerator);ss.IDisposable=function(){};ss.IDisposable.registerInterface("IDisposable");ss.StringBuilder=function(a){this._parts=!ss.isNullOrUndefined(a)?[a]:[];this.isEmpty=this._parts.length==0};ss.StringBuilder.prototype={append:function(a){if(!ss.isNullOrUndefined(a)){this._parts.add(a);this.isEmpty=false}return this},appendLine:function(a){this.append(a);this.append("\r\n");this.isEmpty=false;return this},clear:function(){this._parts=[];this.isEmpty=true},toString:function(a){return this._parts.join(a||"")}};ss.StringBuilder.registerClass("StringBuilder");ss.EventArgs=function(){};ss.EventArgs.registerClass("EventArgs");ss.EventArgs.Empty=new ss.EventArgs;if(!window.XMLHttpRequest)window.XMLHttpRequest=function(){for(var b=["Msxml2.XMLHTTP","Microsoft.XMLHTTP"],a=0;a<b.length;a++)try{return new ActiveXObject(b[a])}catch(d){}return null};ss.XmlDocumentParser=function(){};ss.XmlDocumentParser.registerClass("XmlDocumentParser");ss.XmlDocumentParser.parse=function(d){try{if(DOMParser){var e=new DOMParser;return e.parseFromString(d,"text/xml")}else for(var c=["Msxml2.DOMDocument.3.0","Msxml2.DOMDocument"],b=0;b<c.length;b++){var a=new ActiveXObject(c[b]);a.async=false;a.loadXML(d);a.setProperty("SelectionLanguage","XPath");return a}}catch(f){}return null};ss.CancelEventArgs=function(){ss.CancelEventArgs.initializeBase(this);this.cancel=false};ss.CancelEventArgs.registerClass("CancelEventArgs",ss.EventArgs)