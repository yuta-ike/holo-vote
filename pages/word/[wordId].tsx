import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import axios from 'axios'
import Header from '../../view/components/Header'
import NominateDialog from '../../view/dialog/NominateDialog'
import Word from '../../types/word'
import Comment, { SerializedComment } from '../../types/comment'
import { members } from '../../data/members'
import { AiOutlineLoading3Quarters, AiOutlineTwitter } from 'react-icons/ai'
import TextField from '@material-ui/core/TextField'
import { BiPlus } from 'react-icons/bi'
import { MdThumbUp } from 'react-icons/md'
import MemberDialog from '../../view/dialog/MemberDialog'
import VoteDialog from '../../view/dialog/VoteDialog'
import initFirebase from '../../utils/auth/initFirebase'
import { GetStaticPaths, GetStaticProps } from 'next'
import initAdminFirebase from '../../utils/auth/initAdminFirebase'
import { DateTime } from 'luxon'
import classNames from 'classnames'
import Member from '../../types/member'
import { useRouter } from 'next/router'
import MemberSelectDialog from '../../view/dialog/MemberSelectDialog'
import VideoAddDialog from '../../view/dialog/VideoAddDialog'
import toFormatApproximateTime from '../../utils/date/toFormatApproximateTime'
import Footer from '../../view/components/Footer'
import ReportDialog from '../../view/dialog/ReportDialog'
import { useGlobalStates } from '../../utils/context/GlobalStatesProvider'
import outLink from '../../utils/ga/outLink'
import { firestore } from 'firebase-admin'
import NotFoundError from '../../error/NotFoundError'
import getShortenUrl from '../../utils/shortenUrl'

type SerializedWord = Pick<Word, "id" | "content" | "members" | "videos" | "shortenUrl" | "nominateNo"> & {
  comments: SerializedComment[]
}

type Props = {
  word: SerializedWord
}

type ParsedUrlQuery = {
  wordId: string
}

const FIX_COMMENTS = ["いいね！", "これは草", "大草原", "！？！？"]

const WordPage: React.FC<Props> = ({ word: _word }) => {
  const router = useRouter()
  if(_word == null){
    return null
  }
  const [word, setWord] = useState<Pick<Word, "id" | "content" | "members" | "videos" | "comments" | "shortenUrl" | "nominateNo">>({..._word, comments: _word.comments.map(comment => ({ ...comment, createdAt: DateTime.fromISO(comment.createdAt) }))})
  const [nominateDialogOpen, setNominateDialogOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<null | Member>(null)
  const [voteDialogOpen, setVoteDialogOpen] = useState(false)
  const [memberSelectDialogOpen, setMemberSelectDialogOpen] = useState(false)
  const [videoDialogOpen, setVideoDialogOpen] = useState(false)
  const [reportDialogOpen, setReportDialogOpen] = useState(false)
  const [likedIds, setLikedIds] = useState<string[]>([])
  const [comment, setComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const { globalStates: { user } } = useGlobalStates()
  const ref = useRef<HTMLDivElement>(null)

  const disabled = comment.length === 0 || isSending

  // useEffect(() => {
  //   ;(async () => {
  //     const { db } = initFirebase()
  //     const [wordSnapshot, commentSnapshots] = await Promise.all([
  //       db.collection("words").doc(word.id).get(),
  //       db.collection("words").doc(word.id).collection("comments").get(),
  //     ])
  //     const wordData = wordSnapshot.data()
      
  //     setWord(prev => ({
  //       ...prev,
  //       content: wordData.content,
  //       members: wordData.memberIds.map((id: number) => members[id - 1]),
  //       videos: wordData.videos,
  //       comments: commentSnapshots.docs.map<Comment>((snapshot, i) => ({
  //         id: snapshot.id,
  //         serialNumber: i + 1,
  //         createdAt: DateTime.fromJSDate(snapshot.data().createdAt.toDate()),
  //         content: snapshot.data().content,
  //         like: snapshot.data().like,
  //       })).reverse(),
  //     }))
  //     setIsLoading(false)
  //   })()
  // }, [])

  useEffect(() => {
    if(user != null) setLikedIds(word.comments.filter(comment => comment.like.includes(user.uid)).map(comment => comment.id))
  }, [user])

  const handleQuickSend = (comment: string) => () => {
    sendComment(comment)
  }

  const handleCommentSend = () => {
    sendComment(comment)
  }

  const sendComment = async (comment: string) => {
    const { firebase, db, auth } = initFirebase()
    if(auth.currentUser == null) return;
    setIsSending(true)
    const ref = await db.collection("words").doc(word.id).collection("comments").add({
      content: comment,
      authorId: auth.currentUser.uid,
      like: [],
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdBy: auth.currentUser.uid
    })
    setComment("")
    setIsSending(false)
    const newComment: Comment = {
      content: comment,
      id: ref.id,
      serialNumber: word.comments.length + 1,
      createdAt: DateTime.local(),
      like: []
    }
    setWord(prev => ({...prev, comments: [newComment, ...prev.comments]}))
    // router.push(router.asPath.split("#")[0] + "#comment-anchor")
    // router.reload()
  }

  const handleLikeAdd = async (commentId: string) => {
    const { firebase, db, auth } = initFirebase()
    if (auth.currentUser == null) return;
    setLikedIds([...likedIds, commentId])
    await db.collection("words").doc(word.id).collection("comments").doc(commentId).update({
      like: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.uid),
    })
  }

  const handleLikeRemove = async (commentId: string) => {
    const { firebase, db, auth } = initFirebase()
    if (auth.currentUser == null) return;
    setLikedIds(likedIds.filter(id => commentId !== id))
    await db.collection("words").doc(word.id).collection("comments").doc(commentId).update({
      like: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.uid),
    })
  }

  const handleAddMember = async (selectedIds: number[]) => {
    const { db } = initFirebase()
    const newMemberIds = Array.from(new Set([...word.members.map(member => member.id), ...selectedIds]))
    await db.collection("words").doc(word.id).update({
      memberIds: newMemberIds,
    })
    setWord({ ...word, members: newMemberIds.map(id => members[id - 1]) })
    setMemberSelectDialogOpen(false)
    ref.current?.scrollTo({
      left: 9999,
      behavior: 'smooth'
    })
  }

  const handleVideoAdd = async (videoId?: string) => {
    if(videoId == null || (word.videos.find(video => video.videoId === videoId) != null)){
      setVideoDialogOpen(false)
      return
    }
    await axios.post("/api/video", {
      videoId, wordId: word.id
    })
    setVideoDialogOpen(false)
    router.push(router.asPath.split("#")[0] + "#video-anchor")
    router.reload()
  }

  const scrollToTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'smooth'})

  return (
    <>
      <Head>
        <title>ホロライブ流行語大賞【非公式】</title>
        <meta property="og:title" content={`【非公式】ホロライブ流行語大賞2020!! ${word.content}`}/>
        <meta property="og:description" content={`${word.content} ー ${word.members?.map(member => member.name).join(" ") ?? ""}`} />
        <meta property="og:url" content={router.asPath} />
        <meta property="og:image" content={`/api/ogp/word/${word.id}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={`https://${process.env.NEXT_PUBLIC_VERCEL_URL}/${router.asPath}`} />
        <meta name="twitter:title" content={`${word.content} ー ${word.members?.map(member => member.name).join(" ") ?? ""}`} />
        <meta name="twitter:description" content={`${word.content} ー ${word.members?.map(member => member.name).join(" ") ?? ""}    【非公式】ホロライブ流行語大賞2020!!`} />
        <meta name="twitter:image" content={`https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/ogp/word/${word.id}`} />
      </Head>
      <div className="bg-gray-100 sm:bg-gray-50">
        <Header onClickNominate={() => setNominateDialogOpen(true)} onClickVote={() => setVoteDialogOpen(true)}/>
        <Link href={router.query.fromList ? `/?from=${word.id}` : "/"} as="/">
          <a className="block ml-8 py-4">
            一覧へ戻る
          </a>
        </Link>
        <div className="max-w-screen-xl mx-auto sm:mb-8 sm:px-8">
          <div className="relative w-full flex flex-col items-center px-4 py-8 bg-white min-h-screen round-2 sm:shadow-lg">
            <button
              className="sticky z-40 sm:top-20 sm:-mx-8 top-16 w-screen flex flex-col items-start text-center py-2 bg-gradient-to-r from-primary to-primary-light text-white shadow-lg"
              onClick={scrollToTop}
            >
              <blockquote className="w-full self-center my-1 text-md sm:text-2xl break-all font-emphasis font-bold">
                {word.content}
              </blockquote>
            </button>
            <div className="flex-1 flex flex-col items-center mt-12 mb-20" id="vote-anchor">
              <div className="my-4">
                \ 投票して盛り上げよう!! /
              </div>
              <blockquote className="quote-design block relative my-3 px-12 py-2 self-center text-3xl break-all transition-all hover:tracking-widest font-emphasis font-extrabold">
                {word.content}
              </blockquote>
              <a
                href={`https://twitter.com/intent/tweet?url=${word.shortenUrl}&hashtags=${encodeURIComponent(`ホロ流行語大賞_非公式,${word.members?.slice(0, 7).map(member => member.name).join(",") ?? ""}`)}`}
                className="px-4 py-2 my-4 rounded-full border-twitter text-sm flex items-center
                    transform transition-all bg-twitter text-white hover:shadow-md
                    focus:outline-none focus-visible:outline-black active:shadow-none active:scale-95"
                onClick={outLink("word-twitter-link")}
              >
                <AiOutlineTwitter className="mr-2"/> ツイートする
              </a>
              <button
                onClick={() => setVoteDialogOpen(true)}
                className="px-12 py-2 mt-2 border-2 border-primary rounded-sm text-md tracking-wide
                    transform transition-all hover:bg-primary-light hover:border-primary-light hover:text-white hover:tracking-wider hover:shadow-md
                    focus:outline-none focus-visible:outline-black active:shadow-none active:scale-95">
                コレに投票する!!
              </button>
            </div>
            <div className="flex flex-col md:flex-row w-full">
              <section className="md:w-1/2">
                <h1 className="ml-4">ホロメン情報</h1>
                <div ref={ref} className="w-full h-full flex flex-row flex-nowrap overflow-x-scroll overscroll-x-contain">
                  {
                    word.members?.map(member => (
                      <button key={member.id} onClick={() => setSelectedMember(member)} className="flex-none flex flex-col items-center mx-2 my-4 w-52 hover:shadow-md p-2 rounded-md group min-w-0">
                        <div className="w-36">
                          <Image src={`/${member.imageAPath}`} width={220} height={220} />
                        </div>
                        <h1 className="mt-2 mb-2 text-md break-all">{member.name}</h1>
                        <p className="text-sm ">{member.catchphrase}</p>
                      </button>
                    ))
                  }
                  <button className="flex-none mx-2 my-4 w-52 hover:shadow-md p-2 rounded-md group min-w-0" onClick={() => setMemberSelectDialogOpen(true)}>
                    <div className="px-2 py-20 sm:py-2 rounded-md bg-gray-100 w-full h-full flex flex-col items-center justify-center">
                      <BiPlus className="mb-2 text-2xl" />
                      関係するホロメンを追加する
                    </div>
                  </button>
                </div>
              </section>
              <section className="md:w-1/2" id="video-anchor">
                <h1 className="ml-4">関連動画</h1>
                <div className="w-full h-full flex flex-row flex-nowrap overflow-x-scroll overscroll-x-contain">
                  {
                    word.videos?.map(video => (
                      <a href={`https://www.youtube.com/watch?v=${video.videoId}`} key={video.videoId} className="flex-none mx-2 my-4 w-52 hover:shadow-md p-2 rounded-md group min-w-0">
                        {video.thumbnail != null && <Image src={video.thumbnail} width={320} height={220} />}
                        <h1 className="mb-2 text-sm group-hover:underline break-all">{video.title}</h1>
                      </a>
                    ))
                  }
                  <button className="flex-none mx-2 my-4 w-52 hover:shadow-md p-2 rounded-md group min-w-0" onClick={() => setVideoDialogOpen(true)}>
                    <div className="p-2 rounded-md bg-gray-100 w-full h-full flex flex-col items-center justify-center">
                      <BiPlus className="mb-2 text-3xl"/>
                      関連動画を追加する
                    </div>
                  </button>
                </div>
              </section>
            </div>
            <section className="flex flex-col mt-8 sm:mt-16 max-w-2xl w-full text-sm text-gray-400 text-center">
              <p className="leading-none">
              この投稿が不適切である場合、
              <button className="inline my-4 text-red-300" onClick={() => setReportDialogOpen(true)}>
                こちらのフォーム
              </button>
                {" "}または{" "}<a className="text-red-300" href="https://twitter.com/holovote">@holovote</a>{" "}へご報告をお願いします
              </p>
            </section>
            <section id="comment-anchor" className="flex flex-col my-12 max-w-2xl w-full">
              <h1>応援コメント!!<span className="text-sm">（匿名）</span></h1>
              <div className="flex w-full justify-between mt-8">
                <TextField
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  className="flex-1 mr-2"
                  variant="outlined"
                  disabled={isSending}
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
              <div className="mb-6 pt-2 flex flex-row items-center flex-nowrap overflow-x-scroll overscroll-x-contain whitespace-nowrap">
                <p className="text-sm mr-2">
                  ワンタップで投稿
                </p>
                {
                  FIX_COMMENTS.map(comment => (
                    <button
                      key={comment}
                      onClick={handleQuickSend(comment)}
                      className="px-4 py-2 mx-1 border border-gray-300 rounded-sm focus-visible:outline-black focus:outline-none hover:bg-gray-100"
                    >
                      {comment}
                    </button>
                  ))
                }
              </div>
              <p className="text-sm text-gray-500">他のユーザーの画面に反映されるまで、最大で1時間程度かかります。</p>
              <section>
                {
                  word.comments.filter(comment => comment.content !== "").map((comment, i) => (
                    <section id={`${comment.serialNumber}`} key={comment.id} className={classNames(i === 0 && "border-t", "border-b border-gray-200 py-2")}>
                      <div className="flex justify-between text-sm items-center">
                        <div>#{`${comment.serialNumber}`.padStart(3, "0")}</div><div>{toFormatApproximateTime(comment.createdAt)}</div>
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
                          <span className="text-sm">{user == null ? 0 : (comment.like.length - (comment.like.includes(user.uid) ? 1 : 0)) + (likedIds.includes(comment.id) ? 1 : 0)}</span>
                        </button>
                      </div>
                    </section>
                  ))
                }
                {
                  word.comments.length === 0 && (
                    isLoading ? (
                      <section className="text-gray-400 my-16 sm:my-24">
                        <AiOutlineLoading3Quarters className="animate-spin text-4xl mx-auto" />
                      </section>
                    ) : (
                      <section className="text-center text-gray-400 my-16 sm:my-24">
                        コメントはまだ投稿されていません<br/>コメントを投稿して盛り上げよう!!
                      </section>
                    )
                  )
                }
              </section>
            </section>
          </div>
        </div>
        <Footer/>
      </div>
      <NominateDialog open={nominateDialogOpen} onClose={() => setNominateDialogOpen(false)} />
      {
        selectedMember != null &&
        <MemberDialog member={selectedMember} open={selectedMember != null} onClose={() => setSelectedMember(null)}/>
      }
      <VoteDialog open={voteDialogOpen} onClose={() => setVoteDialogOpen(false)} word={word} />
      <MemberSelectDialog open={memberSelectDialogOpen} onClose={handleAddMember}/>
      <VideoAddDialog open={videoDialogOpen} onClose={handleVideoAdd}/>
      <ReportDialog open={reportDialogOpen} onClose={() => setReportDialogOpen(false)} word={word}/>
    </>
  )
}

const getWordData = async (wordId: string, db: typeof firestore) => {
  const [wordSnapshot, commentSnapshots] = await Promise.all([
    db().collection("words").doc(wordId).get(),
    db().collection("words").doc(wordId).collection("comments").orderBy('createdAt').get(),
  ])

  if(!wordSnapshot.exists) throw new NotFoundError()

  const wordData = wordSnapshot.data()
  const commentData = commentSnapshots.docs.map((snapshot) => ({ ...snapshot.data(), id: snapshot.id })) as any[]

  if(wordData == null) throw new NotFoundError()

  if(wordData.redirectId != null){
    const redirectId: string = wordData.redirectId
    return redirectId
  }

  const word: Omit<SerializedWord, "createdAt"> = {
    id: wordSnapshot.id,
    content: wordData.content,
    members: wordData.memberIds.map((id: number) => members[id - 1]),
    videos: wordData.videos,
    shortenUrl: wordData.shortenUrl,
    nominateNo: wordData.nominateNo,
    comments: commentData.map<SerializedComment>((data, i) => ({
      id: data.id,
      serialNumber: i + 1,
      createdAt: DateTime.fromJSDate(data.createdAt.toDate()).toISO(),
      content: data.content,
      like: data.like,
    })).reverse(),
  }
  return word
}

export const getStaticPaths: GetStaticPaths<ParsedUrlQuery> = async () => {
  const { db } = initAdminFirebase()
  const snapshots = await db().collection("words").get()
  return {
    paths: snapshots.docs.filter(snapshot => snapshot.exists && snapshot.data().valid && snapshot.data().redirectId == null).map(snapshot => snapshot.id).map(wordId => ({ params: { wordId } })),
    fallback: true,
  }
}


export const getStaticProps: GetStaticProps<Props, ParsedUrlQuery> = async ({ params }) => {
  try{
    const wordId = params?.wordId
    if(wordId == null) throw new Error()
    const { db } = initAdminFirebase()
    const word = await getWordData(wordId, db)
    if(typeof word !== "string"){
      return { props: { word } }
    }else{
      return {
        redirect: {
          permanent: true,
          destination: `/word/${word}`
        }
      }
    }
  }catch(e){
    if (e instanceof NotFoundError){
      return {
        redirect: {
          permanent: false,
          destination: '/404',
        }
      }
    }else{
      throw new Error()
    }
  }
}

export default WordPage