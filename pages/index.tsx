import type { GetServerSideProps } from 'next'
import React, { useEffect, useState } from 'react'
import Header from '../view/components/Header'
import { MdArrowDownward } from 'react-icons/md'
import WordCard from '../view/components/WordCard'
import WordListItem from '../view/components/WordListItem'
import NominateDialog from '../view/dialog/NominateDialog'
import MemberSelectDialog from '../view/dialog/MemberSelectDialog'
import Word, { SerializedWord } from '../types/word'
import { members } from '../data/members'
import classNames from 'classnames'
import Member from '../types/member'
import NameChip from '../view/components/NameChip'
import initAdminFirebase from '../utils/auth/initAdminFirebase'
import { unserialize } from '../types/word'
import shuffle from '../utils/shuffle'
import { useRouter } from 'next/router'
import Head from 'next/head'

type Props = {
  words: Omit<SerializedWord, "comments">[]
}

const PICKUP_NUM = 7

const Index: React.FC<Props> = ({ words: _words }) => {
  const router = useRouter()
  const [words] = useState<Omit<Word, "comments">[]>(() => _words.map(unserialize))
  const [pickup, setPickUp] = useState<Omit<Word, "comments">[]>([])
  const [listWords, setListWords] = useState<Omit<Word, "comments">[]>([])

  const [nominateDialogOpen, setNominateDialogOpen] = useState(false)
  const [memberSelectDialog, setMemberSelectDialogOpen] = useState(false)
  
  const [filter, setFilters] = useState<Member[] | null>(null)

  const [mode, setMode] = useState<"late" | "random">("late")
  const [sort, setSort] = useState(true)

  const handleMemberSelectDone = (memberIds: number[]) => {
    setFilters(memberIds.length === members.length ? null : memberIds.map(id => members[id - 1]))
    setMemberSelectDialogOpen(false)
  }

  const handleNominateDialogClose = () => {
    setNominateDialogOpen(false)
  }
  
  useEffect(() => {
    const filterIds = filter?.map(member => member.id)
    const filtered = filter == null ? words : words.filter(word => word.members.reduce((acc, member) => acc || filterIds.includes(member.id), false))
    console.log(filtered)
    const sorted = sort
      ? [...filtered.sort((a, b) => a.createdAt < b.createdAt ? 1 : a.createdAt === b.createdAt ? 0 : -1)]
      : [...filtered.sort((a, b) => a.createdAt < b.createdAt ? -1 : a.createdAt === b.createdAt ? 0 : 1)]
    console.log(sorted)
    setListWords(sorted)
  }, [sort, filter])

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
        <meta property="og:type" content="website" />
        <meta property="og:url" content={router.asPath} />
        <meta property="og:image" content={`/api/ogp/word/top`} />
        <meta property="og:site_name" content="【非公式】ホロライブ流行語大賞2020!!" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@holovote" />
        <meta name="twitter:url" content={router.asPath} />
        <meta name="twitter:title" content="【非公式】ホロライブ流行語大賞2020!!" />
        <meta name="twitter:description" content={`ホロライブファンでホロライブ流行語大賞を決めませんか？ぜひご参加ください!!`} />
        <meta name="twitter:image" content={`https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/ogp/top`} />
      </Head>
      <div className="bg-gray-50">
        <Header onClickNominate={() => setNominateDialogOpen(true)}/>
        <div className="sm:m-8 px-4 pt-8 pb-48 bg-white min-h-screen round-2 shadow-lg flex flex-col items-center">
          <dl className="sm:mx-2 p-2 sm:p-4 bg-gray-50 text-black w-full flex flex-row">
            <div className="flex-1 flex flex-col sm:flex-row text-center">
              <dt className="inline-block text-sm">ノミネート数</dt>
              <dd className="inline-block text-2xl sm:ml-2 font-bold text-primary">{words.length.toString()}</dd>
            </div>
            <div className="flex-1 flex flex-col sm:flex-row text-center">
              <dt className="inline-block text-sm">ノミネート〆切</dt>
              <dd className="inline-block text-2xl sm:ml-2 font-bold text-primary">未定</dd>
            </div>
            <div className="flex-1 flex flex-col sm:flex-row text-center">
              <dt className="inline-block text-sm">投票開始</dt>
              <dd className="inline-block text-2xl sm:ml-2 font-bold text-primary">未定</dd>
            </div>
          </dl>

          <section className="mx-2 my-4 sm:my-8 p-4 border-solid border-primary border-2 w-full text-sm">
            ホロライブ流行語大賞2020（非公式）は、「ノミネート期間」と「投票期間」に分かれています。
            「ノミネート期間」では、ホロライブファンのみなさんから、ホロライブ流行語のノミネート（登録）を募集します。
            ノミネートされた言葉の中から投票を行い、流行語を決定します。投票は「投票期間」中にのみ可能です。
          </section>
          <section className="my-16">
            <p className="text-center">あなたの思う「流行語」はなに？</p>
            <button
              className="px-16 py-4 my-4 bg-gradient-to-r from-primary to-primary-light text-white rounded-full shadow-lg text-xl
                transform duration-200 transition-all focus-visible:outline-black focus:outline-none focus:shadow-none hover:scale-105 focus:scale-95"
              onClick={() => setNominateDialogOpen(true)}
            >
              ノミネートする
            </button>
          </section>

          <section className="w-full my-8">
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
                <WordCard key={item.content} word={item}/>
              ))}
              <div className="pl-2"/>
            </div>
          </section>
          
          <article className="self-start w-full my-8">
            <h1 className="text-lg mb-4">ノミネート一覧</h1>
            <div className="flex flex-row text-sm mt-4 mb-2 w-full overflow-hidden overflow-x-scroll overscroll-x-contain sm:overflow-x-auto">
              <button className={classNames("flex flex-row flex-shrink-0 items-center mr-2 px-2 focus-visible:outline-black focus:outline-none", !sort && "mr-3")} onClick={() => setSort(!sort)}>
                <MdArrowDownward className={classNames("transform transition-all", !sort && "rotate-180")}/>
                { sort ? "新しい順" : "古い順" }
              </button>
              <button className="px-2 focus-visible:outline-black focus:outline-none flex items-center min-w-0" onClick={() => setMemberSelectDialogOpen(true)}>
                <span className="flex-0 flex-shrink-0">フィルター：</span>
                {
                  filter == null ? "全員" : (
                    <div
                      className="scroll-wrapper flex flex-row flex-nowrap items-center my-2 whitespace-nowrap px-2 cursor-pointer sm:overflow-x-scroll sm:overscroll-x-contain"
                    >
                      {filter.map(member => <NameChip key={member.id} member={member} selected={true} selectable={false}/>)}
                    </div>
                  )
                }
              </button>
            </div>
            {listWords.map((item) => (
              <WordListItem key={item.content} word={item}/>
            ))}
          </article>
        </div>
      </div>
      <NominateDialog open={nominateDialogOpen} onClose={handleNominateDialogClose}/>
      <MemberSelectDialog open={memberSelectDialog} init={filter == null ? [] : (filter ?? members).map(member => member.id)} onClose={handleMemberSelectDone}/>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const { db } = initAdminFirebase()
  const snapshots = await db().collection("words").orderBy("createdAt").get()
  const words: Omit<SerializedWord, "comments">[] = snapshots.docs.map<any>(snapshot => ({ ...snapshot.data(), id: snapshot.id })).map<Omit<SerializedWord, "comments">>((data) => ({
    id: data.id,
    content: data.content,
    members: data.memberIds.map(id => members[id - 1]),
    videos: data.videos,
    createdAt: (data.createdAt.toDate() as Date).toISOString()
  }))
  return { props: { words } }
}

export default Index