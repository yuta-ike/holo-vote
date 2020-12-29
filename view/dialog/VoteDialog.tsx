import { Dialog, DialogContent, DialogTitle } from '@material-ui/core'
import classNames from 'classnames'
import React, { useState } from 'react'
import { AiFillPlusSquare, AiFillMinusSquare, AiOutlineLoading3Quarters } from 'react-icons/ai'
import Word from '../../types/word'
import initFirebase from '../../utils/auth/initFirebase'
// import signInWithTwitter from '../../utils/auth/signInWithTwitter'
import { useGlobalStates } from '../../utils/context/GlobalStatesProvider'
import Transition from './transition/Transition'
import VoteCompleteDialog from './VoteCompleteDialog'

type Props = {
  open: boolean
  onClose: () => void
  word: Omit<Omit<Word, "comments">, "createdAt">
}

const MAX_VOTE_NUM = 5

const VoteDialog: React.FC<Props> = ({ open, onClose, word }) => {
  const [voteCompleteDialogOpen, setVoteCompleteDialogOpen] = useState(false)
  const { globalStates: { user, todayVotes, voteStart, voteStartDate, voteErrorMessage }, incrementTodayVotes } = useGlobalStates()
  const [voteNum, setVoteNum] = useState(1)

  const handleVote = async () => {
    const { firebase, db, auth } = initFirebase()
    const uid = auth.currentUser?.uid

    if (uid == null || todayVotes >= MAX_VOTE_NUM) return

    await Promise.all(Array(voteNum).fill(null).map(() => db.collection("words").doc(word.id).collection("votes").add({
      userId: uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    })))

    incrementTodayVotes(voteNum)
    setVoteNum(1)

    const { analytics } = initFirebase()
    analytics.logEvent("vote", { name: "vote" })

    setVoteCompleteDialogOpen(true)
  }

  const handleClose = () => {
    setVoteCompleteDialogOpen(false)
    onClose()
  }

  const handlePlusVoteNum = (e) => {
    e.preventDefault()
    if(todayVotes + voteNum + 1 <= MAX_VOTE_NUM) setVoteNum(voteNum + 1)
  }

  const handleMinusVoteNum = (e) => {
    e.preventDefault()
    if(voteNum > 1) setVoteNum(voteNum - 1)
  }

  const ableToVote = voteStart && todayVotes <= MAX_VOTE_NUM

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        onClose={onClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">投票</DialogTitle>
        <DialogContent className="relative">
          {
            ableToVote ? (
              <>
                <p>「{word.content}」への投票数を選択してください</p>
                <p className="text-sm mt-2">1日5票まで投票できます（今日はあと{MAX_VOTE_NUM - todayVotes}票）</p>
                
                <div className="flex flex-row w-full justify-center items-center mt-4 mb-5 p-4">
                  <button className="text-4xl text-primary-light disabled:text-gray-200" disabled={voteNum <= 1} onClick={handleMinusVoteNum}> <AiFillMinusSquare/> </button>
                  <p className="mx-10">{voteNum}票</p>
                  <button className="text-4xl text-primary-light disabled:text-gray-200" disabled={todayVotes + voteNum >= MAX_VOTE_NUM} onClick={handlePlusVoteNum}> <AiFillPlusSquare/> </button>
                </div>
                {
                  voteErrorMessage != null && voteErrorMessage !== "" && (
                    <p className="mb-4 text-sm text-red-500">{voteErrorMessage}</p>
                  )
                }
                <div className="flex flex-row items-center mb-4">
                  <button
                    className="px-8 py-2 ml-auto mr-4 bg-gray-300 text-white rounded-full
                      transform duration-200 transition-all focus-visible:outline-black focus:outline-none focus:shadow-none hover:scale-105 focus:scale-95"
                    onClick={onClose}
                  >
                    キャンセル
                  </button>
                  <button
                    disabled={user == null || (voteErrorMessage != null && voteErrorMessage !== "")}
                    onClick={handleVote}
                    className={
                        classNames(`px-8 py-2 text-white rounded-full transform duration-200 transition-all focus-visible:outline-black focus:outline-none`,
                          user == null || (voteErrorMessage != null && voteErrorMessage !== "") ? "bg-gray-200 shadow-none cursor-not-allowed" : "bg-gradient-to-r from-primary to-primary-light shadow-lg focus:shadow-none hover:scale-105 focus:scale-95")
                  }>
                    {
                      user != null ? "投票する!!" : (
                        <div className="flex flex-row items-center">
                          <AiOutlineLoading3Quarters className="animate-spin text-md mr-2"/>
                          読み込み中
                        </div>
                      )
                    }
                    
                  </button>
                </div>
              </>
            ) : (
              <>
                {
                  todayVotes >= MAX_VOTE_NUM ? (
                    <p>
                      今日はもう投票できません😢<br />
                      0時を過ぎると、再度投票可能となります<br /><br />
                    </p>
                  ) : (
                    <p>
                      ごめんなさい...<br />
                      投票は投票期間中のみ可能です<br /><br />
                      投票開始時期：{voteStartDate}<br />
                    </p>
                  )
                }
                <div className="flex flex-row justify-end mt-2">
                  <button
                    onClick={onClose}
                    className="px-8 py-2 my-4 bg-gradient-to-r from-primary to-primary-light text-white rounded-full shadow-lg
                        transform duration-200 transition-all focus-visible:outline-black focus:outline-none focus:shadow-none hover:scale-105 focus:scale-95">
                    OK!!
                  </button>
                </div>
              </>
            )
          }
          
        </DialogContent>
        <VoteCompleteDialog open={voteCompleteDialogOpen} onClose={handleClose} word={word}/>
      </Dialog>
    </>
  )
}

export default VoteDialog
