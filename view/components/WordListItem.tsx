import type { MouseEvent } from 'react'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Word from '../../types/word'
import VoteDialog from '../dialog/VoteDialog'
import Member from '../../types/member'
import MemberDialog from '../dialog/MemberDialog'
import classNames from 'classnames'

type Props = {
  word: Omit<Word, "comments">
  className?: string
}

const WordListItem: React.FC<Props> = ({ word, className = "" }) => {
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
          className={classNames("flex flex-col items-start border-solid border-gray-200 border-b sm:px-2 sm:py-4 cursor-pointer hover:bg-gray-50", className)}
          role="button"
        >
          <div className="flex flex-row justify-start sm:justify-between items-center w-full py-1 sm:py-0 max-w-screen-lg mx-auto">
            <div className="flex flex-row flex-wrap mr-2 w-24 justify-center">
              {
                word.members.map(member => (
                  <Image key={member.id} onClick={handleOpenMemberDialog(member)} className="rounded-md bg-white" src={`/${member.imageAPath}`} width={70} height={70} />
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
