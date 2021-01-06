import axios from "axios";

const BITLY_ACCESS_TOKEN = process.env.BITLY_ACCESS_TOKEN || "";

const getShortenUrl = async (targetURL: string) => {
  try {
    const endpoint = "https://api-ssl.bitly.com/v4"
    const url = `${endpoint}/shorten`
    const options = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BITLY_ACCESS_TOKEN}`
      }
    }
    const params = {
      long_url: targetURL
    }
    const res: any = await axios.post(url, params, options)
    return res.data.link as string
  } catch (error) {
    return targetURL
  }
}

export default getShortenUrl