import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import "dayjs/locale/ko";
dayjs.locale("ko");

dayjs.extend(updateLocale)
let config = {
    thresholds: [
        { l: 's', r: 1 },
        { l: 'm', r: 1 },
        { l: 'mm', r: 59, d: '분' },
        { l: 'h', r: 1 },
        { l: 'hh', r: 23, d: '시간' },
        { l: 'd', r: 1 },
        { l: 'dd', r: 29, d: '일' },
        { l: 'M', r: 1 },
        { l: 'MM', r: 11, d: '개월' },
        { l: 'y', r: 1 },
        { l: 'yy', d: '년' }
    ],
    function(number: string) {
        return number;
    }
};

dayjs.updateLocale('ko', {
    relativeTime: {
        future: "%s",
        past: "%s 전",
        s: '1초',
        m: "1분",
        mm: "%d분",
        h: "1시간",
        hh: "%d시간",
        d: "1일",
        dd: "%d일",
        M: "1개월",
        MM: "%d개월",
        y: "1년",
        yy: "%d년"
    }
})

dayjs.extend(relativeTime);

export default dayjs;