import React from 'react'
import { useGlobalStates } from '../utils/context/GlobalStatesProvider'

const Page404 = () => {
  const { globalStates: { errorMessage } } = useGlobalStates()
  return (
    <div className="w-full h-screen pb-10 flex flex-col items-center justify-center">
      <div className="text-center flex flex-col items-center p-4 box-border">
        <p className="text-lg">申し訳ありません。エラーが発生しました。</p>
        <p className="my-4 text-sm">「そんなのってないぺこじゃん！！！！」</p>
        <a href="https://twitter.com/holovote" className="text-sm text-blue-500 underline">運営ツイッター</a>
        <p className="text-sm my-4">{errorMessage}</p>
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
