/**
 + ------------------------------------------------ +
 + By: Ferris
 + QQ: 21314130
 + ------------------------------------------------ +
 + Date: 2012-02-22
 + ------------------------------------------------ +
**/
var fgm = {};

fgm.$ = function(id) {
	return typeof id === "object" ? id : document.getElementById(id)
};

fgm.$$ = function(tagName, oParent) {
	return (oParent || document).getElementsByTagName(tagName)
};

fgm.$$$ = function(className, tagName, oParent) {
	var reg = new RegExp("(^|\\s)" + className + "(\\s|$)"),
		aEl = fgm.$$(tagName || "*", oParent)
		len = aEl.length,
		aClass = [],
		i = 0;
	for(;i < len; i++) reg.test(aEl[i].className) && aClass.push(aEl[i]);
	return aClass
};

fgm.index = function(element) {
	var aChild = element.parentNode.children;
	for(var i = aChild.length; i--;)
		if(element == aChild[i]) return i
};

fgm.css = function(element, attr, value) {
	if(arguments.length == 2) {
		var style = element.style,
			currentStyle = element.currentStyle;
		if(typeof attr === "string")
			return parseFloat(currentStyle ? currentStyle[attr] : getComputedStyle(element, null)[attr]) || 0
		for(var property in attr)
			property == "opacity" ? (style.filter = "alpha(opacity=" + attr[property] + ")", style.opacity = attr[property] / 100) : style[property] = attr[property]		
	}
	else if(arguments.length == 3) {
		switch(attr) {
			case "width":
			case "height":
			case "paddingTop":
			case "paddingRight":
			case "paddingBottom":
			case "paddingLeft":
				value = Math.max(value, 0);
			case "top":
			case "right":
			case "bottom":
			case "left":
			case "marginTop":
			case "marginRigth":
			case "marginBottom":
			case "marginLeft":	
				element.style[attr] = value + "px";
				break;
			case "opacity":
				element.style.filter = "alpha(opacity=" + value + ")";
				element.style.opacity = value / 100;
				break;
			default:
				element.style[attr] = value
		}
	}
};

fgm.contains = function(element, oParent) {
	if(oParent.contains) {
		return oParent.contains(element)	
	}
	else if(oParent.compareDocumentPosition) {
		return !!(oParent.compareDocumentPosition(element) & 16)
	}
};

fgm.isParent = function(element, tagName) {
	while(element != undefined && element != null && element.tagName.toUpperCase() !== "BODY") {
		if(element.tagName.toUpperCase() == tagName.toUpperCase())
			return element;
		element = element.parentNode;	
	}
	return false
};

fgm.extend = function(destination, source) {
	for (var property in source) destination[property] = source[property];
	return destination
};

fgm.animate = function(obj, json, opt) {
	clearInterval(obj.timer);
	obj.iSpeed = 0;
	opt = fgm.extend({
		type: "buffer",
		callback: function() {}
	}, opt);
	obj.timer = setInterval(function() {
		var iCur = 0,
			complete = !0,
			property = null,
			maxSpeed = 30;
		for(property in json) {
			iCur = fgm.css(obj, property);
			property == "opacity" && (iCur = parseInt(iCur.toFixed(2) * 100));
			switch(opt.type) {
				case "buffer":
					obj.iSpeed = (json[property] - iCur) / 5;
					obj.iSpeed = obj.iSpeed > 0 ? Math.ceil(obj.iSpeed) : Math.floor(obj.iSpeed);
					json[property] == iCur || (complete = !1, fgm.css(obj, property, property == "zIndex" ? iCur + obj.iSpeed || iCur * -1 : iCur + obj.iSpeed));
					break;
				case "flex":
					obj.iSpeed += (json[property] - iCur) / 5;
					obj.iSpeed *= 0.7;
					obj.iSpeed = Math.abs(obj.iSpeed) > maxSpeed ? obj.iSpeed > 0 ? maxSpeed : -maxSpeed : obj.iSpeed;
					Math.abs(json[property] - iCur) <=1 && Math.abs(obj.iSpeed) <= 1 || (complete = !1, fgm.css(obj, property, iCur + obj.iSpeed));
					break;	
			}
		}
		if(complete) {
			clearInterval(obj.timer);
			if(opt.type == "flex") for(property in json) fgm.css(obj, property, json[property]);
			opt.callback.apply(obj, arguments);	
		}		
	}, 30)	
};

fgm.fireClick = function(element) {
	if (/(chrome)|(firefox)/i.test(navigator.userAgent)) {
		var oEvent = document.createEvent("MouseEvents");
		oEvent.initMouseEvent("click", true, true, document.defaultView, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		element.dispatchEvent(oEvent)
	} else if (/safari/i.test(navigator.userAgent)) {
		var oEvent = document.createEvent("UIEvents");
		oEvent.initEvent("click", true, true);
		element.dispatchEvent(oEvent)
	} else {
		element.click()
	}
};

//焦点图构造函数
function Google() {
	this.aImg   = [];
	this.aLi    = [];
	this.aPos   = [];
	this.oList  = document.createElement("div");
	this.oUl    = document.createElement("ul");
	this.zIndex = 10;
	this.iQueue = 0;
	this.init.apply(this, arguments)
}
Google.prototype = {
	init: function(id, data) {
		this.oBox = typeof id === "string" ? document.getElementById(id) : id;
		this.oBox.className = "google";
		this._create(data);	
		this._layout();
		this._addEvent();
	},
	_create: function(data) {
		var oImgFrag = document.createDocumentFragment();
		var oLiFrag  = document.createDocumentFragment();
		for(var i = 0, len = data.length, aResult = []; i < len; i++) {
			var oImg = new Image();
			var oLi = document.createElement("li");
			oLi.innerHTML = '<img src="'+ data[i].img.replace(/(\d+)/g, "$1_") +'" /><div><h5>'+ data[i].tit +'</h5><a href="'+ data[i].url +'">开始玩</a></div>'
			oImg.src = data[i].img;
			this.aImg.push(oImg);
			this.aLi.push(oLi);
			oImgFrag.appendChild(oImg);
			oLiFrag.appendChild(oLi)
		}
		this.oUl.style.width = this.oBox.offsetWidth - 354 + (this.aLi.length - 9) * 46 + "px";
		this.oList.className = "list";
		this.oList.appendChild(oImgFrag);
		this.oUl.appendChild(oLiFrag);
		this.oBox.appendChild(this.oList);
		this.oBox.appendChild(this.oUl)
	},
	_layout: function() {
		for(var i = this.aLi.length; i--;) {
			this.aLi[i].index = i;
			this.aLi[i].style.top  = this.aLi[i].offsetTop + "px";
			this.aPos[i] = this.aLi[i].style.left = this.aLi[i].offsetLeft + "px";
		}
		for(var i = this.aLi.length; i--;) this.aLi[i].style.position = "absolute"
	},
	_addEvent: function() {
		var that = this;
		this.oUl.onclick = this.oUl.onmouseover = function(e) {
			if(that.iQueue > 0) return;
			e = e || event;
			var oTarget = e.target || e.srcElement;
			if(fgm.contains(oTarget, this) && fgm.isParent(oTarget, "li")) {
				var oLi = fgm.isParent(oTarget, "li");
				var oH5 = fgm.$$("h5", oLi)[0];
				if(oLi.className) return;
				switch(e.type) {
					case "click":
						oLi.active = true;
						var aLi   = fgm.$$("li", that.oUl);
						var oLast = that.oUl.children[aLi.length-1];
						var index = fgm.index(oLi);
						var oImg  = that.aImg[oLi.index];
						var timer = null;
						fgm.css(oLi, {zIndex: that.zIndex++});
						that.iQueue = (aLi.length - index - 1);
						if(oLast.className == "active") {
							fgm.$$("h5", oLast)[0].style.display = "none";
							oLast.className = "";						
							fgm.animate(oLast, {left: -100}, {
								callback: function() {									
									oLast.style.top = 0;
									oLast.style.left = that.aPos[that.aPos.length - 1];
									oLast.style.width = "32px";
									oLast.style.height = "38px";
								}	
							})
						}
						
						that.oUl.insertBefore(oLi, that.oUl.firstChild);
						fgm.css(oImg, {zIndex: that.zIndex++, opacity: 0});
						fgm.animate(oImg, {opacity: 100});
						oH5.style.display = "none";
											
						fgm.animate(oLi, {
							top:    -49,
							left:   10,
							width:  70,
							height: 84
						}, {
							callback: function() {
								var oLi = this;
								this.className = "active";
								oH5.style.display = "block";
								timer = setInterval(function() {
									fgm.animate(aLi[++index], {
										left:parseInt(that.aPos[index-1])
									}, {
										callback: function() {
											that.iQueue--	
									}
									});
									if(index >= aLi.length - 1) {
										clearInterval(timer);
										that.oUl.appendChild(oLi);
										oLi.active = !1;
									}
								}, 100);					
							}	
						});
						break;
					case "mouseover":
						fgm.css(oH5 , "display", "block");
						fgm.animate(oLi, {top: -10});
						oLi.onmouseout = function() {
							if(!oLi.active && !that.iQueue)	 {
								fgm.css(oH5, "display", "none");
								fgm.animate(oLi, {top: 0})	
							}
						}
						break;
				}	
			}
		}
	},
	showIndex: function(index) {
		var aLi = fgm.$$("li", this.oUl);
		fgm.fireClick(aLi[index]);
		return this
	},
	autoPlay: function(delay) {
		var that = this;
		this.showIndex(0);
		this._play(delay);
		this.oBox.onmouseover = this.oBox.onmouseout = function(e) {
			(e || event).type == "mouseover" ? clearInterval(this.timer) : that._play(delay)
		};
		return this	
	},
	_play: function(delay) {
		var that = this;
		this.oBox.timer = setInterval(function() {
			that.showIndex(0)
		}, delay || 3000);
	}
};
//图片加载构造函数
function Loading() {
	this.init.apply(this, arguments)	
}
Loading.prototype.init = function(id, aImg, handler) {
	var oCon 	  = fgm.$(id),
		oLayer 	  = fgm.$$$("overlay", "div", oCon)[0],
		oLoad 	  = fgm.$$$("load", "div", oLayer)[0],
		oSpan 	  = fgm.$$("span", oLoad)[0],
		oP 		  = fgm.$$("p", oLoad)[0],
		aData 	  = [],
		iImgCount = 0,
		iLoaded	  = 0;
	if(!oLayer || !oLoad || !oSpan || !oP) {
		handler();
		return	
	}
	for(i = 0, iImgCount = aImg.length; i < iImgCount; i++) {
		(function(i) {
			var oImg = new Image();
			oImg.onload = function() {
				oSpan.innerHTML = oP.style.width = Math.ceil(++iLoaded / iImgCount * 100) + "%";
				this.onload = null;					
				var aTmp = document.createElement("img");
				aTmp.src = this.src;
				aData[i] = aTmp;
				if(aData[i] && aData.length == iImgCount) {
					fgm.animate(oLayer, {opacity:0}, {
						callback: function() {
							fgm.css(this, {display:"none"});
							handler()						
						}
					});										
				}
			}
			oImg.src = aImg[i];
		})(i);		
	}
};