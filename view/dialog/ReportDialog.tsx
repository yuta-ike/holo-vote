import Dialog from '@material-ui/core/Dialog'
import { SerializedWord } from '../../types/word'
import React from 'react'
import Transition from './transition/Transition'
import useIsSp from '../../utils/hooks/useIsSp'
import { MdClose } from 'react-icons/md'
import DialogContent from '@material-ui/core/DialogContent'
import TextField from '@material-ui/core/TextField'
import classNames from 'classnames'
import FormLabel from '@material-ui/core/FormLabel'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'

type Props = {
  open: boolean,
  onClose: () => void
  word: Omit<Omit<SerializedWord, "createdAt">, "comments">
}

const actionURL = process.env.NEXT_PUBLIC_FORM_ACTION_URL
const formWordIdName = process.env.NEXT_PUBLIC_FORM_WORD_ID
const formReportTargetName = process.env.NEXT_PUBLIC_FORM_TARGET
const formContentTypeName = process.env.NEXT_PUBLIC_FORM_CONTENT_TYPE
const formContentDescriptionName = process.env.NEXT_PUBLIC_FORM_CONTENT_DESCRIPTION

const ReportDialog: React.FC<Props> = ({ open, onClose, word }) => {
  const fullScreen = useIsSp()

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      onClose={onClose}
      fullScreen={fullScreen}
    >
      <div className="px-4 py-2 sm:mt-4 flex flex-row items-center justify-between">
        <h1 className="mx-2 text-lg">通報フォーム</h1>
        {
          fullScreen &&
          <button onClick={onClose} className="p-4 rounded-full transition-all hover:bg-gray-100">
            <MdClose />
          </button>
        }
      </div>
      <DialogContent>
        <form action={actionURL} className="flex flex-col">
          <h1 className="mb-4">「{word.content}」に関する通報フォーム</h1>
          <input type="hidden" name={formWordIdName} value={word.id}/>
          <FormControl required>
            <FormLabel className="mb-2" htmlFor="report-target">通報対象</FormLabel>
            <Select id="report-target" name={formReportTargetName} defaultValue="ノミネートされている言葉" required variant="outlined">
              <MenuItem value="ノミネートされている言葉">ノミネートされている言葉</MenuItem>
              <MenuItem value="コメント">コメント</MenuItem>
            </Select>
          </FormControl>
          <FormControl required>
            <FormLabel className="mt-4 mb-2" htmlFor="report-content-type">通報内容</FormLabel>
            <Select id="report-content-type" name={formContentTypeName} defaultValue="荒らし行為" required variant="outlined">
              <MenuItem value="荒らし行為">荒らし行為</MenuItem>
              <MenuItem value="スパム（広告など）">スパム（広告など）</MenuItem>
              <MenuItem value="上記以外の不適切な行為">上記以外の不適切な行為</MenuItem>
            </Select>
          </FormControl>
          <FormControl required>
            <FormLabel className="mt-4 mb-2" htmlFor="report-content-type">通報内容</FormLabel>
            <TextField
              id="report-content-type"
              required
              name={formContentDescriptionName}
              multiline
              rows={3}
              variant="outlined"
            />
          </FormControl>
          <p className="text-sm text-gray-400 mt-4">※フォームを送信するとGoogleFormの完了画面に遷移します</p>
          <div className="w-full flex">
            <button
              className="px-8 py-2 my-4 ml-auto mr-4 bg-gray-300 text-white rounded-full
                  transform duration-200 transition-all focus-visible:outline-black focus:outline-none focus:shadow-none hover:scale-105 focus:scale-95"
              onClick={onClose}
            >
              キャンセル
            </button>
            <button
              className={classNames(`px-8 py-2 my-4 text-white rounded-full transform duration-200 transition-all focus-visible:outline-black focus:outline-none`,
                "bg-gradient-to-r from-primary to-primary-light shadow-lg hover:scale-105 focus:scale-95 focus:shadow-none")}
              onClick={onClose}
              type="submit"
            >
              送信
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ReportDialog
