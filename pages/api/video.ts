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
    const videos: Video[] = data?.videos ?? []

    const apiRes = await youtube.videos.list({
      id: [videoId],
      part: ["snippet"],
    })

    const item = apiRes.data.items?.[0]

    if (item == null){
      res.status(400).end()
      return
    }

    const title = item.snippet?.title
    const thumbnail = item.snippet?.thumbnails?.high?.url

    if (title == null || thumbnail == null) {
      res.status(400).end()
      return
    }

    const newVideos: Video[] = Array.from(new Set([...videos, { videoId, title, thumbnail }]))
    await db().collection("words").doc(wordId).update({
      videos: newVideos,
    })
    res.status(201).end()
  }
}

export default videoIdUpload