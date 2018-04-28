function getNextDayOfWeek(date: Date, dayOfWeek: number): Date {
    // Code to check that date and dayOfWeek are valid left as an exercise ;)

    const resultDate = new Date(date.getTime());

    resultDate.setDate(date.getDate() + (7 + dayOfWeek - date.getDay()) % 7);
    return resultDate;
}

export function timeToMondaySecondsEpoch(time: string): number {
  const now = new Date()
  const [hours, minutes] = time.split(":")
  const nextMonday = getNextDayOfWeek(now, 1)
  nextMonday.setHours(parseInt(hours))
  nextMonday.setMinutes(parseInt(minutes))
  nextMonday.setSeconds(0)
  return toSecondsEpoch(nextMonday)
}

export function secondsEpochToTime(epochSeconds: number) {
  const epochMs = epochSeconds * 1000
  const date = new Date(epochMs)
  const hours = date.getHours().toString().padStart(2,"0")
  const minutes = date.getMinutes().toString().padStart(2,"0")
  return `${hours}:${minutes}`
}

const toMsEpoch = (time: Date) => time.valueOf()

const toSecondsEpoch = (time: Date) => {
  return Math.round(toMsEpoch(time) / 1000)
}
