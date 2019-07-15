/* eslint-disable */

'use strict';

// 时间格式化
if (!new Date().format) {
    Date.prototype.format = function (fmt) { //author: meizz 
        var o = {
            "M+": this.getMonth() + 1, //月份 
            "d+": this.getDate(), //日 
            "h+": this.getHours(), //小时 
            "H+": this.getHours() > 12 ? this.getHours() - 12 : this.getHours(),
            "m+": this.getMinutes(), //分 
            "s+": this.getSeconds(), //秒 
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
            "S": this.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
};

let XTEAMLIST = [];
let MODELTYPE = '';
let SOCKET = null;
let CONSOLEXTEAM = [];

// util 公共对象函数
class utilfn {
    // 初始化对象
    constructor() {
        this.win = window.top;
        this.UA = navigator.userAgent;
        this.isPC = this.UA.indexOf('Windows NT') > -1;
        this.isAndroid = this.UA.indexOf('Android') > -1;
        this.isIos = this.UA.indexOf('Mac OS X') > -1;
        this.isIphone = this.UA.indexOf('iPhone;') > -1;
        this.isIpad = this.UA.indexOf('iPad;') > -1;
        this.isIE7 = this.UA.indexOf('MSIE 7.0;') > -1;
        this.isIE8 = this.UA.indexOf('MSIE 8.0;') > -1;
        this.isIE9 = this.UA.indexOf('MSIE 9.0;') > -1;
        this.isIE10 = this.UA.indexOf('MSIE 10.0;') > -1;
        this.isIE11 = this.UA.indexOf('Trident') > -1;
    };

    /*封装的ajax函数
        *type           	类型  get|post
        *url            	api地址
        *data           	请求的json数据
        *noLoading  		ajax执行时是否显示遮罩
        *nohideloading  	ajax执行完成之后是否隐藏遮罩
        *notimeout			是否有请求超时
        *complete       	ajax完成后执行（失败成功后都会执行）
        *beforeSend        	请求发送前执行
        *success        	成功之后执行
        *error          	失败之后执行
        *goingError     	是否执行自定义error回调
        *timeout        	ajax超时时间
        *isGoingLogin   	是否跳转到登录界面
        */
    ajax(json) {
        let This = this;
        let noError = true;
        let url = null;
        let asyncVal = typeof(json.async) == 'boolean' ? json.async : true;
        if (!json.nohideloading) {
            This.showLoading();
        };

        //是否有请求超时
        if (!json.notimeout) {
            var timeout = setTimeout(function() {
                This.hideLoading();
                // 请求超时
                noError = false;
                asyncVal && popup.alert({
                    type: 'msg',
                    title: '您的网络太慢了哦,请刷新重试!'
                });
            }, json.timeout || config.ajaxtimeout);
        }
        // 增加时间戳参数
        if (json.url.indexOf('?') != -1) {
            url = json.url + '&_=' + this.time();
        } else {
            url = json.url + '?_=' + this.time();
        };

        return $.ajax({
            type: json.type || "post",
            url: url,
            data: json.data || "",
            dataType: "json",
            async: asyncVal,
            beforeSend: function(xhr) {
                xhr.setRequestHeader("x-csrf-token", $.cookie('csrfToken')||'');
                json.beforeSend && json.beforeSend(xhr);
            },
            success: function(data) {
                if (!json.nohideloading) {
                    This.hideLoading();
                };
                clearTimeout(timeout);
                if (typeof(data) == 'string') {
                    This.error(JSON.parse(data), json);
                } else {
                    This.error(data, json);
                }
            },
            complete: function(XMLHttpRequest) {
                if (!json.nohideloading) {
                    This.hideLoading();
                };
                clearTimeout(timeout);
                if (json.complete) {
                    json.complete(XMLHttpRequest);
                }
            },
            error: function(XMLHttpRequest) {
                This.hideLoading();
                clearTimeout(timeout);
                if (noError) {
                    This._error(XMLHttpRequest, json);
                };
            }
        });
    };

    //error 处理函数
    error(data, json) {
        //判断code 并处理
        var dataCode = parseInt(data.code);
        if (!json.isGoingLogin && dataCode == 1004) {
            // 判断app或者web
            if (window.location.href.indexOf(config.loginUrl) == -1) {
                $('#main').html('');
                function login(){
                    sessionStorage.setItem("weixin-url", window.location.href); //记录没有登陆前的访问页面
                    location.href = config.loginUrl + '?redirecturl=' + encodeURIComponent(location.href);
                }
                popup.confirm({ maskHide: false, title: data.desc || '登录失败,请重新登录!', yes: () => { login() }, no: () => { login() } });
            } else {
                popup.alert({
                    type: 'msg',
                    title: '用户未登陆,请登录!'
                });
            }
        } else {
            switch (dataCode) {
                case 1000:
                    json.success && json.success(data);
                    break;
                default:
                    if (json.goingError) {
                        //走error回调
                        json.error && json.error(data);
                    } else {
                        //直接弹出错误信息
                        popup.alert({
                            type: 'msg',
                            title: data.desc
                        });
                    };
            }
        };
    }

    // _error 处理函数
    _error(XMLHttpRequest, json) {
        this.hideLoading();
        if (json.code) {
            json.error(JSON.parse(XMLHttpRequest.responseText));
        } else {
            switch (XMLHttpRequest.status) {
                case 401:
                    if (window.location.href.indexOf(config.loginUrl) == -1) {
                        sessionStorage.setItem("weixin-url", window.location.href); //记录没有登陆前的访问页面
                        window.location.href = config.loginUrl;
                    } else {
                        popup.alert({
                            type: 'msg',
                            title: "你需要登录哦"
                        });
                    };
                    break;
                case 400:
                    popup.alert({
                        type: 'msg',
                        title: "您的请求不合法呢"
                    });
                    break;
                case 404:
                    popup.alert({
                        type: 'msg',
                        title: "访问的地址可能不存在哦"
                    });
                    break;
                case 500:
                case 502:
                    popup.alert({
                        type: 'msg',
                        title: "服务器内部错误"
                    });
                    break;
                    // default:
                    // 	popup.alert({type:'msg',title:"未知错误。程序员欧巴正在赶来修改哦"});
            }
        }
    }

    // 获取当前时间毫秒
    time() {
        return new Date().getTime();
    }

    /*根据参数生成常用的正则表达式
        *string    type 生成的正则表达式类型
        *array     numArr 生成正则的条件数组 例如:[6,16] 也可省略
        */
    regCombination(type, numArr) {
        var reg = "";
        switch (type) {
            case "*": //"*":"不能为空！"
                if (numArr) {
                    reg = new RegExp("^[\\w\\W]{" + numArr[0] + "," + numArr[1] + "}$");
                } else {
                    reg = new RegExp("^[\\w\\W]+$");
                }
                break;
            case "n": //"number":"请填写数字！
                if (numArr) {
                    reg = new RegExp("^\\d{" + numArr[0] + "," + numArr[1] + "}$");
                } else {
                    reg = new RegExp("^\\d+$");
                }
                break;
            case "s": //"s":"不能输入特殊字符！"
                if (numArr) {
                    reg = new RegExp("^[\\u4E00-\\u9FA5\\uf900-\\ufa2d\\w\\.\\s]{" + numArr[0] + "," + numArr[1] + "}$");
                } else {
                    reg = new RegExp("^[\\u4E00-\\u9FA5\\uf900-\\ufa2d\\w\\.\\s]+$");
                }
                break;
            case "c": //"z":"中文验证"
                reg = new RegExp("^[\\u4E00-\\u9FA5\\uf900-\\ufa2d]{" + numArr[0] + "," + numArr[1] + "}$");
                break;
            case "p": //"p":"邮政编码！
                reg = new RegExp("^[0-9]{6}$");
                break;
            case "m": //"m":"写手机号码！"
                reg = new RegExp("^13[0-9]{9}$|14[0-9]{9}$|15[0-9]{9}$|17[0-9]{9}$|18[0-9]{9}$");
                break;
            case "e": //"e":"邮箱地址格式
                reg = new RegExp("^\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$");
                break;
            case "id": //"id":验证身份证
                reg = new RegExp("^\\d{17}[\\dXx]|\\d{14}[\\dXx]$");
                break;
            case "money": //钱
                reg = new RegExp("^[\\d\\.]+$");
                break;
            case "url": //"url":"网址"
                reg = new RegExp("^(\\w+:\\/\\/)?\\w+(\\.\\w+)+.*$");
                break;
            case "u": //
                reg = new RegExp("^[A-Z\\d]+$");
                break;
            case "numLimitTo2": //保留2位小数点正整数
                reg = new RegExp("^-{0,0}\\d+(.\\d{0,2})?$");
                break;
            case "spec": //校验特殊字符
                reg = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？%+_]");
                break;
        }
        return reg;
    }

	/*extent json函数
	 *json1  原始数据
	 *json2  新数据
	 */
	extend(json1, json2) {
		var newJson = json1;
		for (var j in json2) {
			newJson[j] = json2[j];
		}
		return newJson;
	}

	//showLoading
	showLoading() {
		$('#loading').stop().show();
	}

	//hideLoading
	hideLoading() {
		$('#loading').stop().hide();
    }
    
    /*生成随机字符串*/
    randomString(len) {
        len = len || 15;
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        var maxPos = $chars.length;
        var pwd = '';
        for (let i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }
	
	/*获取url hash*/
	getQueryString(name, hash) {
		var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
		if (hash) {
			if (!window.location.hash) {
				return '';
			};
			var r = decodeURIComponent(window.location.hash).substr(1).match(reg);
		} else {
			var r = decodeURIComponent(window.location.search).substr(1).match(reg);
		}
		if (r != null) {
			return r[2];
		}
		return null;
	}

	/*获取 storage 缓存数据
	 * type  类型   local：localStorage   session：sessionStorage
	 * name  缓存数据name名
	 */
	getStorage(type, name) {
		var type = type || 'local';
		if (type == 'local') {
			var result = localStorage.getItem(name) ? localStorage.getItem(name) : "";
		} else if (type == 'session') {
			var result = sessionStorage.getItem(name) ? sessionStorage.getItem(name) : "";
		}
		return result;
	}

	/*设置 storage 缓存数据
	 *type  类型   local：localStorage   session：sessionStorage
	 *name  缓存数据name名
	 *content  缓存的数据内容
	 */
	setStorage(type, name, content) {
		var type = type || 'local';
		var data = content;
		if (typeof(data) == 'object') {
			data = JSON.stringify(content)
		};
		if (type == 'local') {
			localStorage.setItem(name, data);
		} else if (type == 'session') {
			sessionStorage.setItem(name, data);
		}
	}

	/*vue获得checkbox的值*/
	getCheckBoxVal(arr){
		let result=""
		if(!arr.length) return result;
		arr.forEach((item)=>{
			if(item.checked){
				result+=item.value+','
			}
		})
		return result.slice(0,-1);
	}

	/*vue转换checkbox的值*/
	setCheckBoxVal(arr,str){
		let copyarr = arr;
		if(!str) return copyarr;
		let newArr=str.split(',')
		copyarr.forEach((itemp)=>{
			newArr.forEach((item)=>{
				if(itemp.value == item){
					itemp.checked=true;
				}
			})
		})
		return copyarr;
	}

	goBack(){
		window.history.go(-1);
    }
    
    // 获得查询时间
    getSearchTime() {
        let json = {
            beginTime: '',
            endTime: ''
        }
        let selecttimes = util.getStorage('local', 'userselectTime') || 60000
        selecttimes = selecttimes * 1
        if (selecttimes) {
            let endTime = new Date().getTime()
            let beginTime = endTime - selecttimes
            json.beginTime = new Date(beginTime).format('yyyy/MM/dd hh:mm:ss')
            json.endTime = new Date(endTime).format('yyyy/MM/dd hh:mm:ss')
        }

        return json
    }

    // 应用构建socket、xtram
    startSocketXteam(json = {}) {
        const assetsList = json.assetsList || [];
        const taskItem = json.taskItem || {};
        const buildType = json.buildType || '';
        const startType = json.startType || 'new';
        if (!Array.isArray(assetsList) && !assetsList.length) return;

        const buildLogs = {}

        const result = [];
        if (startType === 'switch') {
            for (let i = 0; i < XTEAMLIST.length; i++) { XTEAMLIST[i] && XTEAMLIST[i].destroy() }
            XTEAMLIST = [];
        } else if (startType === 'agein') {
            return {
                xteamList: XTEAMLIST,
                socket: SOCKET,
            };
        } else if (startType === 'new') {
            XTEAMLIST = [];
        }

        // socket
        const socket = SOCKET = io.connect('/');
        Terminal.applyAddon(fit);
        Terminal.applyAddon(fullscreen); 
        Terminal.applyAddon(attach);
        // list
        assetsList.forEach((item, index) => {
            // 先执行 xteam
            let xteam = new Terminal({
                cursorBlink:true,
                fontSize:14,
                fontFamily: '"Monaco", "Consolas", "monospace"',
            });
            xteam.open(document.getElementById('terminal'+index));
            xteam.focus()
            xteam.fit()
            xteam.attach(socket)

            const data = 'process_data_' + index;
            const resize = 'process_resize_' + index;
            const end = 'process_end_' + index;
            const close = 'process_close_' + index;

            xteam.on('data', function (res) {
                socket.emit(data, res)
            })
            
            // socket
            socket.on(data, function (res) {
                xteam.write(res);
            });

            // end
            socket.on(end, function (res) {
                json.callback && json.callback(res)
            });

            XTEAMLIST.push(xteam);

            result.push({
                assitsItem:{
                    name: item.name,
                    lan_ip: item.lan_ip,
                    outer_ip: item.outer_ip,
                    port: item.port,
                    user: item.user,
                    password: item.password,
                },
                data, resize, close, end
            })
        })
        const userMsg = util.getStorage('local', 'userMsg');
        const user_name = userMsg ? JSON.parse(userMsg).user_name : '';
        socket.emit('socket', { 
            taskItem,
            data: result, buildType,
            id: json.id || '',
            user_name,
            cols: XTEAMLIST[0].cols,
            rows: XTEAMLIST[0].rows} || 'begin'
        );

        window.addEventListener('resize', this.resizeScreen.bind(this, XTEAMLIST, socket), false)

        socket.on('close', msg => { close(msg); });
        socket.on('disconnect', msg => { close(msg); });
        socket.on('disconnecting', () => { close(); });
        socket.on('error', (err) => { close(err); });

        function close(msg){
            XTEAMLIST.forEach(item => {
                item.write(msg || '服务器close,请刷新重试。');
            })
        }

        return {
            xteamList: XTEAMLIST,
            socket,
        };
        // xteam.clear()  xteam.reset()  xteam.destroy()
    }

    resizeScreen(XTEAMLIST, socket) {
        for (let i = 0; i < XTEAMLIST.length; i++) { XTEAMLIST[i] && XTEAMLIST[i].fit() }
        socket.emit('resize', { cols: XTEAMLIST[0].cols, rows: XTEAMLIST[0].rows })
    }

    // 设置xteam窗口大小
    setSocketXteam(type, xteamlist = [], socket) {
        if (MODELTYPE === type) return;
        MODELTYPE = type;
        const comm_mocel = document.querySelector('.comm_shell_model_content');
        const terminal_item = document.querySelectorAll('.terminal');
        const content_list = document.querySelectorAll('.com_content_list');
        if(type === 1){
            // 放大
            comm_mocel.style.width = 'calc(100% - 30px)'
            comm_mocel.style.height = 'calc(100% - 20px)'
            comm_mocel.style.marginLeft = '15px'
            comm_mocel.style.marginTop = '10px'
        }else if(type === 2){
            // 缩小
            comm_mocel.style.width = 'calc(70%)'
            comm_mocel.style.height = 'calc(80%)'
            comm_mocel.style.marginLeft = 'calc(15%)'
            comm_mocel.style.marginTop = 'calc(5%)'
        } else if (type === 3){
            for (let i = 0; i < terminal_item.length;i++) {
                terminal_item[i].style.top = '0'
            }
            for (let i = 0; i < content_list.length; i++) {
                content_list[i].style.marginTop = '10px'
                content_list[i].style.position = 'relative'
                content_list[i].style.width = 'calc(49%)'
                if (i % 2 === 0) content_list[i].style.marginRight = '2%'
                content_list[i].style.height = '500px'
            }
            comm_mocel.style.background = '#3e3e3e'
            comm_mocel.style.overflow = 'auto'
        } else if (type === 4) {
            for (let i = 0; i < terminal_item.length; i++) {
                terminal_item[i].style.top = '10px'
            }
            for (let i = 0; i < content_list.length; i++) {
                content_list[i].style.position = 'static'
            }
            comm_mocel.style.background = '#000'
            comm_mocel.style.overflow = 'hidden'
        }
        setTimeout(()=>{
            this.resizeScreen(xteamlist, socket)
        })
    }

    /* socket.io实现
    *  fn 信息回调触发
    *  query socket 参数
    */
    socket(json = {}) {
        const socket = io.connect('/');
        socket.on('close', msg => { close() });
        socket.on('disconnect', msg => { close() });
        socket.on('disconnecting', () => { close() });
        socket.on('error', (err) => { close() });

        function close(msg){
            CONSOLEXTEAM.forEach(item => {
                item.write(msg || '服务器close.');
            })
        }

        return socket;
    }

    /* xteam 实现
    * id
    */
    xteam(json = {}){
        const { socket, index, assetsItem} = json;
        const result = [];

        const data = 'console_data_' + index;
        const resize = 'console_resize_' + index;
        const close = 'console_close_' + index;
        const end = 'console_end_' + index;

        Terminal.applyAddon(fit);
        Terminal.applyAddon(fullscreen); 
        Terminal.applyAddon(attach);

        let xteam = new Terminal({
            cursorBlink: true,
            fontSize: 14,
            fontFamily: '"Monaco", "Consolas", "monospace"',
        });
        xteam.open(document.getElementById('console_terminal_' + index));
        xteam.focus()
        xteam.fit()
        xteam.attach(socket)

        xteam.on('data', function (res) {
            socket.emit(data, res)
        })

        xteam.write(`开始连接到 ${assetsItem.user}@${assetsItem.name}-${assetsItem.outer_ip}-${assetsItem.lan_ip}\r\n`)

        // socket
        socket.on(data, function (res) {
            xteam.write(res);
        });

        result.push({
            assitsItem: {
                name: assetsItem.name,
                lan_ip: assetsItem.lan_ip,
                outer_ip: assetsItem.outer_ip,
                port: assetsItem.port,
                user: assetsItem.user,
                password: assetsItem.password,
            },
            data, resize, close, end
        })

        socket.emit('socket', { data: result, buildType: 'sshonline', cols: xteam.cols, rows: xteam.rows } || 'begin');

        window.addEventListener('resize', this.resizeScreen.bind(this, [xteam], socket), false)
        this.resizeScreen([xteam], socket)

        CONSOLEXTEAM.push(xteam)

        return xteam;
    }
}

//初始化util对象
window.util = new utilfn();



