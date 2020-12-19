import type { NextApiRequest, NextApiResponse } from "next"
import Video from "../../types/video"
import initAdminFirebase from "../../utils/auth/initAdminFirebase"
import { google } from 'googleapis'

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
})

const videoIdUpload = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  if (req.method === 'POST') {
    const wordId = req.body.wordId.toString()
    const videoId = req.body.videoId.toString()
    const { db } = initAdminFirebase()
    const snapshot = await db().collection("words").doc(wordId).get()
    const data = snapshot.data()
    const videos: Video[] = data.videos

    const apiRes = await youtube.videos.list({
      id: [videoId],
      part: ["snippet"],
    })

    if (apiRes.data.items.length === 0){
      res.status(400).end()
      return
    }

    const title = apiRes.data.items[0].snippet.title
    const thumbnail = apiRes.data.items[0].snippet.thumbnails.high.url

    const newVideos: Video[] = Array.from(new Set([...videos, { videoId, title, thumbnail }]))
    await db().collection("words").doc(wordId).update({
      videos: newVideos,
    })
    res.status(201).end()
  }
}

export default videoIdUpload