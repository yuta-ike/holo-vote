import initFirebase from "./initFirebase"

const signInWithTwitter = async () => {
  const { firebase, auth } = initFirebase()
  const uid = auth.currentUser?.uid
  if(uid == null) return

  await auth.signInWithRedirect(new firebase.auth.TwitterAuthProvider())
}

export default signInWithTwitter