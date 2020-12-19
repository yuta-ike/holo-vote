import { DateTime } from "luxon"
import type { AppProps } from "next/app"
import {  useEffect, useState } from "react"
import "tailwindcss/tailwind.css"
import "../style/global.css"
import GlobalState from "../types/globalState"
import initFirebase from "../utils/auth/initFirebase"
import GlobalStatesProvider from "../utils/context/UserProvider"
import isSameDay from "../utils/date/isSameDay"

const defaultDescription = `ホロライブ流行語大賞2020（非公式）は、「ノミネート期間」と「投票期間」に分かれています。「ノミネート期間」では、ホロライブファンのみなさんから、ホロライブ流行語のノミネート（登録）を募集します。ノミネートされた言葉の中から投票を行い、流行語を決定します。投票は「投票期間」中にのみ可能です。`

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const [globalStates, setGlobalStates] = useState<GlobalState>({ user: null, todayVotes: 0, nominateEnd: false, voteStart: false, initialized: false, description: defaultDescription, topMessage: {}, footerMessage: {}, voteStartDate: "" })
  useEffect(() => {
    const { auth, db, remoteConfig } = initFirebase()

    if (window != null) {
      remoteConfig().fetchAndActivate().then(() => {
        let topMessage: Record<string, string> = {}
        let footerMessage: Record<string, string> = {}
        try{
          footerMessage = JSON.parse(remoteConfig().getString("footerMessage")) as Record<string, string>
          topMessage = JSON.parse(remoteConfig().getString("topMessage")) as Record<string, string>
        }catch{}

        setGlobalStates(prev => ({
          ...prev,
          initialized: true,
          nominateEnd: remoteConfig().getBoolean("nominateEnd"),
          voteStart: remoteConfig().getBoolean("voteStart"),
          voteStartDate: remoteConfig().getString("VOTE_START_DATE"),
          description: remoteConfig().getString("description"),
          topMessage,
          footerMessage,
        }))
      })
    }

    auth().onAuthStateChanged(async (user) => {
      setGlobalStates(prev => ({...prev, user}))
      if(user != null){
        const snapshots = await db().collectionGroup("votes").where("userId", "==", user.uid).get()
        const todayVotes = snapshots.docs.map(snapshot => snapshot.data()).map((data) => DateTime.fromJSDate(data.createdAt.toDate())).filter(createdAt => isSameDay(createdAt, DateTime.local()))
        setGlobalStates(prev => ({ ...prev, todayVotes: todayVotes.length }))
      }
    })
    auth().signInAnonymously()
  }, [])

  const incrementTodayVotes = () => setGlobalStates(prev => ({...prev, todayVotes: prev.todayVotes + 1}))
  
  return (
    <>
      <link rel="preconnect" href="https://fonts.gstatic.com"/>
      <link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@300;400;700&display=swap" rel="stylesheet"/>
      <GlobalStatesProvider value={{ globalStates, incrementTodayVotes }}>
        <Component {...pageProps}/>
      </GlobalStatesProvider>
    </>
  )
}

export default App