/*
---
MooTools: the javascript framework

web build:
 - http://mootools.net/core/f95ed9dd49077cbac61cf6a7cbc40ce9

packager build:
 - packager build Core/Element.Dimensions Core/Fx.Morph Core/DOMReady Core/Swiff

copyrights:
  - [MooTools](http://mootools.net)

licenses:
  - [MIT License](http://mootools.net/license.txt)
...
*/
(function(){this.MooTools={version:"1.3.2",build:"c9f1ff10e9e7facb65e9481049ed1b450959d587"};var o=this.typeOf=function(i){if(i==null){return"null";}if(i.$family){return i.$family();
}if(i.nodeName){if(i.nodeType==1){return"element";}if(i.nodeType==3){return(/\S/).test(i.nodeValue)?"textnode":"whitespace";}}else{if(typeof i.length=="number"){if(i.callee){return"arguments";
}if("item" in i){return"collection";}}}return typeof i;};var j=this.instanceOf=function(t,i){if(t==null){return false;}var s=t.$constructor||t.constructor;
while(s){if(s===i){return true;}s=s.parent;}return t instanceof i;};var f=this.Function;var p=true;for(var k in {toString:1}){p=null;}if(p){p=["hasOwnProperty","valueOf","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","constructor"];
}f.prototype.overloadSetter=function(s){var i=this;return function(u,t){if(u==null){return this;}if(s||typeof u!="string"){for(var v in u){i.call(this,v,u[v]);
}if(p){for(var w=p.length;w--;){v=p[w];if(u.hasOwnProperty(v)){i.call(this,v,u[v]);}}}}else{i.call(this,u,t);}return this;};};f.prototype.overloadGetter=function(s){var i=this;
return function(u){var v,t;if(s||typeof u!="string"){v=u;}else{if(arguments.length>1){v=arguments;}}if(v){t={};for(var w=0;w<v.length;w++){t[v[w]]=i.call(this,v[w]);
}}else{t=i.call(this,u);}return t;};};f.prototype.extend=function(i,s){this[i]=s;}.overloadSetter();f.prototype.implement=function(i,s){this.prototype[i]=s;
}.overloadSetter();var n=Array.prototype.slice;f.from=function(i){return(o(i)=="function")?i:function(){return i;};};Array.from=function(i){if(i==null){return[];
}return(a.isEnumerable(i)&&typeof i!="string")?(o(i)=="array")?i:n.call(i):[i];};Number.from=function(s){var i=parseFloat(s);return isFinite(i)?i:null;
};String.from=function(i){return i+"";};f.implement({hide:function(){this.$hidden=true;return this;},protect:function(){this.$protected=true;return this;
}});var a=this.Type=function(u,t){if(u){var s=u.toLowerCase();var i=function(v){return(o(v)==s);};a["is"+u]=i;if(t!=null){t.prototype.$family=(function(){return s;
}).hide();}}if(t==null){return null;}t.extend(this);t.$constructor=a;t.prototype.$constructor=t;return t;};var e=Object.prototype.toString;a.isEnumerable=function(i){return(i!=null&&typeof i.length=="number"&&e.call(i)!="[object Function]");
};var q={};var r=function(i){var s=o(i.prototype);return q[s]||(q[s]=[]);};var b=function(t,x){if(x&&x.$hidden){return;}var s=r(this);for(var u=0;u<s.length;
u++){var w=s[u];if(o(w)=="type"){b.call(w,t,x);}else{w.call(this,t,x);}}var v=this.prototype[t];if(v==null||!v.$protected){this.prototype[t]=x;}if(this[t]==null&&o(x)=="function"){m.call(this,t,function(i){return x.apply(i,n.call(arguments,1));
});}};var m=function(i,t){if(t&&t.$hidden){return;}var s=this[i];if(s==null||!s.$protected){this[i]=t;}};a.implement({implement:b.overloadSetter(),extend:m.overloadSetter(),alias:function(i,s){b.call(this,i,this.prototype[s]);
}.overloadSetter(),mirror:function(i){r(this).push(i);return this;}});new a("Type",a);var d=function(s,w,u){var t=(w!=Object),A=w.prototype;if(t){w=new a(s,w);
}for(var x=0,v=u.length;x<v;x++){var B=u[x],z=w[B],y=A[B];if(z){z.protect();}if(t&&y){delete A[B];A[B]=y.protect();}}if(t){w.implement(A);}return d;};d("String",String,["charAt","charCodeAt","concat","indexOf","lastIndexOf","match","quote","replace","search","slice","split","substr","substring","toLowerCase","toUpperCase"])("Array",Array,["pop","push","reverse","shift","sort","splice","unshift","concat","join","slice","indexOf","lastIndexOf","filter","forEach","every","map","some","reduce","reduceRight"])("Number",Number,["toExponential","toFixed","toLocaleString","toPrecision"])("Function",f,["apply","call","bind"])("RegExp",RegExp,["exec","test"])("Object",Object,["create","defineProperty","defineProperties","keys","getPrototypeOf","getOwnPropertyDescriptor","getOwnPropertyNames","preventExtensions","isExtensible","seal","isSealed","freeze","isFrozen"])("Date",Date,["now"]);
Object.extend=m.overloadSetter();Date.extend("now",function(){return +(new Date);});new a("Boolean",Boolean);Number.prototype.$family=function(){return isFinite(this)?"number":"null";
}.hide();Number.extend("random",function(s,i){return Math.floor(Math.random()*(i-s+1)+s);});var g=Object.prototype.hasOwnProperty;Object.extend("forEach",function(i,t,u){for(var s in i){if(g.call(i,s)){t.call(u,i[s],s,i);
}}});Object.each=Object.forEach;Array.implement({forEach:function(u,v){for(var t=0,s=this.length;t<s;t++){if(t in this){u.call(v,this[t],t,this);}}},each:function(i,s){Array.forEach(this,i,s);
return this;}});var l=function(i){switch(o(i)){case"array":return i.clone();case"object":return Object.clone(i);default:return i;}};Array.implement("clone",function(){var s=this.length,t=new Array(s);
while(s--){t[s]=l(this[s]);}return t;});var h=function(s,i,t){switch(o(t)){case"object":if(o(s[i])=="object"){Object.merge(s[i],t);}else{s[i]=Object.clone(t);
}break;case"array":s[i]=t.clone();break;default:s[i]=t;}return s;};Object.extend({merge:function(z,u,t){if(o(u)=="string"){return h(z,u,t);}for(var y=1,s=arguments.length;
y<s;y++){var w=arguments[y];for(var x in w){h(z,x,w[x]);}}return z;},clone:function(i){var t={};for(var s in i){t[s]=l(i[s]);}return t;},append:function(w){for(var v=1,t=arguments.length;
v<t;v++){var s=arguments[v]||{};for(var u in s){w[u]=s[u];}}return w;}});["Object","WhiteSpace","TextNode","Collection","Arguments"].each(function(i){new a(i);
});var c=Date.now();String.extend("uniqueID",function(){return(c++).toString(36);});})();Array.implement({every:function(c,d){for(var b=0,a=this.length;
b<a;b++){if((b in this)&&!c.call(d,this[b],b,this)){return false;}}return true;},filter:function(d,e){var c=[];for(var b=0,a=this.length;b<a;b++){if((b in this)&&d.call(e,this[b],b,this)){c.push(this[b]);
}}return c;},indexOf:function(c,d){var a=this.length;for(var b=(d<0)?Math.max(0,a+d):d||0;b<a;b++){if(this[b]===c){return b;}}return -1;},map:function(d,e){var c=[];
for(var b=0,a=this.length;b<a;b++){if(b in this){c[b]=d.call(e,this[b],b,this);}}return c;},some:function(c,d){for(var b=0,a=this.length;b<a;b++){if((b in this)&&c.call(d,this[b],b,this)){return true;
}}return false;},clean:function(){return this.filter(function(a){return a!=null;});},invoke:function(a){var b=Array.slice(arguments,1);return this.map(function(c){return c[a].apply(c,b);
});},associate:function(c){var d={},b=Math.min(this.length,c.length);for(var a=0;a<b;a++){d[c[a]]=this[a];}return d;},link:function(c){var a={};for(var e=0,b=this.length;
e<b;e++){for(var d in c){if(c[d](this[e])){a[d]=this[e];delete c[d];break;}}}return a;},contains:function(a,b){return this.indexOf(a,b)!=-1;},append:function(a){this.push.apply(this,a);
return this;},getLast:function(){return(this.length)?this[this.length-1]:null;},getRandom:function(){return(this.length)?this[Number.random(0,this.length-1)]:null;
},include:function(a){if(!this.contains(a)){this.push(a);}return this;},combine:function(c){for(var b=0,a=c.length;b<a;b++){this.include(c[b]);}return this;
},erase:function(b){for(var a=this.length;a--;){if(this[a]===b){this.splice(a,1);}}return this;},empty:function(){this.length=0;return this;},flatten:function(){var d=[];
for(var b=0,a=this.length;b<a;b++){var c=typeOf(this[b]);if(c=="null"){continue;}d=d.concat((c=="array"||c=="collection"||c=="arguments"||instanceOf(this[b],Array))?Array.flatten(this[b]):this[b]);
}return d;},pick:function(){for(var b=0,a=this.length;b<a;b++){if(this[b]!=null){return this[b];}}return null;},hexToRgb:function(b){if(this.length!=3){return null;
}var a=this.map(function(c){if(c.length==1){c+=c;}return c.toInt(16);});return(b)?a:"rgb("+a+")";},rgbToHex:function(d){if(this.length<3){return null;}if(this.length==4&&this[3]==0&&!d){return"transparent";
}var b=[];for(var a=0;a<3;a++){var c=(this[a]-0).toString(16);b.push((c.length==1)?"0"+c:c);}return(d)?b:"#"+b.join("");}});Function.extend({attempt:function(){for(var b=0,a=arguments.length;
b<a;b++){try{return arguments[b]();}catch(c){}}return null;}});Function.implement({attempt:function(a,c){try{return this.apply(c,Array.from(a));}catch(b){}return null;
},bind:function(c){var a=this,b=(arguments.length>1)?Array.slice(arguments,1):null;return function(){if(!b&&!arguments.length){return a.call(c);}if(b&&arguments.length){return a.apply(c,b.concat(Array.from(arguments)));
}return a.apply(c,b||arguments);};},pass:function(b,c){var a=this;if(b!=null){b=Array.from(b);}return function(){return a.apply(c,b||arguments);};},delay:function(b,c,a){return setTimeout(this.pass((a==null?[]:a),c),b);
},periodical:function(c,b,a){return setInterval(this.pass((a==null?[]:a),b),c);}});Number.implement({limit:function(b,a){return Math.min(a,Math.max(b,this));
},round:function(a){a=Math.pow(10,a||0).toFixed(a<0?-a:0);return Math.round(this*a)/a;},times:function(b,c){for(var a=0;a<this;a++){b.call(c,a,this);}},toFloat:function(){return parseFloat(this);
},toInt:function(a){return parseInt(this,a||10);}});Number.alias("each","times");(function(b){var a={};b.each(function(c){if(!Number[c]){a[c]=function(){return Math[c].apply(null,[this].concat(Array.from(arguments)));
};}});Number.implement(a);})(["abs","acos","asin","atan","atan2","ceil","cos","exp","floor","log","max","min","pow","sin","sqrt","tan"]);String.implement({test:function(a,b){return((typeOf(a)=="regexp")?a:new RegExp(""+a,b)).test(this);
},contains:function(a,b){return(b)?(b+this+b).indexOf(b+a+b)>-1:this.indexOf(a)>-1;},trim:function(){return this.replace(/^\s+|\s+$/g,"");},clean:function(){return this.replace(/\s+/g," ").trim();
},camelCase:function(){return this.replace(/-\D/g,function(a){return a.charAt(1).toUpperCase();});},hyphenate:function(){return this.replace(/[A-Z]/g,function(a){return("-"+a.charAt(0).toLowerCase());
});},capitalize:function(){return this.replace(/\b[a-z]/g,function(a){return a.toUpperCase();});},escapeRegExp:function(){return this.replace(/([-.*+?^${}()|[\]\/\\])/g,"\\$1");
},toInt:function(a){return parseInt(this,a||10);},toFloat:function(){return parseFloat(this);},hexToRgb:function(b){var a=this.match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})$/);
return(a)?a.slice(1).hexToRgb(b):null;},rgbToHex:function(b){var a=this.match(/\d{1,3}/g);return(a)?a.rgbToHex(b):null;},substitute:function(a,b){return this.replace(b||(/\\?\{([^{}]+)\}/g),function(d,c){if(d.charAt(0)=="\\"){return d.slice(1);
}return(a[c]!=null)?a[c]:"";});}});(function(){var k=this.document;var i=k.window=this;var b=1;this.$uid=(i.ActiveXObject)?function(e){return(e.uid||(e.uid=[b++]))[0];
}:function(e){return e.uid||(e.uid=b++);};$uid(i);$uid(k);var a=navigator.userAgent.toLowerCase(),c=navigator.platform.toLowerCase(),j=a.match(/(opera|ie|firefox|chrome|version)[\s\/:]([\w\d\.]+)?.*?(safari|version[\s\/:]([\w\d\.]+)|$)/)||[null,"unknown",0],f=j[1]=="ie"&&k.documentMode;
var o=this.Browser={extend:Function.prototype.extend,name:(j[1]=="version")?j[3]:j[1],version:f||parseFloat((j[1]=="opera"&&j[4])?j[4]:j[2]),Platform:{name:a.match(/ip(?:ad|od|hone)/)?"ios":(a.match(/(?:webos|android)/)||c.match(/mac|win|linux/)||["other"])[0]},Features:{xpath:!!(k.evaluate),air:!!(i.runtime),query:!!(k.querySelector),json:!!(i.JSON)},Plugins:{}};
o[o.name]=true;o[o.name+parseInt(o.version,10)]=true;o.Platform[o.Platform.name]=true;o.Request=(function(){var q=function(){return new XMLHttpRequest();
};var p=function(){return new ActiveXObject("MSXML2.XMLHTTP");};var e=function(){return new ActiveXObject("Microsoft.XMLHTTP");};return Function.attempt(function(){q();
return q;},function(){p();return p;},function(){e();return e;});})();o.Features.xhr=!!(o.Request);var h=(Function.attempt(function(){return navigator.plugins["Shockwave Flash"].description;
},function(){return new ActiveXObject("ShockwaveFlash.ShockwaveFlash").GetVariable("$version");})||"0 r0").match(/\d+/g);o.Plugins.Flash={version:Number(h[0]||"0."+h[1])||0,build:Number(h[2])||0};
o.exec=function(p){if(!p){return p;}if(i.execScript){i.execScript(p);}else{var e=k.createElement("script");e.setAttribute("type","text/javascript");e.text=p;
k.head.appendChild(e);k.head.removeChild(e);}return p;};String.implement("stripScripts",function(p){var e="";var q=this.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi,function(r,s){e+=s+"\n";
return"";});if(p===true){o.exec(e);}else{if(typeOf(p)=="function"){p(e,q);}}return q;});o.extend({Document:this.Document,Window:this.Window,Element:this.Element,Event:this.Event});
this.Window=this.$constructor=new Type("Window",function(){});this.$family=Function.from("window").hide();Window.mirror(function(e,p){i[e]=p;});this.Document=k.$constructor=new Type("Document",function(){});
k.$family=Function.from("document").hide();Document.mirror(function(e,p){k[e]=p;});k.html=k.documentElement;if(!k.head){k.head=k.getElementsByTagName("head")[0];
}if(k.execCommand){try{k.execCommand("BackgroundImageCache",false,true);}catch(g){}}if(this.attachEvent&&!this.addEventListener){var d=function(){this.detachEvent("onunload",d);
k.head=k.html=k.window=null;};this.attachEvent("onunload",d);}var m=Array.from;try{m(k.html.childNodes);}catch(g){Array.from=function(p){if(typeof p!="string"&&Type.isEnumerable(p)&&typeOf(p)!="array"){var e=p.length,q=new Array(e);
while(e--){q[e]=p[e];}return q;}return m(p);};var l=Array.prototype,n=l.slice;["pop","push","reverse","shift","sort","splice","unshift","concat","join","slice"].each(function(e){var p=l[e];
Array[e]=function(q){return p.apply(Array.from(q),n.call(arguments,1));};});}})();(function(){var k,n,l,g,a={},c={},m=/\\/g;var e=function(q,p){if(q==null){return null;
}if(q.Slick===true){return q;}q=(""+q).replace(/^\s+|\s+$/g,"");g=!!p;var o=(g)?c:a;if(o[q]){return o[q];}k={Slick:true,expressions:[],raw:q,reverse:function(){return e(this.raw,true);
}};n=-1;while(q!=(q=q.replace(j,b))){}k.length=k.expressions.length;return o[k.raw]=(g)?h(k):k;};var i=function(o){if(o==="!"){return" ";}else{if(o===" "){return"!";
}else{if((/^!/).test(o)){return o.replace(/^!/,"");}else{return"!"+o;}}}};var h=function(u){var r=u.expressions;for(var p=0;p<r.length;p++){var t=r[p];
var q={parts:[],tag:"*",combinator:i(t[0].combinator)};for(var o=0;o<t.length;o++){var s=t[o];if(!s.reverseCombinator){s.reverseCombinator=" ";}s.combinator=s.reverseCombinator;
delete s.reverseCombinator;}t.reverse().push(q);}return u;};var f=function(o){return o.replace(/[-[\]{}()*+?.\\^$|,#\s]/g,function(p){return"\\"+p;});};
var j=new RegExp("^(?:\\s*(,)\\s*|\\s*(<combinator>+)\\s*|(\\s+)|(<unicode>+|\\*)|\\#(<unicode>+)|\\.(<unicode>+)|\\[\\s*(<unicode1>+)(?:\\s*([*^$!~|]?=)(?:\\s*(?:([\"']?)(.*?)\\9)))?\\s*\\](?!\\])|(:+)(<unicode>+)(?:\\((?:(?:([\"'])([^\\13]*)\\13)|((?:\\([^)]+\\)|[^()]*)+))\\))?)".replace(/<combinator>/,"["+f(">+~`!@$%^&={}\\;</")+"]").replace(/<unicode>/g,"(?:[\\w\\u00a1-\\uFFFF-]|\\\\[^\\s0-9a-f])").replace(/<unicode1>/g,"(?:[:\\w\\u00a1-\\uFFFF-]|\\\\[^\\s0-9a-f])"));
function b(x,s,D,z,r,C,q,B,A,y,u,F,G,v,p,w){if(s||n===-1){k.expressions[++n]=[];l=-1;if(s){return"";}}if(D||z||l===-1){D=D||" ";var t=k.expressions[n];
if(g&&t[l]){t[l].reverseCombinator=i(D);}t[++l]={combinator:D,tag:"*"};}var o=k.expressions[n][l];if(r){o.tag=r.replace(m,"");}else{if(C){o.id=C.replace(m,"");
}else{if(q){q=q.replace(m,"");if(!o.classList){o.classList=[];}if(!o.classes){o.classes=[];}o.classList.push(q);o.classes.push({value:q,regexp:new RegExp("(^|\\s)"+f(q)+"(\\s|$)")});
}else{if(G){w=w||p;w=w?w.replace(m,""):null;if(!o.pseudos){o.pseudos=[];}o.pseudos.push({key:G.replace(m,""),value:w,type:F.length==1?"class":"element"});
}else{if(B){B=B.replace(m,"");u=(u||"").replace(m,"");var E,H;switch(A){case"^=":H=new RegExp("^"+f(u));break;case"$=":H=new RegExp(f(u)+"$");break;case"~=":H=new RegExp("(^|\\s)"+f(u)+"(\\s|$)");
break;case"|=":H=new RegExp("^"+f(u)+"(-|$)");break;case"=":E=function(I){return u==I;};break;case"*=":E=function(I){return I&&I.indexOf(u)>-1;};break;
case"!=":E=function(I){return u!=I;};break;default:E=function(I){return !!I;};}if(u==""&&(/^[*$^]=$/).test(A)){E=function(){return false;};}if(!E){E=function(I){return I&&H.test(I);
};}if(!o.attributes){o.attributes=[];}o.attributes.push({key:B,operator:A,value:u,test:E});}}}}}return"";}var d=(this.Slick||{});d.parse=function(o){return e(o);
};d.escapeRegExp=f;if(!this.Slick){this.Slick=d;}}).apply((typeof exports!="undefined")?exports:this);(function(){var j={},l={},b=Object.prototype.toString;
j.isNativeCode=function(c){return(/\{\s*\[native code\]\s*\}/).test(""+c);};j.isXML=function(c){return(!!c.xmlVersion)||(!!c.xml)||(b.call(c)=="[object XMLDocument]")||(c.nodeType==9&&c.documentElement.nodeName!="HTML");
};j.setDocument=function(w){var t=w.nodeType;if(t==9){}else{if(t){w=w.ownerDocument;}else{if(w.navigator){w=w.document;}else{return;}}}if(this.document===w){return;
}this.document=w;var y=w.documentElement,u=this.getUIDXML(y),o=l[u],A;if(o){for(A in o){this[A]=o[A];}return;}o=l[u]={};o.root=y;o.isXMLDocument=this.isXML(w);
o.brokenStarGEBTN=o.starSelectsClosedQSA=o.idGetsName=o.brokenMixedCaseQSA=o.brokenGEBCN=o.brokenCheckedQSA=o.brokenEmptyAttributeQSA=o.isHTMLDocument=o.nativeMatchesSelector=false;
var m,n,x,q,r;var s,c="slick_uniqueid";var z=w.createElement("div");var p=w.body||w.getElementsByTagName("body")[0]||y;p.appendChild(z);try{z.innerHTML='<a id="'+c+'"></a>';
o.isHTMLDocument=!!w.getElementById(c);}catch(v){}if(o.isHTMLDocument){z.style.display="none";z.appendChild(w.createComment(""));n=(z.getElementsByTagName("*").length>1);
try{z.innerHTML="foo</foo>";s=z.getElementsByTagName("*");m=(s&&!!s.length&&s[0].nodeName.charAt(0)=="/");}catch(v){}o.brokenStarGEBTN=n||m;try{z.innerHTML='<a name="'+c+'"></a><b id="'+c+'"></b>';
o.idGetsName=w.getElementById(c)===z.firstChild;}catch(v){}if(z.getElementsByClassName){try{z.innerHTML='<a class="f"></a><a class="b"></a>';z.getElementsByClassName("b").length;
z.firstChild.className="b";q=(z.getElementsByClassName("b").length!=2);}catch(v){}try{z.innerHTML='<a class="a"></a><a class="f b a"></a>';x=(z.getElementsByClassName("a").length!=2);
}catch(v){}o.brokenGEBCN=q||x;}if(z.querySelectorAll){try{z.innerHTML="foo</foo>";s=z.querySelectorAll("*");o.starSelectsClosedQSA=(s&&!!s.length&&s[0].nodeName.charAt(0)=="/");
}catch(v){}try{z.innerHTML='<a class="MiX"></a>';o.brokenMixedCaseQSA=!z.querySelectorAll(".MiX").length;}catch(v){}try{z.innerHTML='<select><option selected="selected">a</option></select>';
o.brokenCheckedQSA=(z.querySelectorAll(":checked").length==0);}catch(v){}try{z.innerHTML='<a class=""></a>';o.brokenEmptyAttributeQSA=(z.querySelectorAll('[class*=""]').length!=0);
}catch(v){}}try{z.innerHTML='<form action="s"><input id="action"/></form>';r=(z.firstChild.getAttribute("action")!="s");}catch(v){}o.nativeMatchesSelector=y.matchesSelector||y.mozMatchesSelector||y.webkitMatchesSelector;
if(o.nativeMatchesSelector){try{o.nativeMatchesSelector.call(y,":slick");o.nativeMatchesSelector=null;}catch(v){}}}try{y.slick_expando=1;delete y.slick_expando;
o.getUID=this.getUIDHTML;}catch(v){o.getUID=this.getUIDXML;}p.removeChild(z);z=s=p=null;o.getAttribute=(o.isHTMLDocument&&r)?function(D,B){var E=this.attributeGetters[B];
if(E){return E.call(D);}var C=D.getAttributeNode(B);return(C)?C.nodeValue:null;}:function(C,B){var D=this.attributeGetters[B];return(D)?D.call(C):C.getAttribute(B);
};o.hasAttribute=(y&&this.isNativeCode(y.hasAttribute))?function(C,B){return C.hasAttribute(B);}:function(C,B){C=C.getAttributeNode(B);return !!(C&&(C.specified||C.nodeValue));
};o.contains=(y&&this.isNativeCode(y.contains))?function(B,C){return B.contains(C);}:(y&&y.compareDocumentPosition)?function(B,C){return B===C||!!(B.compareDocumentPosition(C)&16);
}:function(B,C){if(C){do{if(C===B){return true;}}while((C=C.parentNode));}return false;};o.documentSorter=(y.compareDocumentPosition)?function(C,B){if(!C.compareDocumentPosition||!B.compareDocumentPosition){return 0;
}return C.compareDocumentPosition(B)&4?-1:C===B?0:1;}:("sourceIndex" in y)?function(C,B){if(!C.sourceIndex||!B.sourceIndex){return 0;}return C.sourceIndex-B.sourceIndex;
}:(w.createRange)?function(E,C){if(!E.ownerDocument||!C.ownerDocument){return 0;}var D=E.ownerDocument.createRange(),B=C.ownerDocument.createRange();D.setStart(E,0);
D.setEnd(E,0);B.setStart(C,0);B.setEnd(C,0);return D.compareBoundaryPoints(Range.START_TO_END,B);}:null;y=null;for(A in o){this[A]=o[A];}};var e=/^([#.]?)((?:[\w-]+|\*))$/,g=/\[.+[*$^]=(?:""|'')?\]/,f={};
j.search=function(U,z,H,s){var p=this.found=(s)?null:(H||[]);if(!U){return p;}else{if(U.navigator){U=U.document;}else{if(!U.nodeType){return p;}}}var F,O,V=this.uniques={},I=!!(H&&H.length),y=(U.nodeType==9);
if(this.document!==(y?U:U.ownerDocument)){this.setDocument(U);}if(I){for(O=p.length;O--;){V[this.getUID(p[O])]=true;}}if(typeof z=="string"){var r=z.match(e);
simpleSelectors:if(r){var u=r[1],v=r[2],A,E;if(!u){if(v=="*"&&this.brokenStarGEBTN){break simpleSelectors;}E=U.getElementsByTagName(v);if(s){return E[0]||null;
}for(O=0;A=E[O++];){if(!(I&&V[this.getUID(A)])){p.push(A);}}}else{if(u=="#"){if(!this.isHTMLDocument||!y){break simpleSelectors;}A=U.getElementById(v);
if(!A){return p;}if(this.idGetsName&&A.getAttributeNode("id").nodeValue!=v){break simpleSelectors;}if(s){return A||null;}if(!(I&&V[this.getUID(A)])){p.push(A);
}}else{if(u=="."){if(!this.isHTMLDocument||((!U.getElementsByClassName||this.brokenGEBCN)&&U.querySelectorAll)){break simpleSelectors;}if(U.getElementsByClassName&&!this.brokenGEBCN){E=U.getElementsByClassName(v);
if(s){return E[0]||null;}for(O=0;A=E[O++];){if(!(I&&V[this.getUID(A)])){p.push(A);}}}else{var T=new RegExp("(^|\\s)"+d.escapeRegExp(v)+"(\\s|$)");E=U.getElementsByTagName("*");
for(O=0;A=E[O++];){className=A.className;if(!(className&&T.test(className))){continue;}if(s){return A;}if(!(I&&V[this.getUID(A)])){p.push(A);}}}}}}if(I){this.sort(p);
}return(s)?null:p;}querySelector:if(U.querySelectorAll){if(!this.isHTMLDocument||f[z]||this.brokenMixedCaseQSA||(this.brokenCheckedQSA&&z.indexOf(":checked")>-1)||(this.brokenEmptyAttributeQSA&&g.test(z))||(!y&&z.indexOf(",")>-1)||d.disableQSA){break querySelector;
}var S=z,x=U;if(!y){var C=x.getAttribute("id"),t="slickid__";x.setAttribute("id",t);S="#"+t+" "+S;U=x.parentNode;}try{if(s){return U.querySelector(S)||null;
}else{E=U.querySelectorAll(S);}}catch(Q){f[z]=1;break querySelector;}finally{if(!y){if(C){x.setAttribute("id",C);}else{x.removeAttribute("id");}U=x;}}if(this.starSelectsClosedQSA){for(O=0;
A=E[O++];){if(A.nodeName>"@"&&!(I&&V[this.getUID(A)])){p.push(A);}}}else{for(O=0;A=E[O++];){if(!(I&&V[this.getUID(A)])){p.push(A);}}}if(I){this.sort(p);
}return p;}F=this.Slick.parse(z);if(!F.length){return p;}}else{if(z==null){return p;}else{if(z.Slick){F=z;}else{if(this.contains(U.documentElement||U,z)){(p)?p.push(z):p=z;
return p;}else{return p;}}}}this.posNTH={};this.posNTHLast={};this.posNTHType={};this.posNTHTypeLast={};this.push=(!I&&(s||(F.length==1&&F.expressions[0].length==1)))?this.pushArray:this.pushUID;
if(p==null){p=[];}var M,L,K;var B,J,D,c,q,G,W;var N,P,o,w,R=F.expressions;search:for(O=0;(P=R[O]);O++){for(M=0;(o=P[M]);M++){B="combinator:"+o.combinator;
if(!this[B]){continue search;}J=(this.isXMLDocument)?o.tag:o.tag.toUpperCase();D=o.id;c=o.classList;q=o.classes;G=o.attributes;W=o.pseudos;w=(M===(P.length-1));
this.bitUniques={};if(w){this.uniques=V;this.found=p;}else{this.uniques={};this.found=[];}if(M===0){this[B](U,J,D,q,G,W,c);if(s&&w&&p.length){break search;
}}else{if(s&&w){for(L=0,K=N.length;L<K;L++){this[B](N[L],J,D,q,G,W,c);if(p.length){break search;}}}else{for(L=0,K=N.length;L<K;L++){this[B](N[L],J,D,q,G,W,c);
}}}N=this.found;}}if(I||(F.expressions.length>1)){this.sort(p);}return(s)?(p[0]||null):p;};j.uidx=1;j.uidk="slick-uniqueid";j.getUIDXML=function(m){var c=m.getAttribute(this.uidk);
if(!c){c=this.uidx++;m.setAttribute(this.uidk,c);}return c;};j.getUIDHTML=function(c){return c.uniqueNumber||(c.uniqueNumber=this.uidx++);};j.sort=function(c){if(!this.documentSorter){return c;
}c.sort(this.documentSorter);return c;};j.cacheNTH={};j.matchNTH=/^([+-]?\d*)?([a-z]+)?([+-]\d+)?$/;j.parseNTHArgument=function(p){var n=p.match(this.matchNTH);
if(!n){return false;}var o=n[2]||false;var m=n[1]||1;if(m=="-"){m=-1;}var c=+n[3]||0;n=(o=="n")?{a:m,b:c}:(o=="odd")?{a:2,b:1}:(o=="even")?{a:2,b:0}:{a:0,b:m};
return(this.cacheNTH[p]=n);};j.createNTHPseudo=function(o,m,c,n){return function(r,p){var t=this.getUID(r);if(!this[c][t]){var z=r.parentNode;if(!z){return false;
}var q=z[o],s=1;if(n){var y=r.nodeName;do{if(q.nodeName!=y){continue;}this[c][this.getUID(q)]=s++;}while((q=q[m]));}else{do{if(q.nodeType!=1){continue;
}this[c][this.getUID(q)]=s++;}while((q=q[m]));}}p=p||"n";var u=this.cacheNTH[p]||this.parseNTHArgument(p);if(!u){return false;}var x=u.a,w=u.b,v=this[c][t];
if(x==0){return w==v;}if(x>0){if(v<w){return false;}}else{if(w<v){return false;}}return((v-w)%x)==0;};};j.pushArray=function(o,c,q,n,m,p){if(this.matchSelector(o,c,q,n,m,p)){this.found.push(o);
}};j.pushUID=function(p,c,r,o,m,q){var n=this.getUID(p);if(!this.uniques[n]&&this.matchSelector(p,c,r,o,m,q)){this.uniques[n]=true;this.found.push(p);}};
j.matchNode=function(m,n){if(this.isHTMLDocument&&this.nativeMatchesSelector){try{return this.nativeMatchesSelector.call(m,n.replace(/\[([^=]+)=\s*([^'"\]]+?)\s*\]/g,'[$1="$2"]'));
}catch(u){}}var t=this.Slick.parse(n);if(!t){return true;}var r=t.expressions,p,s=0,q;for(q=0;(currentExpression=r[q]);q++){if(currentExpression.length==1){var o=currentExpression[0];
if(this.matchSelector(m,(this.isXMLDocument)?o.tag:o.tag.toUpperCase(),o.id,o.classes,o.attributes,o.pseudos)){return true;}s++;}}if(s==t.length){return false;
}var c=this.search(this.document,t),v;for(q=0;v=c[q++];){if(v===m){return true;}}return false;};j.matchPseudo=function(p,c,o){var m="pseudo:"+c;if(this[m]){return this[m](p,o);
}var n=this.getAttribute(p,c);return(o)?o==n:!!n;};j.matchSelector=function(n,u,c,o,p,r){if(u){var s=(this.isXMLDocument)?n.nodeName:n.nodeName.toUpperCase();
if(u=="*"){if(s<"@"){return false;}}else{if(s!=u){return false;}}}if(c&&n.getAttribute("id")!=c){return false;}var q,m,t;if(o){for(q=o.length;q--;){t=n.getAttribute("class")||n.className;
if(!(t&&o[q].regexp.test(t))){return false;}}}if(p){for(q=p.length;q--;){m=p[q];if(m.operator?!m.test(this.getAttribute(n,m.key)):!this.hasAttribute(n,m.key)){return false;
}}}if(r){for(q=r.length;q--;){m=r[q];if(!this.matchPseudo(n,m.key,m.value)){return false;}}}return true;};var i={" ":function(p,v,m,q,r,t,o){var s,u,n;
if(this.isHTMLDocument){getById:if(m){u=this.document.getElementById(m);if((!u&&p.all)||(this.idGetsName&&u&&u.getAttributeNode("id").nodeValue!=m)){n=p.all[m];
if(!n){return;}if(!n[0]){n=[n];}for(s=0;u=n[s++];){var c=u.getAttributeNode("id");if(c&&c.nodeValue==m){this.push(u,v,null,q,r,t);break;}}return;}if(!u){if(this.contains(this.root,p)){return;
}else{break getById;}}else{if(this.document!==p&&!this.contains(p,u)){return;}}this.push(u,v,null,q,r,t);return;}getByClass:if(q&&p.getElementsByClassName&&!this.brokenGEBCN){n=p.getElementsByClassName(o.join(" "));
if(!(n&&n.length)){break getByClass;}for(s=0;u=n[s++];){this.push(u,v,m,null,r,t);}return;}}getByTag:{n=p.getElementsByTagName(v);if(!(n&&n.length)){break getByTag;
}if(!this.brokenStarGEBTN){v=null;}for(s=0;u=n[s++];){this.push(u,v,m,q,r,t);}}},">":function(o,c,q,n,m,p){if((o=o.firstChild)){do{if(o.nodeType==1){this.push(o,c,q,n,m,p);
}}while((o=o.nextSibling));}},"+":function(o,c,q,n,m,p){while((o=o.nextSibling)){if(o.nodeType==1){this.push(o,c,q,n,m,p);break;}}},"^":function(o,c,q,n,m,p){o=o.firstChild;
if(o){if(o.nodeType==1){this.push(o,c,q,n,m,p);}else{this["combinator:+"](o,c,q,n,m,p);}}},"~":function(p,c,r,o,m,q){while((p=p.nextSibling)){if(p.nodeType!=1){continue;
}var n=this.getUID(p);if(this.bitUniques[n]){break;}this.bitUniques[n]=true;this.push(p,c,r,o,m,q);}},"++":function(o,c,q,n,m,p){this["combinator:+"](o,c,q,n,m,p);
this["combinator:!+"](o,c,q,n,m,p);},"~~":function(o,c,q,n,m,p){this["combinator:~"](o,c,q,n,m,p);this["combinator:!~"](o,c,q,n,m,p);},"!":function(o,c,q,n,m,p){while((o=o.parentNode)){if(o!==this.document){this.push(o,c,q,n,m,p);
}}},"!>":function(o,c,q,n,m,p){o=o.parentNode;if(o!==this.document){this.push(o,c,q,n,m,p);}},"!+":function(o,c,q,n,m,p){while((o=o.previousSibling)){if(o.nodeType==1){this.push(o,c,q,n,m,p);
break;}}},"!^":function(o,c,q,n,m,p){o=o.lastChild;if(o){if(o.nodeType==1){this.push(o,c,q,n,m,p);}else{this["combinator:!+"](o,c,q,n,m,p);}}},"!~":function(p,c,r,o,m,q){while((p=p.previousSibling)){if(p.nodeType!=1){continue;
}var n=this.getUID(p);if(this.bitUniques[n]){break;}this.bitUniques[n]=true;this.push(p,c,r,o,m,q);}}};for(var h in i){j["combinator:"+h]=i[h];}var k={empty:function(c){var m=c.firstChild;
return !(m&&m.nodeType==1)&&!(c.innerText||c.textContent||"").length;},not:function(c,m){return !this.matchNode(c,m);},contains:function(c,m){return(c.innerText||c.textContent||"").indexOf(m)>-1;
},"first-child":function(c){while((c=c.previousSibling)){if(c.nodeType==1){return false;}}return true;},"last-child":function(c){while((c=c.nextSibling)){if(c.nodeType==1){return false;
}}return true;},"only-child":function(n){var m=n;while((m=m.previousSibling)){if(m.nodeType==1){return false;}}var c=n;while((c=c.nextSibling)){if(c.nodeType==1){return false;
}}return true;},"nth-child":j.createNTHPseudo("firstChild","nextSibling","posNTH"),"nth-last-child":j.createNTHPseudo("lastChild","previousSibling","posNTHLast"),"nth-of-type":j.createNTHPseudo("firstChild","nextSibling","posNTHType",true),"nth-last-of-type":j.createNTHPseudo("lastChild","previousSibling","posNTHTypeLast",true),index:function(m,c){return this["pseudo:nth-child"](m,""+c+1);
},even:function(c){return this["pseudo:nth-child"](c,"2n");},odd:function(c){return this["pseudo:nth-child"](c,"2n+1");},"first-of-type":function(c){var m=c.nodeName;
while((c=c.previousSibling)){if(c.nodeName==m){return false;}}return true;},"last-of-type":function(c){var m=c.nodeName;while((c=c.nextSibling)){if(c.nodeName==m){return false;
}}return true;},"only-of-type":function(n){var m=n,o=n.nodeName;while((m=m.previousSibling)){if(m.nodeName==o){return false;}}var c=n;while((c=c.nextSibling)){if(c.nodeName==o){return false;
}}return true;},enabled:function(c){return !c.disabled;},disabled:function(c){return c.disabled;},checked:function(c){return c.checked||c.selected;},focus:function(c){return this.isHTMLDocument&&this.document.activeElement===c&&(c.href||c.type||this.hasAttribute(c,"tabindex"));
},root:function(c){return(c===this.root);},selected:function(c){return c.selected;}};for(var a in k){j["pseudo:"+a]=k[a];}j.attributeGetters={"class":function(){return this.getAttribute("class")||this.className;
},"for":function(){return("htmlFor" in this)?this.htmlFor:this.getAttribute("for");},href:function(){return("href" in this)?this.getAttribute("href",2):this.getAttribute("href");
},style:function(){return(this.style)?this.style.cssText:this.getAttribute("style");},tabindex:function(){var c=this.getAttributeNode("tabindex");return(c&&c.specified)?c.nodeValue:null;
},type:function(){return this.getAttribute("type");}};var d=j.Slick=(this.Slick||{});d.version="1.1.5";d.search=function(m,n,c){return j.search(m,n,c);
};d.find=function(c,m){return j.search(c,m,null,true);};d.contains=function(c,m){j.setDocument(c);return j.contains(c,m);};d.getAttribute=function(m,c){return j.getAttribute(m,c);
};d.match=function(m,c){if(!(m&&c)){return false;}if(!c||c===m){return true;}j.setDocument(m);return j.matchNode(m,c);};d.defineAttributeGetter=function(c,m){j.attributeGetters[c]=m;
return this;};d.lookupAttributeGetter=function(c){return j.attributeGetters[c];};d.definePseudo=function(c,m){j["pseudo:"+c]=function(o,n){return m.call(o,n);
};return this;};d.lookupPseudo=function(c){var m=j["pseudo:"+c];if(m){return function(n){return m.call(this,n);};}return null;};d.override=function(m,c){j.override(m,c);
return this;};d.isXML=j.isXML;d.uidOf=function(c){return j.getUIDHTML(c);};if(!this.Slick){this.Slick=d;}}).apply((typeof exports!="undefined")?exports:this);
var Element=function(b,g){var h=Element.Constructors[b];if(h){return h(g);}if(typeof b!="string"){return document.id(b).set(g);}if(!g){g={};}if(!(/^[\w-]+$/).test(b)){var e=Slick.parse(b).expressions[0][0];
b=(e.tag=="*")?"div":e.tag;if(e.id&&g.id==null){g.id=e.id;}var d=e.attributes;if(d){for(var f=0,c=d.length;f<c;f++){var a=d[f];if(g[a.key]!=null){continue;
}if(a.value!=null&&a.operator=="="){g[a.key]=a.value;}else{if(!a.value&&!a.operator){g[a.key]=true;}}}}if(e.classList&&g["class"]==null){g["class"]=e.classList.join(" ");
}}return document.newElement(b,g);};if(Browser.Element){Element.prototype=Browser.Element.prototype;}new Type("Element",Element).mirror(function(a){if(Array.prototype[a]){return;
}var b={};b[a]=function(){var h=[],e=arguments,j=true;for(var g=0,d=this.length;g<d;g++){var f=this[g],c=h[g]=f[a].apply(f,e);j=(j&&typeOf(c)=="element");
}return(j)?new Elements(h):h;};Elements.implement(b);});if(!Browser.Element){Element.parent=Object;Element.Prototype={"$family":Function.from("element").hide()};
Element.mirror(function(a,b){Element.Prototype[a]=b;});}Element.Constructors={};var IFrame=new Type("IFrame",function(){var e=Array.link(arguments,{properties:Type.isObject,iframe:function(f){return(f!=null);
}});var c=e.properties||{},b;if(e.iframe){b=document.id(e.iframe);}var d=c.onload||function(){};delete c.onload;c.id=c.name=[c.id,c.name,b?(b.id||b.name):"IFrame_"+String.uniqueID()].pick();
b=new Element(b||"iframe",c);var a=function(){d.call(b.contentWindow);};if(window.frames[c.id]){a();}else{b.addListener("load",a);}return b;});var Elements=this.Elements=function(a){if(a&&a.length){var e={},d;
for(var c=0;d=a[c++];){var b=Slick.uidOf(d);if(!e[b]){e[b]=true;this.push(d);}}}};Elements.prototype={length:0};Elements.parent=Array;new Type("Elements",Elements).implement({filter:function(a,b){if(!a){return this;
}return new Elements(Array.filter(this,(typeOf(a)=="string")?function(c){return c.match(a);}:a,b));}.protect(),push:function(){var d=this.length;for(var b=0,a=arguments.length;
b<a;b++){var c=document.id(arguments[b]);if(c){this[d++]=c;}}return(this.length=d);}.protect(),unshift:function(){var b=[];for(var c=0,a=arguments.length;
c<a;c++){var d=document.id(arguments[c]);if(d){b.push(d);}}return Array.prototype.unshift.apply(this,b);}.protect(),concat:function(){var b=new Elements(this);
for(var c=0,a=arguments.length;c<a;c++){var d=arguments[c];if(Type.isEnumerable(d)){b.append(d);}else{b.push(d);}}return b;}.protect(),append:function(c){for(var b=0,a=c.length;
b<a;b++){this.push(c[b]);}return this;}.protect(),empty:function(){while(this.length){delete this[--this.length];}return this;}.protect()});(function(){var g=Array.prototype.splice,b={"0":0,"1":1,length:2};
g.call(b,1,1);if(b[1]==1){Elements.implement("splice",function(){var e=this.length;g.apply(this,arguments);while(e>=this.length){delete this[e--];}return this;
}.protect());}Elements.implement(Array.prototype);Array.mirror(Elements);var f;try{var a=document.createElement("<input name=x>");f=(a.name=="x");}catch(c){}var d=function(e){return(""+e).replace(/&/g,"&amp;").replace(/"/g,"&quot;");
};Document.implement({newElement:function(e,h){if(h&&h.checked!=null){h.defaultChecked=h.checked;}if(f&&h){e="<"+e;if(h.name){e+=' name="'+d(h.name)+'"';
}if(h.type){e+=' type="'+d(h.type)+'"';}e+=">";delete h.name;delete h.type;}return this.id(this.createElement(e)).set(h);}});})();Document.implement({newTextNode:function(a){return this.createTextNode(a);
},getDocument:function(){return this;},getWindow:function(){return this.window;},id:(function(){var a={string:function(d,c,b){d=Slick.find(b,"#"+d.replace(/(\W)/g,"\\$1"));
return(d)?a.element(d,c):null;},element:function(b,c){$uid(b);if(!c&&!b.$family&&!(/^(?:object|embed)$/i).test(b.tagName)){Object.append(b,Element.Prototype);
}return b;},object:function(c,d,b){if(c.toElement){return a.element(c.toElement(b),d);}return null;}};a.textnode=a.whitespace=a.window=a.document=function(b){return b;
};return function(c,e,d){if(c&&c.$family&&c.uid){return c;}var b=typeOf(c);return(a[b])?a[b](c,e,d||document):null;};})()});if(window.$==null){Window.implement("$",function(a,b){return document.id(a,b,this.document);
});}Window.implement({getDocument:function(){return this.document;},getWindow:function(){return this;}});[Document,Element].invoke("implement",{getElements:function(a){return Slick.search(this,a,new Elements);
},getElement:function(a){return document.id(Slick.find(this,a));}});if(window.$$==null){Window.implement("$$",function(a){if(arguments.length==1){if(typeof a=="string"){return Slick.search(this.document,a,new Elements);
}else{if(Type.isEnumerable(a)){return new Elements(a);}}}return new Elements(arguments);});}(function(){var k={},i={};var n={input:"checked",option:"selected",textarea:"value"};
var e=function(p){return(i[p]||(i[p]={}));};var j=function(q){var p=q.uid;if(q.removeEvents){q.removeEvents();}if(q.clearAttributes){q.clearAttributes();
}if(p!=null){delete k[p];delete i[p];}return q;};var o=["defaultValue","accessKey","cellPadding","cellSpacing","colSpan","frameBorder","maxLength","readOnly","rowSpan","tabIndex","useMap"];
var d=["compact","nowrap","ismap","declare","noshade","checked","disabled","readOnly","multiple","selected","noresize","defer","defaultChecked"];var g={html:"innerHTML","class":"className","for":"htmlFor",text:(function(){var p=document.createElement("div");
return(p.textContent==null)?"innerText":"textContent";})()};var m=["type"];var h=["value","defaultValue"];var l=/^(?:href|src|usemap)$/i;d=d.associate(d);
o=o.associate(o.map(String.toLowerCase));m=m.associate(m);Object.append(g,h.associate(h));var c={before:function(q,p){var r=p.parentNode;if(r){r.insertBefore(q,p);
}},after:function(q,p){var r=p.parentNode;if(r){r.insertBefore(q,p.nextSibling);}},bottom:function(q,p){p.appendChild(q);},top:function(q,p){p.insertBefore(q,p.firstChild);
}};c.inside=c.bottom;var b=function(s,r){if(!s){return r;}s=Object.clone(Slick.parse(s));var q=s.expressions;for(var p=q.length;p--;){q[p][0].combinator=r;
}return s;};Element.implement({set:function(r,q){var p=Element.Properties[r];(p&&p.set)?p.set.call(this,q):this.setProperty(r,q);}.overloadSetter(),get:function(q){var p=Element.Properties[q];
return(p&&p.get)?p.get.apply(this):this.getProperty(q);}.overloadGetter(),erase:function(q){var p=Element.Properties[q];(p&&p.erase)?p.erase.apply(this):this.removeProperty(q);
return this;},setProperty:function(q,r){q=o[q]||q;if(r==null){return this.removeProperty(q);}var p=g[q];(p)?this[p]=r:(d[q])?this[q]=!!r:this.setAttribute(q,""+r);
return this;},setProperties:function(p){for(var q in p){this.setProperty(q,p[q]);}return this;},getProperty:function(q){q=o[q]||q;var p=g[q]||m[q];return(p)?this[p]:(d[q])?!!this[q]:(l.test(q)?this.getAttribute(q,2):(p=this.getAttributeNode(q))?p.nodeValue:null)||null;
},getProperties:function(){var p=Array.from(arguments);return p.map(this.getProperty,this).associate(p);},removeProperty:function(q){q=o[q]||q;var p=g[q];
(p)?this[p]="":(d[q])?this[q]=false:this.removeAttribute(q);return this;},removeProperties:function(){Array.each(arguments,this.removeProperty,this);return this;
},hasClass:function(p){return this.className.clean().contains(p," ");},addClass:function(p){if(!this.hasClass(p)){this.className=(this.className+" "+p).clean();
}return this;},removeClass:function(p){this.className=this.className.replace(new RegExp("(^|\\s)"+p+"(?:\\s|$)"),"$1");return this;},toggleClass:function(p,q){if(q==null){q=!this.hasClass(p);
}return(q)?this.addClass(p):this.removeClass(p);},adopt:function(){var s=this,p,u=Array.flatten(arguments),t=u.length;if(t>1){s=p=document.createDocumentFragment();
}for(var r=0;r<t;r++){var q=document.id(u[r],true);if(q){s.appendChild(q);}}if(p){this.appendChild(p);}return this;},appendText:function(q,p){return this.grab(this.getDocument().newTextNode(q),p);
},grab:function(q,p){c[p||"bottom"](document.id(q,true),this);return this;},inject:function(q,p){c[p||"bottom"](this,document.id(q,true));return this;},replaces:function(p){p=document.id(p,true);
p.parentNode.replaceChild(this,p);return this;},wraps:function(q,p){q=document.id(q,true);return this.replaces(q).grab(q,p);},getPrevious:function(p){return document.id(Slick.find(this,b(p,"!~")));
},getAllPrevious:function(p){return Slick.search(this,b(p,"!~"),new Elements);},getNext:function(p){return document.id(Slick.find(this,b(p,"~")));},getAllNext:function(p){return Slick.search(this,b(p,"~"),new Elements);
},getFirst:function(p){return document.id(Slick.search(this,b(p,">"))[0]);},getLast:function(p){return document.id(Slick.search(this,b(p,">")).getLast());
},getParent:function(p){return document.id(Slick.find(this,b(p,"!")));},getParents:function(p){return Slick.search(this,b(p,"!"),new Elements);},getSiblings:function(p){return Slick.search(this,b(p,"~~"),new Elements);
},getChildren:function(p){return Slick.search(this,b(p,">"),new Elements);},getWindow:function(){return this.ownerDocument.window;},getDocument:function(){return this.ownerDocument;
},getElementById:function(p){return document.id(Slick.find(this,"#"+(""+p).replace(/(\W)/g,"\\$1")));},getSelected:function(){this.selectedIndex;return new Elements(Array.from(this.options).filter(function(p){return p.selected;
}));},toQueryString:function(){var p=[];this.getElements("input, select, textarea").each(function(r){var q=r.type;if(!r.name||r.disabled||q=="submit"||q=="reset"||q=="file"||q=="image"){return;
}var s=(r.get("tag")=="select")?r.getSelected().map(function(t){return document.id(t).get("value");}):((q=="radio"||q=="checkbox")&&!r.checked)?null:r.get("value");
Array.from(s).each(function(t){if(typeof t!="undefined"){p.push(encodeURIComponent(r.name)+"="+encodeURIComponent(t));}});});return p.join("&");},destroy:function(){var p=j(this).getElementsByTagName("*");
Array.each(p,j);Element.dispose(this);return null;},empty:function(){Array.from(this.childNodes).each(Element.dispose);return this;},dispose:function(){return(this.parentNode)?this.parentNode.removeChild(this):this;
},match:function(p){return !p||Slick.match(this,p);}});var a=function(t,s,q){if(!q){t.setAttributeNode(document.createAttribute("id"));}if(t.clearAttributes){t.clearAttributes();
t.mergeAttributes(s);t.removeAttribute("uid");if(t.options){var u=t.options,p=s.options;for(var r=u.length;r--;){u[r].selected=p[r].selected;}}}var v=n[s.tagName.toLowerCase()];
if(v&&s[v]){t[v]=s[v];}};Element.implement("clone",function(r,p){r=r!==false;var w=this.cloneNode(r),q;if(r){var s=w.getElementsByTagName("*"),u=this.getElementsByTagName("*");
for(q=s.length;q--;){a(s[q],u[q],p);}}a(w,this,p);if(Browser.ie){var t=w.getElementsByTagName("object"),v=this.getElementsByTagName("object");for(q=t.length;
q--;){t[q].outerHTML=v[q].outerHTML;}}return document.id(w);});var f={contains:function(p){return Slick.contains(this,p);}};if(!document.contains){Document.implement(f);
}if(!document.createElement("div").contains){Element.implement(f);}[Element,Window,Document].invoke("implement",{addListener:function(s,r){if(s=="unload"){var p=r,q=this;
r=function(){q.removeListener("unload",r);p();};}else{k[$uid(this)]=this;}if(this.addEventListener){this.addEventListener(s,r,!!arguments[2]);}else{this.attachEvent("on"+s,r);
}return this;},removeListener:function(q,p){if(this.removeEventListener){this.removeEventListener(q,p,!!arguments[2]);}else{this.detachEvent("on"+q,p);
}return this;},retrieve:function(q,p){var s=e($uid(this)),r=s[q];if(p!=null&&r==null){r=s[q]=p;}return r!=null?r:null;},store:function(q,p){var r=e($uid(this));
r[q]=p;return this;},eliminate:function(p){var q=e($uid(this));delete q[p];return this;}});if(window.attachEvent&&!window.addEventListener){window.addListener("unload",function(){Object.each(k,j);
if(window.CollectGarbage){CollectGarbage();}});}})();Element.Properties={};Element.Properties.style={set:function(a){this.style.cssText=a;},get:function(){return this.style.cssText;
},erase:function(){this.style.cssText="";}};Element.Properties.tag={get:function(){return this.tagName.toLowerCase();}};(function(a){if(a!=null){Element.Properties.maxlength=Element.Properties.maxLength={get:function(){var b=this.getAttribute("maxLength");
return b==a?null:b;}};}})(document.createElement("input").getAttribute("maxLength"));Element.Properties.html=(function(){var c=Function.attempt(function(){var e=document.createElement("table");
e.innerHTML="<tr><td></td></tr>";});var d=document.createElement("div");var a={table:[1,"<table>","</table>"],select:[1,"<select>","</select>"],tbody:[2,"<table><tbody>","</tbody></table>"],tr:[3,"<table><tbody><tr>","</tr></tbody></table>"]};
a.thead=a.tfoot=a.tbody;var b={set:function(){var f=Array.flatten(arguments).join("");var g=(!c&&a[this.get("tag")]);if(g){var h=d;h.innerHTML=g[1]+f+g[2];
for(var e=g[0];e--;){h=h.firstChild;}this.empty().adopt(h.childNodes);}else{this.innerHTML=f;}}};b.erase=b.set;return b;})();(function(){var c=document.html;
Element.Properties.styles={set:function(f){this.setStyles(f);}};var e=(c.style.opacity!=null);var d=/alpha\(opacity=([\d.]+)\)/i;var b=function(g,f){if(!g.currentStyle||!g.currentStyle.hasLayout){g.style.zoom=1;
}if(e){g.style.opacity=f;}else{f=(f*100).limit(0,100).round();f=(f==100)?"":"alpha(opacity="+f+")";var h=g.style.filter||g.getComputedStyle("filter")||"";
g.style.filter=d.test(h)?h.replace(d,f):h+f;}};Element.Properties.opacity={set:function(g){var f=this.style.visibility;if(g==0&&f!="hidden"){this.style.visibility="hidden";
}else{if(g!=0&&f!="visible"){this.style.visibility="visible";}}b(this,g);},get:(e)?function(){var f=this.style.opacity||this.getComputedStyle("opacity");
return(f=="")?1:f;}:function(){var f,g=(this.style.filter||this.getComputedStyle("filter"));if(g){f=g.match(d);}return(f==null||g==null)?1:(f[1]/100);}};
var a=(c.style.cssFloat==null)?"styleFloat":"cssFloat";Element.implement({getComputedStyle:function(h){if(this.currentStyle){return this.currentStyle[h.camelCase()];
}var g=Element.getDocument(this).defaultView,f=g?g.getComputedStyle(this,null):null;return(f)?f.getPropertyValue((h==a)?"float":h.hyphenate()):null;},setOpacity:function(f){b(this,f);
return this;},getOpacity:function(){return this.get("opacity");},setStyle:function(g,f){switch(g){case"opacity":return this.set("opacity",parseFloat(f));
case"float":g=a;}g=g.camelCase();if(typeOf(f)!="string"){var h=(Element.Styles[g]||"@").split(" ");f=Array.from(f).map(function(k,j){if(!h[j]){return"";
}return(typeOf(k)=="number")?h[j].replace("@",Math.round(k)):k;}).join(" ");}else{if(f==String(Number(f))){f=Math.round(f);}}this.style[g]=f;return this;
},getStyle:function(l){switch(l){case"opacity":return this.get("opacity");case"float":l=a;}l=l.camelCase();var f=this.style[l];if(!f||l=="zIndex"){f=[];
for(var k in Element.ShortStyles){if(l!=k){continue;}for(var j in Element.ShortStyles[k]){f.push(this.getStyle(j));}return f.join(" ");}f=this.getComputedStyle(l);
}if(f){f=String(f);var h=f.match(/rgba?\([\d\s,]+\)/);if(h){f=f.replace(h[0],h[0].rgbToHex());}}if(Browser.opera||(Browser.ie&&isNaN(parseFloat(f)))){if((/^(height|width)$/).test(l)){var g=(l=="width")?["left","right"]:["top","bottom"],i=0;
g.each(function(m){i+=this.getStyle("border-"+m+"-width").toInt()+this.getStyle("padding-"+m).toInt();},this);return this["offset"+l.capitalize()]-i+"px";
}if(Browser.opera&&String(f).indexOf("px")!=-1){return f;}if((/^border(.+)Width|margin|padding/).test(l)){return"0px";}}return f;},setStyles:function(g){for(var f in g){this.setStyle(f,g[f]);
}return this;},getStyles:function(){var f={};Array.flatten(arguments).each(function(g){f[g]=this.getStyle(g);},this);return f;}});Element.Styles={left:"@px",top:"@px",bottom:"@px",right:"@px",width:"@px",height:"@px",maxWidth:"@px",maxHeight:"@px",minWidth:"@px",minHeight:"@px",backgroundColor:"rgb(@, @, @)",backgroundPosition:"@px @px",color:"rgb(@, @, @)",fontSize:"@px",letterSpacing:"@px",lineHeight:"@px",clip:"rect(@px @px @px @px)",margin:"@px @px @px @px",padding:"@px @px @px @px",border:"@px @ rgb(@, @, @) @px @ rgb(@, @, @) @px @ rgb(@, @, @)",borderWidth:"@px @px @px @px",borderStyle:"@ @ @ @",borderColor:"rgb(@, @, @) rgb(@, @, @) rgb(@, @, @) rgb(@, @, @)",zIndex:"@",zoom:"@",fontWeight:"@",textIndent:"@px",opacity:"@"};
Element.ShortStyles={margin:{},padding:{},border:{},borderWidth:{},borderStyle:{},borderColor:{}};["Top","Right","Bottom","Left"].each(function(l){var k=Element.ShortStyles;
var g=Element.Styles;["margin","padding"].each(function(m){var n=m+l;k[m][n]=g[n]="@px";});var j="border"+l;k.border[j]=g[j]="@px @ rgb(@, @, @)";var i=j+"Width",f=j+"Style",h=j+"Color";
k[j]={};k.borderWidth[i]=k[j][i]=g[i]="@px";k.borderStyle[f]=k[j][f]=g[f]="@";k.borderColor[h]=k[j][h]=g[h]="rgb(@, @, @)";});})();(function(){var h=document.createElement("div"),e=document.createElement("div");
h.style.height="0";h.appendChild(e);var d=(e.offsetParent===h);h=e=null;var l=function(m){return k(m,"position")!="static"||a(m);};var i=function(m){return l(m)||(/^(?:table|td|th)$/i).test(m.tagName);
};Element.implement({scrollTo:function(m,n){if(a(this)){this.getWindow().scrollTo(m,n);}else{this.scrollLeft=m;this.scrollTop=n;}return this;},getSize:function(){if(a(this)){return this.getWindow().getSize();
}return{x:this.offsetWidth,y:this.offsetHeight};},getScrollSize:function(){if(a(this)){return this.getWindow().getScrollSize();}return{x:this.scrollWidth,y:this.scrollHeight};
},getScroll:function(){if(a(this)){return this.getWindow().getScroll();}return{x:this.scrollLeft,y:this.scrollTop};},getScrolls:function(){var n=this.parentNode,m={x:0,y:0};
while(n&&!a(n)){m.x+=n.scrollLeft;m.y+=n.scrollTop;n=n.parentNode;}return m;},getOffsetParent:d?function(){var m=this;if(a(m)||k(m,"position")=="fixed"){return null;
}var n=(k(m,"position")=="static")?i:l;while((m=m.parentNode)){if(n(m)){return m;}}return null;}:function(){var m=this;if(a(m)||k(m,"position")=="fixed"){return null;
}try{return m.offsetParent;}catch(n){}return null;},getOffsets:function(){if(this.getBoundingClientRect&&!Browser.Platform.ios){var r=this.getBoundingClientRect(),o=document.id(this.getDocument().documentElement),q=o.getScroll(),t=this.getScrolls(),s=(k(this,"position")=="fixed");
return{x:r.left.toInt()+t.x+((s)?0:q.x)-o.clientLeft,y:r.top.toInt()+t.y+((s)?0:q.y)-o.clientTop};}var n=this,m={x:0,y:0};if(a(this)){return m;}while(n&&!a(n)){m.x+=n.offsetLeft;
m.y+=n.offsetTop;if(Browser.firefox){if(!c(n)){m.x+=b(n);m.y+=g(n);}var p=n.parentNode;if(p&&k(p,"overflow")!="visible"){m.x+=b(p);m.y+=g(p);}}else{if(n!=this&&Browser.safari){m.x+=b(n);
m.y+=g(n);}}n=n.offsetParent;}if(Browser.firefox&&!c(this)){m.x-=b(this);m.y-=g(this);}return m;},getPosition:function(p){if(a(this)){return{x:0,y:0};}var q=this.getOffsets(),n=this.getScrolls();
var m={x:q.x-n.x,y:q.y-n.y};if(p&&(p=document.id(p))){var o=p.getPosition();return{x:m.x-o.x-b(p),y:m.y-o.y-g(p)};}return m;},getCoordinates:function(o){if(a(this)){return this.getWindow().getCoordinates();
}var m=this.getPosition(o),n=this.getSize();var p={left:m.x,top:m.y,width:n.x,height:n.y};p.right=p.left+p.width;p.bottom=p.top+p.height;return p;},computePosition:function(m){return{left:m.x-j(this,"margin-left"),top:m.y-j(this,"margin-top")};
},setPosition:function(m){return this.setStyles(this.computePosition(m));}});[Document,Window].invoke("implement",{getSize:function(){var m=f(this);return{x:m.clientWidth,y:m.clientHeight};
},getScroll:function(){var n=this.getWindow(),m=f(this);return{x:n.pageXOffset||m.scrollLeft,y:n.pageYOffset||m.scrollTop};},getScrollSize:function(){var o=f(this),n=this.getSize(),m=this.getDocument().body;
return{x:Math.max(o.scrollWidth,m.scrollWidth,n.x),y:Math.max(o.scrollHeight,m.scrollHeight,n.y)};},getPosition:function(){return{x:0,y:0};},getCoordinates:function(){var m=this.getSize();
return{top:0,left:0,bottom:m.y,right:m.x,height:m.y,width:m.x};}});var k=Element.getComputedStyle;function j(m,n){return k(m,n).toInt()||0;}function c(m){return k(m,"-moz-box-sizing")=="border-box";
}function g(m){return j(m,"border-top-width");}function b(m){return j(m,"border-left-width");}function a(m){return(/^(?:body|html)$/i).test(m.tagName);
}function f(m){var n=m.getDocument();return(!n.compatMode||n.compatMode=="CSS1Compat")?n.html:n.body;}})();Element.alias({position:"setPosition"});[Window,Document,Element].invoke("implement",{getHeight:function(){return this.getSize().y;
},getWidth:function(){return this.getSize().x;},getScrollTop:function(){return this.getScroll().y;},getScrollLeft:function(){return this.getScroll().x;
},getScrollHeight:function(){return this.getScrollSize().y;},getScrollWidth:function(){return this.getScrollSize().x;},getTop:function(){return this.getPosition().y;
},getLeft:function(){return this.getPosition().x;}});(function(){var a=this.Class=new Type("Class",function(h){if(instanceOf(h,Function)){h={initialize:h};
}var g=function(){e(this);if(g.$prototyping){return this;}this.$caller=null;var i=(this.initialize)?this.initialize.apply(this,arguments):this;this.$caller=this.caller=null;
return i;}.extend(this).implement(h);g.$constructor=a;g.prototype.$constructor=g;g.prototype.parent=c;return g;});var c=function(){if(!this.$caller){throw new Error('The method "parent" cannot be called.');
}var g=this.$caller.$name,h=this.$caller.$owner.parent,i=(h)?h.prototype[g]:null;if(!i){throw new Error('The method "'+g+'" has no parent.');}return i.apply(this,arguments);
};var e=function(g){for(var h in g){var j=g[h];switch(typeOf(j)){case"object":var i=function(){};i.prototype=j;g[h]=e(new i);break;case"array":g[h]=j.clone();
break;}}return g;};var b=function(g,h,j){if(j.$origin){j=j.$origin;}var i=function(){if(j.$protected&&this.$caller==null){throw new Error('The method "'+h+'" cannot be called.');
}var l=this.caller,m=this.$caller;this.caller=m;this.$caller=i;var k=j.apply(this,arguments);this.$caller=m;this.caller=l;return k;}.extend({$owner:g,$origin:j,$name:h});
return i;};var f=function(h,i,g){if(a.Mutators.hasOwnProperty(h)){i=a.Mutators[h].call(this,i);if(i==null){return this;}}if(typeOf(i)=="function"){if(i.$hidden){return this;
}this.prototype[h]=(g)?i:b(this,h,i);}else{Object.merge(this.prototype,h,i);}return this;};var d=function(g){g.$prototyping=true;var h=new g;delete g.$prototyping;
return h;};a.implement("implement",f.overloadSetter());a.Mutators={Extends:function(g){this.parent=g;this.prototype=d(g);},Implements:function(g){Array.from(g).each(function(j){var h=new j;
for(var i in h){f.call(this,i,h[i],true);}},this);}};})();(function(){this.Chain=new Class({$chain:[],chain:function(){this.$chain.append(Array.flatten(arguments));
return this;},callChain:function(){return(this.$chain.length)?this.$chain.shift().apply(this,arguments):false;},clearChain:function(){this.$chain.empty();
return this;}});var a=function(b){return b.replace(/^on([A-Z])/,function(c,d){return d.toLowerCase();});};this.Events=new Class({$events:{},addEvent:function(d,c,b){d=a(d);
this.$events[d]=(this.$events[d]||[]).include(c);if(b){c.internal=true;}return this;},addEvents:function(b){for(var c in b){this.addEvent(c,b[c]);}return this;
},fireEvent:function(e,c,b){e=a(e);var d=this.$events[e];if(!d){return this;}c=Array.from(c);d.each(function(f){if(b){f.delay(b,this,c);}else{f.apply(this,c);
}},this);return this;},removeEvent:function(e,d){e=a(e);var c=this.$events[e];if(c&&!d.internal){var b=c.indexOf(d);if(b!=-1){delete c[b];}}return this;
},removeEvents:function(d){var e;if(typeOf(d)=="object"){for(e in d){this.removeEvent(e,d[e]);}return this;}if(d){d=a(d);}for(e in this.$events){if(d&&d!=e){continue;
}var c=this.$events[e];for(var b=c.length;b--;){if(b in c){this.removeEvent(e,c[b]);}}}return this;}});this.Options=new Class({setOptions:function(){var b=this.options=Object.merge.apply(null,[{},this.options].append(arguments));
if(this.addEvent){for(var c in b){if(typeOf(b[c])!="function"||!(/^on[A-Z]/).test(c)){continue;}this.addEvent(c,b[c]);delete b[c];}}return this;}});})();
(function(){var f=this.Fx=new Class({Implements:[Chain,Events,Options],options:{fps:60,unit:false,duration:500,frames:null,frameSkip:true,link:"ignore"},initialize:function(g){this.subject=this.subject||this;
this.setOptions(g);},getTransition:function(){return function(g){return -(Math.cos(Math.PI*g)-1)/2;};},step:function(g){if(this.options.frameSkip){var h=(this.time!=null)?(g-this.time):0,i=h/this.frameInterval;
this.time=g;this.frame+=i;}else{this.frame++;}if(this.frame<this.frames){var j=this.transition(this.frame/this.frames);this.set(this.compute(this.from,this.to,j));
}else{this.frame=this.frames;this.set(this.compute(this.from,this.to,1));this.stop();}},set:function(g){return g;},compute:function(i,h,g){return f.compute(i,h,g);
},check:function(){if(!this.isRunning()){return true;}switch(this.options.link){case"cancel":this.cancel();return true;case"chain":this.chain(this.caller.pass(arguments,this));
return false;}return false;},start:function(k,j){if(!this.check(k,j)){return this;}this.from=k;this.to=j;this.frame=(this.options.frameSkip)?0:-1;this.time=null;
this.transition=this.getTransition();var i=this.options.frames,h=this.options.fps,g=this.options.duration;this.duration=f.Durations[g]||g.toInt();this.frameInterval=1000/h;
this.frames=i||Math.round(this.duration/this.frameInterval);this.fireEvent("start",this.subject);b.call(this,h);return this;},stop:function(){if(this.isRunning()){this.time=null;
d.call(this,this.options.fps);if(this.frames==this.frame){this.fireEvent("complete",this.subject);if(!this.callChain()){this.fireEvent("chainComplete",this.subject);
}}else{this.fireEvent("stop",this.subject);}}return this;},cancel:function(){if(this.isRunning()){this.time=null;d.call(this,this.options.fps);this.frame=this.frames;
this.fireEvent("cancel",this.subject).clearChain();}return this;},pause:function(){if(this.isRunning()){this.time=null;d.call(this,this.options.fps);}return this;
},resume:function(){if((this.frame<this.frames)&&!this.isRunning()){b.call(this,this.options.fps);}return this;},isRunning:function(){var g=e[this.options.fps];
return g&&g.contains(this);}});f.compute=function(i,h,g){return(h-i)*g+i;};f.Durations={"short":250,normal:500,"long":1000};var e={},c={};var a=function(){var h=Date.now();
for(var j=this.length;j--;){var g=this[j];if(g){g.step(h);}}};var b=function(h){var g=e[h]||(e[h]=[]);g.push(this);if(!c[h]){c[h]=a.periodical(Math.round(1000/h),g);
}};var d=function(h){var g=e[h];if(g){g.erase(this);if(!g.length&&c[h]){delete e[h];c[h]=clearInterval(c[h]);}}};})();Fx.CSS=new Class({Extends:Fx,prepare:function(c,d,b){b=Array.from(b);
if(b[1]==null){b[1]=b[0];b[0]=c.getStyle(d);}var a=b.map(this.parse);return{from:a[0],to:a[1]};},parse:function(a){a=Function.from(a)();a=(typeof a=="string")?a.split(" "):Array.from(a);
return a.map(function(c){c=String(c);var b=false;Object.each(Fx.CSS.Parsers,function(f,e){if(b){return;}var d=f.parse(c);if(d||d===0){b={value:d,parser:f};
}});b=b||{value:c,parser:Fx.CSS.Parsers.String};return b;});},compute:function(d,c,b){var a=[];(Math.min(d.length,c.length)).times(function(e){a.push({value:d[e].parser.compute(d[e].value,c[e].value,b),parser:d[e].parser});
});a.$family=Function.from("fx:css:value");return a;},serve:function(c,b){if(typeOf(c)!="fx:css:value"){c=this.parse(c);}var a=[];c.each(function(d){a=a.concat(d.parser.serve(d.value,b));
});return a;},render:function(a,d,c,b){a.setStyle(d,this.serve(c,b));},search:function(a){if(Fx.CSS.Cache[a]){return Fx.CSS.Cache[a];}var c={},b=new RegExp("^"+a.escapeRegExp()+"$");
Array.each(document.styleSheets,function(f,e){var d=f.href;if(d&&d.contains("://")&&!d.contains(document.domain)){return;}var g=f.rules||f.cssRules;Array.each(g,function(k,h){if(!k.style){return;
}var j=(k.selectorText)?k.selectorText.replace(/^\w+/,function(i){return i.toLowerCase();}):null;if(!j||!b.test(j)){return;}Object.each(Element.Styles,function(l,i){if(!k.style[i]||Element.ShortStyles[i]){return;
}l=String(k.style[i]);c[i]=((/^rgb/).test(l))?l.rgbToHex():l;});});});return Fx.CSS.Cache[a]=c;}});Fx.CSS.Cache={};Fx.CSS.Parsers={Color:{parse:function(a){if(a.match(/^#[0-9a-f]{3,6}$/i)){return a.hexToRgb(true);
}return((a=a.match(/(\d+),\s*(\d+),\s*(\d+)/)))?[a[1],a[2],a[3]]:false;},compute:function(c,b,a){return c.map(function(e,d){return Math.round(Fx.compute(c[d],b[d],a));
});},serve:function(a){return a.map(Number);}},Number:{parse:parseFloat,compute:Fx.compute,serve:function(b,a){return(a)?b+a:b;}},String:{parse:Function.from(false),compute:function(b,a){return a;
},serve:function(a){return a;}}};Fx.Morph=new Class({Extends:Fx.CSS,initialize:function(b,a){this.element=this.subject=document.id(b);this.parent(a);},set:function(a){if(typeof a=="string"){a=this.search(a);
}for(var b in a){this.render(this.element,b,a[b],this.options.unit);}return this;},compute:function(e,d,c){var a={};for(var b in e){a[b]=this.parent(e[b],d[b],c);
}return a;},start:function(b){if(!this.check(b)){return this;}if(typeof b=="string"){b=this.search(b);}var e={},d={};for(var c in b){var a=this.prepare(this.element,c,b[c]);
e[c]=a.from;d[c]=a.to;}return this.parent(e,d);}});Element.Properties.morph={set:function(a){this.get("morph").cancel().setOptions(a);return this;},get:function(){var a=this.retrieve("morph");
if(!a){a=new Fx.Morph(this,{link:"cancel"});this.store("morph",a);}return a;}};Element.implement({morph:function(a){this.get("morph").start(a);return this;
}});(function(){var a=Object.prototype.hasOwnProperty;Object.extend({subset:function(d,g){var f={};for(var e=0,b=g.length;e<b;e++){var c=g[e];if(c in d){f[c]=d[c];
}}return f;},map:function(b,e,f){var d={};for(var c in b){if(a.call(b,c)){d[c]=e.call(f,b[c],c,b);}}return d;},filter:function(b,e,g){var d={};for(var c in b){var f=b[c];
if(a.call(b,c)&&e.call(g,f,c,b)){d[c]=f;}}return d;},every:function(b,d,e){for(var c in b){if(a.call(b,c)&&!d.call(e,b[c],c)){return false;}}return true;
},some:function(b,d,e){for(var c in b){if(a.call(b,c)&&d.call(e,b[c],c)){return true;}}return false;},keys:function(b){var d=[];for(var c in b){if(a.call(b,c)){d.push(c);
}}return d;},values:function(c){var b=[];for(var d in c){if(a.call(c,d)){b.push(c[d]);}}return b;},getLength:function(b){return Object.keys(b).length;},keyOf:function(b,d){for(var c in b){if(a.call(b,c)&&b[c]===d){return c;
}}return null;},contains:function(b,c){return Object.keyOf(b,c)!=null;},toQueryString:function(b,c){var d=[];Object.each(b,function(h,g){if(c){g=c+"["+g+"]";
}var f;switch(typeOf(h)){case"object":f=Object.toQueryString(h,g);break;case"array":var e={};h.each(function(k,j){e[j]=k;});f=Object.toQueryString(e,g);
break;default:f=g+"="+encodeURIComponent(h);}if(h!=null){d.push(f);}});return d.join("&");}});})();var Event=new Type("Event",function(a,i){if(!i){i=window;
}var o=i.document;a=a||i.event;if(a.$extended){return a;}this.$extended=true;var n=a.type,k=a.target||a.srcElement,m={},c={},q=null,h,l,b,p;while(k&&k.nodeType==3){k=k.parentNode;
}if(n.indexOf("key")!=-1){b=a.which||a.keyCode;p=Object.keyOf(Event.Keys,b);if(n=="keydown"){var d=b-111;if(d>0&&d<13){p="f"+d;}}if(!p){p=String.fromCharCode(b).toLowerCase();
}}else{if((/click|mouse|menu/i).test(n)){o=(!o.compatMode||o.compatMode=="CSS1Compat")?o.html:o.body;m={x:(a.pageX!=null)?a.pageX:a.clientX+o.scrollLeft,y:(a.pageY!=null)?a.pageY:a.clientY+o.scrollTop};
c={x:(a.pageX!=null)?a.pageX-i.pageXOffset:a.clientX,y:(a.pageY!=null)?a.pageY-i.pageYOffset:a.clientY};if((/DOMMouseScroll|mousewheel/).test(n)){l=(a.wheelDelta)?a.wheelDelta/120:-(a.detail||0)/3;
}h=(a.which==3)||(a.button==2);if((/over|out/).test(n)){q=a.relatedTarget||a[(n=="mouseover"?"from":"to")+"Element"];var j=function(){while(q&&q.nodeType==3){q=q.parentNode;
}return true;};var g=(Browser.firefox2)?j.attempt():j();q=(g)?q:null;}}else{if((/gesture|touch/i).test(n)){this.rotation=a.rotation;this.scale=a.scale;
this.targetTouches=a.targetTouches;this.changedTouches=a.changedTouches;var f=this.touches=a.touches;if(f&&f[0]){var e=f[0];m={x:e.pageX,y:e.pageY};c={x:e.clientX,y:e.clientY};
}}}}return Object.append(this,{event:a,type:n,page:m,client:c,rightClick:h,wheel:l,relatedTarget:document.id(q),target:document.id(k),code:b,key:p,shift:a.shiftKey,control:a.ctrlKey,alt:a.altKey,meta:a.metaKey});
});Event.Keys={enter:13,up:38,down:40,left:37,right:39,esc:27,space:32,backspace:8,tab:9,"delete":46};Event.implement({stop:function(){return this.stopPropagation().preventDefault();
},stopPropagation:function(){if(this.event.stopPropagation){this.event.stopPropagation();}else{this.event.cancelBubble=true;}return this;},preventDefault:function(){if(this.event.preventDefault){this.event.preventDefault();
}else{this.event.returnValue=false;}return this;}});(function(){Element.Properties.events={set:function(b){this.addEvents(b);}};[Element,Window,Document].invoke("implement",{addEvent:function(f,h){var i=this.retrieve("events",{});
if(!i[f]){i[f]={keys:[],values:[]};}if(i[f].keys.contains(h)){return this;}i[f].keys.push(h);var g=f,b=Element.Events[f],d=h,j=this;if(b){if(b.onAdd){b.onAdd.call(this,h);
}if(b.condition){d=function(k){if(b.condition.call(this,k)){return h.call(this,k);}return true;};}g=b.base||g;}var e=function(){return h.call(j);};var c=Element.NativeEvents[g];
if(c){if(c==2){e=function(k){k=new Event(k,j.getWindow());if(d.call(j,k)===false){k.stop();}};}this.addListener(g,e,arguments[2]);}i[f].values.push(e);
return this;},removeEvent:function(e,d){var c=this.retrieve("events");if(!c||!c[e]){return this;}var h=c[e];var b=h.keys.indexOf(d);if(b==-1){return this;
}var g=h.values[b];delete h.keys[b];delete h.values[b];var f=Element.Events[e];if(f){if(f.onRemove){f.onRemove.call(this,d);}e=f.base||e;}return(Element.NativeEvents[e])?this.removeListener(e,g,arguments[2]):this;
},addEvents:function(b){for(var c in b){this.addEvent(c,b[c]);}return this;},removeEvents:function(b){var d;if(typeOf(b)=="object"){for(d in b){this.removeEvent(d,b[d]);
}return this;}var c=this.retrieve("events");if(!c){return this;}if(!b){for(d in c){this.removeEvents(d);}this.eliminate("events");}else{if(c[b]){c[b].keys.each(function(e){this.removeEvent(b,e);
},this);delete c[b];}}return this;},fireEvent:function(e,c,b){var d=this.retrieve("events");if(!d||!d[e]){return this;}c=Array.from(c);d[e].keys.each(function(f){if(b){f.delay(b,this,c);
}else{f.apply(this,c);}},this);return this;},cloneEvents:function(e,d){e=document.id(e);var c=e.retrieve("events");if(!c){return this;}if(!d){for(var b in c){this.cloneEvents(e,b);
}}else{if(c[d]){c[d].keys.each(function(f){this.addEvent(d,f);},this);}}return this;}});Element.NativeEvents={click:2,dblclick:2,mouseup:2,mousedown:2,contextmenu:2,mousewheel:2,DOMMouseScroll:2,mouseover:2,mouseout:2,mousemove:2,selectstart:2,selectend:2,keydown:2,keypress:2,keyup:2,orientationchange:2,touchstart:2,touchmove:2,touchend:2,touchcancel:2,gesturestart:2,gesturechange:2,gestureend:2,focus:2,blur:2,change:2,reset:2,select:2,submit:2,load:2,unload:1,beforeunload:2,resize:1,move:1,DOMContentLoaded:1,readystatechange:1,error:1,abort:1,scroll:1};
var a=function(b){var c=b.relatedTarget;if(c==null){return true;}if(!c){return false;}return(c!=this&&c.prefix!="xul"&&typeOf(this)!="document"&&!this.contains(c));
};Element.Events={mouseenter:{base:"mouseover",condition:a},mouseleave:{base:"mouseout",condition:a},mousewheel:{base:(Browser.firefox)?"DOMMouseScroll":"mousewheel"}};
})();(function(i,k){var l,f,e=[],c,b,d=k.createElement("div");var g=function(){clearTimeout(b);if(l){return;}Browser.loaded=l=true;k.removeListener("DOMContentLoaded",g).removeListener("readystatechange",a);
k.fireEvent("domready");i.fireEvent("domready");};var a=function(){for(var m=e.length;m--;){if(e[m]()){g();return true;}}return false;};var j=function(){clearTimeout(b);
if(!a()){b=setTimeout(j,10);}};k.addListener("DOMContentLoaded",g);var h=function(){try{d.doScroll();return true;}catch(m){}return false;};if(d.doScroll&&!h()){e.push(h);
c=true;}if(k.readyState){e.push(function(){var m=k.readyState;return(m=="loaded"||m=="complete");});}if("onreadystatechange" in k){k.addListener("readystatechange",a);
}else{c=true;}if(c){j();}Element.Events.domready={onAdd:function(m){if(l){m.call(this);}}};Element.Events.load={base:"load",onAdd:function(m){if(f&&this==i){m.call(this);
}},condition:function(){if(this==i){g();delete Element.Events.load;}return true;}};i.addEvent("load",function(){f=true;});})(window,document);(function(){var Swiff=this.Swiff=new Class({Implements:Options,options:{id:null,height:1,width:1,container:null,properties:{},params:{quality:"high",allowScriptAccess:"always",wMode:"window",swLiveConnect:true},callBacks:{},vars:{}},toElement:function(){return this.object;
},initialize:function(path,options){this.instance="Swiff_"+String.uniqueID();this.setOptions(options);options=this.options;var id=this.id=options.id||this.instance;
var container=document.id(options.container);Swiff.CallBacks[this.instance]={};var params=options.params,vars=options.vars,callBacks=options.callBacks;
var properties=Object.append({height:options.height,width:options.width},options.properties);var self=this;for(var callBack in callBacks){Swiff.CallBacks[this.instance][callBack]=(function(option){return function(){return option.apply(self.object,arguments);
};})(callBacks[callBack]);vars[callBack]="Swiff.CallBacks."+this.instance+"."+callBack;}params.flashVars=Object.toQueryString(vars);if(Browser.ie){properties.classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000";
params.movie=path;}else{properties.type="application/x-shockwave-flash";}properties.data=path;var build='<object id="'+id+'"';for(var property in properties){build+=" "+property+'="'+properties[property]+'"';
}build+=">";for(var param in params){if(params[param]){build+='<param name="'+param+'" value="'+params[param]+'" />';}}build+="</object>";this.object=((container)?container.empty():new Element("div")).set("html",build).firstChild;
},replaces:function(element){element=document.id(element,true);element.parentNode.replaceChild(this.toElement(),element);return this;},inject:function(element){document.id(element,true).appendChild(this.toElement());
return this;},remote:function(){return Swiff.remote.apply(Swiff,[this.toElement()].append(arguments));}});Swiff.CallBacks={};Swiff.remote=function(obj,fn){var rs=obj.CallFunction('<invoke name="'+fn+'" returntype="javascript">'+__flash__argumentsToXML(arguments,2)+"</invoke>");
return eval(rs);};})();
// MooTools: the javascript framework.
// Load this file's selection again by visiting: http://mootools.net/more/1b84f78e3952c74d74d3e2d3be481364 
// Or build this file again with packager using: packager build More/Fx.Scroll
/*
---
copyrights:
  - [MooTools](http://mootools.net)

licenses:
  - [MIT License](http://mootools.net/license.txt)
...
*/
MooTools.More={version:"1.3.2.1",build:"e586bcd2496e9b22acfde32e12f84d49ce09e59d"};(function(){Fx.Scroll=new Class({Extends:Fx,options:{offset:{x:0,y:0},wheelStops:true},initialize:function(c,b){this.element=this.subject=document.id(c);
this.parent(b);if(typeOf(this.element)!="element"){this.element=document.id(this.element.getDocument().body);}if(this.options.wheelStops){var d=this.element,e=this.cancel.pass(false,this);
this.addEvent("start",function(){d.addEvent("mousewheel",e);},true);this.addEvent("complete",function(){d.removeEvent("mousewheel",e);},true);}},set:function(){var b=Array.flatten(arguments);
if(Browser.firefox){b=[Math.round(b[0]),Math.round(b[1])];}this.element.scrollTo(b[0],b[1]);return this;},compute:function(d,c,b){return[0,1].map(function(e){return Fx.compute(d[e],c[e],b);
});},start:function(c,d){if(!this.check(c,d)){return this;}var b=this.element.getScroll();return this.parent([b.x,b.y],[c,d]);},calculateScroll:function(g,f){var d=this.element,b=d.getScrollSize(),h=d.getScroll(),j=d.getSize(),c=this.options.offset,i={x:g,y:f};
for(var e in i){if(!i[e]&&i[e]!==0){i[e]=h[e];}if(typeOf(i[e])!="number"){i[e]=b[e]-j[e];}i[e]+=c[e];}return[i.x,i.y];},toTop:function(){return this.start.apply(this,this.calculateScroll(false,0));
},toLeft:function(){return this.start.apply(this,this.calculateScroll(0,false));},toRight:function(){return this.start.apply(this,this.calculateScroll("right",false));
},toBottom:function(){return this.start.apply(this,this.calculateScroll(false,"bottom"));},toElement:function(d,e){e=e?Array.from(e):["x","y"];var c=a(this.element)?{x:0,y:0}:this.element.getScroll();
var b=Object.map(document.id(d).getPosition(this.element),function(g,f){return e.contains(f)?g+c[f]:false;});return this.start.apply(this,this.calculateScroll(b.x,b.y));
},toElementEdge:function(d,g,e){g=g?Array.from(g):["x","y"];d=document.id(d);var i={},f=d.getPosition(this.element),j=d.getSize(),h=this.element.getScroll(),b=this.element.getSize(),c={x:f.x+j.x,y:f.y+j.y};
["x","y"].each(function(k){if(g.contains(k)){if(c[k]>h[k]+b[k]){i[k]=c[k]-b[k];}if(f[k]<h[k]){i[k]=f[k];}}if(i[k]==null){i[k]=h[k];}if(e&&e[k]){i[k]=i[k]+e[k];
}},this);if(i.x!=h.x||i.y!=h.y){this.start(i.x,i.y);}return this;},toElementCenter:function(e,f,h){f=f?Array.from(f):["x","y"];e=document.id(e);var i={},c=e.getPosition(this.element),d=e.getSize(),b=this.element.getScroll(),g=this.element.getSize();
["x","y"].each(function(j){if(f.contains(j)){i[j]=c[j]-(g[j]-d[j])/2;}if(i[j]==null){i[j]=b[j];}if(h&&h[j]){i[j]=i[j]+h[j];}},this);if(i.x!=b.x||i.y!=b.y){this.start(i.x,i.y);
}return this;}});function a(b){return(/^(?:body|html)$/i).test(b.tagName);}})();
var RIA={};
var FB = null;
var Log = {
	info: function(msg) {
		if(window.console && console.log && msg) {
			console.log(msg);
		}
	},
	error: function(errorObject) {
		/* 
		* 	errorObject : {
		* 		method[String]: "MyClass : myFunction()" (example) string to help you identify which js file and function caused the error
		* 		error:[Object]: the error object
		* 	}
		*/
		if (errorObject.error instanceof TypeError) {
			this.info("JS ERROR : "+(errorObject.method||'Unknown method')+" : TypeError; the type of a variable is not as expected : "+(errorObject.error.message||errorObject.error));
		} else if (errorObject.error instanceof RangeError) {
			this.info("JS ERROR : "+(errorObject.method||'Unknown method')+" : RangeError; numeric variable has exceeded its allowed range : "+(errorObject.error.message||errorObject.error));
		} else if (errorObject.error instanceof SyntaxError) {
			this.info("JS ERROR : "+(errorObject.method||'Unknown method')+" : SyntaxError; syntax error occurred while parsing : "+(errorObject.error.message||errorObject.error));
		} else if (errorObject.error instanceof ReferenceError) {
			this.info("JS ERROR : "+(errorObject.method||'Unknown method')+" : ReferenceError; invalid reference used : "+(errorObject.error.message||errorObject.error));
		} else {
			this.info("JS ERROR : "+(errorObject.method||'Unknown method')+" : Unidentified Error Type : "+(errorObject.error.message||errorObject.error));
		}
	}
};
RIA.Facebook = new Class({
	generateLike: function(article) {
		/*
		*	@description:
		*		Generate a Facebook Like Button (once only) for an Article	
		*/
		
		var id = article.get("id"), 
		l = document.id(document.createElement("fb:like")), 
		c = new Element("span", {"class":"facebook-like"}), 
		u = article.get("data-url"),
		s = article.getElement(".social");

		l.set({
			"href":u,
			"layout":"button_count",
			"show_faces":"false",
			"send":"true",
			"width":150,
			"height":80,
			"font":"arial",
			"ref":"a-to-z-mcdonalds-"+id
		}).inject(c);

		c.inject(s,"bottom");
	
		/*
		*	Generate the FB Like button
		*/
		if(FB) FB.XFBML.parse(c);

		id = l = c = u = s = null;

	},
	initFacebook: function() {
		/*
		*	Hook from Facebook's fbAsyncInit function. Fired once the FB library has loaded
		*/
		FB.Event.subscribe('edge.create', this.eventEdgeCreate.bind(this));
		FB.Event.subscribe('edge.remove', this.eventEdgeRemove.bind(this));
		FB.Event.subscribe('message.send', this.eventMessageSend.bind(this));
	},
	eventEdgeCreate: function(href, widget) {
		/*
		*	@description:
		*		Method hook from Facebook Like action (edge.create).
		*/
		_gaq.push(['_trackEvent', 'Facebook', 'Like', href, null]);
	},
	eventEdgeRemove: function(href, widget) {
		/*
		*	@description:
		*		Method hook from Facebook Unlike action (edge.remove).
		*/
		_gaq.push(['_trackEvent', 'Facebook', 'Unlike', href, null]);
	},
	eventMessageSend: function(href, widget) {
		/*
		*	@description:
		*		Method hook from Facebook Send action (message.send).
		*/
		_gaq.push(['_trackEvent', 'Facebook', 'Message', href, null]);
	}
});
RIA.Twitter = new Class({
	generateTweet: function(article) {
		/*
		*	@description:
		*		Generate a custom Twitter Tweet Button (once only) for an Article, that we can track with Google Analytics.
		*		Note that the RIA custom HTML version will already exist in the page for every article, we just need to create the event listener and adjust some data
		*/
		try {
			var tb = article.getElement(".tweet-button a"), 
			url = "http://twitter.com/share?_="+new Date().getTime()+"&count=none&original_referrer="+encodeURIComponent(window.location.href)+"&lang=en&text="+encodeURIComponent(tb.get("data-tweet"))+"&url="+encodeURIComponent(tb.get("data-url"));
			tb.set("href", url).addEvent("click", this.eventTweet.bind(this));		
			tb = url = null;
		} catch(e) {
			Log.error({message:"RIA.Twitter : generateTweet()", error:e});
		}
	},
	eventTweet: function(e) {
		/*
		*	@description:
		*		Method hook from Twitter Tweet LAUNCH BUTTON action
		*/
		try {
			e.preventDefault();		
			var t = e.targetTouches ? e.targetTouches[0].target : e.target, 
			u = t.get("data-url"),
			w = 550,
			h = 450,
			l = Math.round((this.viewport.x / 2)-(w/2)),
			n=window.open(t.get("href"),"twitter_tweet","left="+l+",top=0,width="+w+",height="+h+",personalbar=0,toolbar=0,scrollbars=1,resizable=1");
			if(n) n.focus();
		
			_gaq.push(['_trackEvent', 'Twitter', 'Tweet', u, null]);
		
			t = u = w = h = l = n = null;
		} catch(e) {
			Log.error({method:"eventTweet()", error:e});
		}
	}
});
RIA.EventListeners = new Class({
	addEventListeners: function() {
		/*
		*	@description:
		*		Add all event listeners
		*/
		// Add mouse window resize event listener
		window.addEvent("resize", this.onWindowResize.bind(this));
		
		// Add mouse & touch navigation event listener, only if we are not on an Alphabet Fact page
		if(!this.options.alpha || this.options.alpha == "") {
			this.navPanel.getElements("a").addEvents({
				"click":this.pointerEvent.bind(this),
				"touchstart":this.pointerEvent.bind(this)
			});
		}
		
		document.id("close").addEvents({
			"click":this.closeMovie.bind(this),
			"touchstart":this.closeMovie.bind(this)
		});
		
		// Add keyboard navigation event listener
		document.addEvent("keyup", this.keyboardUp.bind(this));
		
		this.addKeyboardEventListeners();
		
		// Add document scroll event listener
		this.addScrollEventListener();
		
		this.loadEventBind = this.loadEvent.bind(this)
		window.addEvent("load", this.loadEventBind);

		this.addMovieEventListener();
		
	},
	loadEvent: function() {
		/*
		this.articles.each(function(article) {
			this.articleImages[article.get("id")] = this.createImage(article);
		},this);
		*/
		this.loadMovie();
		window.removeEvent("load", this.loadEventBind);
	},
	addKeyboardEventListeners: function() {
		/*
		*	@description:
		*		Add keyboard event listeners
		*/
		this.keyboardBind = this.keyboardEvent.bind(this);
		document.addEvent("keydown", this.keyboardBind);
	},
	removeKeyboardEventListeners: function() {
		/*
		*	@description:
		*		Remove keyboard event listeners
		*/
		document.removeEvent("keydown", this.keyboardBind);
		
	},
	addScrollEventListener: function() {
		/*
		*	@description:
		*		The scroll event listener is separated as we need to disable the onScroll event whilst scrolling to an element. Otherwise we'll constantly be checking content as we scroll
		*/
		this.getContentBind = this.getContentInViewport.bind(this);
		window.addEvent("scroll", this.getContentBind);
	},
	removeScrollEventListener: function() {
		/*
		*	@description:
		*		The scroll event listener is separated as we need to disable the onScroll event whilst scrolling to an element. Otherwise we'll constantly be checking content as we scroll
		*/
		window.removeEvent("scroll", this.getContentBind);
	},
	addPinNavEventListener: function() {
		/*
		*	@description:
		*		Evaluate the Nav Panel pinned position regardless of scroll of Fx.Scroll.
		*		Add this event only whilst we are using Fx.Scroll, and remove onComplete
		*/
		this.pinNavPanelBind = this.pinNavPanel.bind(this);
		window.addEvent("scroll", this.pinNavPanelBind);
	},
	removePinNavEventListener: function() {
		/*
		*	@description:
		*		Evaluate the Nav Panel pinned position regardless of scroll of Fx.Scroll.
		*		Add this event only whilst we are using Fx.Scroll, and remove onComplete
		*/
		window.removeEvent("scroll", this.pinNavPanelBind);
	},
	pointerEvent: function(e) {
		/*
		*	@description:
		*		Add mouse and touch (iOS) event listeners	
		*/
		e.preventDefault();
		var t = e.targetTouches ? e.targetTouches[0].target : e.target, c = null;
		if(t.nodeName == "#text") {
			t = t.parentNode;
		}
		c = t.get("data-category");
		if(c) {
			this.filter(c, e.type);
		}
		t = c = null;
	},
	keyboardEvent: function(e) {
		/*
		*	@description:
		*		Handle keyboard navigation.
		*	@conditions:
		*		This should only be available if we are in the "all" view, i.e. not just a single article selected. We determine this by checking to see if the 'alpha' option is available or not
		*		Only allow keyboard interaction if the command buttons are not in use
		*/
		this.removeKeyboardEventListeners();
		if(!e.control && !e.shift && !e.meta && !this.options.alpha) {
			this.filter(e.key, e.type);
		}
	},
	keyboardUp: function() {
		this.addKeyboardEventListeners();
	},
	onWindowResize: function() {
		/*
		*	@description:
		*		Callback from the window onResize event listener
		*/	
		this.getContentInViewport();
		if(this.mask) {
			this.mask.setStyles({"width":this.viewport.x+"px"});
		}
		if(this.movieContainer && this.options.movie.inView) {
			var leftPos = (this.viewport.x - this.shellWidth) < 0 ? 0 : (this.viewport.x - this.shellWidth)/2;
			this.movieContainer.setStyle("left",leftPos+"px");
		}
	}
});
/*
*	Global function callback from YouTube Player
*/
function onYouTubePlayerReady(ytplayer) {
	if(RIA.Campaign) {
		RIA.Campaign.onYouTubePlayerReady(ytplayer);
	}	
}

/*
*	Global function callback from YouTube Player
*/
function onytplayerStateChange(newState) {
	if(RIA.Campaign) {
		RIA.Campaign.onytplayerStateChange(newState);
	}
}

/*
*	Global function callback from YouTube Player
*/
function onPlaybackQualityChange(quality) {
	if(RIA.Campaign) {
		RIA.Campaign.onPlaybackQualityChange(quality);
	}
}

RIA.Movie = new Class({
	options:{
		youtube:{
			states:{
				"-1":"Unstarted",
				"0":"Ended",
				"1":"Playing",
				"2":"Paused"
				//,"3":"Buffering",
				//"5":"Video cued"
			},
			quality:{
				"small":"Small", 
				"medium":"Medium",
				"large":"Large",
				"hd720":"HD720",
				"hd1080":"HD1080",
				"highres":"High res"
			}
		}
	},
	loadMovie: function() {
		try {
			if(!Browser.Platform.ios && Browser.Plugins.Flash.version <= 0) return;
			
			this.movie = new Swiff(this.movieContainer.get("data-movie"), {
				container:this.movieSWFContainer,
				id:"movie-swf",
				width:630,
				height:385, // 360 + 25px for the controls
				params:{
					"movie":this.movieContainer.get("data-movie"),
					"allowfullscreen":"true"
				}
			});
		
			this.movieSWF = document.id("movie-swf");
		} catch(e) {
			Log.error({method:"RIA.Movie : loadMovie()", error:e});
		}		
	},
	closeMovie: function() {
		/*
		*	@description:
		*		
		*/
		this.addKeyboardEventListeners();			
		/*
		*	If the video is currently in play or buffering, pause it
		*/
		if(this.movieSWF && this.movieSWF.pauseVideo && this.movieSWF.getPlayerState) {
			var playerState = this.movieSWF.getPlayerState()||-2;
			if(playerState == 1 || playerState == 3) {
				this.movieSWF.pauseVideo();
			}
		} else {
			//Log.info("Movie.pauseVideo is not supported, or player state was "+this.options.youtube.states[playerState]);
		}
		this.movieContainer.setStyle("visibility","hidden");
		if(Browser.Platform.ios) {
			(function() {
				this.mask.setStyles({opacity:"0"});
			}.bind(this)).delay(500)
			this.doMovieContainer(false);				
		} else {
			this.mask.morph({opacity:"0"});					
		}
		playerState = null;
	},
	createMask: function() {
		try {
			this.removeKeyboardEventListeners();
			
			if(!this.mask) {
				this.mask = document.id("mask");
				this.mask.set({
					'class': 'mask',
					'id': 'mask',
					"styles":{
						"opacity":0,
						"width":this.viewport.x+"px"
					},
					events: {
						"click": function(e){
							e.preventDefault();
							this.closeMovie();
						}.bind(this),
						"touchstart": function(e){
							e.preventDefault();
							this.closeMovie();
						}.bind(this)
					},
					"morph":{
						fps:100,
						duration:200,
						onComplete: function(mask) {
							/*
							*	Browser.Platform.ios will not run this
							*/
							if(mask.getStyle("opacity") > 0) {
								this.doMovieContainer(true);
							} else {
								this.doMovieContainer(false);
							}
						}.bind(this)
					}
				});

			}	
			
			if(Browser.Platform.ios) {
				/*
				*	[ST] there's a bug when repeatedly opening and closing the video (and mask) where the viewport.x appears to reset to zero, so check it
				*/
				if(this.viewport.x == 0) this.viewport.x = window.innerWidth;
				
				this.mask.setStyles({opacity:"0.7","width":this.viewport.x+"px"});
				(function() {
					this.doMovieContainer(true);
				}.bind(this)).delay(500);
			} else {
				this.mask.morph({opacity:"0.7","width":this.viewport.x+"px"});
			}
			
		} catch(e) {
			Log.error({method:"RIA.Movie : createMask()", error:e});
		}
	},
	doMovieContainer: function(show) {
		/*
		*	@description:
		*		Show/Hide the movie container
		*		If it's Apple iOS we have previously deleted the SWF from the hide action, so recreate it if it's a show action
		*/
		try {
			if(Browser.Platform.ios && show) {
				this.loadMovie();
			}
		
			if(this.movieContainer) {
				if(show) {
					this.options.movie.inView = true;
					var leftPos = (this.viewport.x - this.shellWidth) < 0 ? 0 : (this.viewport.x - this.shellWidth)/2;
					this.movieContainer.setStyle("left",leftPos+"px");
					this.movieContainer.setStyle("visibility","visible");
				} else {
					this.options.movie.inView = false;
					this.movieContainer.setStyle("left","-10000em");
					this.movieContainer.setStyle("visibility","hidden");
					/*
					*	The pause and getPlayerState methods do not work, so just bin it
					*/
					if(Browser.Platform.ios) {
						this.movieSWF.destroy();
					}
				}
			}
		} catch(e) {
			Log.error({method:"RIA.Movie : doMovieContainer()", error:e});
		}
	},
	trackYTSWF: function(action) {
		try {
			if(!action) return;
			var source = this.movieContainer ? this.movieContainer.get("data-movie") : "movie src unknown";
			_gaq.push(['_trackEvent', 'YouTubeSWFMovie', action, source, null]);
			source = null;
		} catch(e) {
			Log.error({method:"RIA.Movie : trackYTSWF()", error:e});
		}
	},
	onYouTubePlayerReady: function(playerId) {
		/*
		*	@description:
		*		Hook from YT onYouTubePlayerReady(playerId) method.
		*		Uses YouTube's API proprietary addEventListener method (http://code.google.com/apis/youtube/js_api_reference.html#Adding_event_listener)
		*/
		this.movieSWF.addEventListener("onStateChange", "onytplayerStateChange");
		this.movieSWF.addEventListener("onPlaybackQualityChange", "onPlaybackQualityChange");
		
		/*
		*	Only add the event listener to launch the overlay if the YouTube Player is ready
		*	This way, the link will act as a link to YouTube if Flash or HTML5 executions do not work on the device
		*/
		//this.addMovieEventListener();
	},
	onytplayerStateChange: function(newState) {
		/*
		*	@description:
		*		This event is fired whenever the player's state changes. 
		*	@arguments:
		*		Possible values are:
		*	 		unstarted (-1)
		*			ended (0)
		*			playing (1)
		*			paused (2)
		*			buffering (3)
		*			video cued (5).
		*		When the SWF is first loaded it will broadcast an unstarted (-1) event. 
		*		When the video is cued and ready to play it will broadcast a video cued event (5).
		*/
		try {
			if(this.options.youtube.states[newState]) {
				this.trackYTSWF(this.options.youtube.states[newState]);
			}
		} catch(e) {
			Log.error({method:"RIA.Movie : onytplayerStateChange()", error:e});
		}
	},
	onPlaybackQualityChange: function(newQuality) {
		/*
		*	Possible values are "small", "medium", "large", "hd720", "hd1080", and "highres".
		*/
		var quality = "Quality: "+this.options.youtube.quality[newQuality]||"Unknown quality";		
		this.trackYTSWF(quality);
		quality = null;
	},
	addMovieEventListener: function() {
		
		this.launchEventBind = this.launchEvent.bind(this);
		
		this.youtubeLink.addEvents({
			"click":this.launchEventBind,
			"touchstart":this.launchEventBind
		});
	},
	removeMovieEventListener: function() {
		this.youtubeLink.removeEvents({
			"click":this.launchEventBind,
			"touchstart":this.launchEventBind
		});
	},
	launchEvent: function(e) {
		e.preventDefault();
		this.createMask();
	}
});
/*
*	@description: 	The main Campaign Class
*	@version: 		3
*	@author: 		Stuart Thorne
*/
RIA.AZCampaign = new Class({
	Implements:[
		Options,
		RIA.Facebook,
		RIA.Twitter,
		RIA.EventListeners,
		RIA.Movie
	],
	options:{
		fxDuration:{
			desktop:200,
			ios:800
		},
		binaryGIF:"data:image/gif;base64,R0lGODlhAQABAPAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
		alpha:null,
		categories:null,
		category:null,
		eventTypes:{
			"touchstart":"Touch",
			"click":"Mouse",
			"keyup":"Keyboard"
		},
		movie:{
			inView:false
		}
	},
	initialize: function(options, init) {
		try {
			this.setOptions(options);
			
			document.getElement("body").addClass("js");
		
			this.articles = document.getElements("article");
			this.navPanel = document.id("navigation");
			this.shellWidth = document.id("shell").getWidth();
			this.headerH1 = document.getElement("h1");
			this.youtubeLink = document.id("youtube-link");
			this.movieContainer = document.id("movie");
			
			this.generateTweet(this.movieContainer);
			this.generateLike(this.movieContainer);
			
			this.movieSWFContainer = document.id("movie-container");
			this.navOffsetTop = this.navPanel.offsetTop;
			this.navAlphabetHeight = document.id("alphabet").getSize().y;
		
			// [ST]TODO: manual increase here, as the vertical offset doesn't quite prevent the bottom of fact content hidden beneath the top nav from being loaded
			this.scrollVerticalOffset = -50;//this.navPanel.getSize().y;
		
			this.headerH1Offset = this.headerH1.getSize().y;
		
			this.articleImages = new Object();
			
			
			
			
			this.getContentInViewport();
		
			this.scrollFx = new Fx.Scroll(window, {
				offset: {y: this.scrollVerticalOffset}, // the -y negative offset here means that the Article content won't scroll behind the navigation which is fixed to the top of the viewport
				duration:(Browser.Platform.ios ? this.options.fxDuration.ios : this.options.fxDuration.desktop),
				transition:"sine:in:out",
				link:"cancel", // linking is set to cancel, so that if a new scroll action is requested by the user any current scroll action is cancelled immediately
				onStart: function(e) {
					this.addPinNavEventListener();
					this.removeScrollEventListener();
				}.bind(this),
				onComplete: function(e) {
					this.getContentInViewport();
					this.addScrollEventListener();
					this.removePinNavEventListener();
				}.bind(this),
				onCancel: function(e) {
					this.getContentInViewport();
					this.addScrollEventListener();
					this.removePinNavEventListener();
				}.bind(this)
			});
		
			this.addEventListeners();
			//this.loadMovie();
			
		} catch(e) {
			if(Browser.ie) alert("initialize() error : "+e.message);
			Log.error({method:"RIA.AZCampaign v3 : initialize() : Error : ", error:e});	
		}
	},
	pinNavPanel: function(gotViewport) {
		/*
		*	@description:
		*		Pin the Nav Panel x coordinate, in case the window has been resized along the x axis
		*		Pin the Nav Panel y coordinate, in case the window has scrolled such that the H1 header is out of view
		*		[ST]TODO: we only need to call this function once, under 2 conditions; if the viewport.scrollTop is less than the H1 height when scrolling up, or vice versa
		*	@arguments:
		*		gotViewport[Boolean]: If this method has been called from getContentInViewport(), for example, we will have just got the viewport dimensions. 
		*			Therefore do not cause an unnecessary DOM lookup
		*/
		if(!gotViewport) {
			this.getViewport();
		}
		
		// [ST] TODO: we have a hard-coded pixel adjustment value here
		if(this.viewport.x > this.shellWidth) {
			this.navPanel.setStyle("left",((this.viewport.x - this.shellWidth) / 2)+"px");
		}
		
		if(this.scrollTop <= this.headerH1Offset) {
			if(Browser.Platform.ios) {
				this.setNavPositionForiOs(0);
			} else {
				this.navPanel.setStyle("top",this.headerH1Offset-this.scrollTop+"px");
			}

            this.navPanel.removeClass("scroll");
				
		}
		else if(this.scrollTop > this.headerH1Offset) {
			if(Browser.Platform.ios) {
				this.setNavPositionForiOs(112);
			} else {
				this.navPanel.setStyle("top","0px");
			}
			
			this.navPanel.addClass("scroll");
		}

	},
	getContentInViewport: function(eventObj) {
		/*
		*	@description:
		*		Establish which content is visible in the viewport		
		*/
		
		this.getViewport();
		
		var articleCoords;
		
		
		this.pinNavPanel(true);
		
		
		this.articles.each(function(article) {
			articleCoords = article.getCoordinates();
			// If the Article is not in the viewport... [ST]TODO: adjust the second condition for the top nav, as Fact article content bottom may be hidden behind the nav but considered "in view"
			if((articleCoords.top >= this.viewport.y+this.scrollTop) || (articleCoords.bottom <= (this.scrollTop+this.scrollVerticalOffset))) {
				article.store("inviewport",false);
			} else {
				/*
				*	If the Article is not recorded as being in the viewport, load the Article (once) and track it (once)
				*/

				if(!article.retrieve("inviewport") || article.retrieve("inviewport") == false) {
					article.store("inviewport",true);
					
					if(!article.retrieve("loaded") || article.retrieve("loaded") == false) {
						this.loadArticle(article);
						article.store("loaded",true);
					}
					/*
					*	MCDCOUK-1787[ST]: Do not track an additional page view when we are on a fact page, as it is duplication
					*/
					if(!this.options.alpha || this.options.alpha == "") {
						//Log.info("_trackPageview("+article.get("id")+"/scrolled)");
						_gaq.push(['_trackPageview', "/"+article.get("id")+"/scrolled"]);
					}
					
				}								
			}				
		},this);

		articleCoords = null;
	},
	loadArticle: function(article) {
		/*
		*	@description:
		*		Load an Article
		*/
		var i = null, 
		s, 
		w, 
		h, 
		a, 
		ic = article.getElement(".content-image"),
		ib;
		
		if(ic) { 
			
			s = ic.get("data-main-src"),
			w = ic.get("data-main-width"),
			h = ic.get("data-main-height"),
			a = ic.get("data-alt"),
			ib = ic.getElement(".image-bg");
			ic.adopt(this.createImage(article));
			
			//ic.adopt(this.articleImages[article.get("id")]);
		}	
		
		
		this.generateTweet(article);
	
		
		c = ic = ib = i = s = w = h = a = null;
	},
	createImage: function(article) {
		var ic = article.getElement(".content-image"),
		s = ic.get("data-main-src"),
		w = ic.get("data-main-width"),
		h = ic.get("data-main-height"),
		a = ic.get("data-alt"),
		i = null;
		
		
		return i = new Element("img", {
			"src":s,
			"width":w,
			"height":h,
			"alt":a,
			events:{
				"load": this.loadImage.pass([article],this)
			}
		});
		
	},
	loadImage: function(article) {
		try {
			var ib = article.getElement(".image-bg"), ic = article.getElement(".content-image");

			ib.removeClass("loading");		
		    if(!Browser.ie) {
				if(Browser.Platform.ios) {
					/*
					*	[ST]TODO: the webkit fade is killing iPad and iPhone browser instances. Try deleting the element after the fade transition?
					*/
					//ib.addClass("-webkit-fade-out");
					ib.destroy();
				} else {
					ib.set("morph", {fps:100, duration:200, onComplete: function() {
						this.generateLike(article);
					}.bind(this)});
					ib.morph({"opacity":0});							
				}				
			} else {
				ib.set("morph", {fps:100, duration:200, onComplete: function(){
					this.generateLike(article);
				}.bind(this)});
				ib.morph({"opacity":0});	
				
			}

			

		} catch(e) {
			Log.error({method:"loadImage()", error:e});
		}
	},
	filter: function(filter, eventType) {
		/*
		*	@description:
		*		Check to see if we have a category that matches the required filter
		*		Else check to see if we have an article that matches the required filter
		*/
		if(!filter) return;
		var element = document.id(filter);
		if(element) {
			this.scrollToArticle(element, eventType);
		}
		element = null;
	},
	scrollToArticle: function(article, eventType) {
		/*
		*	@description:
		*		If the selected Alpha exists, scroll to it's top coordinate
		*/

		var articleId = article.get("id"), articleCoords;
	
		/*
		*	Now get the Element Position, in case we have removed any CSS classes for filtered out content in filterInAll()
		*/
		articleCoords = article.getCoordinates();
	
		/*
		*	Reset the Fx.Transition duration in case the chain has been cancelled and we are starting a new scroll
		*/
		this.scrollFx.options.duration = (Browser.Platform.ios ? this.options.fxDuration.ios : this.options.fxDuration.desktop);
		if(articleCoords.top < this.scrollTop) {
			this.scrollFx.options.duration += Math.floor(Math.PI*((this.scrollTop - articleCoords.top)/10));
		} else {
			this.scrollFx.options.duration += Math.floor(Math.PI*((articleCoords.top - this.scrollTop)/10));
		}
		/*
		*	Scroll to the selected Alphabet Fact article
		*	If scrolling to "A", just go straight to the top of the Window
		*/
		if(article.get("id") == "a") {
			this.scrollFx.stop().toTop();
		} else {
			this.scrollFx.stop().toElement(articleId, 'y');	
		}
	
		_gaq.push(['_trackEvent', 'AlphabetNavigation', (this.options.eventTypes[eventType]||"Select"), articleId.toUpperCase(), null]);
			
		articleId = articleCoords = null;
	},
	setNavPositionForiOs: function(top) {
		/*
		*	@description:
		*		For Apple iOS (Safari Webkit) only, reset the position of the navigation using webkitTransform
		*/

		if(!Browser.Platform.ios) return;
		this.navPanel.style.webkitTransform = "translateY("+(this.scrollTop-top)+"px)";
	},
	getViewport: function() {
		try {
			this.viewport = window.getSize();
			this.scrollTop = window.getScroll().y;
			if(Browser.Platform.ios) { //&& window.devicePixelRatio != "undefined" && window.devicePixelRatio >= 2 ) {
				this.viewport.x = window.innerWidth;
				this.viewport.y = window.innerHeight
			}
		} catch(e) {
			Log.error({method:"getViewport()", error:e});
		}
	},
	preloadImages: function() {
		
	}
});
