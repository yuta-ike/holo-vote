import { useEffect, useState } from "react"

const usePrev = <T>(_currState: T, init: T = null) => {
  const [currState, setCurrState] = useState(_currState)
  const [prevState, setPrevState] = useState(init)
  useEffect(() => {
    setCurrState(_currState)
    setPrevState(currState)
  }, [_currState])
  return prevState
}

export default usePrev