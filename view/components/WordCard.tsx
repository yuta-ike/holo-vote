import type { MouseEvent } from 'react'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Word from '../../types/word'
import VoteDialog from '../dialog/VoteDialog'
import MemberDialog from '../dialog/MemberDialog'
import Member from '../../types/member'

type Props = {
  word: Omit<Word, "comments">
}

const WordCard: React.FC<Props> = ({ word }) => {
  const [voteDialogOpen, setVoteDialogOpen] = useState(false)
  const [member, setMember] = useState<Member | null>(null)
  const handleClickVote = (e: MouseEvent<HTMLInputElement>) => {
    e.stopPropagation()
    setVoteDialogOpen(true)
  }

  const handleOpenMemberDialog = (member: Member) => (e: any) => {
    e.stopPropagation()
    setMember(member)
  }

  return (
    <>
      <Link href={`/word/${word.id}`}>
        <section
          tabIndex={0}
          role="button"
          className="flex flex-col flex-shrink-0 items-start justify-between w-72 sm:w-80 pt-1 pl-1 pr-4 pb-4 m-2 bg-gradient-to-r from-primary to-primary-light text-white rounded-md
            cursor-pointer shadow-lg
            transform duration-200 transition-all focus-visible:outline-black focus:outline-none active:scale-95">
          <div className="flex flex-row overflow-x-scroll w-full flex-nowrap whitespace-nowrap">
            {
              word.members.map(member => (
                <Image key={member.id} onClick={handleOpenMemberDialog(member)} className="flex-shrink-0 rounded-full bg-white p-1 bg-clip-content" src={`/${member.imageAPath}`} width={70} height={70} />
              ))
            }
          </div>
          <blockquote className="w-full self-center text-center mt-6 mb-8 text-lg sm:text-lg italic break-words font-bold">
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
      {
        member != null &&
        <MemberDialog member={member} open={member != null} onClose={() => setMember(null)} />
      }
    </>
  )
}

export default WordCard
