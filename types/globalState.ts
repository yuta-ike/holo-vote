import { User } from "firebase"

type GlobalState = {
  user: null | User
  todayVotes: number
  initialized: boolean
  nominateEnd: boolean
  voteStart: boolean
  voteStartDate: string
  topMessage: Record<string, string>
  footerMessage: Record<string, string>
}

export default GlobalState