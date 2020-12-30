import classNames from 'classnames'
import { DateTime } from 'luxon'
import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { members } from '../../data/members'
import Word, { SerializedWord, unserialize } from '../../types/word'
import initAdminFirebase from '../../utils/auth/initAdminFirebase'
import initFirebase from '../../utils/auth/initFirebase'
import { mapUserData } from '../../utils/auth/mapUserData'
import { getUserFromCookie, removeUserCookie, setUserCookie } from '../../utils/auth/userCookies'
import { useGlobalStates } from '../../utils/context/GlobalStatesProvider'

type Vote = {
  userId: string
  createdAt: string
}

type Props = {
  words: Omit<SerializedWord & { kana?: string, redirectId?: string, votes: Vote[] }, "comments">[]
  nominateNum: number
}

const admin = ({ words: _words }) => {
  const router = useRouter()
  const [authed, setAuthed] = useState(false)
  
  // 認証
  useEffect(() => {
    const { auth } = initFirebase()
    auth.onIdTokenChanged(async (user) => {
      if (user) {
        const userData = await mapUserData(user)
        setUserCookie(userData)
      } else {
        removeUserCookie()
      }
    })
    
    const userFromCookie = getUserFromCookie()
    if (!userFromCookie) {
      router.push('/')
      return
    }else{
      setAuthed(true)
    }
  }, [])

  const [words] = useState<Omit<Word & { kana?: string, redirectId?: string, votes: Vote[] }, "comments">[]>(() => _words.map(unserialize))
  const [comments, setComments] = useState<Record<Word["id"], string>>({})
  const [redirects, setRedirects] = useState<Record<Word["id"], string>>({})
  const handleChangeComments = (id:string, value: string) => {
    setComments(prev => ({ ...prev, [id]: value }))
  }

  const handleChangeRedirects = (id: string, value: string) => {
    setRedirects(prev => ({ ...prev, [id]: value }))
  }

  const handleSend = () => {
    const { db } = initFirebase()
    Object.entries(comments).map(([id, kana]) => {
      db.collection("words").doc(id).update({
        kana
      })
    })
  }

  const handleSendRedirect = () => {
    const { db } = initFirebase()
    Object.entries(redirects).map(([id, redirectId]) => {
      db.collection("words").doc(id).update({
        redirectId
      })
    })
  }

  if (!authed) return null

  const voteSum = words.reduce((acc, word) => acc + word.votes.length, 0)

  return (
    <div>
      <div className="flex flex-row m-4">
        <button onClick={handleSend} className="px-4 py-1 bg-primary text-white mr-4">ふりがな送信</button>
        <button onClick={handleSendRedirect} className="px-4 py-1 bg-primary text-white">リダイレクト送信</button>
      </div>
      <div className="font-extrabold my-4">
        {voteSum}
      </div>
      <table className="table-auto">
        <tbody>
          {
            words.sort((a, b) => a.votes.length < b.votes.length ? 1 : a.votes.length === b.votes.length ? 0 : -1).map(word => (
              <tr key={word.id} className={
                classNames(
                  redirects[word.id] != null && redirects[word.id] != "" && words.find(_word => _word.id === redirects[word.id]) == null && "border border-red-500",
                  word.redirectId != null && word.redirectId != "" && "text-gray-300",
                )}>
                <td>{word.id}</td>
                {/* <td>{word?.redirectId}</td> */}
                <td className={word.redirectId != null && word.redirectId != "" ? "text-gray-200" : ""}>{word.content}</td>
                <td className="px-2">{word.votes.length}</td>
                <td className="px-2">{((word.votes.length / voteSum) * 100).toFixed(2)}%</td>
                {/* <td>{word.kana ?? ""}</td> */}
                {/* <td>
                  <input type="text" className="border border-gray-400 rounded-sm" value={comments[word.id] ?? ""} onChange={e => handleChangeComments(word.id, e.target.value)} />
                </td> */}
                {/* <td>
                  <input type="text" className="border border-gray-400 rounded-sm" value={redirects[word.id] ?? ""} onChange={e => handleChangeRedirects(word.id, e.target.value)} />
                </td> */}
                {/* <td>
                  {words.find(_word => _word.id === redirects[word.id])?.content}
                </td> */}
                <td>
                  {word.members.map(member => member.name).join(" / ")}
                </td>
              </tr>
            ))
          }
        {/* {
          members.map(member => member.id).map(memberId => (
            words.filter(word => word.members.length <= 6 && word.members.map(member => member.id).includes(memberId)).map((word, i) => (
              <tr key={word.id} className={
                classNames(
                  redirects[word.id] != null && redirects[word.id] != "" && words.find(_word => _word.id === redirects[word.id]) == null && "border border-red-500",
                  word.redirectId != null && word.redirectId != "" && "text-gray-300",
                  i === 0 && "border-t-2 border-gray-500"
                )}>
                <td>{word.id}</td>
                <td>{word?.redirectId}</td>
                <td className={word.redirectId != null && word.redirectId != "" ? "text-gray-200" : ""}>{word.content}</td>
                <td>{word.votes.length}</td>
                <td>{word.kana ?? ""}</td>
                <td>
                  <input type="text" className="border border-gray-400 rounded-sm" value={comments[word.id] ?? ""} onChange={e => handleChangeComments(word.id, e.target.value)} />
                </td>
                <td>
                  <input type="text" className="border border-gray-400 rounded-sm" value={redirects[word.id] ?? ""} onChange={e => handleChangeRedirects(word.id, e.target.value)} />
                </td>
                <td>
                  {words.find(_word => _word.id === redirects[word.id])?.content}
                </td>
                <td>
                  {word.members.map(member => member.name).join(" / ")}
                </td>
              </tr>
            ))
          ))
        }
        {
          words.filter(word => word.members.length > 6).map(word => (
            <tr key={word.id} className={
              classNames(
                redirects[word.id] != null && redirects[word.id] != "" && words.find(_word => _word.id === redirects[word.id]) == null && "border border-red-500",
                word.redirectId != null && word.redirectId != "" && "text-gray-300",
              )}>
              <td>{word.id}</td>
              <td>{word?.redirectId}</td>
              <td className={word.redirectId != null && word.redirectId != "" ? "text-gray-200" : ""}>{word.content}</td>
              <td>{word.votes.length}</td>
              <td>{word.kana ?? ""}</td>
              <td>
                <input type="text" className="border border-gray-400 rounded-sm" value={comments[word.id] ?? ""} onChange={e => handleChangeComments(word.id, e.target.value)} />
              </td>
              <td>
                <input type="text" className="border border-gray-400 rounded-sm" value={redirects[word.id] ?? ""} onChange={e => handleChangeRedirects(word.id, e.target.value)} />
              </td>
              <td>
                {words.find(_word => _word.id === redirects[word.id])?.content}
              </td>
              <td>
                {word.members.map(member => member.name).join(" / ")}
              </td>
            </tr>
          ))
        } */}
        </tbody>
      </table>
      <button onClick={handleSend} className="p-4 bg-primary text-white">送信</button>
    </div>
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  try {
    const { db } = initAdminFirebase()
    const snapshots = await db().collection("words").orderBy("kana").get()
    const wordData = snapshots.docs.filter(snapshot => snapshot.exists && snapshot.data().valid).map<any>(snapshot => ({ ...snapshot.data(), id: snapshot.id }))
    const words: Omit<SerializedWord, "comments">[] = wordData.map<Omit<SerializedWord, "comments">>((data) => ({
      id: data.id,
      content: data.content,
      members: data.memberIds.map(id => members[id - 1]),
      videos: data.videos,
      createdAt: (data.createdAt.toDate() as Date).toISOString(),
      kana: data.kana ?? null,
      redirectId: data.redirectId ?? null,
    }))

    const voteSnapshots = await Promise.all(words.map(word => db().collection("words").doc(word.id).collection("votes").get()))
    const voteData = voteSnapshots.map(snapshots => snapshots.docs.map(snapshot => snapshot.data())) as Vote[][]
    
    const wordsWithVotes = words.map((word, i) => ({...word, votes: voteData[i]}))

    return {
      props: { words: wordsWithVotes, nominateNum: wordsWithVotes.length },
      revalidate: 6 * 60 * 60, // 6h
    }

    // const words: Omit<SerializedWord & { votes: Vote[] }, "comments">[] = Array(10).fill(null).map((_, i) => ({
    //   id: "test-id-" + i,
    //   content: i === 0 ? "あぁいほぉうぃ〜…とうぎゃざ〜えば〜。グッドラック！！" : i === 1 ? "アピールして下さい" : "テストワード" + i,
    //   members: Array(i <= 6 ? i + 1 : 2).fill(null).map((_, j) => members[i + j]),
    //   videos: [],
    //   createdAt: DateTime.local().toISO(),
    //   nominateNo: 500 + i,
    //   votes: i === 0 ? [{ createdAt: "", userId: "user01" }, { createdAt: "", userId: "user02" }] : [{ createdAt: "", userId: "user01" }]
    // }))

    // const word: Omit<SerializedWord & { votes: Vote[] }, "comments"> = {
    //   id: "YfNLvwpzMHArzXa7l3t7",
    //   content: "へい！むな！",
    //   members: [members[21 - 1], members[33 - 1], members[0]],
    //   videos: [],
    //   createdAt: DateTime.local().toISO(),
    //   nominateNo: 170,
    //   votes: [{ createdAt: "", userId: "user01" }]
    // }

    // return {
    //   props: { words: [word, ...words], nominateNum: words.length },
    //   revalidate: 6 * 60 * 60, // 6h
    // }
  } catch {
    return {
      redirect: {
        permanent: false,
        destination: '/404',
      }
    }
  }
}

export default admin
