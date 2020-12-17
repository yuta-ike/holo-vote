import initAdminFirebase from './initAdminFirebase'

export const verifyIdToken = async (token: string) => {
  const { auth } = initAdminFirebase()
  await auth().verifyIdToken(token).catch((error) => {
    throw error
  })
}