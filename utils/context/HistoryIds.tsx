import { createContext, useCallback, useContext, useState } from "react"

const HistoryIdsValueContext = createContext<string[]>([])
const SetHistoryIdsContext = createContext<(wordId: string) => void>(() => {})

const HistoryIdsProvider: React.FC = ({ children }) => {
  const [historyIds, setHistoryIds] = useState<string[]>(() => {
    if(!process.browser) return []
    const str = localStorage.getItem("vote-history")
    if(str == null) return []
    try{
      return JSON.parse(str)
    }catch{
      return []
    }
  })

  const addHistory = useCallback((wordId: string) => {
    const newHistory = Array.from(new Set([wordId, ...historyIds]))
    localStorage.setItem("vote-history", JSON.stringify(newHistory))
    setHistoryIds(newHistory)
  }, [])

  return (
    <HistoryIdsValueContext.Provider value={historyIds}>
      <SetHistoryIdsContext.Provider value={addHistory}>
        { children }
      </SetHistoryIdsContext.Provider>
    </HistoryIdsValueContext.Provider>
  )
}

export default HistoryIdsProvider

export const useHistoryIdsValue = () => useContext(HistoryIdsValueContext)
export const useAddHistoryId = () => useContext(SetHistoryIdsContext)
export const useHistoryIds = () => [useHistoryIdsValue(), useAddHistoryId()] as const