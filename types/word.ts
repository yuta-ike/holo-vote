import Member from "./member"
import Comment from './comment'
import { DateTime } from "luxon"

type Word = {
  id: string
  content: string
  members: Member[]
  videos: string[]
  createdAt: DateTime
  comments: Comment[]
}

export type SerializedWord = Omit<Word, "createdAt"> & {
  createdAt: string
}

export const serialize = (word: Word) => ({ ...word, createdAt: word.createdAt.toISO() })
export const unserialize = (word: SerializedWord) => ({ ...word, createdAt: DateTime.fromISO(word.createdAt) })

export default Word