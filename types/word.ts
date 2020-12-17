import Member from "./member"
import Comment from './comment'
import { DateTime } from "luxon"
import Video from "./video"

type Word = {
  id: string
  content: string
  members: Member[]
  videos: Video[]
  createdAt: DateTime
  comments: Comment[]
}

export type SerializedWord = Omit<Word, "createdAt"> & {
  createdAt: string
}

export const serialize = (word: Word) => ({ ...word, createdAt: word.createdAt.toISO() })
export const unserialize = (word: SerializedWord) => ({ ...word, createdAt: DateTime.fromISO(word.createdAt) })

export default Word