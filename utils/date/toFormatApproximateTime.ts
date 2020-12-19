import { DateTime } from "luxon"

const toFormatApproximateTime = (date: DateTime) => {
  const today = DateTime.local()
  const diff = today.diff(date, ['years', 'months', 'weeks', 'days', 'hours', 'minutes'])
  if(diff.years > 0){
    return `${diff.years.toFixed(0)}年前`
  }else if(diff.months > 0){
    return `${diff.months.toFixed(0)}ヶ月前`
  }else if(diff.weeks > 0){
    return `${diff.weeks.toFixed(0)}週間前`
  }else if(diff.days > 0){
    return `${diff.days.toFixed(0)}日前`
  }else if(diff.minutes > 1){
    if(diff.minutes <= 10){
      return `${diff.minutes.toFixed(0)}分前`
    }else{
      return `${(Math.round(diff.minutes/10) * 10).toFixed(0)}分前`
    }
  }else{
    return '今'
  }
}

export default toFormatApproximateTime