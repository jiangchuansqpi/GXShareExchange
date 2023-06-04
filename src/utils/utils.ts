const weekdays = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

// 输出时间字符串格式为yyyy-MM-dd DDD hh:mm:ss
export function parseDateStringToLocalString (dateTimeString:any) {
  const originDate = new Date(dateTimeString)
  const dateArray = originDate.toLocaleString().split(' ')

  const timeClock = dateArray[1].split('午')
  if (timeClock[0] === '下') {
    const timer: any = timeClock[1].split(':')
    timer[0] = timer[0] * 1 + 12
    dateArray[1] = timer.join(':')
  }
  const dayStr = weekdays[originDate.getDay()]
  return {
    date: `${dateArray[0]}`,
    today: `${dayStr}`,
    time: `${dateArray[1]}`
  }
}
