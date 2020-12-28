import classNames from 'classnames'
import { GetStaticProps } from 'next'
import React, { useState } from 'react'
import { members } from '../data/members'
import Word, { SerializedWord, unserialize } from '../types/word'
import initAdminFirebase from '../utils/auth/initAdminFirebase'
import initFirebase from '../utils/auth/initFirebase'

type Props = {
  words: Omit<SerializedWord & { kana?: string, redirectId?: string }, "comments">[]
  nominateNum: number
}

const admin = ({ words: _words }) => {
  const [words] = useState<Omit<Word & { kana?: string, redirectId?: string }, "comments">[]>(() => _words.map(unserialize))
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

  console.log(redirects)
  console.log(words.find(word => word.id === redirects["YfNLvwpzMHArzXa7l3t7"]))

  return (
    <div>
      <div className="flex flex-row m-4">
        <button onClick={handleSend} className="px-4 py-1 bg-primary text-white mr-4">ふりがな送信</button>
        <button onClick={handleSendRedirect} className="px-4 py-1 bg-primary text-white">リダイレクト送信</button>
      </div>
      <table className="table-auto">
        <tbody>
        {
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
        }
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
    const words: Props["words"] = wordData.map<Omit<SerializedWord, "comments">>((data) => ({
      id: data.id,
      content: data.content,
      members: data.memberIds.map(id => members[id - 1]),
      videos: data.videos,
      createdAt: (data.createdAt.toDate() as Date).toISOString(),
      kana: data.kana ?? null,
      redirectId: data.redirectId ?? null,
    }))

    return {
      props: { words, nominateNum: wordData.length },
      revalidate: 60 * 60, // 1h
    }
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
