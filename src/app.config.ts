export default defineAppConfig({
  pages: [
  'pages/index/index',
  'pages/alumnus/index',
  'pages/my/index'],

  window: {
    backgroundTextStyle: 'light',

    navigationBarBackgroundColor: '#018BBC',
    navigationBarTitleText: '信缘 · 广外'
  },
  
  tabBar: {
    custom: true,
    list: [
    {
      pagePath: 'pages/alumnus/index',
      text: '校友组织',
      iconPath: './global/assets/images/tab-bar/alumnus.png',
      selectedIconPath: './global/assets/images/tab-bar/alumnus-s.png'
    },
    {
      pagePath: 'pages/index/index',
      text: '首页',
      iconPath: './global/assets/images/tab-bar/tab-logo2.png',
      selectedIconPath: './global/assets/images/tab-bar/tab-logo2.png'
    },
    {
      pagePath: 'pages/my/index',
      text: '我的',
      iconPath: './global/assets/images/tab-bar/my.png',
      selectedIconPath: './global/assets/images/tab-bar/my-s.png'
    }],

    color: '#9CC4E6',
    selectedColor: '#018BBC'
  }, 
  subPackages: [
    { root: "loginPkg/", pages: [
      "pages/login/index",
      'pages/register/index',
      'pages/forgot/index',
      'pages/reset/index'
    ]},
    { root: "activityPkg/", pages: [
      'pages/allview/index',
      'pages/detail/index',
    ]},
    { root: "myPkg/", pages: [
      'pages/contact/index',
      'pages/setting/index',
      'pages/myinfor/index',
      'pages/settingdetail/index',
    ]},
    { root: 'msgPkg/', pages: [
      'pages/allmsg/index',
      'pages/chat/index'
    ]},
    { root: 'adminPkg/', pages: [
      'pages/home/index',
      'pages/setting/index',
      'pages/import/index',
      'pages/new/index',
      'pages/adminManage/index',
    ]}
  ]
});