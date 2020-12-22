import type { GetStaticProps } from 'next'
import React, { useEffect, useState } from 'react'
import Header from '../view/components/Header'
import { MdArrowDownward, MdClose } from 'react-icons/md'
import WordCard from '../view/components/WordCard'
import WordListItem from '../view/components/WordListItem'
import NominateDialog from '../view/dialog/NominateDialog'
import MemberSelectDialog from '../view/dialog/MemberSelectDialog'
import Word, { SerializedWord } from '../types/word'
import { members } from '../data/members'
import classNames from 'classnames'
import NameChip from '../view/components/NameChip'
import initAdminFirebase from '../utils/auth/initAdminFirebase'
import { unserialize } from '../types/word'
import shuffle from '../utils/shuffle'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useGlobalStates } from '../utils/context/GlobalStatesProvider'
import Link from 'next/link'
import Footer from '../view/components/Footer'
import { useSortProps } from '../utils/context/SortPropProvider'

type Props = {
  words: Omit<SerializedWord, "comments">[]
  nominateNum: number
}

const PICKUP_NUM = 7

const Index: React.FC<Props> = ({ words: _words, nominateNum }) => {
  const router = useRouter()
  const [words] = useState<Omit<Word, "comments">[]>(() => _words.map(unserialize))
  const [pickup, setPickUp] = useState<Omit<Word, "comments">[]>([])
  const [listWords, setListWords] = useState<Omit<Word, "comments">[]>([])

  const [nominateDialogOpen, setNominateDialogOpen] = useState(false)
  const [memberSelectDialog, setMemberSelectDialogOpen] = useState(false)

  const [mode, setMode] = useState<"late" | "random">("late")
  const [sortProps, setSortProps] = useSortProps()

  // const [wordId, setWordId] = useState<string|null>(router.query.from?.toString())
  useEffect(() => {
    setSortProps(prev => ({ ...prev, showWordJumpButton: router.query.from != null}))
  }, [])

  const { globalStates: { initialized, description, nominateEnd, topMessage } } = useGlobalStates()

  const handleMemberSelectDone = (memberIds: number[]) => {
    if(memberIds.length === 0) memberIds = members.map(member => member.id)
    setSortProps(prev => ({...prev, filter: memberIds.map(id => members[id - 1])}))
    setMemberSelectDialogOpen(false)
  }

  const handleNominateDialogClose = () => {
    setNominateDialogOpen(false)
  }
  
  useEffect(() => {
    const filterIds = sortProps.filter?.map(member => member.id)
    const filtered = sortProps.filter == null ? words : words.filter(word => word.members.reduce((acc, member) => acc || filterIds.includes(member.id), false))
    const sorted = sortProps.sort
      ? [...filtered.sort((a, b) => a.createdAt < b.createdAt ? 1 : a.createdAt === b.createdAt ? 0 : -1)]
      : [...filtered.sort((a, b) => a.createdAt < b.createdAt ? -1 : a.createdAt === b.createdAt ? 0 : 1)]
    setListWords(sorted)
  }, [sortProps.sort, sortProps.filter])

  useEffect(() => {
    if(mode === "late"){
      setPickUp([...words.sort((a, b) => a.createdAt < b.createdAt ? 1 : a.createdAt === b.createdAt ? 0 : -1)].slice(0, PICKUP_NUM))
    }else{
      setPickUp(shuffle(words).slice(0, PICKUP_NUM))
    }
  }, [mode])


  return (
    <>
      <Head>
        <title>ホロライブ流行語大賞【非公式】</title>
        <meta property="og:title" content="【非公式】ホロライブ流行語大賞2020!!" />
        <meta property="og:description" content={`ホロライブファンでホロライブ流行語大賞を決めませんか？ぜひご参加ください!!`} />
        <meta property="og:url" content={router.asPath} />
        <meta property="og:image" content={`/api/ogp/word/top`} />
        <meta name="twitter:card" content="summary_large_image" />
        {/* <meta name="twitter:site" content="@holovote" /> */}
        <meta name="twitter:url" content={router.asPath} />
        <meta name="twitter:title" content="【非公式】ホロライブ流行語大賞2020!!" />
        <meta name="twitter:description" content={`ホロライブファンでホロライブ流行語大賞を決めませんか？ぜひご参加ください!!`} />
        <meta name="twitter:image" content={`https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/ogp/top`} />
      </Head>
      <div className="bg-gray-100 sm:bg-gray-50">
        <Header onClickNominate={() => setNominateDialogOpen(true)}/>
        <div className="max-w-screen-xl mx-auto sm:my-8 sm:px-8">
          <div className="relative w-full flex flex-col items-center px-4 py-8 bg-white min-h-screen round-2 sm:shadow-lg">
            <dl className="sm:mx-2 p-2 sm:p-4 bg-gray-50 text-black w-full flex flex-row">
              {
                Object.entries(topMessage).map(([key, message]) => (
                  <div key={key} className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-center text-center">
                    <dt className="inline-block text-sm">{key}</dt>
                    <dd className="inline-block text-xl sm:text-2xl sm:ml-2 font-bold text-primary">
                      {message === "%NOMINATE_SUM%" ? nominateNum : message}
                    </dd>
                  </div>
                ))
              }
            </dl>

            <section className="mx-2 my-4 sm:my-8 p-4 border-solid border-primary border-2 w-full text-sm">
              {description}
            </section>
            <section className="my-16">
              <p className="text-center">あなたの思う「流行語」はなに？</p>
              {
                nominateEnd ? (
                  <Link href={router.asPath.split("#")[0] + "#vote-anchor"}>
                    <a
                      className="block text-center px-16 py-4 my-4 bg-gradient-to-r from-primary to-primary-light text-white rounded-full shadow-lg text-xl font-bold
                        transform duration-200 transition-all focus-visible:outline-black focus:outline-none focus:shadow-none hover:scale-105 focus:scale-95"
                    >
                      投票する
                    </a>
                  </Link>
                ) : (
                  <button
                      className="px-16 py-4 my-4 bg-gradient-to-r from-primary to-primary-light text-white rounded-full shadow-lg text-xl font-bold
                      transform duration-200 transition-all focus-visible:outline-black focus:outline-none focus:shadow-none hover:scale-105 focus:scale-95"
                    onClick={() => setNominateDialogOpen(true)}
                  >
                    {initialized ? "ノミネートする" : "ノミネートする" /* 初期値 */}
                  </button>
                )
              }
            </section>

            <section className="w-full mt-8">
              <h1 className="text-lg mb-4 mx-2">ピックアップ</h1>
              <button
                className={classNames(mode === "late" ? "text-black font-bold underline" : "text-gray-400",
                  "transition-all text-md mx-2 focus-visible:outline-black focus:outline-none")}
                onClick={() => setMode("late")}
              >
                最新
              </button>
              <button
                className={classNames(mode === "random" ? "text-black font-bold underline" : "text-gray-400",
                    "transition-all text-md mx-2 focus-visible:outline-black focus:outline-none")}
                onClick={() => setMode("random")}
              >
                ランダム
              </button>
              <div className="-ml-4 -mr-4 p-2 overflow-x-scroll overscroll-x-contain flex flex-row flex-nowrap whitespace-nowrap">
                {pickup.map(item => (
                  <WordCard key={item.id} word={item}/>
                ))}
                <div className="pl-2"/>
              </div>
            </section>
            <div className="mb-16" />
            <article className="self-start w-full my-8">
              <h1 className="text-lg mb-4" id="vote-anchor">ノミネート一覧</h1>
              <div className="flex flex-row text-sm mt-4 mb-2 border-gray-200 border-b w-full overflow-hidden overflow-x-scroll overscroll-x-contain sm:overflow-x-auto">
                <button className={classNames("flex flex-row flex-shrink-0 items-center mr-2 px-2 focus-visible:outline-black focus:outline-none", !sortProps.sort && "mr-3")} onClick={() => setSortProps(prev => ({...prev, sort: !prev.sort}))}>
                  <MdArrowDownward className={classNames("transform transition-all", !sortProps.sort && "rotate-180")}/>
                  { sortProps.sort ? "新しい順" : "古い順" }
                </button>
                <button className="px-2 focus-visible:outline-black focus:outline-none flex items-center min-w-0" onClick={() => setMemberSelectDialogOpen(true)}>
                  <span className="flex-0 flex-shrink-0">フィルター：</span>
                  {
                    sortProps.filter.length === members.length ? "全員" : (
                      <div
                        className="scroll-wrapper flex flex-row flex-nowrap items-center my-2 whitespace-nowrap px-2 cursor-pointer sm:overflow-x-scroll sm:overscroll-x-contain"
                      >
                        {sortProps.filter.map(member => <NameChip key={member.id} member={member} selected={true} selectable={false}/>)}
                      </div>
                    )
                  }
                </button>
              </div>
              {listWords.map((item) => (
                <WordListItem key={item.id} word={item}/>
              ))}
              {
                listWords.length === 0 && (
                  <section className="text-center text-gray-400 mt-24 sm:mb-12">
                    条件を満たす流行語はありませんでした
                  </section>
                )
              }
            </article>
          </div>
        </div>
        <Footer/>
      </div>
      {
        sortProps.showWordJumpButton &&
        <Link href={`/#${router.query.from}`} scroll={false}>
          <button
            className="fixed bottom-12 left-1/2 bg-gray-800 text-white
              pl-6 pr-2 py-1 flex flex-row items-center rounded-full shadow-lg
              scroll-back-button focus-visible:outline-black focus:outline-none hover:scale-105 active:scale-95"
            onClick={() => setSortProps(prev => ({...prev, showWordJumpButton: false}))}
          >
            <span>元のスクロール位置に戻る</span>
            <MdClose
              className="ml-1 flex-shrink-0 text-xl transform scale hover:bg-gray-500 rounded-full p-2 w-8 h-8"
              onClick={(e) => {
                e.preventDefault()
                setSortProps(prev => ({ ...prev, showWordJumpButton: false }))
              }}
            />
          </button>
        </Link>
      }
      <NominateDialog open={nominateDialogOpen} onClose={handleNominateDialogClose}/>
      <MemberSelectDialog open={memberSelectDialog} init={sortProps.filter.length == members.length ? [] : (sortProps.filter ?? members).map(member => member.id)} onClose={handleMemberSelectDone}/>
    </>
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  try{
    const { db } = initAdminFirebase()
    const snapshots = await db().collection("words").orderBy("createdAt").get()
    const originalWords = snapshots.docs.map<any>(snapshot => ({ ...snapshot.data(), id: snapshot.id }))
    const words: Omit<SerializedWord, "comments">[] = originalWords.filter(data => data.redirectId == null).map<Omit<SerializedWord, "comments">>((data) => ({
      id: data.id,
      content: data.content,
      members: data.memberIds.map(id => members[id - 1]),
      videos: data.videos,
      createdAt: (data.createdAt.toDate() as Date).toISOString()
    }))
    return {
      props: { words, nominateNum: originalWords.length },
      revalidate: 5 * 60,
    }
  }catch{
    return {
      redirect: {
        permanent: false,
        destination: '/404',
      }
    }
  }
}

export default Index