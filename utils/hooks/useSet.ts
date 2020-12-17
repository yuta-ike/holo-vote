import type { Dispatch, SetStateAction } from "react"
import { useState } from "react"

const useSet = <T>(init: T[]): [items: T[], operators: { add: (item: T) => void, remove: (item: T) => void, toggle: (item: T) => void }, setItems: Dispatch<SetStateAction<T[]>>] => {
  const [items, setItems] = useState<T[]>(init)
  const add = (item: T) => {
    if(!items.includes(item)){
      setItems([...items, item])
    }
  }
  const remove = (item: T) => {
    setItems(items.filter((_item) => _item !== item))
  }
  const toggle = (item: T) => {
    if(items.includes(item)){
      remove(item)
    }else{
      add(item)
    }
  }

  return [items, { add, remove, toggle }, setItems]
}

export default useSet