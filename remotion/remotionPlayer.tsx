import {Player} from '@remotion/player'
import remotionVideo from './remotionVideo'
import { useContext } from 'react'
import { VideoContext } from '@/context/VideoProvider'

const RemotionPlayer = () => {
    const ctx = useContext(VideoContext)

    const {audio, images, captions} = ctx!
    const totalDuration = captions.length > 1
    ? Math.ceil((captions[captions.length-1]as any).end / (1000 / 30)+30)
    : 1
  return (
    <Player 
     component={remotionVideo}
     durationInFrames={totalDuration}
     compositionWidth={300}
     compositionHeight={450}
     controls={true}
     inputProps={{audio, images, captions}}
     fps={30}
    />
  )
}

export default RemotionPlayer
