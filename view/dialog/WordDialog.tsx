import React from 'react'
import { Dialog } from '@material-ui/core'
import Image from 'next/image'
import Word from '../../types/word'
import NameChip from '../components/NameChip'
import Transition from './transition/Transition'

type Props = {
  open: boolean
  onClose: (open: boolean) => void
  word: Word
}

const WordDialog: React.FC<Props> = ({ open, onClose, word }) => {
  // const url = "https://www.youtube.com/watch?v=Mbf2qj8Amxg";

  // fetch(url).then(res => res.text()).then(text => {
  //   const el = new DOMParser().parseFromString(text, "text/html")
  //   const headEls = (el.head.children)
  //   Array.from(headEls).map(v => {
  //     const prop = v.getAttribute('property')
  //     if (!prop) return;
  //     console.log(prop, v.getAttribute("content"))
  //   })
  // })
  
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      className="overflow-y-visible"
    >
      <section className="flex flex-col items-start w-full p-4 bg-gradient-to-r from-primary to-primary-light text-white shadow-lg relative">
        {/* <Image className="rounded-full" src="/monster01.png" width={50} height={50} /> */}
        <blockquote className="w-full self-center mt-4 mb-6 text-lg italic break-all">
          {word.content}
        </blockquote>
        {/* <button className="self-center px-4 py-1 opacity-80 hover:opacity-90 border-2 border-white border-solid rounded-md text-sm">投票する!!</button> */}
      </section>
      <div
        // onClick={() => setMemberDialogOpen(true)}
        className="scroll-wrapper flex flex-row flex-nowrap my-2 overflow-x-scroll overscroll-x-contain whitespace-nowrap w-full px-2">
        {
          word.members.map(member => (
            <NameChip key={member.id} member={member} onClick={() => { }} selected={true} selectable={false} />
          ))
        }
      </div>
      <section className="flex flex-col w-80">
        <Image src="http://img.youtube.com/vi/uRB1G0cKpIk/mqdefault.jpg" width={320} height={180}/>
        <h1 className="px-2 mb-2">【#ホロWACCA】『ぺこみこ大戦争！！』フルMV【さくらみこ/兎田ぺこら ホロライブ】</h1>
      </section>
    </Dialog>
  )
}

export default WordDialog
