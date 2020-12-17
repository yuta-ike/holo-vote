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

type Props = {
  open: boolean
  onClose: (selected: number[]) => void
  init?: number[]
}

const MemberSelectDialog: React.FC<Props> = ({ open, onClose, init = [] }) => {
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

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      onClose={() => onClose([])}
    >
      <DialogTitle className="shadow-md pb-0">
        メンバー選択
      </DialogTitle>
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
      <DialogActions className="dialog-action-area flex flex-col">
        <style>{`
          .dialog-action-area {
             box-shadow: 0 -6px 6px -2px rgba(0, 0, 0, 0.05);
          }
        `}</style>
        <div ref={ref} className="scroll-wrapper flex flex-row flex-nowrap my-2 overflow-x-scroll overscroll-x-contain whitespace-nowrap w-full px-2">
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
          <button
            onClick={() => onClose(init)}
            className="px-8 py-2 my-4 mr-4 bg-gray-300 text-white rounded-full
              transform duration-200 transition-all focus-visible:outline-black focus:outline-none focus:shadow-none hover:scale-105 focus:scale-95">
            キャンセル
          </button>
          <button
            onClick={() => onClose(selected)}
            disabled={selected.length === 0}
            className={classNames(selected.length > 0 ?
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
