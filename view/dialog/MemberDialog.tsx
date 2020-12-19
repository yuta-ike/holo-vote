import React, { useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogTitle, TextField } from '@material-ui/core'
import Transition from './transition/Transition'
import { IoMdArrowDropdown } from 'react-icons/io'
import NameChip from '../components/NameChip'
import { members } from '../../data/members'
import MemberSelectDialog from './MemberSelectDialog'
import Member from '../../types/member'
import { FaYoutube } from 'react-icons/fa'
import { RiBilibiliLine } from 'react-icons/ri'
import { AiOutlineTwitter } from 'react-icons/ai'

type Props = {
  open: boolean,
  onClose: () => void
  member: Member
}

const MemberDialog: React.FC<Props> = ({ open, onClose, member }) => {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      onClose={onClose}
    >
      <DialogTitle>{member.name}<span className="ml-4 text-sm">
        {
          member.chineseName !== "" ? (
            `${member.chineseName}/${member.englishName}`
          ) : (
            member.englishName
          )
        }</span></DialogTitle>
      <DialogContent>
        <div className="flex flex-wrap mb-4 justify-center sm:flex-nowrap">
          <div className="flex-shrink-0 sm:mr-2">
            <Image className="flex-0 bg-white" src={`/${member.imageAPath}`} width={220} height={220}/>
          </div>
          <div>
            <div className="mt-4 mb-2">{member.catchphrase}</div>
            <div className="mt-4 mb-2">{member.description}</div>
            <div className="w-full flex justify-between items-center flex-wrap sm:flex-nowrap">
              <div className="flex justify-end text-4xl">
                <a href={`https://www.youtube.com/channel/${member.youtubeId}`}>
                  <FaYoutube />
                </a>
                <a className="ml-6" href={`https://space.bilibili.com/${member.bilibiliId}/`}>
                  <RiBilibiliLine />
                </a>
                <a className="ml-6" href={`https://twitter.com/${member.twitterId}`}>
                  <AiOutlineTwitter />
                </a>
              </div>
              <button
                className="px-8 py-2 my-4 bg-gradient-to-r from-primary to-primary-light text-white rounded-full shadow-lg
                    transform duration-200 transition-all focus-visible:outline-black focus:outline-none focus:shadow-none hover:scale-105 focus:scale-95"
                onClick={onClose}
              >
                OK!!
              </button>
            </div>
          </div>
        </div>
        
      </DialogContent>
    </Dialog>
  )
}

export default MemberDialog
