import type { EffectCallback } from 'react'
import { useEffect } from "react"
import usePrev from './usePrev'

const useEffectWhen = <T>(effect: EffectCallback, state: T, when: (curr: T, prev: T) => boolean) => {
  const prevState = usePrev(state)
  useEffect(() => {
    if (when(state, prevState)) {
      effect()
    }
  }, [state])
}

export const useEffectWhenLarge = <T>(effect: EffectCallback, state: T) => useEffectWhen(effect, state, (curr, prev) => prev < curr)

export default useEffectWhen