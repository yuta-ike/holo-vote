import React from 'react'
import Link from 'next/link'
import { AiOutlineTwitter } from 'react-icons/ai'
import { useRouter } from 'next/router'

type Props = {
  onClickNominate: () => void
}

const Header: React.FC<Props> = ({ onClickNominate }) => {
  const router = useRouter()
  return (
    <>
      <header className="sticky top-0 h-20 flex flex-row items-center p-4 justify-between shadow-md bg-white z-40">
        <Link href="/">
          <a className="mr-auto">【非公式】ホロライブ流行語大賞2020</a>
        </Link>
        <button
          className="text-primary h-full mr-4 px-2 border-2 border-primary-light rounded-full
            transform duration-200 transition-all focus-visible:outline-black focus:outline-none focus:shadow-none hover:scale-105 focus:scale-95"
          onClick={onClickNominate}
        >
          ノミネートする!!
        </button>
        <a
          href={`https://twitter.com/intent/tweet?url=https://${process.env.NEXT_PUBLIC_VERCEL_URL}${router.asPath}&hashtags=${encodeURIComponent(`ホロ流行語大賞_非公式,ホロライブ`)}`}
          className="twitter-share-button flex flex-row items-center bg-twitter text-white rounded-sm px-2 py-1 shadow-lg outline-none
            transform duration-200 transition-all focus-visible:outline-black focus:outline-none focus:shadow-none hover:scale-105 focus:scale-95"
        >
          <div className="mr-2 text-white">
            <AiOutlineTwitter/>
          </div>
          <p className="text-white">#ホロ流行語大賞_非公式</p>
        </a>
      </header>
    </>
  )
}

export default Header
