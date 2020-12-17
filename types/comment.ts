import { DateTime } from "luxon"

type Comment = {
  id: string
  serialNumber: number
  content: string
  createdAt: DateTime
  like: string[]
}

export type SerializedComment = Omit<Comment, "createdAt"> & {
  createdAt: string
}

export const serialize = (comment: Comment): SerializedComment => ({ ...comment, createdAt: comment.createdAt.toISO() })
export const unserialize = (comment: SerializedComment): Comment => ({ ...comment, createdAt: DateTime.fromISO(comment.createdAt) })

export default Comment