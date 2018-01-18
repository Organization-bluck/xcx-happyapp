import config from './config.js'
//格式化日期
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//alert showModal封装
const alert = (title = '提示', content = '好像哪里出了小问题~ 请再试一次~') => {
  if ('object' === typeof content) {
    content = config.isDEV && JSON.stringify(content) || '好像哪里出了小问题~ 请再试一次~'
  }
  wx.showModal({
    title: title,
    content: content
  })
}
//loading提示

const showLoading = (title = "数据加载中", duration = 1000) => {
  wx.showToast({
    title: title,
    icon: 'loading',
    duration: (duration <= 0) ? 5000 : duration
  });
}

//http 请求
const DEFAULT_REQUEST_OPTIONS = {
  url: '',
  data: {},
  header: {
    'Content-Type': 'application/json'
  },
  method: 'GET',
  dataType: 'json'
}
const request = opt => {
  let options = Object.assign({}, DEFAULT_REQUEST_OPTIONS, opt)
  let { url, data, header, method, dataType, mock = false } = options
  let self = this
  return new Promise((resolve, reject) => {
    // 判断有没有本地mock数据
    if(mock){
      let res = {
        statusCode: 200,
        data: url
      }
      if (res && res.statusCode == 200 && res.data) {
        resolve(res.data)
      } else {
        self.alert('提示', res)
        reject(res)
      }
    }else{
      wx.request({
        url,
        data,
        header,
        method,
        dataType,
        success (res) {
          if (res && res.statusCode == 200 && res.data) {
            resolve(res.data);
          } else {
            self.alert('提示', res);
            reject(res);
          }
        },
        fail (err) {
          self.log(err);
          self.alert('提示', err);
          reject(err);
        }
      })
    }
  })
}

// 本地缓存读取
const getStorageData = (key, cb) =>{
  let self = this;

  // 将数据存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个异步接口
  wx.getStorage({
    key: key,
    success(res) {
      cb && cb(res.data);
    },
    fail(err) {
      let msg = err.errMsg || '';
      if (/getStorage:fail/.test(msg)) {
        setStorageData(key)
      }
    }
  })
}
// 本地缓存存储
const setStorageData = (key, value = '', cb) => {
  wx.setStorage({
    key: key,
    data: value,
    success() {
      cb && cb();
    }
  })
}

//Base64对象
const Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9+/=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/rn/g, "n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } } 

// 过滤字符串里的html标签
const removeHTMLTag = (str) => {
  str = str.replace(/<\/?[^>]*>/g, ''); //去除HTML tag  
  str = str.replace(/[ | ]*\n/g, '\n'); //去除行尾空白  
  str = str.replace(/ /ig, '');//去掉   
  str = Trim(str, "g");
  return str;  
}
function Trim(str, is_global) {
  var result;
  result = str.replace(/(^\s+)|(\s+$)/g, "");
  if (is_global.toLowerCase() == "g") {
    result = result.replace(/\s/g, "");
  }
  return result;
}  

module.exports = {
  formatTime: formatTime,
  request,
  setStorageData,
  getStorageData,
  alert,
  showLoading,
  Base64,
  removeHTMLTag
}
