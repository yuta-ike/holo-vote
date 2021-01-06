import { createContext, useContext } from 'react'
import GlobalStates from '../../types/globalState'

const GlobalStateContext = createContext<{ globalStates: GlobalStates, incrementTodayVotes: (voteNum: number) => void }>({
  globalStates: {
    user: null, todayVotes: 0, nominateEnd: true, voteStart: true, initialized: false, description: "",
    topMessage: {}, footerMessage: {}, voteStartDate: "", errorMessage: "", voteErrorMessage: ""
  },
  incrementTodayVotes: () => console.error("ERROR")
})

const GlobalStatesProvider = GlobalStateContext.Provider

export default GlobalStatesProvider

export const useGlobalStates = () => useContext(GlobalStateContext)