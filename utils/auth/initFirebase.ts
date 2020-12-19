import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/remote-config'

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: '1:665505747760:web:9d6a70351cd5c7e2f6eef5',
}

let voteStart = false
let nominateEnd = false

const initFirebase = () => {
  if (!firebase.apps.length) {
    firebase.initializeApp(config)

    if(window != null){
      const remoteConfig = firebase.remoteConfig()
      remoteConfig.settings = {
        minimumFetchIntervalMillis: (process.env.NODE_ENV === "development" ? 10 : 60 * 60) * 1000,
        fetchTimeoutMillis: 60 * 1000,
      }
      remoteConfig.defaultConfig = {
        voteStart: false,
        nominateEnd: false,
      }
    }
  }

  const db = firebase.firestore
  const auth = firebase.auth
  const remoteConfig = firebase.remoteConfig

  return { db, auth, config: { voteStart, nominateEnd }, remoteConfig,  firebase }
}

export default initFirebase
