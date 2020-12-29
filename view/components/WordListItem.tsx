import type { MouseEvent } from 'react'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Word from '../../types/word'
import VoteDialog from '../dialog/VoteDialog'
import Member from '../../types/member'
import MemberDialog from '../dialog/MemberDialog'
import classNames from 'classnames'
import initFirebase from '../../utils/auth/initFirebase'
import { Mode } from '../../utils/context/SortPropProvider'

type Props = {
  word: Omit<Word, "comments">
  className?: string
  mode: Mode
}

const WordListItem: React.FC<Props> = ({ word, className = "", mode }) => {
  const [voteDialogOpen, setVoteDialogOpen] = useState(false)
  const [member, setMember] = useState<Member | null>(null)
  
  const handleClickVote = (e: MouseEvent<HTMLInputElement>) => {
    e.preventDefault()
    setVoteDialogOpen(true)
    const { analytics } = initFirebase()
    analytics.logEvent("select_item", { item_list_name: word.content, item_list_id: word.id, name: "wordlistitem" })
  }

  const handleOpenMemberDialog = (member: Member) => (e: any) => {
    e.preventDefault()
    setMember(member)
  }

  return (
    <>
      <Link href={`/word/${word.id}?fromList=true`} as={`/word/${word.id}`}>
        {
          mode === "list" ? (
            <a
              id={word.id}
              className={classNames("flex flex-col items-start border-solid border-gray-200 border-b sm:px-2 py-2 sm:py-4 cursor-pointer hover:bg-gray-50", className)}
            >
              <div className="flex flex-row justify-between items-center w-full py-1 sm:py-0 max-w-screen-lg mx-auto">
                <div className="flex flex-col mr-2 w-20 justify-center flex-shrink-0">
                  <div className="flex flex-row">
                  {
                    word.members.slice(0, 2).map(member => (
                      <Image key={member.id} onClick={handleOpenMemberDialog(member)} className="rounded-md bg-white" src={`/${member.imageAPath}`} width={70} height={70} />
                    ))
                  }
                  </div>
                  {
                    word.members.length > 2 && (
                      <p className="text-xs text-center mt-1 sm:text-md">+{word.members.length - 2}人</p>
                    )
                  }
                </div>
                <blockquote className="text-lg sm:text-2xl break-words px-1 font-extrabold text-gray-700" style={{ wordBreak: "break-all" }}>
                  {word.content}
                </blockquote>
                <button
                  onClick={handleClickVote}
                  className="px-4 py-2 ml-2 flex-shrink-0 rounded-full text-sm block bg-primary-light text-white
                      transform duration-200 transition-all focus-visible:outline-black focus:outline-none focus:shadow-none hover:scale-105 focus:scale-95"
                >
                  投票
                </button>
              </div>
            </a>
          ) : (
            // シンプルモード
            <a id={word.id}>
              <div className="flex flex-row items-center justify-between border-solid border-gray-200 border-b py-2">
                <blockquote>{word.content}</blockquote>
                <button
                  onClick={handleClickVote}
                  className="px-4 py-2 ml-2 flex-shrink-0 rounded-full text-sm block bg-primary-light text-white
                transform duration-200 transition-all focus-visible:outline-black focus:outline-none focus:shadow-none hover:scale-105 focus:scale-95"
                >
                  投票
                </button>
              </div>
            </a>
          )
        }
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
