import initFirebase from "../auth/initFirebase"

const outLink = (title: string) => () => {
  const { analytics } = initFirebase()
  analytics.logEvent("outbound_link", { title })
}

export default outLink