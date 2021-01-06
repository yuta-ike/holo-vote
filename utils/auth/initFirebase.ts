import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/remote-config'
import 'firebase/analytics'

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

let db: firebase.firestore.Firestore, auth: firebase.auth.Auth, remoteConfig: firebase.remoteConfig.RemoteConfig, analytics: firebase.analytics.Analytics;

const initFirebase = () => {
  if (!firebase.apps.length) {
    firebase.initializeApp(config)

    if (process.browser){
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
  if(db == null) db = firebase.firestore()
  if(auth == null) auth = firebase.auth()
  if (process.browser){
    if(analytics == null) analytics = firebase.analytics()
    if(remoteConfig == null) remoteConfig = firebase.remoteConfig()
  }

  return { db, auth, remoteConfig, analytics, firebase }
}

export default initFirebase
