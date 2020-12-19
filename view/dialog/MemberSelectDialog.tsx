import React, { useRef } from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Transition from './transition/Transition'
import { categorizedMembers, members } from '../../data/members'
import Member, { Generation, genToDisplay } from '../../types/member'
import useSet from '../../utils/hooks/useSet'
import classNames from 'classnames'
import DialogActions from '@material-ui/core/DialogActions'
import NameChip from '../components/NameChip'
import { useEffectWhenLarge } from '../../utils/hooks/useEffectWhen'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'
import useIsSp from '../../utils/hooks/useIsSp'
import { MdClose } from 'react-icons/md'

type Props = {
  open: boolean
  onClose: (selected: number[]) => void
  init?: number[]
  allowEmpty?: boolean
}

const MemberSelectDialog: React.FC<Props> = ({ open, onClose, init = [], allowEmpty = false }) => {
  const [selected, { toggle }, setItem] = useSet<number>(init)
  const ref = useRef(null)

  const handleToggle = (id: number) => {
    toggle(id)
  }

  const allSelected = selected.length === members.length
  const handleAllSelect = () => {
    if(allSelected){
      setItem([])
    }else{
      setItem(members.map(member => member.id))
    }
  }

  useEffectWhenLarge(() => {
    ref.current?.scrollTo({
      left: 9999,
      behavior: 'smooth'
    })
  }, selected.length)

  const fullScreen = useIsSp()

  const disabled = allowEmpty ? false : selected.length === 0

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      onClose={() => onClose(init)}
      fullScreen={fullScreen}
    >
      <div className="shadow-md px-4 py-2 flex flex-row items-center justify-between">
        <h1 className="my-2">メンバー選択</h1>
        {
          fullScreen &&
          <button onClick={() => onClose(init)} className="p-4 my-4 rounded-full transition-all hover:bg-gray-100">
            <MdClose/>
          </button>
        }
      </div>
      <DialogContent className="px-0">
        <style>{`
          .name-chip > div:first-child{
            flex-shrink: 0;
          }
        `}</style>
        {
          Object.entries(categorizedMembers).map(([gen, members]: [Generation, Member[]]) => (
            <section key={gen} className="mt-2">
              <div className="mx-4">{genToDisplay(gen)}</div>
              <div className="scroll-wrapper flex flex-row flex-nowrap mb-4 overflow-x-scroll overscroll-x-contain whitespace-nowrap w-full px-2">
                <style>{`
                  .scroll-wrapper>*:last-child::before {
                    position: absolute;
                    top: 0;
                    left: 100%;
                    width: 1rem;
                    height: 1px;
                    content: '';
                  }
                `}</style>
                {
                  members.map((member) => (
                    <NameChip key={member.id} member={member} onClick={() => handleToggle(member.id)} selected={selected.includes(member.id)}/>
                  ))
                }
              </div>
            </section>
          ))
        }
      </DialogContent>
      <DialogActions className="top-shadow flex flex-col">
        <style>{`
          .top-shadow {
             box-shadow: 0 -20px 25px -5px rgba(0, 0, 0, 0.1);
          }
        `}</style>
        <div ref={ref} className="scroll-wrapper flex flex-row flex-nowrap overflow-x-scroll overscroll-x-contain whitespace-nowrap w-full px-2 py-2">
          {
            selected.map(memberId => members[memberId - 1]).map(member => (
              <NameChip key={member.id} member={member} onClick={() => handleToggle(member.id)} selected={selected.includes(member.id)} />
            ))
          }
        </div>
        <div className="flex items-center justify-end w-full px-4">
          <button
            onClick={handleAllSelect}
            className={classNames("border-4 mr-auto text-white rounded-full focus-visible:outline-black focus:outline-none px-4 py-2",
              allSelected ? "bg-primary-light border-primary-light" : "bg-gray-300 border-gray-300"
            )}
          >
            全選択
          </button>
          {
            !fullScreen &&
            <button
              onClick={() => onClose(init)}
              className="px-8 py-2 my-4 mr-4 bg-gray-300 text-white rounded-full
                transform duration-200 transition-all focus-visible:outline-black focus:outline-none focus:shadow-none hover:scale-105 focus:scale-95">
              キャンセル
            </button>
          }
          <button
            onClick={() => onClose(selected)}
            disabled={disabled}
            className={classNames(!disabled ?
                "bg-gradient-to-r from-primary to-primary-light text-white shadow-lg transform duration-200 transition-all focus:shadow-none hover:scale-105 focus:scale-95" :
                "bg-gray-300 text-white shadow-none cursor-default",
                `px-8 py-2 my-4 rounded-full focus-visible:outline-black focus:outline-none`)}
          >
            OK!!
          </button>
        </div>
      </DialogActions>
    </Dialog>
  )
}

export default MemberSelectDialog
