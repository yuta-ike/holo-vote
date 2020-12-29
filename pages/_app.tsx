import type { AppProps } from "next/app"
import { Router, useRouter } from "next/router"
import { DateTime } from "luxon"
import React, {  useEffect, useState } from "react"
import "tailwindcss/tailwind.css"
import "../style/global.css"
import GlobalState from "../types/globalState"
import initFirebase from "../utils/auth/initFirebase"
import GlobalStatesProvider from "../utils/context/GlobalStatesProvider"
import SortPropProvider from "../utils/context/SortPropProvider"
import isSameDay from "../utils/date/isSameDay"

const defaultDescription = `ホロライブ流行語大賞2020（非公式）は、「ノミネート期間」と「投票期間」に分かれています。「ノミネート期間」では、ホロライブファンのみなさんから、ホロライブ流行語のノミネート（登録）を募集します。ノミネートされた言葉の中から投票を行い、流行語を決定します。投票は「投票期間」中にのみ可能です。`

const MESSAGES: string[] = ['ちょっと待ってにぇ', 'ちょっと待つぺこ', 'ちょっと待つのら〜', 'ちょっと待つっす!!']

const getRandomImage = (): string => MESSAGES[Math.floor((Math.random() * MESSAGES.length))]

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter()
  const [globalStates, setGlobalStates] = useState<GlobalState>({ user: null, todayVotes: 0, nominateEnd: true, voteStart: true, initialized: false, description: defaultDescription, topMessage: {}, footerMessage: {}, voteStartDate: "", errorMessage: "", voteErrorMessage: "" })
  useEffect(() => {
    const { auth, db, remoteConfig } = initFirebase()

    if (window != null) {
      remoteConfig.fetchAndActivate().then(() => {
        let topMessage: Record<string, string> = {}
        let footerMessage: Record<string, string> = {}
        try{
          footerMessage = JSON.parse(remoteConfig.getString("footerMessage")) as Record<string, string>
          topMessage = JSON.parse(remoteConfig.getString("topMessage")) as Record<string, string>
        }catch{}

        setGlobalStates(prev => ({
          ...prev,
          initialized: true,
          nominateEnd: remoteConfig.getBoolean("nominateEnd"),
          voteStart: remoteConfig.getBoolean("voteStart"),
          voteStartDate: remoteConfig.getString("VOTE_START_DATE"),
          description: remoteConfig.getString("description"),
          topMessage,
          footerMessage,
          errorMessage: remoteConfig.getString("ERROR_MESSAGE"),
          voteErrorMessage: remoteConfig.getString("VOTE_ERROR_MESSAGE")
        }))
      })
    }

    auth.onAuthStateChanged(async (user) => {
      setGlobalStates(prev => ({...prev, user}))
      if(user != null){
        const snapshots = await db.collectionGroup("votes").where("userId", "==", user.uid).get()
        const todayVotes = snapshots.docs.map(snapshot => snapshot.data()).map((data) => DateTime.fromJSDate(data.createdAt.toDate())).filter(createdAt => isSameDay(createdAt, DateTime.local()))
        setGlobalStates(prev => ({ ...prev, todayVotes: todayVotes.length }))
      }
    })
    auth.signInAnonymously()
  }, [])

  const incrementTodayVotes = (num: number = 1) => setGlobalStates(prev => ({...prev, todayVotes: prev.todayVotes + num}))
  

  const [message, setMessage] = useState<string>(() => getRandomImage())

  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const handleLoadingStart = () => setLoading(true)
    const handleLoadingFinish = () => setLoading(false)
    Router.events.on("routeChangeStart", handleLoadingStart)
    Router.events.on("routeChangeComplete", handleLoadingFinish)
    Router.events.on("routeChangeError", handleLoadingFinish)
    
    return () => {
      Router.events.off("routeChangeStart", handleLoadingStart)
      Router.events.off("routeChangeComplete", handleLoadingFinish)
      Router.events.off("routeChangeError", handleLoadingFinish)
    }
  }, [])

  useEffect(() => {
    if(loading == false){
      setMessage(getRandomImage())
    }
  }, [loading])

  useEffect(() => {
    const { analytics } = initFirebase()
    analytics.logEvent("page_view", { page_location: router.asPath, page_path: router.asPath, page_title: router.asPath })

    const handleRouteChange = (path: string) => {
      analytics.logEvent("page_view", { page_location: path, page_path: path, page_title: path })
    }

    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [])

  return (
    <>
      <link rel="preconnect" href="https://fonts.gstatic.com"/>
      <link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@300;400;700;900&display=swap" rel="stylesheet"/>
      <GlobalStatesProvider value={{ globalStates, incrementTodayVotes }}>
        <SortPropProvider>
          <Component {...pageProps}/>
          {
            loading &&
            <div className="fixed top-0 left-0 w-screen h-screen bg-gray-50 bg-opacity-80 z-50 flex items-center justify-center">
              <div className="flex flex-col items-center justify-center pb-10">
                <p className="mb-4">{message}</p>
                <div className="animate-ping inline-flex rounded-full bg-purple-400 opacity-75 w-4 h-4"/>
              </div>
            </div>
          }
        </SortPropProvider>
      </GlobalStatesProvider>
    </>
  )
}

export default App