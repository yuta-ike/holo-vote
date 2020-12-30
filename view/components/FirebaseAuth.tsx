import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import firebase from 'firebase/app'
import 'firebase/auth'
import initFirebase from '../../utils/auth/initFirebase'
import { setUserCookie } from '../../utils/auth/userCookies'
import { mapUserData } from '../../utils/auth/mapUserData'
import { useEffect } from 'react'

// Init the Firebase app.
initFirebase()

const firebaseAuthConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  // Auth providers
  // https://github.com/firebase/firebaseui-web#configure-oauth-providers
  signInOptions: [
    {
      provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      requireDisplayName: false,
    },
  ],
  signInSuccessUrl: '/admin',
  credentialHelper: 'none',
  callbacks: {
    signInSuccessWithAuthResult: ({ user }, redirectUrl) => {
      mapUserData(user).then(setUserCookie)
      return true
    },
  },
}

const FirebaseAuth = () => {
  return (
    <div>
      <StyledFirebaseAuth
        uiConfig={firebaseAuthConfig}
        firebaseAuth={firebase.auth()}
      />
    </div>
  )
}

export default FirebaseAuth
