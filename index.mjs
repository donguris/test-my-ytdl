import ytdl from '@distube/ytdl-core'
import fs from 'fs'
import ffmpeg from 'fluent-ffmpeg'
import ffmpegPath from 'ffmpeg-static'

ffmpeg.setFfmpegPath(ffmpegPath)

const BASE_PATH = 'http://www.youtube.com/watch?v='
const youtubeID = 'youtubeID'
const url = BASE_PATH + youtubeID

const video = ytdl(url, {
  filter: format => format.container === 'mp4',
  quality: 'highestvideo',
})
const audio = ytdl(url, { quality: 'highestaudio' })

audio.pipe(fs.createWriteStream('audio.wav')).on('finish', () => {
  video.pipe(fs.createWriteStream('video.mp4')).on('finish', () => {
    ffmpeg()
      .input('video.mp4')
      .input('audio.wav')
      .videoCodec('copy')
      .audioCodec('aac')
      .output('output.mp4')
      .on('end', () => {
        console.log('Video and audio have been merged into output.mp4.')
      })
      .on('error', err => {
        console.error('Error:', err)
      })
      .run()
  })
})
