import type { NextApiRequest, NextApiResponse } from "next";
import { createCanvas, registerFont } from "canvas";
import initAdminFirebase from "../../../../utils/auth/initAdminFirebase";
import Word from "../../../../types/word";
import { members } from "../../../../data/members";
import createFrame from "../../../../utils/ogp/createFrame";

const WIDTH = 1200
const HEIGHT = 630
const PADDING_ROUND_RADIUS = 10
const PADDING_WIDTH_X = 30
const PADDING_WIDTH_Y = 30
const INNER_WIDTH = WIDTH - PADDING_WIDTH_X * 2
const INNER_HEIGHT = HEIGHT - PADDING_WIDTH_Y * 2
const PRIMARY_COLOR = "rgb(41, 197, 252)"

const createOgp = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const { db } = initAdminFirebase()
  const snapshot = await db().collection("words").doc(req.query.wordId.toString()).get()
  const data = snapshot.data()
  const word: Omit<Word, "comments" | "videos" | "createdAt"> = {
    id: snapshot.id,
    content: data.content,
    members: data.memberIds.map((id: number) => members[id - 1]),
  }

  const canvas = createCanvas(WIDTH, HEIGHT)
  const ctx = canvas.getContext("2d")
  registerFont("./assets/fonts/puikko_20201114/puikko-Regular.otf", { family: "puikko" });
  registerFont("./assets/fonts/M_PLUS_Rounded_1c/MPLUSRounded1c-Medium.ttf", { family: "MPLUS" });

  createFrame(ctx)

  {
    const text = word.content
    const fontSize = text.length <= 4 ? 100 : text.length <= 6 ? 80 : text.length <= 8 ? 70 : 60
    ctx.font = `${fontSize}px "MPLUS"`
    ctx.fillStyle = "black"
    ctx.textAlign = "center"
    const lineHeight = fontSize * 1.2
    if(ctx.measureText(text).width > WIDTH * 0.85){
      const formar = text.slice(0, text.length / 2)
      const latter = text.slice(text.length / 2)
      ctx.fillText(formar, WIDTH / 2, HEIGHT / 2 - lineHeight / 2 + 40, WIDTH * 0.9)
      ctx.fillText(latter, WIDTH / 2, HEIGHT / 2 + lineHeight / 2 + 40, WIDTH * 0.9)
    }else{
      ctx.fillText(text, WIDTH / 2, HEIGHT / 2 + 40 + (fontSize - 60) / 2, WIDTH * 0.9)
    }
  }

  {
    const text = word.members.map(member => member.name).join(" ")
    const fontSize = 42
    ctx.font = `${fontSize}px "MPLUS"`
    ctx.fillStyle = PRIMARY_COLOR
    ctx.textAlign = "center"
    ctx.fillStyle = "black"
    ctx.fillText(text, WIDTH / 2, HEIGHT - 92, WIDTH * 0.9)
  }

  {
    const text = "ノミネート"
    const fontSize = 32
    ctx.font = `${fontSize}px "puikko"`
    ctx.fillStyle = PRIMARY_COLOR
    ctx.textAlign = "center"
    const lineHeight = fontSize * 1.2
    const textWidth = ctx.measureText(text).width
    ctx.fillRect(WIDTH / 2 - textWidth / 2 - 50, PADDING_WIDTH_Y + 132, textWidth + 100, lineHeight + 10)
    ctx.fillStyle = "white"
    ctx.fillText(text, WIDTH / 2, PADDING_WIDTH_Y + 170, WIDTH * 0.9)
  }

  const buffer = canvas.toBuffer();

  res.writeHead(200, {
    'Cache-Control': 'public, max-age=315360000, s_maxage=315360000',
    Expires: new Date(Date.now() + 315360000000).toUTCString(),
    'Content-Type': 'image/png',
    'Content-Length': buffer.length,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
  })
  res.end(buffer, 'binary')
}

export default createOgp;