export default defineAppConfig({
  pages: [
  'pages/index/index',
  'pages/alumnus/index',
  'pages/my/index'],

  window: {
    backgroundTextStyle: 'light',

    navigationBarBackgroundColor: '#018BBC',
    navigationBarTitleText: '广外信院校友之家'
  },

  __usePrivacyCheck__: true,

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
      'pages/chat/index',
      'pages/infor/index'
    ]},
    { root: 'adminPkg/', pages: [
      'pages/home/index',
      'pages/setting/index',
      'pages/import/index',
      'pages/newActivi/index',
      'pages/adminManage/index',
      'pages/organizationNaudit/index',
      'pages/newOrgan/index',
      'pages/auditDetail/index',
      'pages/newNotification/index'
    ]}
  ],
  preloadRule: {
    // 【预下载策略1】进入首页时预下载常用分包
    'pages/index/index': {
      network: 'all',
      packages: ['myPkg', 'loginPkg']
    },
    // 【预下载策略2】进入"我的"页面时预下载个人中心分包
    'pages/my/index': {
      network: 'all',
      packages: ['myPkg']
    }
  }
});