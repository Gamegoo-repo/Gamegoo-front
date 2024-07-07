import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import "dayjs/locale/ko";
dayjs.locale("ko");

dayjs.extend(updateLocale)

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
    },
})

dayjs.extend(relativeTime);

export default dayjs;