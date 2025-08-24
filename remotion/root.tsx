
import React from 'react'
import { Composition } from 'remotion'
import remotionVideo from './remotionVideo'

const Root = () => {
  return (
    <>
      <Composition 
       id='video'
       component={remotionVideo}
       durationInFrames={60}
       fps={30}
       width={1200}
       height={720}
      />
    </>
  )
}

export default Root
