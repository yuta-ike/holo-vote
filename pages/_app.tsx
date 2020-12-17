import type { AppProps } from "next/app"

import { useEffect } from "react"
import "tailwindcss/tailwind.css"
import "../style/global.css"
import initFirebase from "../utils/auth/initFirebase"

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  useEffect(() => {
    const { auth } = initFirebase()
    auth().signInAnonymously()
  }, [])
  
  return (
    <>
      <link rel="preconnect" href="https://fonts.gstatic.com"/>
      <link href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@300;400;700&display=swap" rel="stylesheet"/>
      <Component {...pageProps}/>
    </>
  )
}

export default App