;
(function () {

	function getSignature() {
		return axios.post(tcp + addr + ax + 'vs', JSON.stringify({
			"Action": "GetUgcUploadSign"
		}), {headers: {'X-CSRFToken': getCookie('csrftoken')}}).then(function (response) {
			return response.data.signature
		})
	};

	let vm = new Vue({
		delimiters: ['[[', ']]'],
		el: '#app',
		data: {
			msg: '',
			UorV: "step1",
			uploaderInfos: [],

			expD: '',
			p_type: 0,
			puzzle: 3,
			content_type: '',
			url: '',
			video_url: '',
			video_size: '',
			image: '',
			note: '',
			total: '',
			password: '',
			is_public: '',

			// 检测
			ck: {url: false, video: false, image: false, note: true, total: false, password: true, expD:false},

			// tip:'提示',
			tip: {url: 'url提示', video: 'video提示', image: 'image提示', note: 'note提示', total: 'total提示', password: 'password提示', expD: 'expD提示'},

			res_available: '',
			Icall:'',
			res_id: '',
			res_cs: '',
			res_expD:'',
			// text: '',
			Cname: '',
			isP:'',
			isA:'',
			lastD:'',
			expD:'',
			ceatedD:'',
		},

		created: function () {
			this.tcVod = new TcVod.default({
				getSignature: getSignature
			})
		},

		watch: {
			expD(val){
				if(val <= getNowFormatDate()){
					this.ck.expD = false
					this.tip.expD = '不能小于或等于今天'
				}else {
					this.ck.expD = true
					this.tip.expD = '成功通过'
					this.expD = val
				}
			},
			p_type(val){
				if (val == 0){
					$('#p_a')[0].setAttribute("style", "display: none");
					$('#s_a')[0].setAttribute("style", "display: none");
					$('#pu_a')[0].setAttribute("style", "display: none");
					this.password = '';
					this.ck.password = true;
					this.tip.password = ''
					this.p_type = val;
				}else if(val == 1){
					$('#p_a')[0].setAttribute("style", "display: ");
					$('#s_a')[0].setAttribute("style", "display: none");
					$('#pu_a')[0].setAttribute("style", "display: none");
					this.password = '';
					this.ck.password = false;
					this.tip.password = '密码不能为空'
					this.p_type = val;
				}else if(val == 2){
					$('#p_a')[0].setAttribute("style", "display: ");
					$('#s_a')[0].setAttribute("style", "display: ");
					$('#pu_a')[0].setAttribute("style", "display: none");
					this.password = '';
					this.ck.password = false;
					this.tip.password = '密码不能为空'
					this.p_type = val;
				}else if(val == 3){
					$('#p_a')[0].setAttribute("style", "display: none");
					$('#s_a')[0].setAttribute("style", "display: none");
					$('#pu_a')[0].setAttribute("style", "display: ");
					this.password = 3;
					this.ck.password = true;
					this.tip.password = ''
					this.p_type = val;
				}
			},
			puzzle(val){
				this.password = val
			},
			url(val) {
				this.ck.url = false;
				if (this.url == '' || this.url == undefined || this.url == null) {
					this.tip.url = "请输入内容"
				} else if (this.url.search(/^http:\/\//i) && this.url.search(/^https:\/\//i)) {
					this.tip.url = "请以为 http:// 或 https:// 开头"
				} else if (this.url.length >= 100) {
					this.tip.url = "路径长度不能超过100字"
				} else {
					this.tip.url = "成功通过,请自行检测地址有效性";
					this.ck.url = true
				}
			},
			total(val) {
				// TODO 识别次数 语音次数 视频容量 流量 判断
				this.ck.total = false;
				if (this.total == '' || this.total == undefined || this.total == null) {
					this.tip.total = "请填写内容"
				} else if (this.total < 1) {
					this.tip.total = "不能少于1次"
				} else if (this.total > available) {
					this.tip.total = "超过限定次数"
				} else if (this.content_type === "VIDEO" && ava_size - this.video_size * this.total < 0) {
					this.tip.total = "超出可用容量"
				} else {
					this.tip.total = "成功通过";
					this.ck.total = true
				}
			},
			note(val) {
				if (this.note.length >= 30) {
					this.ck.note = false;
					this.tip.note = '不能超过30字'
				} else {
					this.ck.note = true;
					this.tip.note = "成功通过"
				}
			},
			password(val) {
				if (this.p_type == 1){
					if (this.password == ''){
						this.ck.password = false;
						this.tip.password = '密码不能为空'
					} else if (this.password.length >= 30) {
						this.ck.password = false;
						this.tip.password = '不能超过30字'
					} else {
						this.ck.password = true;
						this.tip.password = "成功通过"
					}
				} else if (this.p_type == 2) {
					if (this.password == ''){
						this.ck.password = false;
						this.tip.password = '密码不能为空'
					} else if (this.password.length >= 30) {
						this.ck.password = false;
						this.tip.password = '不能超过30字'
					} else {
						this.ck.password = true;
						this.tip.password = "成功通过"
					}
				}
			},
		},

		methods: {
//  查看后台数据
			conx: function () {
				console.log(this.content_type + '\n' + this.url + '\n' + this.video_url +
						'|' + this.video_size + '\n' + this.image + '\n' + this.note + '|' + this.total +
						'|' + this.password + '\n' + this.p_type + '|' +  this.puzzle + '|' + this.is_public +
						'|' + available + '|' + ava_size +
						'|' + '|' + this.res_id +
						'|' + this.res_available + '|' + this.text);
			},

// 成功上传
			finish: function () {
				location.reload();
			},

//  刷新
			shua: function () {
				if (this.video_url != '') {
					axios.post(tcp + addr + ax + 'delvod', JSON.stringify({"video_id": this.video_url}), {
						headers: {
							'Content-Type': 'application/json',
							'X-CSRFToken': getCookie('csrftoken')
						}
					})
					.then(function (response) {
						console.log(response.data.msg)
					})
					.catch(function (error) {
						console.log(error);
					});
				}
				location.reload();
			},

//数数
			getnext: function (i) {
				// alert(i);
				var sz = new Array("step1", "step2", "step3", "step4");
				if (i == 'x') {
					i = this.UorV;
				}
				for (var j = 0; j < sz.length; j++) {
					if (i == sz[j]) {
						document.getElementById(i).style.display = "block";
					} else {
						document.getElementById(sz[j]).style.display = "none";
					}
				}
			},

// 删除内容
			del: function () {
				var self = this
				return axios.post(tcp + addr + ax + 'delete',  JSON.stringify({"cs": this.res_cs, 'id': this.res_id}), {
						headers: {
							'Content-Type': 'application/json',
							'X-CSRFToken': getCookie('csrftoken')
						}
				})
				.then(function (response) {
					console.log(response.data.msg)
					self.shua()
				})
				.catch(function (error) {
					console.log(error)
				})
			},

//创建内容
			add_send: function () {
				let is_public, data, m_load
				var self = this;
				if (this.is_public == true) {
					is_public = 1
				} else {
					is_public = 0
				}

				if (this.content_type == "URL") {
					data = [this.content_type, this.note, this.url]
				} else if (this.content_type == "VIDEO") {
					data = [this.content_type, this.note, this.video_url, this.video_size]
				}

				m_load = [this.p_type, this.password]

				let formData = new FormData()
				formData.append('image', this.image)
				console.log(this.image)
				formData.append('data', data)
				formData.append('p', m_load)
				formData.append('is_public', is_public)
				formData.append('total', this.total)
				formData.append('expD', this.expD)

				return axios.post(tcp + addr + ax + 'add', formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
						'X-CSRFToken': getCookie('csrftoken')
					}
				})
				.then(function (response) {
					console.log(response.data)
					if (response.data.msg == "成功添加识别图") {
						// 成功添加
						self.getnext("step5")
					} else {
						// 需要更新 获取到上一版本得信息
						$('#res_img')[0].setAttribute("src", response.data.image_url)
						self.res_cs = response.data.cs
						if (response.data.id != ''){
							self.res_id = response.data.id
						}
						self.res_available = response.data.available
						self.Icall = response.data.Icall
						self.Cname = response.data.Cname
						self.isP = response.data.isP
						self.isA = response.data.isA
						self.lastD = response.data.lastD
						self.res_expD = response.data.expD
						self.ceatedD = response.data.ceatedD
						// self.text = response.data.text
						console.log(response.data.text)
						self.getnext("step6")
					}
				})
				.catch(function (error) {
					console.log(error)
				})
			},

//选择样式
			setType: function () {
				var radios = document.getElementsByName("typex")
				// var radios = $("input[name='typex']")
				var value
				for (var i = 0; i < radios.length; i++) {
					if (radios[i].checked) {
						value = radios[i].value
						break;
					}
				}
				if (value == 0) {
					this.content_type = "URL"
					$('#url')[0].setAttribute("style", "display: ");
					this.getnext("step2")
				} else if (value == 1) {
					this.content_type = "VIDEO"
					$('#video')[0].setAttribute("style", "display: ");
					this.getnext("step2")
				}
			},

//设置url
			setURL: function () {
				if (this.ck.total == true && this.ck.url == true) {
					this.getnext("step4")
				}
			},

//video页
			setVIDEO: function () {
				if (this.ck.total == true && this.ck.video == true) {
					this.getnext("step4")
				} else {
					this.tip.video = "请上传视频"
				}
			},

//视频文件判断
			video_file: function () {
				// TODO 视频文件判断
				this.ck.video = false
				this.video_size = f((this.$refs.vFile.files[0].size) / 1024 / 1024, 0) // 找到视频文件
				isVideo(this.$refs.vFile.files[0].name)
				if (this.$refs.vFile.files[0] == null) {
					this.tip.video = "请上传视频"
				} else if (isVideo(this.$refs.vFile.files[0].name) == false) {
					this.tip.video = "不支持该格式的视频文件"
				} else if (ava_size - this.video_size * this.total < 0) {
					this.tip.total = "超出可用容量"
				} else {
					this.tip.video = "成功通过"
				}
			},

//添加视频
			vAdd: function () {
				this.$refs.vFile.click()
			},

//上传视频过程。
			vUpload: function () {
				var self = this
				// console.log(ava_size)
				// console.log(this.video_size)
				if (this.$refs.vFile.files[0] == null) {
					this.tip.video = "请上传视频"
				} else if (this.ck.total == false) {
					this.tip.total = '请修改可用次数'
				} else if (this.video_size * self.total >= ava_size) {
					// var mediaFile = this.$refs.vFile.files[0] // 找到视频文件
					// this.video_size = mediaFile.size
					self.tip.total = "超出可用容量"
				} else {
					// 如果存在video_url 则删除，并重新上传，并获得新的video_url
					if (this.video_url != '') {
						axios.post(tcp + addr + ax + 'delvod', JSON.stringify({"video_id": this.video_url}), {
							headers: {
								'Content-Type': 'application/json',
								'X-CSRFToken': getCookie('csrftoken')
							}
						})
						.then(function (response) {
							console.log(response.data.msg)
						})
						.catch(function (error) {
							console.log(error)
						})
					}
					var mediaFile = this.$refs.vFile.files[0] // 找到视频文件

					var uploader = this.tcVod.upload({ // 加载视频文件
						mediaFile: mediaFile,
					})
					uploader.on('media_progress', function (info) { // 获取上传进度
						console.log(info.percent)
						uploaderInfo.progress = info.percent
					})
					uploader.on('media_upload', function (info) { // 多媒体上传成功
						uploaderInfo.isVideoUploadSuccess = true
					})

					console.log(uploader, 'uploader')

					var uploaderInfo = {
						videoInfo: uploader.videoInfo,
						isVideoUploadSuccess: false,
						isVideoUploadCancel: false,
						progress: 0,
						fileId: '',
						videoUrl: '',
						cancel: function () {
							uploaderInfo.isVideoUploadCancel = true
							uploader.cancel()
						},
					}

					this.uploaderInfos.push(uploaderInfo)

					uploader.done().then(function (doneResult) {
						console.log('doneResult', doneResult)
						uploaderInfo.fileId = doneResult.fileId

						self.video_url = doneResult.fileId
						console.log(self.video_url)

						self.ck.video = true

						return doneResult.video.url
					}).then(function (videoUrl) {
						uploaderInfo.videoUrl = videoUrl
						self.$refs.vE.reset()
					})
				}
			},
			//结束上传视频

//image页
			setIMAGE: function () {
				var file = $('#file-txz')[0].files[0]
				if (isImage(file.name) == false) {
					this.tip.image = "此格式非图像格式"
				} else if (this.ck.password == true && this.ck.note == true && this.image != '' && this.ck.expD == true) {
					// this.getnext("step5")
					this.add_send()
				}
			},

//添加图片
			image_content: function () {
				this.$refs.vFile.click()
			},

// 图片压缩
			image_compressor: function () {
				"use strict";
				var imagec = this
				var file = $('#file-txz')[0].files[0]

				if (!file) {
					return;
				} else if (isImage(file.name) == false) {
					this.tip.image = "此格式非图像格式"
				} else {
					this.tip.image = "成功通过"
					new Compressor(file, {
						quality: 0.6,
						maxWidth: 512,
						maxHeight: 512,
						convertSize: 30000,
						success(result) {
							// console.log(result)
							imagec.image = result
							$('#img-txz')[0].setAttribute("src", URL.createObjectURL(imagec.image));
							$('#img-txy')[0].setAttribute("src", URL.createObjectURL(imagec.image));
							console.log(imagec.image)
						},
						error(err) {
							console.log(err.message);
						},
					});
				}
			},

//录音
			startRecording: function () {
				moveout = true
				// console.log("启动")
				rec = Recorder({
					type: "mp3", sampleRate: 16000, bitRate: 16 //mp3格式，指定采样率hz、比特率kbps，其他参数使用默认配置；注意：是数字的参数必须提供数字，不要用字符串；需要使用的type类型，需提前把格式支持文件加载进来，比如使用wav格式需要提前加载wav.js编码引擎
					, onProcess: function (buffers, powerLevel, bufferDuration, bufferSampleRate, newBufferIdx, asyncEnd) {
					}
				})

				// var dialog=createDelayDialog() //我们可以选择性的弹一个对话框：为了防止移动端浏览器存在第三种情况：用户忽略，并且（或者国产系统UC系）浏览器没有任何回调，此处demo省略了弹窗的代码
				rec.open(function () {//打开麦克风授权获得相关资源
					// dialog&&dialog.Cancel() //如果开启了弹框，此处需要取消
					rec.start()
				}, function (msg, isUserNotAllow) {//用户拒绝未授权或不支持
					// dialog&&dialog.Cancel() //如果开启了弹框，此处需要取消
					console.log((isUserNotAllow ? "UserNotAllow，" : "") + "无法录音:" + msg)
				})
			},

// 上传录音
			uploadAudio: function () {
				if (moveout == true) {
					var self = this
					moveout = false
					// console.log("关闭")
					rec.stop(function (blob, duration) {
						// console.log(blob,(window.URL||webkitURL).createObjectURL(blob),"时长:"+duration+"ms")
						rec.close()  //释放录音资源，当然可以不释放，后面可以连续调用start；但不释放时系统或浏览器会一直提示在录音，最佳操作是录完就close掉
						rec = null
						let formData = new FormData()
						formData.append('audio', blob)
						//已经拿到blob文件对象想干嘛就干嘛：立即播放、上传
						return axios.post(tcp + addr + ax + 'speech', formData, {
							headers: {
								'Content-Type': 'multipart/form-data',
								'X-CSRFToken': getCookie('csrftoken')
							}
						})
						.then(function (response) {
							// console.log(response.data.msg);
							self.password = response.data.msg
						})
						.catch(function (error) {
							console.log(error)
						});
					}, function (msg) {
						console.log("录音失败:" + msg)
						rec.close()  //可以通过stop方法的第3个参数来自动调用close
						rec = null
					});
				}
			},

// 退出登录
			Q: function() {
				window.location.href= tcp + addr  + "/"
			},
		},
	})
})();

let tcp = 'http://'
let addr = '10.168.0.16:8080'
// let tcp = 'https://'
// let addr = '云识.com'
// let addr = 'redwings.tpddns.cn:2021'
let ax = '/axios/'
let moveout, rec

function f(num, n) {
	return parseInt(num * Math.pow(10, n) + 0.9, 10) / Math.pow(10, n);
}

function getNowFormatDate() {
	var day = new Date();
	var Year = 0;
	var Month = 0;
	var Day = 0;
	var CurrentDate = "";
	//初始化时间
	//Year       = day.getYear();//有火狐下2008年显示108的bug
	Year = day.getFullYear();//ie火狐下都可以
	Month = day.getMonth() + 1;
	Day = day.getDate();
	CurrentDate += Year + "-";
	if (Month >= 10) {
		CurrentDate += Month + "-";
	} else {
		CurrentDate += "0" + Month + "-";
	}
	if (Day >= 10) {
		CurrentDate += Day;
	} else {
		CurrentDate += "0" + Day;
	}
	return CurrentDate;
}

function getCookie(name) {
	var value = '; ' + document.cookie;
	var parts = value.split('; ' + name + '=');
	if (parts.length == 2) return parts.pop().split(';').shift()
}

function isImage(filePath) {
	var index = filePath.lastIndexOf(".");
	var ext = filePath.substr(index + 1);
	return ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'].indexOf(ext.toLowerCase()) != -1;
}

function isVideo(filePath) {
	var index = filePath.lastIndexOf(".");
	var ext = filePath.substr(index + 1);
	return ['mp4'].indexOf(ext.toLowerCase()) != -1;
}
