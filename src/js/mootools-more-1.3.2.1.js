// MooTools: the javascript framework.
// Load this file's selection again by visiting: http://mootools.net/more/caada5808f8e34d665cb2f8c17070bbc 
// Or build this file again with packager using: packager build More/Fx.Accordion More/Fx.Reveal More/Fx.Scroll
/*
---
copyrights:
  - [MooTools](http://mootools.net)

licenses:
  - [MIT License](http://mootools.net/license.txt)
...
*/
MooTools.More={version:"1.3.2.1",build:"e586bcd2496e9b22acfde32e12f84d49ce09e59d"};Fx.Elements=new Class({Extends:Fx.CSS,initialize:function(b,a){this.elements=this.subject=$$(b);
this.parent(a);},compute:function(g,h,j){var c={};for(var d in g){var a=g[d],e=h[d],f=c[d]={};for(var b in a){f[b]=this.parent(a[b],e[b],j);}}return c;
},set:function(b){for(var c in b){if(!this.elements[c]){continue;}var a=b[c];for(var d in a){this.render(this.elements[c],d,a[d],this.options.unit);}}return this;
},start:function(c){if(!this.check(c)){return this;}var h={},j={};for(var d in c){if(!this.elements[d]){continue;}var f=c[d],a=h[d]={},g=j[d]={};for(var b in f){var e=this.prepare(this.elements[d],b,f[b]);
a[b]=e.from;g[b]=e.to;}}return this.parent(h,j);}});Fx.Accordion=new Class({Extends:Fx.Elements,options:{fixedHeight:false,fixedWidth:false,display:0,show:false,height:true,width:false,opacity:true,alwaysHide:false,trigger:"click",initialDisplayFx:true,resetHeight:true},initialize:function(){var g=function(h){return h!=null;
};var f=Array.link(arguments,{container:Type.isElement,options:Type.isObject,togglers:g,elements:g});this.parent(f.elements,f.options);var b=this.options,e=this.togglers=$$(f.togglers);
this.previous=-1;this.internalChain=new Chain();if(b.alwaysHide){this.options.link="chain";}if(b.show||this.options.show===0){b.display=false;this.previous=b.show;
}if(b.start){b.display=false;b.show=false;}var d=this.effects={};if(b.opacity){d.opacity="fullOpacity";}if(b.width){d.width=b.fixedWidth?"fullWidth":"offsetWidth";
}if(b.height){d.height=b.fixedHeight?"fullHeight":"scrollHeight";}for(var c=0,a=e.length;c<a;c++){this.addSection(e[c],this.elements[c]);}this.elements.each(function(j,h){if(b.show===h){this.fireEvent("active",[e[h],j]);
}else{for(var k in d){j.setStyle(k,0);}}},this);if(b.display||b.display===0||b.initialDisplayFx===false){this.display(b.display,b.initialDisplayFx);}if(b.fixedHeight!==false){b.resetHeight=false;
}this.addEvent("complete",this.internalChain.callChain.bind(this.internalChain));},addSection:function(g,d){g=document.id(g);d=document.id(d);this.togglers.include(g);
this.elements.include(d);var f=this.togglers,c=this.options,h=f.contains(g),a=f.indexOf(g),b=this.display.pass(a,this);g.store("accordion:display",b).addEvent(c.trigger,b);
if(c.height){d.setStyles({"padding-top":0,"border-top":"none","padding-bottom":0,"border-bottom":"none"});}if(c.width){d.setStyles({"padding-left":0,"border-left":"none","padding-right":0,"border-right":"none"});
}d.fullOpacity=1;if(c.fixedWidth){d.fullWidth=c.fixedWidth;}if(c.fixedHeight){d.fullHeight=c.fixedHeight;}d.setStyle("overflow","hidden");if(!h){for(var e in this.effects){d.setStyle(e,0);
}}return this;},removeSection:function(f,b){var e=this.togglers,a=e.indexOf(f),c=this.elements[a];var d=function(){e.erase(f);this.elements.erase(c);this.detach(f);
}.bind(this);if(this.now==a||b!=null){this.display(b!=null?b:(a-1>=0?a-1:0)).chain(d);}else{d();}return this;},detach:function(b){var a=function(c){c.removeEvent(this.options.trigger,c.retrieve("accordion:display"));
}.bind(this);if(!b){this.togglers.each(a);}else{a(b);}return this;},display:function(b,c){if(!this.check(b,c)){return this;}var h={},g=this.elements,a=this.options,f=this.effects;
if(c==null){c=true;}if(typeOf(b)=="element"){b=g.indexOf(b);}if(b==this.previous&&!a.alwaysHide){return this;}if(a.resetHeight){var e=g[this.previous];
if(e&&!this.selfHidden){for(var d in f){e.setStyle(d,e[f[d]]);}}}if((this.timer&&a.link=="chain")||(b===this.previous&&!a.alwaysHide)){return this;}this.previous=b;
this.selfHidden=false;g.each(function(l,k){h[k]={};var j;if(k!=b){j=true;}else{if(a.alwaysHide&&((l.offsetHeight>0&&a.height)||l.offsetWidth>0&&a.width)){j=true;
this.selfHidden=true;}}this.fireEvent(j?"background":"active",[this.togglers[k],l]);for(var m in f){h[k][m]=j?0:l[f[m]];}if(!c&&!j&&a.resetHeight){h[k].height="auto";
}},this);this.internalChain.clearChain();this.internalChain.chain(function(){if(a.resetHeight&&!this.selfHidden){var i=g[b];if(i){i.setStyle("height","auto");
}}}.bind(this));return c?this.start(h):this.set(h).internalChain.callChain();}});Element.implement({isDisplayed:function(){return this.getStyle("display")!="none";
},isVisible:function(){var a=this.offsetWidth,b=this.offsetHeight;return(a==0&&b==0)?false:(a>0&&b>0)?true:this.style.display!="none";},toggle:function(){return this[this.isDisplayed()?"hide":"show"]();
},hide:function(){var b;try{b=this.getStyle("display");}catch(a){}if(b=="none"){return this;}return this.store("element:_originalDisplay",b||"").setStyle("display","none");
},show:function(a){if(!a&&this.isDisplayed()){return this;}a=a||this.retrieve("element:_originalDisplay")||"block";return this.setStyle("display",(a=="none")?"block":a);
},swapClass:function(a,b){return this.removeClass(a).addClass(b);}});Document.implement({clearSelection:function(){if(window.getSelection){var a=window.getSelection();
if(a&&a.removeAllRanges){a.removeAllRanges();}}else{if(document.selection&&document.selection.empty){try{document.selection.empty();}catch(b){}}}}});(function(){var b=function(e,d){var f=[];
Object.each(d,function(g){Object.each(g,function(h){e.each(function(i){f.push(i+"-"+h+(i=="border"?"-width":""));});});});return f;};var c=function(f,e){var d=0;
Object.each(e,function(h,g){if(g.test(f)){d=d+h.toInt();}});return d;};var a=function(d){return !!(!d||d.offsetHeight||d.offsetWidth);};Element.implement({measure:function(h){if(a(this)){return h.call(this);
}var g=this.getParent(),e=[];while(!a(g)&&g!=document.body){e.push(g.expose());g=g.getParent();}var f=this.expose(),d=h.call(this);f();e.each(function(i){i();
});return d;},expose:function(){if(this.getStyle("display")!="none"){return function(){};}var d=this.style.cssText;this.setStyles({display:"block",position:"absolute",visibility:"hidden"});
return function(){this.style.cssText=d;}.bind(this);},getDimensions:function(d){d=Object.merge({computeSize:false},d);var i={x:0,y:0};var h=function(j,e){return(e.computeSize)?j.getComputedSize(e):j.getSize();
};var f=this.getParent("body");if(f&&this.getStyle("display")=="none"){i=this.measure(function(){return h(this,d);});}else{if(f){try{i=h(this,d);}catch(g){}}}return Object.append(i,(i.x||i.x===0)?{width:i.x,height:i.y}:{x:i.width,y:i.height});
},getComputedSize:function(d){d=Object.merge({styles:["padding","border"],planes:{height:["top","bottom"],width:["left","right"]},mode:"both"},d);var g={},e={width:0,height:0},f;
if(d.mode=="vertical"){delete e.width;delete d.planes.width;}else{if(d.mode=="horizontal"){delete e.height;delete d.planes.height;}}b(d.styles,d.planes).each(function(h){g[h]=this.getStyle(h).toInt();
},this);Object.each(d.planes,function(i,h){var k=h.capitalize(),j=this.getStyle(h);if(j=="auto"&&!f){f=this.getDimensions();}j=g[h]=(j=="auto")?f[h]:j.toInt();
e["total"+k]=j;i.each(function(m){var l=c(m,g);e["computed"+m.capitalize()]=l;e["total"+k]+=l;});},this);return Object.append(e,g);}});})();(function(){var a=function(d){var b=d.options.hideInputs;
if(window.OverText){var c=[null];OverText.each(function(e){c.include("."+e.options.labelClass);});if(c){b+=c.join(", ");}}return(b)?d.element.getElements(b):null;
};Fx.Reveal=new Class({Extends:Fx.Morph,options:{link:"cancel",styles:["padding","border","margin"],transitionOpacity:!Browser.ie6,mode:"vertical",display:function(){return this.element.get("tag")!="tr"?"block":"table-row";
},opacity:1,hideInputs:Browser.ie?"select, input, textarea, object, embed":null},dissolve:function(){if(!this.hiding&&!this.showing){if(this.element.getStyle("display")!="none"){this.hiding=true;
this.showing=false;this.hidden=true;this.cssText=this.element.style.cssText;var d=this.element.getComputedSize({styles:this.options.styles,mode:this.options.mode});
if(this.options.transitionOpacity){d.opacity=this.options.opacity;}var c={};Object.each(d,function(f,e){c[e]=[f,0];});this.element.setStyles({display:Function.from(this.options.display).call(this),overflow:"hidden"});
var b=a(this);if(b){b.setStyle("visibility","hidden");}this.$chain.unshift(function(){if(this.hidden){this.hiding=false;this.element.style.cssText=this.cssText;
this.element.setStyle("display","none");if(b){b.setStyle("visibility","visible");}}this.fireEvent("hide",this.element);this.callChain();}.bind(this));this.start(c);
}else{this.callChain.delay(10,this);this.fireEvent("complete",this.element);this.fireEvent("hide",this.element);}}else{if(this.options.link=="chain"){this.chain(this.dissolve.bind(this));
}else{if(this.options.link=="cancel"&&!this.hiding){this.cancel();this.dissolve();}}}return this;},reveal:function(){if(!this.showing&&!this.hiding){if(this.element.getStyle("display")=="none"){this.hiding=false;
this.showing=true;this.hidden=false;this.cssText=this.element.style.cssText;var d;this.element.measure(function(){d=this.element.getComputedSize({styles:this.options.styles,mode:this.options.mode});
}.bind(this));if(this.options.heightOverride!=null){d.height=this.options.heightOverride.toInt();}if(this.options.widthOverride!=null){d.width=this.options.widthOverride.toInt();
}if(this.options.transitionOpacity){this.element.setStyle("opacity",0);d.opacity=this.options.opacity;}var c={height:0,display:Function.from(this.options.display).call(this)};
Object.each(d,function(f,e){c[e]=0;});c.overflow="hidden";this.element.setStyles(c);var b=a(this);if(b){b.setStyle("visibility","hidden");}this.$chain.unshift(function(){this.element.style.cssText=this.cssText;
this.element.setStyle("display",Function.from(this.options.display).call(this));if(!this.hidden){this.showing=false;}if(b){b.setStyle("visibility","visible");
}this.callChain();this.fireEvent("show",this.element);}.bind(this));this.start(d);}else{this.callChain();this.fireEvent("complete",this.element);this.fireEvent("show",this.element);
}}else{if(this.options.link=="chain"){this.chain(this.reveal.bind(this));}else{if(this.options.link=="cancel"&&!this.showing){this.cancel();this.reveal();
}}}return this;},toggle:function(){if(this.element.getStyle("display")=="none"){this.reveal();}else{this.dissolve();}return this;},cancel:function(){this.parent.apply(this,arguments);
if(this.cssText!=null){this.element.style.cssText=this.cssText;}this.hiding=false;this.showing=false;return this;}});Element.Properties.reveal={set:function(b){this.get("reveal").cancel().setOptions(b);
return this;},get:function(){var b=this.retrieve("reveal");if(!b){b=new Fx.Reveal(this);this.store("reveal",b);}return b;}};Element.Properties.dissolve=Element.Properties.reveal;
Element.implement({reveal:function(b){this.get("reveal").setOptions(b).reveal();return this;},dissolve:function(b){this.get("reveal").setOptions(b).dissolve();
return this;},nix:function(b){var c=Array.link(arguments,{destroy:Type.isBoolean,options:Type.isObject});this.get("reveal").setOptions(b).dissolve().chain(function(){this[c.destroy?"destroy":"dispose"]();
}.bind(this));return this;},wink:function(){var c=Array.link(arguments,{duration:Type.isNumber,options:Type.isObject});var b=this.get("reveal").setOptions(c.options);
b.reveal().chain(function(){(function(){b.dissolve();}).delay(c.duration||2000);});}});})();(function(){Fx.Scroll=new Class({Extends:Fx,options:{offset:{x:0,y:0},wheelStops:true},initialize:function(c,b){this.element=this.subject=document.id(c);
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