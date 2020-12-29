import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { AiOutlineTwitter } from 'react-icons/ai'
import { useRouter } from 'next/router'
import useIsSp from '../../utils/hooks/useIsSp'
import throttle from 'lodash.throttle'
import { useGlobalStates } from '../../utils/context/GlobalStatesProvider'
import outLink from '../../utils/ga/outLink'
import { useSortProps } from '../../utils/context/SortPropProvider'

type Props = {
  onClickNominate: () => void
  onClickVote?: () => void
}

const Header: React.FC<Props> = ({ onClickNominate, onClickVote }) => {
  const [scroll, setScroll] = useState(0)
  const router = useRouter()
  const fullScreen = useIsSp()
  const { globalStates: { initialized, nominateEnd } } = useGlobalStates()

  const [sortProps, setSortProps] = useSortProps()
  
  const handleScroll = throttle(() => {
    setScroll(window.scrollY) //TODO: ここ指定域を超えているかだけでいい
  }, 100)

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (scroll > 1500 && sortProps.showWordJumpButton) {
      setSortProps(prev => ({ ...prev, showWordJumpButton: false }))
    }
  }, [scroll])

  return (
    <>
      <header className={`sticky top-0 h-16 sm:h-20 flex flex-row items-center p-4 justify-between bg-white z-40 transition-all ${scroll < 1 && fullScreen ? "shadow-none" : "shadow-md"}`}>
        <Link href="/">
          <a className="mr-auto">【非公式】ホロライブ流行語大賞2020</a>
        </Link>
        {
          !fullScreen && (
            !initialized ? (
              null
            ) : nominateEnd ? (
              onClickVote == null ? (
                <Link href={router.asPath.split("#")[0] + "#vote-anchor"}>
                  <a
                    className="text-primary mr-4 px-3 py-1 border-2 border-primary-light rounded-full
                      transform duration-200 transition-all focus-visible:outline-black focus:outline-none focus:shadow-none hover:scale-105 focus:scale-95"
                  >
                    投票する!!
                  </a>
                </Link>
              ) : (
                <button
                  onClick={onClickVote}
                  className="text-primary mr-4 px-3 py-1 border-2 border-primary-light rounded-full
                    transform duration-200 transition-all focus-visible:outline-black focus:outline-none focus:shadow-none hover:scale-105 focus:scale-95"
                >
                      投票する!!
                </button>
              )
            ) : (
              <button
                className="text-primary mr-4 px-3 py-1 border-2 border-primary-light rounded-full
                  transform duration-200 transition-all focus-visible:outline-black focus:outline-none focus:shadow-none hover:scale-105 focus:scale-95"
                onClick={onClickNominate}
              >
                ノミネートする!!
              </button>
            )
          )
        }
        {
          fullScreen ? (
            <a
              href={`https://twitter.com/intent/tweet?url=https://${process.env.NEXT_PUBLIC_VERCEL_URL}${router.asPath.split("#")[0]}&hashtags=${encodeURIComponent(`ホロ流行語大賞_非公式,ホロライブ`)}`}
              className="flex flex-row items-center bg-white rounded-full p-2 outline-none
                  transform duration-200 transition-all focus-visible:outline-black focus:outline-none focus:shadow-none hover:scale-105 focus:scale-95"
              onClick={outLink("header-twitter-link")}
            >
              <div className="sm:mr-2 text-twitter text-3xl">
                <AiOutlineTwitter />
              </div>
            </a>
          ) : (
            <a
              href={`https://twitter.com/intent/tweet?url=https://${process.env.NEXT_PUBLIC_VERCEL_URL}${router.asPath.split("#")[0]}&hashtags=${encodeURIComponent(`ホロ流行語大賞_非公式,ホロライブ`)}`}
              className="flex flex-row items-center bg-twitter text-white rounded-sm px-2 py-1 shadow-lg outline-none
                  transform duration-200 transition-all focus-visible:outline-black focus:outline-none focus:shadow-none hover:scale-105 focus:scale-95"
              onClick={outLink("header-twitter-link")}
            >
              <div className="sm:mr-2 text-white">
                <AiOutlineTwitter />
              </div>
              <p className="text-white">#ホロ流行語大賞_非公式</p>
            </a>
          )
        }
      </header>
      {
        sortProps.showWordJumpButton ? (
          null
        ) : !initialized ? (
          null
        ) : nominateEnd ? (
          router.asPath.split("#")[0] === "/" ? (
            null
          ) : onClickVote == null ? (
            <Link href={router.asPath.split("#")[0] + "#vote-anchor"}>
              <a
                className={`fixed bottom-16 px-8 py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-full shadow-2xl text-lg z-50
                    transform duration-200 transition-all focus-visible:outline-black focus:outline-none focus:shadow-none hover:scale-105 focus:scale-95
                    ${scroll > 100 ? "translate-x-0 right-4" : "translate-x-full right-0"}`}
              >
                投票
              </a>
            </Link>
          ) : (
            <button
              className={`fixed bottom-16 px-8 py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-full shadow-2xl text-lg z-50
                transform duration-200 transition-all focus-visible:outline-black focus:outline-none focus:shadow-none hover:scale-105 focus:scale-95
                ${scroll > 100 ? "translate-x-0 right-4" : "translate-x-full right-0"}`}
              onClick={onClickVote}
            >
              投票
            </button>
          )
        ) : (
          <button
            className={`fixed bottom-16 px-5 py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-full shadow-2xl text-lg z-50
              transform duration-200 transition-all focus-visible:outline-black focus:outline-none focus:shadow-none hover:scale-105 focus:scale-95
              ${scroll > 100 ? "translate-x-0 right-4" : "translate-x-full right-0"}`}
            onClick={onClickNominate}
          >
            ノミネート
          </button>
        )
      }
    </>
  )
}

export default Header
