const youtubeUrlValidate = (url: string): (string | null) => {
  const res = url.match(/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?/)
  return res?.[5] ?? null
}

export default youtubeUrlValidate