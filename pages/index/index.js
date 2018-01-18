//index.js
//获取应用实例
import config from '../../utils/config.js'
import util from '../../utils/util.js'
import Mock from '../mock/mock.js'
const app = getApp()
const baseApi = 'https://www.yingshangyan.com/api/commen/getUrlContent';
const RequestApi = 'https://route.showapi.com/255-1';
const girlApi = 'http://gank.io/api/data/福利/20/';
const randomgirlApi = 'http://gank.io/api/random/data/福利/20'
const urlParams = {
  showapi_appid: "54360",
  showapi_sign: "28bd99df05ef49dca94cf538276fc278"
}
let page = 1;//页码
const types = ["29", "10", "41", "31"];
//1->全部;41->视频;10->图片;29->段子;31->声音;
var DATATYPE = {
  ALLDATATYPE: "1",
  VIDEODATATYPE: "41",
  PICTUREDATATYPE: "10",
  TEXTDATATYPE: "29",
  VOICEDATATYPE: "31"
};


Page({
  data: {
    tabs: ['段子', '妹子图', '短视频'],
    currentTab: 0,
    duration: 200,
    girl_pageNum: 1,
    girl_size: 10,
    girlList: [],
    videoList: [],
    textList: [],
    videoWidth: 0,
    videoHeight: 255,
    hiddenLoading: true,
    poster: 'https://www.yingshangyan.com/static/theme/default/img/default.jpg',
    swiperHeight: "0"
  },
  onReady() {
    //获得组件
    this.ContentWapper = this.selectComponent("#ContentWapper");
    //设置swiper 初始高度
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          swiperHeight: res.windowHeight
        });
      }
    })
  },
  itemChange: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
    if (this.data.currentTab == 1) {
      this.getGirlData();
      return
    }
    //如果需要加载数据
    if (this.needLoadNewDataAfterSwiper()) {
      this.refreshNewData();
    }
  },
  changeItem: function (e) {
    this.setData({
      currentTab: e.target.dataset.id
    });
    if (this.data.currentTab == 1) {
      this.getGirlData();
      return
    }
    //如果需要加载数据
    if (this.needLoadNewDataAfterSwiper()) {
      this.refreshNewData();
    }
  },
  getGirlData(){
    let that = this;
    page = 1;
    let girlApis = `${girlApi}${page}`
    let girlApiBase64 = util.Base64.encode(girlApis)
    console.log(girlApis)
    util.request({
      url: baseApi,
      data: {
        url: girlApiBase64,
        type: 'get'
      }
    }).then(res => {
      let dataList = res.data.results;
      let imgList = dataList.map(item => {
        return item.url
      })
      that.setData({
        imgList
      })
      that.setData({
        girlList: res.data.results
      })
      setTimeout(() => {
        wx.hideNavigationBarLoading();
        wx.hideToast();
      }, 1000);
    })
  },
  imgYu(event) {
    var src = event.currentTarget.dataset.src;//获取data-src
    var imgList = this.data.imgList
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  onLoad() {
    // 设置视频宽度和页面宽度相同减去间距
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        let windowWidth = res.windowWidth - 10;
        that.setData({
          videoWidth: windowWidth,
        })
      },
    });

    this.refreshNewData();
  },
  refreshNewData() {
    let that = this;
    util.showLoading();
    wx.showNavigationBarLoading();
    page = 1;
    let params = {
      'showapi_appid': urlParams.showapi_appid,
      'showapi_sign': urlParams.showapi_sign,
      'type': types[this.data.currentTab],
      'page':page
    }
    let paramsStr = JSON.stringify(params)
    let paramsBase64 = util.Base64.encode(paramsStr)
    let RequestApiBase64 = util.Base64.encode(RequestApi)
    console.log(paramsStr)
    util.request({
      url: baseApi,
      data:{
        url: RequestApiBase64,
        type:'get',
        params: paramsBase64
      }
    }).then(res => {
      console.log(res)
      that.setNewDataWithRes(res, that);
      setTimeout(() => {
        wx.hideNavigationBarLoading();
        wx.hideToast();
      }, 1000);
    })
  },
  setNewDataWithRes(res,that){
    var dataList = res.data.showapi_res_body.pagebean.contentlist;
    if (dataList[0].cdn_img){
      let imgList = dataList.map(item => {
        return item.cdn_img
      })
      this.setData({
        imgList
      })
    }
    switch (types[this.data.currentTab]) {
      //段子
      case DATATYPE.TEXTDATATYPE:
        that.setData({
          textList: dataList
        });
        break;
      //视频
      case DATATYPE.VIDEODATATYPE:
        dataList.forEach((item) => {
          item.text = util.removeHTMLTag(item.text)
        })
        that.setData({
          videoList: dataList
        });
        break;
      //图片
      case DATATYPE.PICTUREDATATYPE:
        that.setData({
          girlList: dataList
        });
        break;
      default:
        break;
    }
  },
  //滚动后需不要加载数据
  needLoadNewDataAfterSwiper() {
    switch (types[this.data.currentTab]) {
      //段子
      case DATATYPE.TEXTDATATYPE:
        return this.data.textList.length > 0 ? false : true;
      //图片
      case DATATYPE.PICTUREDATATYPE:
        return this.data.girlList.length > 0 ? false : true;
      //视频
      case DATATYPE.VIDEODATATYPE:
        return this.data.videoList.length > 0 ? false : true;
      default:
        break;
    }
    return false;
  },
  loadMoreData(){
    //加载提示框
    util.showLoading();
    wx.showNavigationBarLoading();
    var that = this;
    page += 1;
    if(this.data.currentTab == 1){
      this.loadGirlData(page)
      return
    }
    let params = {
      'showapi_appid': urlParams.showapi_appid,
      'showapi_sign': urlParams.showapi_sign,
      'type': types[this.data.currentTab],
      'page': page
    }
    let paramsStr = JSON.stringify(params)
    let paramsBase64 = util.Base64.encode(paramsStr)
    let RequestApiBase64 = util.Base64.encode(RequestApi)
    util.request({
      url: baseApi,
      data: {
        url: RequestApiBase64,
        type: 'get',
        params: paramsBase64
      }
    }).then(res => {
      console.log(res)
      that.setMoreDataWithRes(res, that);
      setTimeout(() => {
        wx.hideNavigationBarLoading();
        wx.hideToast();
      }, 1000);
    })
  },
  //加载更多妹子图
  loadGirlData(page){
    let that = this;
    let girlApis = `${girlApi}${page}`
    let girlApiBase64 = util.Base64.encode(girlApis)
    console.log(girlApis)
    util.request({
      url: baseApi,
      data: {
        url: girlApiBase64,
        type: 'get'
      }
    }).then(res => {
      let dataList = res.data.results;
      let _imgList = this.data.imgList;
      if (_imgList) {
        let imgList = dataList.map(item => {
          return item.url
        })
        that.setData({
          imgList: _imgList.concat(imgList)
        })
      }
      that.setData({
        girlList: that.data.girlList.concat(dataList)
      })
      setTimeout(() => {
        wx.hideNavigationBarLoading();
        wx.hideToast();
      }, 1000);
    })
  },
  //滑动到底部
  onReachBottom() {
    console.log(1)
  },
  //设置加载更多的数据
  setMoreDataWithRes(res, that) {
    var dataList = res.data.showapi_res_body.pagebean.contentlist;
    let _imgList = this.data.imgList;
    if (_imgList){
      let imgList = dataList.map(item => {
        return item.image0
      })
      this.setData({
        imgList: _imgList.concat(imgList)
      })
    }
    switch (types[this.data.currentTab]) {
      //段子
      case DATATYPE.TEXTDATATYPE:
        that.setData({
          textList: that.data.textList.concat(dataList)
        });
        break;
      //图片
      case DATATYPE.PICTUREDATATYPE:
        that.setData({
          girlList: that.data.girlList.concat(dataList)
        });
        break;
      //视频
      case DATATYPE.VIDEODATATYPE:
        that.setData({
          videoList: that.data.videoList.concat(dataList)
        });
        break;
      default:
        break;
    }
  },
  randomLoad(){
    let that = this;
    let girlApiBase64 = util.Base64.encode(randomgirlApi)
    page = Math.max(1,(Math.random()*10) | 0)
    util.request({
      url: baseApi,
      data: {
        url: girlApiBase64,
        type: 'get'
      }
    }).then(res => {
      console.log(res)
      let dataList = res.data.results;
      let imgList = dataList.map(item => {
        return item.url
      })
      that.setData({
        imgList
      })
      that.setData({
        girlList: res.data.results
      })
      setTimeout(() => {
        wx.hideNavigationBarLoading();
        wx.hideToast();
      }, 1000);
    })
  },
  //视频播放开始
  videoPlay(e){
    //暂停上一条视频的播放
    
  },
  //视频播放结束
  videoEnd(){
    
  }
})
