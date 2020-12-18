import classNames from 'classnames'
import React from 'react'
import Image from 'next/image'
import Member from '../../types/member'

type Props = {
  member: Member
  onClick?: (selected: boolean) => void
  selected: boolean
  selectable?: boolean
  className?: string
}

const NameChip: React.FC<Props> = ({ member, onClick, selected, selectable = true, className = "" }) => {
  return (
    <div
      key={member.id}
      onClick={() => onClick?.(!selected)}
      {...(selectable ? {role:"button", tabIndex: 0} : {})}
      className={classNames(selected ? " bg-primary-light  border-primary-light" : "bg-gray-300 border-gray-300",
        selectable && "transition-all transform hover:shadow-md active:scale-95 active:shadow-none cursor-pointer select-none",
        `relative name-chip flex-shrink-0 flex flex-row items-center rounded-full border-4 m-1 text-white focus-visible:outline-black focus:outline-none`, className)}
    >
      <Image className="rounded-full bg-white w-8" src={`/${member.imageAPath}`} width={40} height={40} />
      <div className="flex-1 mx-2 text-sm">
        {member.name}
      </div>
    </div>
  )
}

export default NameChip
