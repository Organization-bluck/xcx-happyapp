'use strict';
// 开发生产环境
const env = 'dev';// dev production
/*
 * 默认接口出错弹窗文案
 * @type {string}
 */
const defaultAlertMessage = '好像哪里出了小问题~ 请再试一次~';
/*
 * 默认分享文案
 * @type {{en: string}}
 */
const defaultShareText = {
  en: '默认分享文案'
};
/*
 * 小程序默认标题栏文字
 * @type {string}
 */
const defaultBarTitle = {
  en: '小程序默认标题栏文字'
};
/*
 * 文章默认图片
 * @type {string}
 */
const defaultImg = {
  articleImg: 'https://www.yingshangyan.com/static/theme/default/img/default.jpg',
  coverImg: 'https://www.yingshangyan.com/static/theme/default/img/default.jpg'
};

let config = {
  env: env,
  defaultBarTitle: defaultBarTitle['en'],
  defaultImg: defaultImg,
  defaultAlertMsg: defaultAlertMessage,
  defaultShareText: defaultShareText['en'],
  isDev: env === 'dev',
  isProduction: env === 'production'
};
export default config;
