import Dialog from '@material-ui/core/Dialog'
import React from 'react'
import Transition from './transition/Transition'
import { GiPartyPopper } from 'react-icons/gi'
import Word from '../../types/word'
import { AiOutlineTwitter } from 'react-icons/ai'

type Props = {
  open: boolean
  onClose: () => void
  word: Omit<Omit<Word, "comments">, "createdAt">
}

const VoteCompleteDialog: React.FC<Props> = ({ open, onClose, word }) => {
  const handleClose = () => {
    onClose()
  }

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      onClose={handleClose}
    >
      <div className="p-8 flex flex-col items-center">
        <h1 className="my-2">投票が完了しました！ご協力ありがとうございます！</h1>
        <div className="text-8xl w-80 my-4">
          <GiPartyPopper className="mx-auto" />
        </div>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`「${word.content}」に投票しました!`)}&url=https://${process.env.NEXT_PUBLIC_VERCEL_URL}/word/${word.id}&hashtags=${encodeURIComponent(`ホロ流行語大賞_非公式,ホロライブ`)}`}
          className="px-4 py-2 my-4 rounded-sm border-twitter text-sm flex items-center
              transform transition-all bg-twitter text-white hover:shadow-md
              focus:outline-none focus-visible:outline-black active:shadow-none active:scale-95">
          <AiOutlineTwitter className="mr-2 text-xl" /> 投票したことをツイート
        </a>
      </div>
      <button onClick={handleClose} className="w-full text-center p-4 border-t border-gray-200 hover:bg-gray-50 focus-visible:outline-black focus:outline-none">
        とじる
      </button>
    </Dialog>
  )
}

export default VoteCompleteDialog