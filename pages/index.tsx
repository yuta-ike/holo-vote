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
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useGlobalStates } from '../utils/context/GlobalStatesProvider'
import Link from 'next/link'
import Footer from '../view/components/Footer'
import { useSortProps } from '../utils/context/SortPropProvider'
import PickUpCards from '../view/components/PickUpCards'
import { DateTime } from 'luxon'
import { FaListUl, FaThList } from 'react-icons/fa'

type Props = {
  words: Omit<SerializedWord, "comments">[]
  nominateNum: number
}

const Index: React.FC<Props> = ({ words: _words, nominateNum }) => {
  const router = useRouter()
  const [words] = useState<Omit<Word, "comments">[]>(() => _words.map(unserialize))
  const [listWords, setListWords] = useState<Omit<Word, "comments">[]>([])

  const [nominateDialogOpen, setNominateDialogOpen] = useState(false)
  const [memberSelectDialog, setMemberSelectDialogOpen] = useState(false)

  const [sortProps, setSortProps] = useSortProps()

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

  const handleModeChange = () => {
    const nextMode = sortProps.mode === "list" ? "simple" : "list"
    setSortProps(prev => ({ ...prev, mode: nextMode }))
  }
  
  useEffect(() => {
    const filterIds = sortProps.filter?.map(member => member.id)
    const filtered = sortProps.filter == null ? words : words.filter(word => word.members.reduce((acc, member) => acc || filterIds.includes(member.id), false))
    const sorted = sortProps.sort
      ? [...filtered.sort((a, b) => a.nominateNo > b.nominateNo ? 1 : a.nominateNo === b.nominateNo ? 0 : -1)]
      : [...filtered.sort((a, b) => a.nominateNo > b.nominateNo ? -1 : a.nominateNo === b.nominateNo ? 0 : 1)]
    setListWords(sorted)
  }, [sortProps.sort, sortProps.filter])

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
                !initialized && <div className="h-12"/>
              }
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
              {!initialized ? "ホロライブファンの投票でホロライブの流行語大賞を決めよう！という企画です✨✨投票は1日5回まで、同じワードへの複数投票可です！ぜひご参加ください🎉" : description}
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
                    {initialized ? "ノミネートする" : "投票する" /* 初期値 */}
                  </button>
                )
              }
            </section>

            <PickUpCards words={words}/>

            <article className="self-start w-full my-8">
              <h1 className="text-lg mb-4" id="vote-anchor">ノミネート一覧</h1>
              <div className="flex flex-row text-md mt-4 mb-2 border-gray-200 border-b w-full overflow-hidden overflow-x-scroll overscroll-x-contain sm:overflow-x-auto">
                <button className={classNames("flex flex-row flex-shrink-0 items-center mr-4 px-2 focus-visible:outline-black focus:outline-none", !sortProps.sort && "mr-3")} onClick={() => setSortProps(prev => ({...prev, sort: !prev.sort}))}>
                  {/* <MdArrowDownward className={classNames("transform transition-all", !sortProps.sort && "rotate-180")}/> */}
                  {
                    sortProps.sort ? (
                      <><span className="text-xl font-bold">あ</span>→<span className="text-sm font-bold">ん</span></>
                    ) : (
                      <><span className="text-xl font-bold">ん</span>→<span className="text-sm font-bold">あ</span></>
                    )
                  }
                </button>
                <button className="flex flex-row flex-shrink-0 items-center mr-4" onClick={handleModeChange}>
                  {
                    sortProps.mode === "list" ? (
                      <>
                        <FaThList/>
                        <span className="ml-1">リスト　</span>
                      </>
                    ) : (
                      <>
                        <FaListUl />
                        <span className="ml-1">シンプル</span>
                      </>
                    )
                  }
                </button>
                <button className="px-2 focus-visible:outline-black focus:outline-none flex items-center min-w-0" onClick={() => setMemberSelectDialogOpen(true)}>
                  <span className="flex-0 flex-shrink-0">フィルター：</span>
                  {
                    sortProps.filter.length === members.length ? <span className="py-2 px-5 my-1 bg-primary-light rounded-full text-white">全員</span> : (
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
                <WordListItem key={item.id} word={item} mode={sortProps.mode}/>
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
  const { db } = initAdminFirebase()
  const orderBy: [string, "asc" | "desc"] = process.env.NEXT_PUBLIC_VOTE_START === "START" ? ["nominateNo", "asc"] : ["createdAt", "desc"]
  const snapshots = await db().collection("words").orderBy(...orderBy).get()
  const wordData = snapshots.docs.filter(snapshot => snapshot.exists && snapshot.data().valid && snapshot.data().redirectId == null).map<any>(snapshot => ({ ...snapshot.data(), id: snapshot.id }))
  const words: Omit<SerializedWord, "comments">[] = wordData.map<Omit<SerializedWord, "comments">>((data) => ({
    id: data.id,
    content: data.content,
    members: data.memberIds.map(id => members[id - 1]),
    videos: data.videos,
    createdAt: (data.createdAt.toDate() as Date).toISOString(),
    nominateNo: data.nominateNo ?? null,
  }))
  return {
    props: { words, nominateNum: wordData.length },
    revalidate: 60 * 60, // 1h
  }

  // const words: Omit<SerializedWord, "comments">[] = Array(10).fill(null).map((_, i) => ({
  //   id: "test-id-" + i,
  //   content: i === 0 ? "あぁいほぉうぃ〜…とうぎゃざ〜えば〜。グッドラック！！" : i === 1 ? "アピールして下さい" : "テストワード" + i,
  //   members: [members[i]],
  //   videos: [],
  //   createdAt: DateTime.local().toISO(),
  //   nominateNo: 500 + i,
  // }))

  // const word = {
  //   id: "YfNLvwpzMHArzXa7l3t7",
  //   content: "へい！むな！",
  //   members: [members[21 - 1], members[33 - 1], members[0]],
  //   videos: [],
  //   createdAt: DateTime.local().toISO(),
  //   nominateNo: 170,
  // }

  // return {
  //   props: { words: [...words, word], nominateNum: words.length },
  //   revalidate: 60 * 60, // 1h
  // }
}

export default Index