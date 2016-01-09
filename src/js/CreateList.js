function CreateList() {
	this.oWrap = document.createElement("div");
	this.copyright = document.createElement("div");
	this.initialize.apply(this, arguments);
	this.click.call(this)
}
CreateList.prototype = {
	initialize: function(aData) {		
		var oDl, oElem, project, i;
		while(aData[0]) {
			oDl = document.createElement("dl");
			project = aData[0].project;	
			for(i = 0; i < project.length; i++) {
				if(project[i].href) {
					oElem = document.createElement("dd");
					oElem.innerHTML = i + ") <a href=\"" + project[i].href + "\" target=\"_blank\">" + project[i].text + "</a>"
				}
				else {
					oElem = document.createElement("dt");
					oElem.innerHTML = project[i].text + " (" + (project.length - 1) + ")"	
				}
				oDl.appendChild(oElem);
				oDl.style.height = "31px"
			}
			this.oWrap.appendChild(oDl);
			aData.shift()
		}
		this.oWrap.id = "wrap";
		this.copyright.id = "copyright";
		this.copyright.innerHTML = "By &mdash; Ferris";
		document.body.appendChild(this.oWrap);
		document.body.appendChild(this.copyright)
	},
	click: function() {
		var that = this;
		this.oWrap.onclick = function(event) {
			var oEv, oTarget, oParent, i;
			oEv = event || window.event;
			oTarget = oEv.target || oEv.srcElement;
			oParent = oTarget.parentElement || oTarget.parentNode;
			oParent.height = function() {
				var iHeight = 0;
				for(i = 0;i < oParent.children.length; i++) iHeight += oParent.children[i].offsetHeight;
				return iHeight
			}();
			if(oTarget.tagName.toUpperCase() == "DT") {
				var aSiblings = that.siblings(oParent), count, i;
				for(count = i = 0; i < aSiblings.length; i++) {
					that.startMove(aSiblings[i], oTarget.offsetHeight, "buffer", function() {
						this.children[0].className = "";
						if(++count == aSiblings.length) {
							if(oParent.offsetHeight == oTarget.offsetHeight) {
								oTarget.className = "current";
								that.startMove(oParent, oParent.height, "flex")
							}
							else {
								that.startMove(oParent, oTarget.offsetHeight, "buffer", function() {
									oTarget.className = ""	
								})
							}								
						}	
					})
				}
			}
		}
	},
	startMove: function(obj, iTarget, type, callback) {
		var that = this;
		clearInterval(obj.timer);
		obj.iSpeed = 0;
		obj.timer = setInterval(function() {
			that[type].call(that, obj, iTarget, callback)
		}, 30)
	},
	buffer: function(obj, iTarget, callback) {
		obj.iSpeed = (iTarget - obj.offsetHeight) / 5;
		obj.iSpeed = obj.iSpeed > 0 ? Math.ceil(obj.iSpeed) : Math.floor(obj.iSpeed);
		obj.offsetHeight == iTarget ? (clearInterval(obj.timer), callback && callback.call(obj)) : obj.style.height = obj.offsetHeight + obj.iSpeed + "px"
	},
	flex: function(obj, iTarget, callback) {
		obj.iSpeed += (iTarget - obj.offsetHeight) / 6;
		obj.iSpeed *= 0.75;
		if(Math.abs(iTarget - obj.offsetHeight) <= 1 && Math.abs(obj.iSpeed) <= 1) {
			clearInterval(obj.timer);
			obj.style.height = iTarget + "px";
			callback && callback.call(obj)
		}
		else {
			obj.style.height = obj.offsetHeight + obj.iSpeed + "px"
		}
	},
	siblings: function(element) {
		var aTmp = [], oParent = element.parentElement || element.parentNode, i;
		for(i = 0; i < oParent.children.length; i++) element != oParent.children[i] && aTmp.push(oParent.children[i]);
		return aTmp
	}
};