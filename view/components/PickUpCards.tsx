import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import Word from '../../types/word'
import WordCard from './WordCard'
import shuffle from '../../utils/shuffle'
import { useGlobalStates } from '../../utils/context/GlobalStatesProvider'
import { useHistoryIdsValue } from '../../utils/context/HistoryIds'

type Props = {
  words: Omit<Word, "comments">[]
}

const PICKUP_NUM = 10

const PickUpCards: React.FC<Props> = ({ words }) => {
  const [pickup, setPickUp] = useState<Omit<Word, "comments">[]>([])
  const { globalStates: { voteStart } } = useGlobalStates()
  const [mode, setMode] = useState<"late" | "random" | "history">(voteStart ? "random" : "late")
  const historyIds = useHistoryIdsValue()
  
  useEffect(() => {
    if (mode === "late") {
      setPickUp([...words.sort((a, b) => a.createdAt < b.createdAt ? 1 : a.createdAt === b.createdAt ? 0 : -1)].slice(0, PICKUP_NUM))
    } else if(mode === "random"){
      setPickUp(shuffle(words).slice(0, PICKUP_NUM))
    }else{
      console.log(historyIds.map(id => words.find(word => word.id === id)))
      setPickUp(
        historyIds.map(id => words.find(word => word.id === id)).filter(word => word != null) as any
      )
    }
  }, [mode, historyIds])

  return (
    <section className="w-full my-8">
      <h1 className="text-lg mb-2 mx-2">ピックアップ</h1>
      {
        voteStart ? (
          <>
            <button
              className={classNames(mode === "random" ? "text-black font-bold underline" : "text-gray-400",
                "transition-all text-md mx-2 focus-visible:outline-black focus:outline-none")}
              onClick={() => setMode("random")}
            >
              ランダム
            </button>
            <button
              className={classNames(mode === "history" ? "text-black font-bold underline" : "text-gray-400",
                "transition-all text-md mx-2 focus-visible:outline-black focus:outline-none")}
              onClick={() => setMode("history")}
            >
              投票履歴
            </button>
          </>
        ) : (
          <>
            <button
              className={classNames(mode === "late" ? "text-black font-bold underline" : "text-gray-400",
                "transition-all text-md mx-2 focus-visible:outline-black focus:outline-none")}
              onClick={() => setMode("late")}
            >
              最新
            </button>
            <button
              className={classNames(mode === "random" ? "text-black font-bold underline" : "text-gray-400",
                "transition-all text-md mx-2 focus-visible:outline-black focus:outline-none")}
              onClick={() => setMode("random")}
            >
              ランダム
            </button>
          </>
        )
      }
      <div className="-ml-4 -mr-4 p-2 overflow-x-scroll overscroll-x-contain flex flex-row flex-nowrap whitespace-nowrap">
        {pickup.map(item => (
          <WordCard key={item.id} word={item} />
        ))}
        {pickup.length === 0 && (
          <div className="pt-1 pl-1 pr-4 pb-4 m-2 h-52 w-72 sm:w-80 flex flex-col items-center justify-center bg-gray-100 rounded-md text-gray-400">
            <p className="">該当するワードがありません</p>
          </div>
        )}
        <div className="pl-2" />
      </div>
    </section>
  )
}

export default PickUpCards
