import type { MouseEvent } from 'react'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Word from '../../types/word'
import VoteDialog from '../dialog/VoteDialog'
import Member from '../../types/member'
import MemberDialog from '../dialog/MemberDialog'

type Props = {
  word: Omit<Word, "comments">
}

const WordListItem: React.FC<Props> = ({ word }) => {
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
          className="flex flex-col items-start border-solid border-gray-200 border-t sm:px-2 sm:py-4 cursor-pointer hover:bg-gray-50"
          role="button"
        >
          <div className="flex flex-row justify-start sm:justify-between items-center w-full py-2">
            <div className="w-10 flex flex-row mr-3">
              {
                word.members.map(member => (
                  <Image onClick={handleOpenMemberDialog(member)} className="rounded-full" src="/monster01.png" width={50} height={50} />
                ))
              }
              {/* <Image onClick={handleOpenMemberDialog(member)} className="rounded-full" src="/monster01.png" width={50} height={50} /> */}
            </div>
            <blockquote className="text-md sm:text-lg break-words px-1" style={{ wordBreak: "break-all" }}>
              {word.content}
            </blockquote>
            <button
              onClick={handleClickVote}
              className="px-4 py-1 flex-shrink-0 border border-black rounded-sm text-sm hidden sm:block
                  transform duration-200 transition-all focus-visible:outline-black focus:outline-none focus:shadow-none hover:scale-105 focus:scale-95"
            >
              投票
            </button>
          </div>
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

        export default WordListItem
