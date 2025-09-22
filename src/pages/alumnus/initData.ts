import { itemType } from './components/AlumnusItem'

export const myInfor: itemType = {
  profileHref: '',
  name: '李华',
  description: '我是信院2026届新生',
  status: true,
  url: '',
  type: '校友',
  alumnus: {
    city: '广州',
    domain: '前端开发',
    department: '软工',
    grade: '2026'
  }
}

export const alumnusItemList: itemType[] = [
  {
    profileHref: '',
    name: '李华',
    description: '我是信院2026届新生',
    status: false,
    url: '',
    type: '校友',
    alumnus: {
      city: '上海',
      domain: '后端开发',
      department: '软工',
      grade: '2026'
    }
  },
  {
    profileHref: '',
    name: '阿强',
    description: '我是信院2025届学生',
    status: false,
    url: '',
    type: '校友',
    alumnus: {
      city: '北京',
      domain: '产品经理',
      department: '软工',
      grade: '2025'
    }
  },
  {
    profileHref: '',
    name: '小红',
    description: '我是信院2021届毕业生',
    status: true,
    url: '',
    type: '校友',
    alumnus: {
      city: '佛山',
      domain: '设计',
      department: '计科',
      grade: '2021'
    }
  },
  {
    profileHref: '',
    name: '国强',
    description: '我是信院2001届老生',
    status: false,
    url: '',
    type: '校友',
    alumnus: {
      city: '广州',
      domain: '前端开发',
      department: '网安',
      grade: '2001'
    }
  }
]

export const organizationList: itemType[] = [
  {
    profileHref: '',
    name: '广州校友会',
    description: '广州校友会',
    status: false,
    url: '',
    type: '组织',
    organization: {
      professional: false,
      oversea: true,
      centainArea: false,
      industry: false,
      habit: true
    }
  }
]
