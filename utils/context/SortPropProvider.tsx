import { Dispatch, SetStateAction, useContext } from 'react'
import React, { createContext, useState } from 'react'
import { members } from '../../data/members'
import Member from '../../types/member'

export type Mode = "list" | "simple"

type SortProps = { sort: boolean, filter: Member[], showWordJumpButton: boolean, mode: Mode }
const initSortProps: SortProps = { sort: true, filter: members, showWordJumpButton: false, mode: "list" }

const SortPropContext = createContext<SortProps>(initSortProps)
const SetSortPropContext = createContext<Dispatch<SetStateAction<SortProps>>>(()=>{})

const SortPropProvider: React.FC = ({ children }) => {
  const [sortProps, setSortProps] = useState(initSortProps)
  return (
    <SortPropContext.Provider value={sortProps}>
      <SetSortPropContext.Provider value={setSortProps}>
        {children}
      </SetSortPropContext.Provider>
    </SortPropContext.Provider>
  )
}

export const useSortPropsValue = () => useContext(SortPropContext)
export const useSetSortProps = () => useContext(SetSortPropContext)
export const useSortProps = (): [SortProps, Dispatch<SetStateAction<SortProps>>] => [useContext(SortPropContext), useContext(SetSortPropContext)]

export default SortPropProvider
