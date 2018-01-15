//index.js
//获取应用实例
import config from '../../utils/config.js'
import util from '../../utils/util.js'
import Mock from '../mock/mock.js'
const app = getApp()
const RequestApi = 'http://route.showapi.com/255-1'


Page({
  data: {
    tabs: ['新鲜事', '妹子图', '短视频'],
    currentTab: 0,
    duration: 200,
    girl_pageNum: 1,
    girl_size: 10,
    girlList: [],
    videoList:[],
    videoWidth:0,
    videoHeight: 255,
    hiddenLoading:true,
    poster: 'https://www.yingshangyan.com/static/theme/default/img/default.jpg'
  },
  onReady() {
    //获得组件
    this.ContentWapper = this.selectComponent("#ContentWapper");
  },
  itemChange: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
    if (this.data.currentTab == 1) {
      this.init();
    }
    if (e.detail.current == 2) {
      this.videoInit();
    }
  },
  changeItem: function (e) {
    this.setData({
      currentTab: e.target.dataset.id
    });
    if (this.data.currentTab == 1) {
      this.init();
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
      success: function(res) {
        let windowWidth = res.windowWidth - 10;
        that.setData({
          videoWidth: windowWidth,
        })
      },
    });
  },
  init() {
    let girl_pageNum = this.data.girl_pageNum;
    let girl_size = this.data.girl_size;
    let girlList = this.data.girlList;
    if (girlList.length) {
      return
    }
    this.setData({
      hiddenLoading: false
    })
    util.request({
      url: Mock.girllist,
      mock: true,
    }).then(res => {
      let girlListResult = res.results;
      let imgList = girlListResult.map(item => {
        return item.url
      })
      this.setData({
        hiddenLoading:true,
        girlList: girlListResult,
        imgList
      })
    })
  },
  videoInit(){
    let videoList = this.data.videoList;
    if (videoList.length) {
      return
    }
    this.setData({
      hiddenLoading: false
    })
    util.request({
      url: Mock.videoList,
      mock: true,
    }).then(res => {
      let videoListResult = res.results;
      this.setData({
        hiddenLoading: true,
        videoList: videoListResult
      })
    })
  }
})
