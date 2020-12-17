import { Dialog } from '@material-ui/core'
import Image from 'next/image'
import React from 'react'
import Word from '../../types/word'
import Transition from './transition/Transition'

type Props = {
  open: boolean
  onClose: (open: boolean) => void
  word: Word
}

const PickupWordDialog: React.FC<Props> = ({ open, onClose, word }) => {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      className="overflow-y-visible"
    >
      <section className="flex flex-col items-start w-80 p-4 bg-gradient-to-r from-primary to-primary-light text-white
                  cursor-pointer shadow-lg relative">
        <div className="absolute px-6 -top-8 left-1/2 transform -translate-x-1/2 w-full text-center text-white bg-transparent text-lg font-bold">
          \ ピックアップ!! /
        </div>
        <Image className="rounded-full" src="/monster01.png" width={50} height={50} />
        <blockquote className="w-full self-center mt-4 mb-6 text-lg italic break-words">
          {word.content}
        </blockquote>
        <button className="self-center px-4 py-1 opacity-80 hover:opacity-90 border-2 border-white border-solid rounded-md text-sm">投票する!!</button>
      </section>
    </Dialog>
  )
}

export default PickupWordDialog
