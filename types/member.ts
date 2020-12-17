export type Generation = "1st" | "2nd" | "gs" | "3rd" | "4th" | "5th" | "en-1st" | "id-1st" | "id-2nd" | "staff"
export const generations = ["1st", "2nd", "gs", "3rd", "4th", "5th", "en-1st", "id-1st", "id-2nd", "staff"]
export const genToDisplay = (gen: Generation) => ({ "1st": "1期生", "gs": "ゲーマーズ", "2nd": "2期生", "3rd": "3期生", "4th": "4期生", "5th": "5期生", "en-1st": "EN1期生", "id-1st": "ID1期生", "id-2nd": "ID2期生", "staff": "スタッフ"}[gen])
export type Country = "jp" | "id" | "en"
export const countries = ["jp", "id", "en"]

export const genToCountry = (gen: Generation) => gen === "id-1st" || gen === "id-2nd" ? "id" : gen === "en-1st" ? "en" : "jp"

type Member = {
  id: number
  name: string
  chineseName: string
  englishName: string
  gen: Generation[]
  catchphrase: string
  description: string
  youtubeId: string
  bilibiliId: string
  twitterId: string
  twitterHasTags: string[]
}

export default Member