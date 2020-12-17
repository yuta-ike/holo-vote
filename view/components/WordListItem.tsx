import type { MouseEvent } from 'react'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Word from '../../types/word'
import VoteDialog from '../dialog/VoteDialog'

type Props = {
  word: Omit<Word, "comments">
}

const WordListItem: React.FC<Props> = ({ word }) => {
  const [voteDialogOpen, setVoteDialogOpen] = useState(false)
  const handleClickVote = (e: MouseEvent<HTMLInputElement>) => {
    e.stopPropagation()
    setVoteDialogOpen(true)
  }
  
  return (
    <>
      <Link href={`/word/${word.id}`}>
        <section
          className="flex flex-col items-start border-solid border-gray-200 border-t px-2 py-4 cursor-pointer hover:bg-gray-50"
          role="button"
        >
          <div className="flex flex-row flex-wrap justify-between items-center w-full py-2">
            <div className="w-20 flex flex-row">
              <Image className="rounded-full" src="/monster01.png" width={50} height={50} />
            </div>
            <blockquote className="text-xl break-words" style={{ wordBreak: "break-all" }}>
              {word.content}
            </blockquote>
            <button
              onClick={handleClickVote}
              className="px-4 py-1 border border-black rounded-sm text-sm
                  transform duration-200 transition-all focus-visible:outline-black focus:outline-none focus:shadow-none hover:scale-105 focus:scale-95"
            >
              投票
            </button>
          </div>
        </section>
      </Link>
      <VoteDialog open={voteDialogOpen} onClose={() => setVoteDialogOpen(false)} word={word} />
    </>
  )
}

        export default WordListItem
