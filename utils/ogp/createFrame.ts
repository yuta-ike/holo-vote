import type { CanvasRenderingContext2D } from 'canvas'

const WIDTH = 1200
const HEIGHT = 630
const PADDING_ROUND_RADIUS = 10
const PADDING_WIDTH_X = 30
const PADDING_WIDTH_Y = 30
const INNER_WIDTH = WIDTH - PADDING_WIDTH_X * 2
const INNER_HEIGHT = HEIGHT - PADDING_WIDTH_Y * 2
const PRIMARY_COLOR = "rgb(41, 197, 252)"

const createFrame = (ctx: CanvasRenderingContext2D, { title = true } = {}) => {
  ctx.fillStyle = "#1e90ff"
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  ctx.fillStyle = "#ffffff"
  ctx.fillRect(PADDING_WIDTH_X + PADDING_ROUND_RADIUS, PADDING_WIDTH_Y, WIDTH - PADDING_WIDTH_X * 2 - PADDING_ROUND_RADIUS * 2, HEIGHT - PADDING_WIDTH_Y * 2)
  ctx.fillRect(PADDING_WIDTH_X, PADDING_WIDTH_Y + PADDING_ROUND_RADIUS, WIDTH - PADDING_WIDTH_X * 2, HEIGHT - PADDING_WIDTH_Y * 2 - PADDING_ROUND_RADIUS * 2)
  ctx.beginPath();
  ctx.arc(PADDING_WIDTH_X + PADDING_ROUND_RADIUS, PADDING_WIDTH_Y + PADDING_ROUND_RADIUS, PADDING_ROUND_RADIUS, 0, 2 * Math.PI)
  ctx.fill();
  ctx.beginPath();
  ctx.arc(PADDING_WIDTH_X + PADDING_ROUND_RADIUS, PADDING_WIDTH_Y + INNER_HEIGHT - PADDING_ROUND_RADIUS, PADDING_ROUND_RADIUS, 0, 2 * Math.PI)
  ctx.fill();
  ctx.beginPath();
  ctx.arc(PADDING_WIDTH_X + INNER_WIDTH - PADDING_ROUND_RADIUS, PADDING_WIDTH_Y + PADDING_ROUND_RADIUS, PADDING_ROUND_RADIUS, 0, 2 * Math.PI)
  ctx.fill();
  ctx.beginPath();
  ctx.arc(PADDING_WIDTH_X + INNER_WIDTH - PADDING_ROUND_RADIUS, PADDING_WIDTH_Y + INNER_HEIGHT - PADDING_ROUND_RADIUS, PADDING_ROUND_RADIUS, 0, 2 * Math.PI)
  ctx.fill();

  if (title) {
    const text = "【非公式】 ホロライブ流行語大賞2020!! 【非公式】"
    const fontSize = 60
    ctx.font = `${fontSize}px "puikko"`
    ctx.fillStyle = PRIMARY_COLOR
    ctx.textAlign = "center"
    const lineHeight = fontSize * 1.2
    const textWidth = ctx.measureText(text).width
    // ctx.fillRect(WIDTH / 2 - textWidth / 2 - 50, PADDING_WIDTH_Y + 10, textWidth + 50, lineHeight + 20)
    ctx.fillStyle = PRIMARY_COLOR
    ctx.fillText(text, WIDTH / 2, PADDING_WIDTH_Y + lineHeight / 2 + 50, WIDTH * 0.9)
  }

  {
    const text = "#ホロ流行語大賞_非公式"
    ctx.font = `48px "puikko"`
    ctx.fillStyle = PRIMARY_COLOR
    ctx.textAlign = "center"
    const lineHeight = 32 * 1.2
    const textWidth = ctx.measureText(text).width
    ctx.fillRect(WIDTH / 2 - textWidth / 2 - 50, HEIGHT - lineHeight - 22, textWidth + 100, lineHeight + 20)
    ctx.fillStyle = "white"
    ctx.fillText(text, WIDTH / 2, HEIGHT - 12, WIDTH * 0.9)
  }
}

export default createFrame