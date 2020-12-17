import type { ChangeEvent } from 'react'
import React, { useState } from 'react'
import Dialog from '@material-ui/core/Dialog'
import Transition from './transition/Transition'
import { GiPartyPopper } from 'react-icons/gi'
import DialogContent from '@material-ui/core/DialogContent'
import TextField from '@material-ui/core/TextField'
import classNames from 'classnames'
import youtubeUrlValidate from '../../utils/validation/youtubeUrlValidate'

type Props = {
  open: boolean,
  onClose: (videoId?: string) => void
}

const VideoAddDialog: React.FC<Props> = ({open, onClose}) => {
  const [text, setText] = useState("")
  const [videoId, setVideoId] = useState<null | string>(null)
  const [isLoading, setIsLoading] = useState(false)
  const disabled = isLoading || text.length === 0 || videoId == null

  const handleTextSend = async () => {
    const videoId = youtubeUrlValidate(text)
    if(videoId == null) return
    setIsLoading(true)
    setIsLoading(false)
    await onClose(videoId)
    setText("")
    setVideoId("")
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
    const videoId = youtubeUrlValidate(e.target.value)
    setVideoId(videoId)
  }

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      onClose={() => onClose()}
    >
      <div className="p-8 w-96 max-w-full">
        <h1 className="mb-8">関連動画登録</h1>
        <div className="flex w-full justify-between my-8">
          <TextField
            value={text}
            onChange={handleChange}
            className="flex-1 mr-2"
            variant="outlined"
            disabled={isLoading}
            label="Youtube URL"
          />
          <button
            className={
              classNames(`flex-0 px-4 text-white rounded-md
                  transform duration-200 transition-all focus-visible:outline-black focus:outline-none`,
                disabled ? "bg-gray-300 shadow-none cursor-default" : "bg-gradient-to-r from-primary to-primary-light focus:shadow-none hover:scale-105 focus:scale-95"
              )
            }
            onClick={handleTextSend}
            disabled={disabled}
          >
            投稿
            </button>
        </div>
        {
          videoId != null &&
          <iframe
            className="w-full"
            src={`https://www.youtube.com/embed/${videoId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        }
      </div>
      {/* <button onClick={handleClose} className="w-full text-center p-4 border-t border-gray-200 hover:bg-gray-50 focus-visible:outline-black focus:outline-none">
        とじる
      </button> */}
    </Dialog>
  )
}

export default VideoAddDialog
