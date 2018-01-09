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

module.exports = {
  formatTime: formatTime,
  request,
  setStorageData,
  getStorageData,
  alert
}
