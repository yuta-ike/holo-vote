import { createContext, useContext } from 'react'
import GlobalStates from '../../types/globalState'

const GlobalStateContext = createContext<{globalStates: GlobalStates, incrementTodayVotes: () => void}>(null)

const GlobalStatesProvider = GlobalStateContext.Provider

export default GlobalStatesProvider

export const useGlobalStates = () => useContext(GlobalStateContext)