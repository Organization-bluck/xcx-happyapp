//index.js
//获取应用实例
import config from '../../utils/config.js'
import util from '../../utils/util.js'
import Mock from '../mock/mock.js'
const app = getApp()
const RequestApi = 'https://route.showapi.com/255-1';
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
    //如果需要加载数据
    if (this.needLoadNewDataAfterSwiper()) {
      this.refreshNewData();
    }
  },
  changeItem: function (e) {
    this.setData({
      currentTab: e.target.dataset.id
    });
    //如果需要加载数据
    if (this.needLoadNewDataAfterSwiper()) {
      this.refreshNewData();
    }
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
    let url = `${RequestApi}?showapi_appid=${urlParams.showapi_appid}&showapi_sign=${urlParams.showapi_sign}&type=${types[this.data.currentTab]}&page=${page}`;
    util.request({
      url: url,
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
    var dataList = res.showapi_res_body.pagebean.contentlist;
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
    var that = this;
    page += 1;
    let url = `${RequestApi}?showapi_appid=${urlParams.showapi_appid}&showapi_sign=${urlParams.showapi_sign}&type=${types[this.data.currentTab]}&page=${page}`;
    util.request({
      url: url,
    }).then(res => {
      console.log(res)
      that.setMoreDataWithRes(res, that);
      setTimeout(() => {
        wx.hideNavigationBarLoading();
        wx.hideToast();
      }, 1000);
    })
  },
  onReachBottom() {
    console.log(1)
  },
  //设置加载更多的数据
  setMoreDataWithRes(res, that) {
    var dataList = res.showapi_res_body.pagebean.contentlist;
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
})
