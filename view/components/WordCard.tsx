import type { MouseEvent } from 'react'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Word from '../../types/word'
import VoteDialog from '../dialog/VoteDialog'

type Props = {
  word: Omit<Word, "comments">
}

const WordCard: React.FC<Props> = ({ word }) => {
  const [voteDialogOpen, setVoteDialogOpen] = useState(false)
  const handleClickVote = (e: MouseEvent<HTMLInputElement>) => {
    e.stopPropagation()
    setVoteDialogOpen(true)
  }

  return (
    <>
      <Link href={`/word/${word.id}`}>
        <section
          tabIndex={0}
          role="button"
          className="flex flex-col flex-shrink-0 items-start w-80 p-4 m-2 bg-gradient-to-r from-primary to-primary-light text-white rounded-md
            cursor-pointer shadow-lg
            transform duration-200 transition-all focus-visible:outline-black focus:outline-none focus:shadow-none hover:scale-105 focus:scale-95">
          <Image className="rounded-full" src="/monster01.png" width={50} height={50} />
          <blockquote className="w-full self-center mt-4 mb-6 text-lg italic break-words">
            {word.content}
          </blockquote>
          <button
            onClick={handleClickVote}
            className="self-center px-4 py-1 opacity-80 hover:opacity-90 border-2 border-white border-solid rounded-md text-sm focus-visible:outline-black focus:outline-none"
          >
            投票する!!
          </button>
        </section>
      </Link>
      <VoteDialog open={voteDialogOpen} onClose={() => setVoteDialogOpen(false)} word={word} />
    </>
  )
}

export default WordCard
