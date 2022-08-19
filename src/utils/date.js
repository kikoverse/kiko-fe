const Format = (v, fmt) => {
  let d = new Date(v);
  let o = {
    "M+": d.getMonth() + 1, // 月份
    "d+": d.getDate(), // 日
    "h+": d.getHours(), // 小时
    "m+": d.getMinutes(), // 分
    "s+": d.getSeconds(), // 秒
    "q+": Math.floor((d.getMonth() + 3) / 3), // 季度
    S: d.getMilliseconds(), // 毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, d.getFullYear() + "");
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return fmt;
};
/**
 * 倒计时
 * @param {*} timestamp
 * @returns
 */

const countdown = (timestamp) => {
  let interval = timestamp - Date.now();
  if (interval > 0) {
    let day, hour, minute, second;
    interval /= 1000;
    day = Math.floor(interval / 60 / 60 / 24);
    hour = Math.floor((interval / 60 / 60) % 24);
    minute = Math.floor((interval / 60) % 60);
    second = Math.floor(interval % 60);
    hour = hour < 10 ? "0" + hour : hour;
    minute = minute < 10 ? "0" + minute : minute;
    second = second < 10 ? "0" + second : second;
    return {
      day: day,
      hour: hour,
      minute: minute,
      second: second,
    };
  }
  return "";
};

export default {
  Format,
  countdown,
};
