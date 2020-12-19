import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import axios from 'axios'
import Header from '../../view/components/Header'
import NominateDialog from '../../view/dialog/NominateDialog'
import Word from '../../types/word'
import Comment from '../../types/comment'
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
import MemberSelectDialog from '../../view/dialog/MemberSelectDialog'
import VideoAddDialog from '../../view/dialog/VideoAddDialog'
import useIsSp from '../../utils/hooks/useIsSp'
import toFormatApproximateTime from '../../utils/date/toFormatApproximateTime'
import Footer from '../../view/components/Footer'
import { firestore } from 'firebase-admin'

type SerializedWord = Omit<Word, "comments"> & { comments: SerializedComment[] }

type Props = {
  word: Omit<SerializedWord, "createdAt">
}

type Params = {
  wordId: string
}

const WordPage: React.FC<Props> = ({ word: _word }) => {
  const [word, setWord] = useState<Omit<Word, "createdAt">>({..._word, comments: _word.comments.map(unserialize)})
  const router = useRouter()
  const [nominateDialogOpen, setNominateDialogOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<null | Member>(null)
  const [voteDialogOpen, setVoteDialogOpen] = useState(false)
  const [memberSelectDialogOpen, setMemberSelectDialogOpen] = useState(false)
  const [videoDialogOpen, setVideoDialogOpen] = useState(false)
  const [likedIds, setLikedIds] = useState<string[]>([])
  const [comment, setComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const ref = useRef(null)

  const disabled = comment.length === 0 || isLoading

  const uid = useRef<string>()
  useEffect(() => {
    const { auth } = initFirebase()
    auth().onAuthStateChanged((user) => {
      if(user == null) return
      uid.current = user.uid
      setLikedIds(_word.comments.filter(comment => comment.like.includes(uid.current)).map(comment => comment.id))
    })
  }, [])

  const handleCommentSend = async () => {
    const { db, auth } = initFirebase()
    setIsLoading(true)
    const ref = await db().collection("words").doc(word.id).collection("comments").add({
      content: comment,
      authorId: auth().currentUser.uid,
      like: [],
      createdAt: db.FieldValue.serverTimestamp(),
      updatedAt: db.FieldValue.serverTimestamp(),
    })
    setComment("")
    setIsLoading(false)
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

  const handleAddMember = async (selectedIds: number[]) => {
    const { db } = initFirebase()
    const newMemberIds = Array.from(new Set([...word.members.map(member => member.id), ...selectedIds]))
    await db().collection("words").doc(word.id).update({
      memberIds: newMemberIds,
    })
    setWord({ ...word, members: newMemberIds.map(id => members[id - 1]) })
    setMemberSelectDialogOpen(false)
    ref.current?.scrollTo({
      left: 9999,
      behavior: 'smooth'
    })
  }

  const handleVideoAdd = async (videoId: string | null) => {
    if(videoId == null){
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
        <meta name="twitter:title" content={`${word.content} ー ${word.members.map(member => member.name).join(" ")}`} />
        <meta name="twitter:description" content={`${word.content} ー ${word.members.map(member => member.name).join(" ")}    【非公式】ホロライブ流行語大賞2020!!`} />
        <meta name="twitter:image" content={`https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/ogp/word/${word.id}`} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-gray-100 sm:bg-gray-50">
        <Header onClickNominate={() => setNominateDialogOpen(true)} onClickVote={() => setVoteDialogOpen(true)}/>
        <div className="max-w-screen-xl mx-auto sm:my-8 sm:px-8">
          <div className="relative w-full flex flex-col items-center px-4 py-8 bg-white min-h-screen round-2 sm:shadow-lg">
            <section className="sticky z-40 sm:top-20 sm:-mx-8 top-16 w-screen flex flex-col items-start text-center py-2 bg-gradient-to-r from-primary to-primary-light text-white shadow-lg">
              <blockquote className="w-full self-center my-1 text-md sm:text-2xl italic break-all">
                {word.content}
              </blockquote>
            </section>
            <div className="flex-1 flex flex-col items-center mt-12 mb-20" id="vote-anchor">
              <div className="my-4">
                \ 投票して盛り上げよう!! /
              </div>
              <blockquote className="quote-design block relative my-3 px-12 py-2 self-center text-xl break-all font-bold transition-all hover:tracking-widest">
                {word.content}
              </blockquote>
              <a
                href={`https://twitter.com/intent/tweet?url=https://${process.env.NEXT_PUBLIC_VERCEL_URL}${router.asPath.split("#")[0]}&hashtags=${encodeURIComponent(`ホロ流行語大賞_非公式,ホロライブ`)}`}
                className="px-4 py-2 my-4 rounded-full border-twitter text-sm flex items-center
                    transform transition-all bg-twitter text-white hover:shadow-md
                    focus:outline-none focus-visible:outline-black active:shadow-none active:scale-95">
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
                    word.members.map(member => (
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
                    word.videos.map(video => (
                      <a href={`https://www.youtube.com/watch?v=${video.videoId}`} key={video.videoId} className="flex-none mx-2 my-4 w-52 hover:shadow-md p-2 rounded-md group min-w-0">
                        <Image src={video.thumbnail} width={320} height={220} />
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
            <section id="comment-anchor" className="flex flex-col my-12 max-w-2xl w-full">
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
                          <span className="text-sm">{(comment.like.length - (comment.like.includes(uid.current) ? 1 : 0)) + (likedIds.includes(comment.id) ? 1 : 0)}</span>
                        </button>
                      </div>
                    </section>
                  ))
                }
                {
                  word.comments.length === 0 && (
                    <section className="text-center text-gray-400 my-16 sm:my-24">
                      コメントはまだ投稿されていません<br/>コメントを投稿して盛り上げよう!!
                    </section>
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
    </>
  )
}

const getWordData = async (wordId: string, db: typeof firestore) => {
  const [wordSnapshot, commentSnapshots] = await Promise.all([
    db().collection("words").doc(wordId).get(),
    db().collection("words").doc(wordId).collection("comments").orderBy('createdAt').get(),
  ])

  const wordData = wordSnapshot.data()
  const commentData = commentSnapshots.docs.map((snapshot) => ({ ...snapshot.data(), id: snapshot.id })) as any[]

  if (wordData == null) throw Error()

  if(wordData.redirectId != null){
    console.log(wordData.redirectId)
    return getWordData(wordData.redirectId, db)
  }

  const word: Omit<SerializedWord, "createdAt"> = {
    id: wordSnapshot.id,
    content: wordData.content,
    members: wordData.memberIds.map((id: number) => members[id - 1]).reverse(),
    videos: wordData.videos,
    comments: commentData.map<SerializedComment>((data, i) => ({
      id: data.id,
      serialNumber: i + 1,
      createdAt: DateTime.fromJSDate(data.createdAt.toDate() as Date).toISO(),
      content: data.content,
      like: data.like,
    })).reverse(),
  }
  return word
}

export const getServerSideProps: GetServerSideProps<Props, Params> = async ({ res, params: { wordId } }) => {
  try{
    const { db } = initAdminFirebase()
    const word = await getWordData(wordId, db)
    return { props: { word } }
  }catch(e){
    console.log(e)
    res.setHeader('Location', '/')
    res.statusCode = 302
    res.end()
    return
  }
}

export default WordPage