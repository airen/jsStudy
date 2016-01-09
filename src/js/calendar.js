/**
 + ---------------------------------------- +
 + 日历组件 v1.0
 + Author: Ferris
 + QQ: 21314130
 + Mail: fgm@fgm.cc
 + ---------------------------------------- +
 + Date: 2012-01-10
 + ---------------------------------------- +
**/
/**
 * 2012——2020年节假日信息（包括节假日前1~3天/后1~3天）
 * @name _dateMap
 * @ignore
 */	
var _dateMap = {};

/**
 * 静态方法集
 * @name _CAL
 * @ignore
*/
var _CAL = {
	/**
	 * 格式化数字，不足两位前面补0
	 * @name _CAL#formatNum
	 * @param {number} num 要格式化的数字	 
	 * @function
	 * @return string
	 */	
	formatNum: function(num) {
		return num.toString().replace(/^(\d)$/, "0$1")	
	},
	/**
	 * 将日期对象/日期字会串格式化为指定日期字符串
	 * @name _CAL#formatStrDate
	 * @param {object|string} vArg	可为日期对象或日期字符串，日期对象格式new Date(yyyy, mm, dd)，日期字符串格式yyyy-mm|n-dd|d	 
	 * @function
	 * @return string yyyy-mm-dd
	 */		 	
	formatStrDate: function(vArg) {
		switch(typeof vArg) {
			case "string":
				vArg = vArg.split(/-|\//g);
				return vArg[0] + "-" + this.formatNum(vArg[1]) + "-" + this.formatNum(vArg[2]);
				break;
			case "object":
				return vArg.getFullYear() + "-" + this.formatNum(vArg.getMonth() + 1) + "-" + this.formatNum(vArg.getDate());
				break;	
		}
	},
	/**
	 * 将日期字符串格式化为数字
	 * @name _CAL#formatIntDate
	 * @param {string} sDate	日期字符串，格式yyyy-mm|m-dd|d	 
	 * @function
	 * @return number yyyymmdd
	 */	
	formatIntDate: function(sDate) {
	 	return this.formatStrDate(sDate).replace(/-|\//g, "")
	},	
	/**
	 * 获取指定日期（yyyy-mm-dd）的前1~3天/后1~3天数据
	 * @name _CAL#getThreeDays
	 * @param {string} dateName 日期名字
	 * @param {string} sDate	日期字符串（yyyy-mm-dd）
	 * @function
	 * @return object
	 */		
	getThreeDays: function(sDate, dateName) {
		var oTmp  = {},
			aDate = sDate.split(/-|\//g),
			sDate, i;
		for(i = 0; i < 7; i++) {			
			sDate = this.formatStrDate(new Date(aDate[0], aDate[1] - 1, aDate[2] - 0 + (i - 3)));
			oTmp[sDate] = dateName + (i != 3 ? (i < 3 ? "\u524d" : "\u540e") + Math.abs(i - 3) + "\u5929" : "");
			i > 2 && (_dateMap[sDate] = dateName + (i != 3 ? (i < 3 ? "\u524d" : "\u540e") + Math.abs(i - 3) + "\u5929" : ""))
		}
		return oTmp
	},
	/**
	 * 向对象中追加不存在的属性
	 * @name _CAL#addObject
	 * @param {object} obj		目标对象
	 * @param {object} oData	要添加的对象
	 * @function
	 * @return object
	 */	
	addObject: function(obj, oData) {
		for(var p in oData) obj[p] || (obj[p] = oData[p])
	},
	/**
	 * 获取目标元素针对于文档的位置
	 * @name _CAL#getPos
	 * @param {element} element 目标元素
	 * @function
	 * @return object {left: 元素左端距文档左侧位置, top: 元素左端距文档左侧位置, right: 元素右端距文档左侧位置, bottom: 元素底端距文档上方位置}
	 */	
	getPos: function(element) {
		var iScrollTop = document.documentElement.scrollTop || document.body.scrollTop,
			iScrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft,
			iPos = element.getBoundingClientRect();		
		return {top: iPos.top + iScrollTop, left: iPos.left + iScrollLeft, right: iPos.right + iScrollLeft, bottom: iPos.bottom + iScrollTop}
	},	
	/**
	 * 元素选择器
	 * @name _CAL#$
	 * @param {string} sArg		#id/.clssName/tagName
	 * @param {object} context	可选，上下文
	 * @function
	 * @return element 为id时返回元素
	 * @return elements 为className|tagName时返回元素集
	 */	
	$: function(sArg, context) {
		switch(sArg.charAt(0)) {
			case "#":
				return document.getElementById(sArg.substring(1));
				break;
			case ".":
				var reg = new RegExp("(^|\\s)"+ sArg.substring(1) +"(\\s|$)"),
					arr = [],
					aEl = _CAL.$("*", context),
					i;
				for(i = 0; i < aEl.length; i++) reg.test(aEl[i].className) && arr.push(aEl[i]);
				return arr;
				break;
			default:
				return (context || document).getElementsByTagName(sArg);
				break;
		}
	},
	/**
	 * 查找元素位置
	 * @name _CAL#indexOf
	 * @param {string} vArg 元素或样式名，当vArg为样式名时，返回第一个匹配元素在元素集中的位置
	 * @param {object} arr 	元素集
	 * @function
	 * @return number	元素在元素集中的位置，如果没有找到返回-1
	 */	
	indexOf: function(vArg, arr) {
		for(var i = arr.length; i--;) {
			if(typeof vArg === "string" ? this.hasClass(arr[i].children[0] || arr[i], vArg) : vArg == arr[i]) return i
		}
		return -1;
	},
	/**
	 * 判断目标元素是否包含指定的className
	 * @name _CAL#hasClass
	 * @param {object} element		目标元素
	 * @param {string} className	要检测的className
	 * @function
	 * @return boolean
	 */	
	hasClass: function(element, className) {
		return new RegExp("(^|\\s)" + className + "(\\s|$)").test(element.className)
	},
	/**
	 * 给目标元素添加className
	 * @name _CAL#addClass
	 * @param {object} element		目标元素
	 * @param {string} className	要添加的className
	 * @function
	 */	
	addClass: function(element, className) {
		var arr = element.className.split(/\s+/);	
		this.hasClass(element, className) || arr.push(className);
		element.className = arr.join(" ").replace(/(^\s*)|(\s*$)/, "")
	},
	/**
	 * 删除目标元素className
	 * @name _CAL#removeClass
	 * @param {object} element		目标元素
	 * @param {string} className	要删除的className
	 * @function
	 */	
	removeClass: function(element, className) {
		element.className = element.className.replace(new RegExp("(^|\\s)" + className + "(\\s|$)", "g"), "").split(/\s+/).join(" ")	
	},	
	/**
	 * 给目标元素绑定事件
	 * @name _CAL#on
	 * @param {object} element		目标元素
	 * @param {string} type 		事件类型
	 * @param {function} handler	处理函数
	 * @function
	 */	
	on: function(element, type, handler) {
		element.addEventListener ? element.addEventListener(type, handler, false) : element.attachEvent("on" + type, handler)
	},
	/**
	 * 阻止事件冒泡和默认事件
	 * @name _CAL#halt
	 * @param {event} e	 
	 * @function
	 */	
	halt: function(e) {
		e = e || event;
		e.preventDefault ? e.preventDefault() : e.returnValue = !1;
		e.stopPropagation ? e.stopPropagation() : e.cancelBubble = !0
	},
	/**
	 * 判断元素A元素是否包含B元素
	 * @name _CAL#contains
	 * @param {element} A
	 * @param {element} B
	 * @function
	 * @return boolean
	 */	
	contains: function(A, B) {
		if(A.contains) {
			return A.contains(B)	
		}
		else if(A.compareDocumentPosition) {
			return !!(A.compareDocumentPosition(B) & 16)
		}
	},
	/*
	 * 将伪数组转为数组
	 * @name _CAL#toArray
	 * @param {object} object 伪数组：例如arguments
	 * @function
	 * @return array
	*/
	toArray: function(object){
		for(var result = [], i = 0, len = object.length; i < len; i++) {
			result.push(object[i])
		}
		return result
	},
	/*
	 * 事件对象兼容处理
	 * @name _CAL#fixEvent
	 * @param {event} e 事件对象
	 * @function
	 * @return object
	*/	
	fixEvent: function(e) {
		e = e || event;
		e.target = e.target || e.srcElement;
		e.preventDefault = function() {
			return e.preventDefault ? e.preventDefault() : e.returnValue = !1;	
		};
		e.stopPropagation = function() {
			return e.stopPropagation ? stopPropagation() : e.cancelBubble = !0;	
		};
		e.hoat = function() {
			this.preventDefault();
			this.stopPropagation();	
		};
		return e
	}
};
/**
 * 日历模板
 * @name _template
 * @type Array
 * @ignore 
 */	
var _template = [
	"<div class=\"cal-container\">",
		"<dl>",
			"<dt class=\"date\"></dt>",
			"<dt><strong>\u65e5</strong></dt>",
			"<dt>\u4e00</dt>",
			"<dt>\u4e8c</dt>",
			"<dt>\u4e09</dt>",
			"<dt>\u56db</dt>",
			"<dt>\u4e94</dt>",
			"<dt><strong>\u516d</string></dt>",
			"<dd></dd>",
		"</dl>",
	"</div>"
];
/**
 * 节假日名字
 * @name _dateName
 * @type Object
 * @ignore
 */	
var _dateName = {
	"today":"\u4eca\u5929",
	"yuandan":"\u5143\u65e6",
	"chuxi":"\u9664\u5915",
	"chunjie":"\u6625\u8282",
	"yuanxiao":"\u5143\u5bb5\u8282",
	"qingming":"\u6e05\u660e",
	"wuyi":"\u52b3\u52a8\u8282",
	"duanwu":"\u7aef\u5348\u8282",
	"zhongqiu":"\u4e2d\u79cb\u8282",
	"guoqing":"\u56fd\u5e86\u8282"
};
/**
 * 2012——2020年节假日数据
 * @name _holidays
 * @type Object
 * @ignore
 */	
var _holidays = {
	today: [_CAL.formatStrDate(new Date)],
	yuandan: ["2012-01-01", "2013-01-01", "2014-01-01", "2015-01-01", "2016-01-01", "2017-01-01", "2018-01-01", "2019-01-01", "2020-01-01"],
	chuxi: ["2012-01-22", "2013-02-09", "2014-01-30", "2015-02-18", "2016-02-07", "2017-01-27", "2018-02-15", "2019-02-04", "2020-01-24"],
	chunjie: ["2012-01-23", "2013-02-10", "2014-01-31", "2015-02-19", "2016-02-08", "2017-01-28", "2018-02-16", "2019-02-05", "2020-01-25"],
	yuanxiao: ["2012-02-06", "2013-02-24", "2014-2-14", "2015-03-05", "2016-02-22", "2017-02-11", "2018-03-02", "2019-02-19", "2020-02-8"],
	qingming: ["2012-04-04", "2013-04-04", "2014-04-05", "2015-04-05", "2016-04-04", "2017-04-04", "2018-04-05", "2019-04-05", "2020-04-04"],
	wuyi: ["2012-05-01", "2013-05-01", "2014-05-01", "2015-05-01", "2016-05-01", "2017-05-01", "2018-05-01", "2019-05-01", "2020-05-01"],
	duanwu: ["2012-06-23", "2013-06-12", "2014-06-02", "2015-06-20", "2016-06-09", "2017-05-30", "2018-06-18", "2019-06-07", "2020-06-25"],
	zhongqiu: ["2012-09-30", "2013-09-19", "2014-09-08", "2015-09-27", "2016-09-15", "2017-10-04", "2018-09-24", "2019-09-13", "2020-10-01"],
	guoqing: ["2012-10-01", "2013-10-01", "2014-10-01", "2015-10-01", "2016-10-01", "2017-10-01", "2018-10-01", "2019-10-01", "2020-10-01"]
};
//生成节假日提示信息地图
for(var p in _holidays) {
	if(p == "today") continue;
	for(var i = 0; i < _holidays[p].length; i++) {
		_CAL.addObject(_dateMap, _CAL.getThreeDays(_holidays[p][i], _dateName[p]));
	}	
}
/**
 * 日历构造函数
 * @constructor
 * @name Calendar
 * @param {object} config 配置参数
 */
function Calendar() {
	this._init.apply(this, arguments)
}
Calendar.prototype = {
	constructor: Calendar,
	/**
	 * 正则表达式：匹配日期字符串yyyy-mm-dd或yyyy/mm/dd
	 * @name Calendar.reg
	 * @type ExpReg
	 */
	reg: /-|\//g,
	/**
	 * 正则表达式：匹配日期字符串2012-01-01——2020-12-31 格式yyyy-mm|m-dd|d
	 * @name Calendar.rDate
	 * @type ExpReg
	 */	
	rDate: /^20(1[2-9]|20)-(0?[1-9]|1[0-2])-(0?[1-9]|[12]\d|3[0-1])$/,
	/**
	 * 日历初始化
	 * @name Calendar#_init
	 * @param {object} config 日历参数配置
	 * @function
	 * @private
	 */	
	_init: function(config) {
		config = config || {};	
		/**
		 * 是否弹出显示日历，默认正常显示日历
		 * @name Calendar.isPopup
		 * @type Boolean
		 */		
		this.isPopup = config.isPopup;		
		/**
		 * 日历容器ID（如果值为空, 则生成不重复ID）
		 * @name Calendar.id
		 * @type String
		 */
		this.id = this.isPopup ? "C_" + (+new Date()) : config.id.replace(/^#/, "") || "C_" + (+new Date());
		/**
		 * 日历容器
		 * @name Calendar.container
		 * @type Object
		 */
		this.container = _CAL.$("#" + this.id) || document.createElement("div");
		/**
		 * 是否开启select选择年月，默认不开启
		 * @name Calendar.isSelect
		 * @type Boolean
		 */
		this.isSelect = config.isSelect;	
		/**
		 * 是否显示上月按钮，默认不显示
		 * @name Calendar.isPrevBtn
		 * @type Boolean
		 */
		this.isPrevBtn = config.isPrevBtn;
		/**
		 * 是否显示上月按钮，默认不显示
		 * @name Calendar.isNextBtn
		 * @type Boolean
		 */	
		this.isNextBtn = config.isNextBtn;
		/**
		 * 是否显示关闭按钮，默认不显示
		 * @name Calendar.isCloseBtn
		 * @type Boolean
		 */	
		this.isCloseBtn = config.isCloseBtn;
		/**
		 * 是否特殊显示节假日，默认不显示
		 * @name Calendar.isHoliday
		 * @type Boolean
		 */	
		this.isHoliday = config.isHoliday;
		/**
		 * 是否提示节假日前1~3天/后1~3天，默认不提示
		 * @name Calendar.isHolidayTips
		 * @type Boolean
		 */	
		this.isHolidayTips = config.isHolidayTips;
		/**
		 * 是否设置文本框为只读，默认可写
		 * @name Calendar.isReadonly
		 * @type Boolean
		 */	
		this.isReadonly = config.isReadonly;
		/**
		 * 是否显示日期信息，默认不显示
		 * @name Calendar.isDateInfo
		 * @type Boolean
		 */	
		this.isDateInfo = config.isDateInfo;	
		/**
		 * 日期信息className，默认值"date-info"
		 * @name Calendar.dateInfoClass
		 * @type String
		 */		
		this.dateInfoClass = config.dateInfoClass || "date-info";		
		/**
		 * 日历是否包含提示信息，默认不包含提示信息
		 * @name Calendar.isMessage
		 * @type Boolean
		 */	
		this.isMessage = config.isMessage;
		/**
		 * 日历提示信息内容，默认值为空
		 * @name Calendar.sMessage
		 * @type String
		 */		
		this.sMessage = config.sMessage || "";
		/**
		 * 存放出发日期日历实例
		 * @name Calendar.CalStart
		 * @type Object
		 */	
		this.CalStart = config.CalStart || null;
		/**
		 * 标记日历实例是否为出发日历
		 * @name Calendar.isCalStart
		 * @type Boolean
		 */	
		this.isCalStart = config.isCalStart;
		/**
		 * 存放返程日期日历实例
		 * @name Calendar.CalEnd
		 * @type Object
		 */	
		this.CalEnd = config.CalEnd || null;
		/**
		 * 标记日历实例是否为返程日历
		 * @name Calendar.isCalEnd
		 * @type Boolean
		 */	
		this.isCalEnd = config.isCalEnd;
		/**
		 * 日历个数,默认1个日历
		 * @name Calendar.count
		 * @type Number
		 */	
		this.count = config.count || 1;
		/**
		 * 上下月切换步长，默认与日历个数一致，整区域切换
		 * @name Calendar.monthStep
		 * @type Number
		 */	
		this.monthStep = config.monthStep || this.count;		
		/**
		 * 显示位置微调，在日历原有的位置进行偏移微调(left值, top值)，满足个性化需求
		 * @name Calendar.revise
		 * @type Object
		 */	
		this.revise = {left:0, top:0};
		/**
		 * 触发显示日历的元素
		 * @name Calendar.triggerNode
		 * @type Object
		 */
		this.triggerNode = _CAL.$("#" + config.id.replace(/^#/, ""));
		/**
		 * 设置日历渲染日期，格式new Date(yyyy, mm, dd)
		 * @name Calendar.date
		 * @type Object
		 */	
		this.date = config.date || new Date;
		/**
		 * 日历年份，只读
		 * @name Calendar.year
		 * @type Number
		 */	
		this.year = this.date.getFullYear();
		/**
		 * 日历月份，只读
		 * @name Calendar.month
		 * @type Number
		 */	
		this.month = _CAL.formatNum(this.date.getMonth() + 1);
		/**
		 * 设置出发日期，格式(yyyy-mm-dd)
		 * @name Calendar.startDate
		 * @type String
		 */	
		this.startDate = config.startDate;
		/**
		 * 设置返程日期，格式(yyyy-mm-dd)
		 * @name Calendar.endDate
		 * @type String
		 */	
		this.endDate = config.endDate;		
		/**
		 * 设置默认选择的日期，增加高亮显示，格式(yyyy, mm, dd)
		 * @name Calendar.selectDate
		 * @type String
		 */	
		this.selectDate = config.selectDate && _CAL.formatStrDate(config.selectDate);
		/**
		 * 指定日历可选范围 mindate:最小日期, maxdate:最大日期。格式new Date(yyyy, mm, dd)
		 * @name Calendar.range
		 * @type Object
		 */
		this.range = config.range || {mindate:null, maxdate:null};			
		//创建日历
		this._create();				
		//初次渲染
		this.render();
		//添加事件
		this._addEvent()
	},
	/**
	 * 创建日历结构
	 * @name Calendar#_create
	 * @function
	 * @private
	 */
	_create: function() {
		var aTmp = [],
			i = 0,
			oIframe = null,
			oDiv = document.createElement("div"),
			oMsg = document.createElement("div");
		//显示上月按钮	
		this.isPrevBtn  && aTmp.push("<span class=\"cal-prev\">prev</span>");
		//显示下月按钮
		this.isNextBtn  && aTmp.push("<span class=\"cal-next\">next</span>");
		//显示关闭按钮
		this.isCloseBtn && aTmp.push("<span class=\"cal-close\">close</span>");
		
		//生成日历结构
		for(i = this.count; i--;) aTmp = aTmp.concat(_template);		
			
		//配置日历容器
		oDiv.className = "calendar";
		oDiv.innerHTML = aTmp.join("");
		if(!this.isPrevBtn && !this.isNextBtn && !this.isCloseBtn) oDiv.style.paddingLeft = oDiv.style.paddingRight = "5px";
		this.container.id = this.id;
		this.container.appendChild(oDiv);
		
		//插入信息容器
		if(this.isMessage) {
			this.oMsg = oMsg;
			oMsg.className = "cal-msg";
			oMsg.innerHTML = this.sMessage;
			oMsg.style.display = this.sMessage ? "block" : "none";
			this.container.insertBefore(oMsg, oDiv);
		}
		
		//修复ie6无法遮盖select的bug
		!!window.ActiveXObject && !window.XMLHttpRequest && (oIframe = document.createElement("iframe"), this.container.appendChild(oIframe));	
		
		//如果页面中没有日历容器则创建一个
		document.getElementById(this.id) || document.body.appendChild(this.container);
		//如果是ie6, 设置容器内的iframe的宽高
		if(oIframe) {
			var style = oIframe.style;
			style.position = "absolute";
			style.top = style.left = "-1px";
			style.filter = "alpha(opacity=0)";
			style.zIndex = -1;
			style.border = 0;
			style.width = this.container.offsetWidth + "px";
			style.height = this.container.offsetHeight + "px"
		}
		
		//如果是弹出式日历则先将其隐藏, 并设置绝对定位
		this.isPopup && (this.hide().container.style.position = "absolute");
		
		//触发元素为输入框时的相关设置
		if(this.triggerNode.tagName.toUpperCase() === "INPUT") {
			//如果设置了只读, 修改触发元素的readonly
			this.isReadonly && (this.triggerNode.readOnly = true);
			//如果设置了显示日期信息, 则创建日期信息标签
			if(this.isDateInfo) {				
				this.triggerNodeParent 				  = document.createElement("div");
				this.oDateInfo 						  = document.createElement("span");
				this.oDateInfo.className 			  = this.dateInfoClass;
				this.triggerNode.style.position 	  = "absolute";
				this.triggerNodeParent.style.position = "relative";
				this.triggerNodeParent.style.display  = "inline-block";
				this.triggerNodeParent.style.width    = this.triggerNode.offsetWidth + "px";
				this.triggerNodeParent.style.height   = this.triggerNode.offsetHeight + "px";
				this.triggerNode.parentNode.insertBefore(this.triggerNodeParent, this.triggerNode);
				this.triggerNodeParent.appendChild(this.triggerNode);
				this.triggerNodeParent.appendChild(this.oDateInfo)				
			}
			//如果输入框有值
			this.triggerNode.value != "" && this.isHolidayTips && this.setDateInfo();
		}
	},
	/**
	 * 画日历
	 * @name Calendar#_draw
	 * @function
	 * @private		 
	 */
	_draw: function(oCal, date) {
		var that  = this,
			oDt   = oCal.getElementsByTagName("dt")[0],
			oDd   = oCal.getElementsByTagName("dd")[0],
			oTmpY = document.createDocumentFragment(),
			oTmpM = document.createDocumentFragment(),
			oOption, oFrag, oDiv, i;		
		//select年月
		if(this.isSelect) {
			oDiv = document.createElement("div");
			this.selectYear = document.createElement("select");
			this.selectMonth = document.createElement("select");
			
			oFrag = document.createDocumentFragment();
			for(i = (new Date).getFullYear(); i >= 1900; i--) {
				oOption = document.createElement("option");
				oOption.value = oOption.innerHTML = i;
				oOption.selected = this.year == i;
				oTmpY.appendChild(oOption)
			}
			for(i = 1; i <= 12; i++) {
				oOption = document.createElement("option");
				oOption.value = oOption.innerHTML = i;
				oOption.selected = this.month == i;
				oTmpM.appendChild(oOption)			
			}
			
			this.selectYear.appendChild(oTmpY);
			this.selectMonth.appendChild(oTmpM);
			
			oDiv.appendChild(this.selectYear);
			oDiv.appendChild(this.selectMonth);
			oDiv.appendChild(document.createTextNode("\u6708"));
			oDiv.insertBefore(document.createTextNode("\u5e74"), this.selectMonth);
			
			oDt.innerHTML = "";
			oDt.appendChild(oDiv);
			
			this.selectYear.onchange = this.selectMonth.onchange = function() {
				that.render(new Date(that.selectYear.value, that.selectMonth.value - 1))
			}
		}
		//文字年月
		else {
			oDt.innerHTML = date.year + "\u5e74" + date.month + "\u6708";
		}
		//日期
		oDd.innerHTML = "";
		oDd.appendChild(this._createDays(date.year, date.month))
	},
	/**
	 * 生成日期
	 * @name Calendar#_createDays
	 * @function
	 * @private		 
	 */
	_createDays: function(year, month) {
		var iDays	  = new Date(year, month, 0).getDate(),
			iFirstDay = new Date(year, month - 1, 1).getDay(),
			arr		  = [],
			result	  = [],
			oFarg	  = document.createDocumentFragment(),
			i, len, sValue, oA, iCur;
		
		for(i = iFirstDay; i--;) arr.push(0);
		for(i = 1; i <= iDays; i++) arr.push(i);
		
		while(arr.length) {
			for(i = 0, len = arr.length; i < len; i++) {
				if(arr.length) {					
					oA 	   = document.createElement("a");
					sValue = arr.shift();
					if(!sValue) {
						oA.className = "disabled";
						oA.innerHTML = "&nbsp;"	
					}
					else {
						oA.href		 	= "javascript:;";
						oA.innerHTML	= sValue;
						oA["data-date"] = _CAL.formatStrDate(year + "-" + month + "-" + sValue);
						
						iCur = _CAL.formatIntDate(oA["data-date"]);
	
						//指定范围
						if(this.range.mindate) {
							iCur < (_CAL.formatIntDate(this.range.mindate)) && (oA.className = "disabled");	
						}
						if(this.range.maxdate) {
							iCur > (_CAL.formatIntDate(this.range.maxdate)) && (oA.className = "disabled");	
						}
						
						//节假日处理
						if(this.isHoliday) {
							for(var className in _dateName) {
								if(oA.className == "disabled") continue;
								this._isHoliday(oA, className)
							}
						}
						
						//指定了日期则增加选中状态
						this.selectDate == oA["data-date"] && ((oA.children[0] || oA).className = "selected");
						
						//开始日期
						this.startDate == oA["data-date"] && ((oA.children[0] || oA).className = "start-date");
						
						//开始日期
						this.endDate == oA["data-date"] && ((oA.children[0] || oA).className = "end-date");
						
						//标记选择范围
						if(this.startDate && this.endDate) {
							iCur > this.startDate.replace(this.reg, "") && iCur < this.endDate.replace(this.reg, "") && ((oA.children[0] || oA).className = "select-range")
						}
					}					
					oFarg.appendChild(oA)
				}
			}
		}
		return oFarg
	},
	/**
	 * 计算是否为节假日
	 * @name Calendar#_isHoliday
	 * @function
	 * @private		 
	 */
	_isHoliday: function(obj, className) {
		if(new RegExp(obj["data-date"]).test(_holidays[className].join())) {
			obj.className = className;
			obj.innerHTML = "<span>"+ obj.innerHTML.replace(/<[^>]+>/,"") +"</span>"
		}
	},
	/**
	 * 设置弹出式日历位置
	 * @name Calendar#_setPos
	 * @function
	 * @private		 
	 */
	_setPos: function(triggerNode) {
		var t, l, w, h, maxT, ie = /msie\s(\d+\.\d+)/i.test(navigator.userAgent) ? RegExp.$1: undefined;
		triggerNode = triggerNode ? triggerNode._node : null || this.triggerNode;
		t = _CAL.getPos(triggerNode).bottom + this.revise.top - (ie < 8 ? 2 : 0);
		l = _CAL.getPos(triggerNode).left + this.revise.left - (ie < 8 ? 2 : 0);
		w = 205 * this.count + (!this.isPrevBtn && !this.isNextBtn && !this.isCloseBtn ? 10 : 60);
		h = this.isSelect ? 216 : 211;
		maxT = t - h - triggerNode.offsetHeight - this.revise.top * 2;
		maxL = l - w + triggerNode.offsetWidth - this.revise.top * 2;
		if(t > document.documentElement.clientHeight + (document.documentElement.scrollTop || document.body.scrollTop) - h) t = maxT < 0 ? t : maxT;
		if(l > document.documentElement.clientWidth + (document.documentElement.scrollLeft || document.body.scrollLeft) - w) l = maxL < 0 ? l : maxL;
		this.container.style.top  = t + "px";
		this.container.style.left = l + "px"
	},
	/**
	 * isPopup为false时，自定义开发的弹出日历显示范围限制，使用时需自行绑定resize事件执行此方法。
	 * @name Calendar#limit
	 * @param {object} triggerNode 触发弹出日历的元素，YUI DOM节点
	 * @function 
	 */
	limit: function(triggerNode) {
		this._setPos(triggerNode)
	},	
	/**
	 * 添加事件
	 * @name Calendar#_addEvent
	 * @function
	 * @private		 
	 */
	_addEvent: function() {
		var that = this,
			obj = this.container;
		//为日历控件添加CLICK事件监听
		_CAL.on(obj, "click", function(e) {
			that.isHide = !0;
			that.closeTimer && clearTimeout(that.closeTimer);
			e = e || event;
			var oTarget = e.target || e.srcElement;
			switch(oTarget.className) {
				case "cal-close":
					that.hide();
					break;
				case "cal-prev":
					that.prevMonth();
					break;
				case "cal-next":
					that.nextMonth();
					break;
			}
			oTarget.parentNode.tagName.toUpperCase() === "A" && (oTarget = oTarget.parentNode);			
			if(oTarget.tagName.toUpperCase() === "A" && oTarget.className != "disabled") {					
				that.run("dateClick", oTarget);
				if(that.triggerNode.tagName.toUpperCase() === "INPUT") {					
					that.triggerNode.value = oTarget["data-date"];
					if(that.isDateInfo) that.setDateInfo(oTarget["data-date"]);
					that.hide()
				}
			}
			that.isPopup && _CAL.contains(obj, oTarget) && _CAL.halt(e)			
		});
		//日历为弹出显示时添加事件
		if(this.isPopup) {
			_CAL.on(this.triggerNode, "focus", function(e) {
				that.isHide = !1;
				that.closeTimer && clearTimeout(that.closeTimer);
				e = e || event;
				var oTarget = e.target || e.srcElement,
					oIframe = _CAL.$("iframe", that.container)[0];	
				that._setPos();
				that.show();
				oTarget.select && oTarget.select();
				oIframe && (oIframe.style.width = that.container.offsetWidth + "px", oIframe.style.height = that.container.offsetHeight + "px");
			});

			_CAL.on(this.triggerNode, "blur", function() {								
				that.closeTimer = setTimeout(function() {
					that.hide();
				}, 150)
			});
			
			_CAL.on(document, "click", function(e) {
				that.isHide && that.hide()
			});
			
			_CAL.on(window, "resize", function() {
				that._setPos()	
			})
		}
		//给日期信息容器添加事件
		if(this.oDateInfo) {
			_CAL.on(this.oDateInfo, "click", function(e) {
				that.focus();
				_CAL.halt(e || event)	
			})	
		}
		//自定义事件outsiteClick
		_CAL.on(document, "click", function(e) {
			e = _CAL.fixEvent(e);
			if(_CAL.contains(that.container, e.target)) return;	
			that.run("outsiteClick", e);
		});	
	},
	/**
	 * 渲染日历
	 * @name Calendar#render
	 * @param {object|string} date 指定日期渲染日期，参数可为日期对象new Date(yyyy, mm, dd)或字符串yyyy-mm-dd
	 * @function
	 */
	render: function(date) {
		var date = date || this.date,
			aCal  = _CAL.$(".cal-container", this.container),
			year, month, i;
			date = typeof date === "string" ? new Date(date.split(this.reg)[0], _CAL.formatNum(date.split(this.reg)[1] - 1)) : date;
			year  = date.getFullYear();
			month = date.getMonth() + 1;
		this.year = year;
		this.month = month;
		for(i = 0, len = aCal.length; i < len; i++) {
			year += (month + (i ? 1 : 0)) > 12 ? 1 : 0;
			month = (month + (i ? 1 : 0)) % 12 || 12;	
			this._draw(aCal[i], {year: year, month: month})	
		}
	},	
	/**
	 * 渲染下月日历
	 * @name Calendar#nextMonth
	 * @function
	 */
	nextMonth: function() {
		this.render(new Date(this.year, this.month + (this.monthStep - 1), 1));
		this.run("nextMonthClick")
	},
	/**
	 * 渲染上月日历
	 * @name Calendar#prevMonth
	 * @function
	 */
	prevMonth: function() {
		this.render(new Date(this.year, this.month - (this.monthStep + 1), 1));
		this.run("prevMonthClick")
	},
	/**
	 * 显示日历
	 * @name Calendar#show
	 * @function
	 */
	show: function() {
		this.container.style.display = "block";		
		this.run("show");
		this.run("outsiteClick");
		return this
	},
	/**
	 * 隐藏日历
	 * @name Calendar#hide
	 * @function
	 */
	hide: function() {
		this.container.style.display = "none";
		this.isMessage && this.hideMessage();
		this.run("hide");
		return this
	},
	/**
	 * 设置显示日期信息
	 * @name Calendar#setDateInfo
	 * @param {string} str 日期信息内容	 
	 * @function
	 */
	setDateInfo: function(sDate) {
		sDate = sDate || this.triggerNode.value;
		this.oDateInfo.innerHTML = this.rDate.test(sDate) ? (this.triggerNode.value = sDate, this.render(sDate), this.getDateInfo(sDate)[this.isHoliday ? "holiday" : "week"]) : ""
	},
	/**
	 * 获取指定间隔日期
	 * @name Calendar#getDate
	 * @param {string} sDate 日期字符串yyyy-mm-dd或yyyy/mm/dd
	 * @param {number} iDiff 日期差异, 可为负数
	 * @function
	 */		
	getDate: function(sDate, iDiff) {
		var aDate = sDate.split(this.reg);
		return _CAL.formatStrDate(new Date(aDate[0], aDate[1] - 1, aDate[2] - 0 + (iDiff || 0)))
	},
	/**
	 * 获取日期信息
	 * @name Calendar#getDateInfo
	 * @param {string} sDate 日期字符串yyyy-mm-dd或yyyy/mm/dd
	 * @function
	 */	
	getDateInfo: function(sDate){
		var that = this,
			aDate = sDate.split(this.reg),
			oDate = new Date(aDate[0], aDate[1] - 1, aDate[2]),
			aDateName = ["\u4eca\u5929", "\u660e\u5929", "\u540e\u5929"],
			sWeekName = "\u661f\u671f" + ["\u65e5", "\u4e00", "\u4e8c", "\u4e09", "\u56db", "\u4e94", "\u516d"][oDate.getDay()],
			iDiff, p;
		return {
			week: sWeekName,
			holiday: function() {
				//节假日
				for(p in _holidays) if(new RegExp(sDate).test(_holidays[p])) return _dateName[p];
				//今天/明天/后天
				iDiff = _CAL.formatIntDate(sDate) - _CAL.formatIntDate(new Date);
				if(iDiff >= 0 && iDiff <= 2) return aDateName[iDiff];
				//节假日前1-3天/后1-3天日期数
				return that.isHolidayTips ? _dateMap[sDate] || sWeekName : sWeekName
			}()
		}
	},		
	/**
	 * 显示鼠标移入的日期距开始日期的时间段
	 * @name Calendar#showRange
	 * @function
	 */	
	showRange: function() {
		var that = this;
		_CAL.on(this.container, "mouseover", function(e) {
			e = e || event;
			var oTarget = e.target || e.srcElement,
				aEl = _CAL.$("a", that.container),
				iBegin = _CAL.indexOf("start-date", aEl),
				i;
			if(!that.startDate) return;
			oTarget.parentNode.tagName.toUpperCase() === "A" && (oTarget = oTarget.parentNode);
			if(oTarget.tagName.toUpperCase() === "A") {
				var iNow = _CAL.indexOf(oTarget, aEl);
				clearClass();
				for(i = iBegin + 1; i < iNow; i++) _CAL.hasClass(aEl[i].children[0] || aEl[i], "end-date") || _CAL.addClass(aEl[i].children[0] || aEl[i], "hover")
			}
			else {
				clearClass()
			}
			function clearClass() {
				for(i = aEl.length; i--;) _CAL.removeClass(aEl[i].children[0] || aEl[i], "hover")
			}
		})
	},
	/**
	 * 弹出式日历时，让触发元素获取焦点
	 * @name Calendar#focus
	 * @function
	 */		
	focus: function() {
		this.triggerNode.focus()	
	},
	/**
	 * 触发元素为INPUT时的keyup事件
	 * @name Calendar#keyup
	 * @function
	 */
	keyup: function() {
		var that = this,
			Cal_S = that.CalStart,
			Cal_E = that.CalEnd;
		_CAL.on(that.triggerNode, "keyup", function(e) {
			e = e || event;
			var oTarget = e.target || e.srcElement,
				sValue = oTarget.value;
			if(that.rDate.test(sValue)) {				
				sValue = _CAL.formatStrDate(sValue);				
				if(sValue != (that.isCal_start ? that.startDate : that.endDate)) {
					if(that.isCalStart) {
						Cal_S.startDate = Cal_E.startDate = sValue;
						Cal_S.render(sValue);
						that.setDateInfo(that.triggerNode.value);						
						Cal_E.render(Cal_E.endDate || sValue);
					}
					else if(that.isCalEnd) {
						Cal_S.endDate = Cal_E.endDate = sValue;
						Cal_E.render(sValue);			
						that.setDateInfo(that.triggerNode.value);
						Cal_S.render();
					}
				}
			}
			else {				
				if(that.isCalStart) {
					Cal_S.startDate = Cal_E.startDate = "";
					Cal_S.render(new Date);					
					Cal_E.render(new Date);
				}
				else if(that.isCalEnd) {
					Cal_S.endDate = Cal_E.endDate = "";
					Cal_S.render(new Date);					
					Cal_E.render(new Date);						
				}
				that.setDateInfo("")
			}		
		});		
	},
	/**
	 * 显示日历提示信息
	 * @name Calendar#showMessage
	 * @param {string} message 日历提示信息内容	 
	 * @function
	 */	
	showMessage: function(message) {
		if(this.oMsg) {
			this.oMsg.innerHTML = message;
			this.oMsg.style.display = "block";
			this.focus()
		}
	},
	/**
	 * 隐藏日历提示信息
	 * @name Calendar#hideMessage
	 * @function
	 */
	hideMessage: function() {
		this.oMsg && (this.oMsg.style.display = "none")
	},
	/**
	 * 添加自定义事件
	 * @name Calendar#_addCustomEvent
	 * @param {string} type 事件名
	 * @param {function} handler 事件处理程序
	 * @function
	 * @private
	 */
	_addCustomEvent: function(type, handler) {
		if(!this._eventQueue) this._eventQueue = {};
		this._eventQueue[type] ? this._eventQueue[type].push(handler) : this._eventQueue[type] = [handler]
	},
	/**
	 * 删除自定义事件
	 * @name Calendar#_delCustomEvent
	 * @param {string} type 事件名
	 * @param {function} handler 事件处理程序	 
	 * @function
	 * @private
	 */
	_delCustomEvent: function(type, handler) {
		if(this._eventQueue) {
			var aHandler = this._eventQueue[type];
			if(aHandler) {
				for(var i = aHandler.length; i--;) {
					if(!handler) {
						aHandler[i] = null;
						aHandler.splice(i, 1);
					}
					else {
						aHandler[i] == handler && (aHandler[i] = null, aHandler.splice(i, 1))
					}
				}	
			}
		}
	},
	/**
	 * 执行自定义事件
	 * @name Calendar#_fireCustomEvent
	 * @param {string} type 事件名
	 * @function
	 * @private
	 */	
	_fireCustomEvent: function(type) {
		if(this._eventQueue) {
			var aHandler = this._eventQueue[type];
			if(aHandler) {
				for(var i = 0, len = aHandler.length; i < len; i++) {
					aHandler[i] && aHandler[i].apply(this, arguments[1] || [])	
				}	
			}
		}
	},
	/**
	 * 添加自定义事件<br />
	 * 内置自定义事件如下：<br />
	 * show - 日历显示事件<br />
	 * hide - 日历隐藏事件<br />
	 * dateClick - 日期点击事件<br />
	 * nextMonthClick - 下月按钮点击事件<br />
	 * prevMonthClick - 上月按钮点击事件<br />
	 * outsiteClick - 日历容器外点击事	 
	 * @name Calendar#on
	 * @param {string} type 事件名
	 * @param {function} handler 事件处理程序
	 * @function
	 */
	on: function(type, handler) {
		this._addCustomEvent(type, handler)
	},
	/**
	 * 删除自定义事件
	 * @name Calendar#un
	 * @param {string} type 事件名
	 * @param {function} handler 事件处理程序	 
	 * @function
	 */	
	un: function(type, handler) {
		this._delCustomEvent(type, handler)	
	},
	/**
	 * 执行自定义事件
	 * @name Calendar#run
	 * @param {string, ...} type 事件名, ...要传递的若干参数
	 * @function
	 */		
	run: function(type) {
		var arg = _CAL.toArray(arguments);
		this._fireCustomEvent(arg.shift(), arg)
	}
};