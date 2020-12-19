import { DateTime } from "luxon"

const isSameDay = (day1: DateTime, day2: DateTime) => {
  return day1.year === day2.year && day1.month === day2.month && day1.day === day2.day
}

export default isSameDay