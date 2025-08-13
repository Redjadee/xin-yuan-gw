export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/alumnus/index',
    'pages/my/index',
  ],
  window: {
    backgroundTextStyle: 'light',

    navigationBarBackgroundColor: '#018BBC',
    navigationBarTitleText: '信缘 · 广外',
  },
  tabBar: {
    custom: true,
    list: [
       {
        pagePath: 'pages/alumnus/index',
        text: '校友组织',
        iconPath: '',
        selectedIconPath: ''
       },
       {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: '',
       },
       {
        pagePath: 'pages/my/index',
        text: '我的',
        iconPath: '',
        selectedIconPath: ''
       }
    ],
    color: '#9CC4E6',
    selectedColor: '#018BBC',
  }
})