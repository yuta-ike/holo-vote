import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogTitle, TextField } from '@material-ui/core'
import Transition from './transition/Transition'
import { IoMdArrowDropdown } from 'react-icons/io'
import NameChip from '../components/NameChip'
import { members } from '../../data/members'
import MemberSelectDialog from './MemberSelectDialog'
import initFirebase from '../../utils/auth/initFirebase'
import { useRouter } from 'next/router'
import classNames from 'classnames'
import MessageDialog from './MessageDialog'
import useIsSp from '../../utils/hooks/useIsSp'
import { MdClose } from 'react-icons/md'

type Props = {
  open: boolean
  onClose: () => void
}

const isAllCheckMode = process.env.NEXT_PUBLIC_CHECK_MODE === "ALL_CHECK"

const NominateDialog: React.FC<Props> = ({ open, onClose }) => {
  const router = useRouter()
  const [memberDialogOpen, setMemberDialogOpen] = useState(false)
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false)
  const [word, setWord] = useState("")
  const [memberIds, setMemberIds] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const wordId = useRef<string>()

  const disabled = isLoading || word.length === 0 || memberIds.length === 0

  const handleMemberDialogClose = (memberIds: number[]) => {
    setMemberDialogOpen(false)
    setMemberIds(memberIds)
  }

  const handleCompleteDialogClose = async () => {
    setMemberDialogOpen(false)
    setCompleteDialogOpen(false)
    // await router.push(`/word/${wordId.current}`)
    onClose()
  }

  const handleSend = async () => {
    if(disabled) return
    setIsLoading(true)
    const { firebase, db, analytics, auth } = initFirebase()
    const ref = await db.collection("words").add({
      content: word,
      memberIds,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      valid: isAllCheckMode ? false : true,
      videos: [],
      createdBy: auth.currentUser.uid
    })

    analytics.logEvent("nominate", { name: "nominate" })

    wordId.current = ref.id
    setIsLoading(false)
    setWord("")
    setMemberIds([])
    setMemberDialogOpen(false)
    handleClose()
    setCompleteDialogOpen(true)
  }

  const handleClose = () => {
    if(!isLoading) onClose()
  }

  const fullScreen = useIsSp()

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        onClose={handleClose}
        fullScreen={fullScreen}
      >
        <div className="px-4 py-2 sm:mt-4 flex flex-row items-center justify-between">
          <h1 className="mx-2 text-lg">流行語ノミネート</h1>
          {
            fullScreen &&
            <button onClick={handleClose} className="p-4 rounded-full transition-all hover:bg-gray-100">
              <MdClose />
            </button>
          }
        </div>
        <DialogContent>
          <div className="mt-4 mb-2">あなたの思う流行語</div>
          <TextField className="mt-2" value={word} onChange={e => setWord(e.target.value)} disabled={isLoading} label="流行語" required variant="outlined" fullWidth />
          <div className="my-4">関連メンバー（発言者など）</div>
          {
            memberIds.length === 0 ? (
              <button onClick={() => setMemberDialogOpen(true)} className="bg-gray-100 border-2 border-gray-300 rounded-md p-3 border-dashed flex items-center">
                <IoMdArrowDropdown className="mr-2"/>
                選択する
              </button>
            ) : (
              <button
                disabled={isLoading}
                onClick={() => setMemberDialogOpen(true)}
                className="scroll-wrapper flex flex-row flex-nowrap my-2 overflow-x-scroll overscroll-x-contain whitespace-nowrap w-full px-2 cursor-pointer">
                {
                  memberIds.map(memberId => members[memberId - 1]).map(member => (
                    <NameChip key={member.id} member={member} onClick={() => {}} selected={true} selectable={false}/>
                  ))
                }
              </button>
            )
          }
          <div className="text-sm my-4">※同じ言葉が複数個ノミネートされた場合は、運営側で１つにまとめる場合がございます。ご了承ください。</div>
          <div className="w-full flex">
            <button
              className="px-8 py-2 my-4 ml-auto mr-4 bg-gray-300 text-white rounded-full
                transform duration-200 transition-all focus-visible:outline-black focus:outline-none focus:shadow-none hover:scale-105 focus:scale-95"
              disabled={isLoading}
              onClick={handleClose}
            >
              キャンセル
            </button>
            <button
              className={classNames(`px-8 py-2 my-4 text-white rounded-full transform duration-200 transition-all focus-visible:outline-black focus:outline-none`,
                disabled ? "bg-gray-300 shadow-none cursor-default" : "bg-gradient-to-r from-primary to-primary-light shadow-lg hover:scale-105 focus:scale-95 focus:shadow-none")}
              disabled={disabled}
              onClick={handleSend}
            >
              OK!!
            </button>
          </div>
        </DialogContent>
      </Dialog>
      <MemberSelectDialog open={memberDialogOpen} onClose={handleMemberDialogClose} init={memberIds}/>
      <MessageDialog open={completeDialogOpen} onClose={handleCompleteDialogClose} body="ノミネートが完了しました！" note="運営の承認後に反映されます"/>
    </>
  )
}

export default NominateDialog
