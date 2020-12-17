import { Dialog, DialogContent, DialogTitle } from '@material-ui/core'
import React from 'react'
import Word from '../../types/word'
import Transition from './transition/Transition'

type Props = {
  open: boolean
  onClose: () => void
  word: Omit<Omit<Word, "comments">, "createdAt">
}

const VoteDialog: React.FC<Props> = ({ open, onClose, word }) => {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">投票</DialogTitle>
      <DialogContent>
        ごめんなさい...<br />
        投票は投票期間中のみ可能です<br /><br />
        投票開始時期：未定<br />
        <button
          onClick={onClose}
          className="px-8 py-2 my-4 bg-gradient-to-r from-primary to-primary-light text-white rounded-full shadow-lg
            transform duration-200 transition-all focus-visible:outline-black focus:outline-none focus:shadow-none hover:scale-105 focus:scale-95">
          OK!!
        </button>
      </DialogContent>
    </Dialog>
  )
}

export default VoteDialog
