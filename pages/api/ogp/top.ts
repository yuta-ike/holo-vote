import type { NextApiRequest, NextApiResponse } from "next";
import * as path from 'path'
import { createCanvas, registerFont } from "canvas";
import createFrame from "../../../utils/ogp/createFrame";

const WIDTH = 1200
const HEIGHT = 630
const PADDING_ROUND_RADIUS = 10
const PADDING_WIDTH_X = 30
const PADDING_WIDTH_Y = 30
const INNER_WIDTH = WIDTH - PADDING_WIDTH_X * 2
const INNER_HEIGHT = HEIGHT - PADDING_WIDTH_Y * 2
const PRIMARY_COLOR = "rgb(41, 197, 252)"

const createOgp = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const canvas = createCanvas(WIDTH, HEIGHT)
  const ctx = canvas.getContext("2d")
  registerFont(path.resolve("./assets/fonts/puikko_20201114/puikko-Regular.otf"), { family: "puikko" })
  registerFont(path.resolve("./assets/fonts/M_PLUS_Rounded_1c/MPLUSRounded1c-Medium.ttf"), { family: "MPLUS" })

  createFrame(ctx, { title: false })
  {
    const text = "【非公式】"
    const fontSize = 50
    ctx.font = `${fontSize}px "puikko"`
    ctx.textAlign = "center"
    ctx.fillStyle = PRIMARY_COLOR
    ctx.fillText(text, WIDTH / 2, HEIGHT / 2 - 120, WIDTH * 0.9)
  }

  {
    const text = "ホロライブ流行語大賞2020!!"
    const fontSize = 80
    ctx.font = `${fontSize}px "puikko"`
    ctx.textAlign = "center"
    ctx.fillStyle = PRIMARY_COLOR
    ctx.fillText(text, WIDTH / 2, HEIGHT / 2 - 20, WIDTH * 0.9)
  }

  {
    const text = "〜 ホロライブファンで流行語大賞を決めよう!! 〜"
    const fontSize = 40
    ctx.font = `${fontSize}px "puikko"`
    ctx.fillStyle = "black"
    ctx.textAlign = "center"
    ctx.fillText(text, WIDTH / 2, HEIGHT / 2 + 80, WIDTH * 0.9)
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