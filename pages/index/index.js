//index.js
//获取应用实例
import config from '../../utils/config.js'
import util from '../../utils/util.js'
import Mock from '../mock/mock.js'
const app = getApp()


const girlApi = 'http://gank.io/api/data/福利/'
Page({
  data: {
    tabs: ['新鲜事', '妹子图', '短视频'],
    currentTab: 0,
    duration: 200,
    girl_pageNum: 1,
    girl_size: 10,
    girlList: [],
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
    // this.init();
  },
  init() {
    let girl_pageNum = this.data.girl_pageNum;
    let girl_size = this.data.girl_size;
    this.setData({
      hiddenLoading:false
    })
    util.request({
      url: Mock.girllist,
      mock: true,
    }).then(res => {
      let girlList = res.results;
      let imgList = girlList.map(item => {
        return item.url
      })
      this.setData({
        hiddenLoading:true,
        girlList,
        imgList
      })
    })
  },
  // onPullDownRefresh(){
  //   wx.showNavigationBarLoading()
  //   let currentIndex = this.data.currentTab;
  //   // switch (currentIndex){
  //   //   case 0:
  //   //     break;
  //   //   case 1:
  //   //     this.init();
  //   //     break;
  //   //   case 2:
  //   //     break;
  //   // }
  //   setTimeout(function () {
  //     // complete
  //     wx.hideNavigationBarLoading() //完成停止加载
  //     wx.stopPullDownRefresh() //停止下拉刷新
  //   }, 500);
  // }
})
