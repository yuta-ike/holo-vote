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
                <div className="flex flex-col mr-2 w-16 sm:w-20 justify-center flex-shrink-0">
                  {
                    word.members.length === 1 ? (
                      <Image onClick={handleOpenMemberDialog(word.members[0])} className="bg-white rounded-xl" objectFit="contain" src={`/${word.members[0].imageAPath}`} width={70} height={70} />
                    ) : word.members.length === 2 ? (
                      <div className="grid grid-cols-2 rounded-xl overflow-hidden">
                        <Image onClick={handleOpenMemberDialog(word.members[0])} objectFit="cover" className="bg-white" src={`/${word.members[0].imageAPath}`} width={35} height={70} />
                        <Image onClick={handleOpenMemberDialog(word.members[1])} objectFit="cover" className="bg-white" src={`/${word.members[1].imageAPath}`} width={35} height={70} />
                      </div>
                    ) : word.members.length === 3 ? (
                      <div className="grid grid-cols-2 grid-rows-2 rounded-xl overflow-hidden">
                        <div className="row-span-2 flex flex-row justify-end">
                          <Image onClick={handleOpenMemberDialog(word.members[0])} objectFit="cover" className="bg-white" src={`/${word.members[0].imageAPath}`} width={40} height={70} />
                        </div>
                        <Image onClick={handleOpenMemberDialog(word.members[1])} objectFit="none" objectPosition="50% 0%" className="bg-white" src={`/${word.members[1].imageAPath}`} width={35} height={35} />
                        <Image onClick={handleOpenMemberDialog(word.members[2])} objectFit="none" objectPosition="50% 0%" className="bg-white" src={`/${word.members[2].imageAPath}`} width={35} height={35} />
                      </div>
                    ) : word.members.length === 4 ? (
                      <div className="grid grid-cols-2 grid-rows-2 rounded-xl overflow-hidden">
                        <Image onClick={handleOpenMemberDialog(word.members[0])} objectFit="none" objectPosition="50% 0%" className="bg-white" src={`/${word.members[0].imageAPath}`} width={35} height={35} />
                        <Image onClick={handleOpenMemberDialog(word.members[1])} objectFit="none" objectPosition="50% 0%" className="bg-white" src={`/${word.members[1].imageAPath}`} width={35} height={35} />
                        <Image onClick={handleOpenMemberDialog(word.members[2])} objectFit="none" objectPosition="50% 0%" className="bg-white" src={`/${word.members[2].imageAPath}`} width={35} height={35} />
                        <Image onClick={handleOpenMemberDialog(word.members[3])} objectFit="none" objectPosition="50% 0%" className="bg-white" src={`/${word.members[3].imageAPath}`} width={35} height={35} />
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 grid-rows-2 rounded-xl overflow-hidden">
                        <Image onClick={handleOpenMemberDialog(word.members[0])} objectFit="none" objectPosition="50% 0%" className="bg-white" src={`/${word.members[0].imageAPath}`} width={35} height={35} />
                        <Image onClick={handleOpenMemberDialog(word.members[1])} objectFit="none" objectPosition="50% 0%" className="bg-white" src={`/${word.members[1].imageAPath}`} width={35} height={35} />
                        <Image onClick={handleOpenMemberDialog(word.members[2])} objectFit="none" objectPosition="50% 0%" className="bg-white" src={`/${word.members[2].imageAPath}`} width={35} height={35} />
                        <div onClick={e => e.preventDefault()} className="flex items-center justify-center bg-white">
                          <p className="text-xs text-center mt-1 sm:text-md font-bold align-middle">+{word.members.length - 4}人</p>
                        </div>
                      </div>
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
