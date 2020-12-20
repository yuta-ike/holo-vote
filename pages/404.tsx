import React from 'react'
import { useState } from 'react'
import Word from '../types/word'
import ReportDialog from '../view/dialog/ReportDialog'

const word: Omit<Omit<Word, "createdAt">, "comments"> = {
  id: '999',
  videos: [],
  content: "テストワード",
  members: [{
    id: 999,
    name: 'name',
    chineseName: '',
    englishName: 'englishName',
    gen: ['0th'],
    catchphrase: 'catcphrase',
    description: 'description',
    youtubeId: 'youtubeId',
    bilibiliId: '',
    twitterId: 'twitterId',
    twitterHasTags: [''],
    imageAPath: 'imageAPath',
    imageBPath: 'imageBPath',
  }]
}


const Page404 = () => {
  return (
    <div className="w-full h-screen pb-10 flex flex-col items-center justify-center">
      <div className="text-center flex flex-col items-center p-4 box-border">
        <p className="text-lg">申し訳ありません。現在アクセスに制限がかかっております。</p>
        <p className="my-4 text-sm">「そんなのってないぺこじゃん！！！！」</p>
        <div className="w-full border border-solid my-4"/>
        <div className="w-72 sm:w-96">
          <h1>おすすめ動画</h1>
          <iframe
            className="w-72 h-48 sm:w-96 sm:h-56"
            src={`https://www.youtube.com/embed/vMU2sn8OaFs`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <p className="text-left">
            みこちと35Pが選ぶホロライブ流行語大賞2020 【ホロライブ切り抜き/さくらみこ】
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page404
