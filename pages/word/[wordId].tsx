import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import Header from '../../view/components/Header'
import NominateDialog from '../../view/dialog/NominateDialog'
import Word from '../../types/word'
import { SerializedComment, unserialize } from '../../types/comment'
import { members } from '../../data/members'
import { AiOutlineTwitter } from 'react-icons/ai'
import TextField from '@material-ui/core/TextField'
import { BiPlus } from 'react-icons/bi'
import { MdThumbUp } from 'react-icons/md'
import MemberDialog from '../../view/dialog/MemberDialog'
import VoteDialog from '../../view/dialog/VoteDialog'
import initFirebase from '../../utils/auth/initFirebase'
import { GetServerSideProps } from 'next'
import initAdminFirebase from '../../utils/auth/initAdminFirebase'
import { DateTime } from 'luxon'
import classNames from 'classnames'
import Member from '../../types/member'
import { useRouter } from 'next/router'

type SerializedWord = Omit<Word, "comments"> & { comments: SerializedComment[] }

type Props = {
  word: Omit<SerializedWord, "createdAt">
  ogpUrl: string
}

type Params = {
  wordId: string
}

const WordPage: React.FC<Props> = ({ word: _word, ogpUrl }) => {
  const word: Omit<Word, "createdAt"> = {..._word, comments: _word.comments.map(unserialize)}
  const router = useRouter()
  const [nominateDialogOpen, setNominateDialogOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<null | Member>(null)
  const [voteDialogOpen, setVoteDialogOpen] = useState(false)
  const [likedIds, setLikedIds] = useState<string[]>([])
  const [comment, setComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const disabled = comment.length === 0 || isLoading

  const uid = useRef<string>()
  useEffect(() => {
    const { auth } = initFirebase()
    auth().onAuthStateChanged((user) => {
      uid.current = user.uid
      setLikedIds(_word.comments.filter(comment => comment.like.includes(uid.current)).map(comment => comment.id))
    })
  }, [])

  const handleCommentSend = async () => {
    const { db, auth } = initFirebase()
    setIsLoading(true)
    await db().collection("words").doc(word.id).collection("comments").add({
      content: comment,
      authorId: auth().currentUser.uid,
      like: [],
      createdAt: db.FieldValue.serverTimestamp(),
      updatedAt: db.FieldValue.serverTimestamp(),
    })
    setComment("")
    setIsLoading(false)
    router.reload()
  }

  const handleLikeAdd = async (commentId: string) => {
    const { db, auth } = initFirebase()
    setLikedIds([...likedIds, commentId])
    await db().collection("words").doc(word.id).collection("comments").doc(commentId).update({
      like: db.FieldValue.arrayUnion(auth().currentUser.uid),
    })
  }

  const handleLikeRemove = async (commentId: string) => {
    const { db, auth } = initFirebase()
    setLikedIds(likedIds.filter(id => commentId !== id))
    await db().collection("words").doc(word.id).collection("comments").doc(commentId).update({
      like: db.FieldValue.arrayRemove(auth().currentUser.uid),
    })
  }

  const handleVideoAdd = async (videoId: string) => {
    const { db } = initFirebase()
    await db().collection("words").doc(word.id).update({
      videoIds: db.FieldValue.arrayUnion(videoId),
    })
  }

  console.log(process.env)

  return (
    <>
      <Head>
        <title>ホロライブ流行語大賞【非公式】</title>
        <meta property="og:title" content="【非公式】ホロライブ流行語大賞2020!!"/>
        <meta property="og:description" content={`${word.content} ー ${word.members.map(member => member.name).join(" ")}`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={router.asPath} />
        <meta property="og:image" content={`/api/ogp/word/${word.id}`} />
        <meta property="og:site_name" content="【非公式】ホロライブ流行語大賞2020!!" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@holovote" />
        <meta name="twitter:url" content={router.asPath} />
        <meta name="twitter:title" content="【非公式】ホロライブ流行語大賞2020!!" />
        <meta name="twitter:description" content={`${word.content} ー ${word.members.map(member => member.name).join(" ")}`} />
        <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_VERCEL_URL}/api/ogp/word/${word.id}`} />
        {/* <link rel="shortcut icon" href={'https://t-cr.jp/favicon.ico'} />
        <link rel="apple-touch-icon" href={'https://t-cr.jp/logo.png'} /> */}
      </Head>
      <Header onClickNominate={() => setNominateDialogOpen(true)} />
      <Link href="/">
        <button className="ml-8 my-2 text-gray-500 focus-visible:outline-black focus:outline-none">{"戻る"}</button>
      </Link>
      <div className="mx-8 px-4 py-8 bg-white min-h-screen round-2 shadow-lg flex flex-col items-center">
        <section className="sticky z-40 top-24 flex flex-col items-start text-center w-full py-2 bg-gradient-to-r from-primary to-primary-light text-white shadow-lg">
          <blockquote className="w-full self-center my-1 text-2xl italic break-all">
            {word.content}
          </blockquote>
        </section>
        <div className="flex-1 flex flex-col items-center mt-12 mb-20">
          <div className="my-4">
            \ 投票して盛り上げよう!! /
          </div>
          <blockquote className="quote-design block relative mt-3 px-12 py-2 self-center text-xl break-all font-bold transition-all hover:tracking-widest">
            {word.content}
          </blockquote>
          <button
            className="px-4 py-1 my-3 rounded-full border-twitter text-sm flex items-center
                transform transition-all hover:bg-twitter hover:border-twitter hover:text-white hover:tracking-wider hover:shadow-md
                focus:outline-none focus-visible:outline-black active:shadow-none active:scale-95">
            <AiOutlineTwitter className="mr-2"/> ツイートする
          </button>
          <button
            onClick={() => setVoteDialogOpen(true)}
            className="px-12 py-2 border-2 border-primary rounded-sm text-md tracking-wide
                transform transition-all hover:bg-primary-light hover:border-primary-light hover:text-white hover:tracking-wider hover:shadow-md
                focus:outline-none focus-visible:outline-black active:shadow-none active:scale-95">
            コレに投票する!!
          </button>
        </div>
        <div className="flex flex-row w-full">
          <section className="w-1/2">
            <h1 className="ml-4">ホロメン情報</h1>
            <div className="w-full flex flex-row flex-nowrap overflow-x-scroll overscroll-x-contain">
              {
                word.members.map(member => (
                  <button key={member.id} onClick={() => setSelectedMember(member)} className="flex-none m-2 w-52 hover:shadow-md p-2 rounded-md group min-w-0">
                    <Image src="/001.png" width={300} height={300} />
                    <h1 className="mb-2 text-md break-all">{member.name}</h1>
                    <p className="text-sm ">{member.catchphrase}</p>
                  </button>
                ))
              }
              <button className="flex-none m-2 w-52 hover:shadow-md p-2 rounded-md group min-w-0">
                <div className="p-2 rounded-md bg-gray-100 w-full h-full flex flex-col items-center justify-center">
                  <BiPlus className="mb-2 text-2xl" />
                  関係するホロメンを追加する
                </div>
              </button>
            </div>
          </section>
          <section className="w-1/2">
            <h1 className="ml-4">関連動画</h1>
            <div className="w-full flex flex-row flex-nowrap overflow-x-scroll overscroll-x-contain">
              {
                word.videos.map(video => (
                  <a href="" className="flex-none m-2 w-52 hover:shadow-md p-2 rounded-md group min-w-0">
                    <Image src="http://img.youtube.com/vi/uRB1G0cKpIk/mqdefault.jpg" width={320} height={180} />
                    <h1 className="mb-2 text-sm group-hover:underline break-all">【#ホロWACCA】『ぺこみこ大戦争！！』フルMV【さくらみこ/兎田ぺこら ホロライブ】</h1>
                  </a>
                ))
              }
              <button className="flex-none m-2 w-52 hover:shadow-md p-2 rounded-md group min-w-0 h-64">
                <div className="p-2 rounded-md bg-gray-100 w-full h-full flex flex-col items-center justify-center">
                  <BiPlus className="mb-2 text-3xl"/>
                  関連動画を追加する
                </div>
              </button>
            </div>
          </section>
        </div>
        <section className="flex flex-col my-12 max-w-2xl w-full">
          <h1>応援コメント!!</h1>
          <div className="flex w-full justify-between my-8">
            <TextField
              value={comment}
              onChange={e => setComment(e.target.value)}
              className="flex-1 mr-2"
              variant="outlined"
              disabled={isLoading}
              label="コメントを投稿して盛り上げよう!!"
            />
            <button
              className={
                classNames(`flex-0 px-4 text-white rounded-md
                  transform duration-200 transition-all focus-visible:outline-black focus:outline-none`,
                  disabled ? "bg-gray-300 shadow-none cursor-default" : "bg-gradient-to-r from-primary to-primary-light focus:shadow-none hover:scale-105 focus:scale-95"
                )
              }
              onClick={handleCommentSend}
              disabled={disabled}
            >
              投稿
            </button>
          </div>
          <section>
          {
            word.comments.filter(comment => comment.content !== "").map((comment, i) => (
              <section id={`${comment.serialNumber}`} key={comment.id} className={classNames(i === 0 && "border-t", "border-b border-gray-200 py-2")}>
                <div className="flex justify-between text-sm items-center">
                  <div>#{`${comment.serialNumber}`.padStart(3, "0")}</div><div>{comment.createdAt.toFormat("mm/dd")}</div>
                </div>
                <p className="px-1 text-center">{comment.content}</p>
                <div>
                  <button
                    className={classNames("ml-auto flex items-center focus-visible:outline-black focus:outline-none px-2 py-1 border rounded-full",
                      likedIds.includes(comment.id) ? "text-primary border-primary" : "text-black border-transparent")}
                    onClick={() => {
                      if(likedIds.includes(comment.id)) {
                        handleLikeRemove(comment.id)
                      }else{
                        handleLikeAdd(comment.id)
                      }
                    }}
                    title="いいね"
                  >
                    <MdThumbUp className="mr-1"/>
                    <span className="text-sm">{(comment.like.length - (comment.like.includes(uid.current) ? 1 : 0)) + (likedIds.includes(comment.id) ? 1 : 0)}</span>
                  </button>
                </div>
              </section>
            ))
          }
          </section>
        </section>
      </div>
      <NominateDialog open={nominateDialogOpen} onClose={() => setNominateDialogOpen(false)} />
      {
        selectedMember != null &&
        <MemberDialog member={selectedMember} open={selectedMember != null} onClose={() => setSelectedMember(null)}/>
      }
      <VoteDialog open={voteDialogOpen} onClose={() => setVoteDialogOpen(false)} word={word} />
    </>
  )
}

const getWordData = async (wordId: string): Promise<[Omit<SerializedWord, "createdAt">, string]> => {
  const { db, storage } = initAdminFirebase()
  const [wordSnapshot, commentSnapshots] = await Promise.all([
    db().collection("words").doc(wordId).get(),
    db().collection("words").doc(wordId).collection("comments").orderBy('createdAt').get(),
  ])

  const wordData = wordSnapshot.data()
  const commentData = commentSnapshots.docs.map((snapshot) => ({ ...snapshot.data(), id: snapshot.id })) as any[]

  if (wordData == null) throw Error()

  // if(wordData.redirectId != null){
  //   console.log(wordData.redirectId)
  //   return getWordData(wordData.redirectId)
  // }

  const word: Omit<SerializedWord, "createdAt"> = {
    id: wordSnapshot.id,
    content: wordData.content,
    members: wordData.memberIds.map((id: number) => members[id - 1]),
    videos: wordData.videos,
    comments: commentData.map<SerializedComment>((data, i) => ({
      id: data.id,
      serialNumber: i + 1,
      createdAt: DateTime.fromJSDate(data.createdAt.toDate() as Date).toISO(),
      content: data.content,
      like: data.like,
    })).reverse(),
  }

  let ogpUrl = ""//wordData.ogpUrl

  // if(ogpUrl == null){
  //   const canvas = createCanvas(WIDTH, HEIGHT)
  //   const ctx = canvas.getContext("2d")

  //   ctx.fillStyle = "#FFF"
  //   ctx.fillRect(DX, DY, WIDTH, HEIGHT)

  //   const buffer = canvas.toBuffer()
  //   const path = `ogp/${wordId}`
  //   const file = storage().bucket().file(path)
  //   await file.save(buffer)
  //   await file.setMetadata({ contentType: 'image/png' })
  //   ogpUrl = `https://firebasestorage.googleapis.com/v0/b/holo-vote/o/${encodeURIComponent(path)}?alt=media`
  // }

  
  return [word, ogpUrl]
}

export const getServerSideProps: GetServerSideProps<Props, Params> = async ({ res, params: { wordId } }) => {
  try{
    const [word, ogpUrl] = await getWordData(wordId)
    return { props: { word, ogpUrl } }
  }catch(e){
    console.log(e)
    res.setHeader('Location', '/')
    res.statusCode = 302
    res.end()
    return
  }
}

export default WordPage