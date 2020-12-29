import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import Word from '../../types/word'
import WordCard from './WordCard'
import shuffle from '../../utils/shuffle'
import { useGlobalStates } from '../../utils/context/GlobalStatesProvider'

type Props = {
  words: Omit<Word, "comments">[]
}

const PICKUP_NUM = 10

const PickUpCards: React.FC<Props> = ({ words }) => {
  const [pickup, setPickUp] = useState<Omit<Word, "comments">[]>([])
  const { globalStates: { voteStart } } = useGlobalStates()
  const [mode, setMode] = useState<"late" | "random">(voteStart ? "random" : "late")
  
  useEffect(() => {
    if (mode === "late") {
      setPickUp([...words.sort((a, b) => a.createdAt < b.createdAt ? 1 : a.createdAt === b.createdAt ? 0 : -1)].slice(0, PICKUP_NUM))
    } else {
      setPickUp(shuffle(words).slice(0, PICKUP_NUM))
    }
  }, [mode])

  return (
    <section className="w-full my-8">
      <h1 className="text-lg mb-2 mx-2">ピックアップ</h1>
      {
        !voteStart && (
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
        <div className="pl-2" />
      </div>
    </section>
  )
}

export default PickUpCards
