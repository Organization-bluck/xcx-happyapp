// pages/detail/detail.js
import util from '../../utils/util.js';
import config from '../../utils/config.js';
import * as Mock from '../mock/mock.js'
// WxParse HtmlFormater 用来解析 content 文本为小程序视图
import WxParse from '../../utils/wxParse/wxParse.js';
// 把 html 转为化标准安全的格式
import HtmlFormater from '../../utils/htmlFormater.js';

const newsDetailApi = 'https://www.yingshangyan.com/api/news/getinfo';

let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollTop: 0,
    detailDataAll:{},
    detailData: {},
    isFromShare: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let contentUrl = options.contentUrl || '';
    this.setData({
      isFromShare: !!options.share
    });
    console.log(contentUrl)
    this.init(contentUrl);
  },
  articleRevert() {
    // this.data.detailData 是之前我们通过 setData 设置的响应数据
    let htmlContent = this.data.detailData && this.data.detailData.content;
    WxParse.wxParse('article', 'html', htmlContent, this, 0);
  },
  init(contentUrl) {
    if (contentUrl) {
      wx.showLoading({
        title: '加载中',
      })
      this.goTop()
      this.requestDetail(contentUrl).then(data => {
        this.configPageData(data)
      })
        //调用wxparse
        .then(() => {
          this.articleRevert()
        })
    }
  },
  goTop() {
    this.setData({
      scrollTop: 0
    })
  },
  prev() {
    let prev_id = this.data.detailDataAll && this.data.detailDataAll.prev_id || '';
    this.requestNextPrevContent(prev_id)
  },
  next() {
    let next_id = this.data.detailDataAll && this.data.detailDataAll.next_id || '';
    this.requestNextPrevContent(next_id)
  },
  requestNextPrevContent(contentUrl) {
    if (contentUrl) {
      this.init(contentUrl);
    } else {
      wx.showModal({
        title: '提示',
        content: '没有更多文章了!',
      })
    }
  },
  requestDetail(contentUrl) {
    return util.request({
      url: newsDetailApi,
      data: {
        url: contentUrl
      }
    }).then(res => {
      this.setData({
        detailDataAll:res.data
      })
      let formateUpdateTime = this.formateTime(res.data.info.date)
      // 格式化后的时间
      res.data.info.formateUpdateTime = formateUpdateTime
      return res.data.info
    })
  },
  formateTime(timeStr = '') {
    let year = timeStr.slice(0, 4),
      month = timeStr.slice(5, 7),
      day = timeStr.slice(8, 10);
    return `${year}/${month}/${day}`;
  },
  configPageData(data) {
    if (data) {
      wx.hideLoading()
      // 同步数据到 Model 层，Model 层数据发生变化的话，视图层会自动渲染
      this.setData({
        detailData: data
      });
      //设置标题
      let title = this.data.detailData.title || config.defaultBarTitle
      wx.setNavigationBarTitle({
        title: title
      })
    }
  },
  back() {
    if (this.data.isFromShare) {
      wx.navigateTo({
        url: '../index/index'
      })
    } else {
      wx.navigateBack()
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    let title = this.data.detailData && this.data.detailData.title || config.defaultShareText;
    let contentUrl = this.data.detailData && this.data.detailData.url || '';
    return {
      // 分享出去的内容标题
      title: title,

      // 用户点击分享出去的内容，跳转的地址
      // contentId为文章id参数；share参数作用是说明用户是从分享出去的地址进来的，我们后面会用到
      path: `/pages/detail/detail?share=1&contentUrl=${contentUrl}`,

      // 分享成功
      success: function (res) {
        console.log('share success')
       },

      // 分享失败
      fail: function (res) { }
    }
  },
})