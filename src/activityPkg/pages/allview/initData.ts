import { actiItemType } from '../../components/ActiItem';

export const actiItems: actiItemType[] = [
  {
    title: "春季音乐会",
    season: 1,
    beginTime: "2025-03-15 19:00",
    endTime: "2025-03-15 21:00",
    grade: 4,
    isFree: true,
    className: "spring-event",
    id: '1'
  },
  {
    title: "夏季艺术展",
    season: 2,
    beginTime: "2025-06-20 10:00",
    endTime: "2025-06-20 18:00",
    grade: 5,
    isFree: false,
    className: "summer-event",
    id: '2'
  },
  {
    title: "秋季读书会",
    season: 3,
    beginTime: "2025-09-20 14:00",
    endTime: "2025-10-10 16:00",
    grade: 3,
    isFree: true,
    className: "autumn-event",
    id: '3'
  },
  {
    title: "冬季滑雪营",
    season: 4,
    beginTime: "2025-12-05 09:00",
    endTime: "2025-12-05 17:00",
    grade: 4,
    isFree: false,
    className: "winter-event",
    id: '4'
  },
  {
    title: "年度庆典",
    season: 5,
    beginTime: "2025-12-31 20:00",
    endTime: "2026-01-01 02:00",
    grade: 5,
    isFree: false,
    className: "annual-event",
    id: '4'
  }
];