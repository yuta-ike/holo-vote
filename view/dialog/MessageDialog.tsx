import Dialog from '@material-ui/core/Dialog'
import React from 'react'
import Transition from './transition/Transition'
import { GiPartyPopper } from 'react-icons/gi'
import DialogContent from '@material-ui/core/DialogContent'

type Props = {
  open: boolean,
  onClose: () => void
}

const MessageDialog: React.FC<Props> = ({open, onClose}) => {
  const handleClose = () => {
    onClose()
  }
  
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      onClose={handleClose}
    >
      <div className="p-8">
        <h1 className="mb-8">完了しました！ご協力ありがとうございます！</h1>
        <div className="text-8xl w-80">
          <GiPartyPopper className="mx-auto"/>
        </div>
      </div>
      <button onClick={handleClose} className="w-full text-center p-4 border-t border-gray-200 hover:bg-gray-50 focus-visible:outline-black focus:outline-none">
        とじる
      </button>
    </Dialog>
  )
}

export default MessageDialog
