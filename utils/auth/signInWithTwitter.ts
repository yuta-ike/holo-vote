import initFirebase from "./initFirebase"

const signInWithTwitter = async () => {
  const { auth } = initFirebase()
  const uid = auth().currentUser?.uid
  if(uid == null) return

  await auth().signInWithRedirect(new auth.TwitterAuthProvider())
}

export default signInWithTwitter