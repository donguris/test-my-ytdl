import ytdl from '@distube/ytdl-core'
import ffmpeg from 'ffmpeg-static'
import { spawn } from 'child_process'

const BASE_PATH = 'http://www.youtube.com/watch?v='
const youtubeID = 'youtubeID'
const url = BASE_PATH + youtubeID

const video = ytdl(url, { filter: format => format.container === 'mp4', quality: 'highestvideo' })
const audio = ytdl(url, { quality: 'highestaudio' })

const ffmpegProcess = spawn(
  ffmpeg,
  [
    '-y',
    '-loglevel',
    '8',
    '-hide_banner',
    '-i',
    'pipe:3',
    '-i',
    'pipe:4',
    '-c:v',
    'copy',
    '-c:a',
    'aac',
    '-map',
    '0:v:0',
    '-map',
    '1:a:0',
    'output.mp4',
  ],
  {
    windowsHide: true,
    stdio: ['inherit', 'inherit', 'inherit', 'pipe', 'pipe'],
  }
)

video.pipe(ffmpegProcess.stdio[3])
audio.pipe(ffmpegProcess.stdio[4])
