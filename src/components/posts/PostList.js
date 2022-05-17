import React from 'react'
import NormalPost from './NormalPost'

import NotFound from "../../images/NOT_FOUND.png"

function PostList() {
  return (
    <div>
        <div className="posts__container">
          <NormalPost image={"https://www.dmarge.com/wp-content/uploads/2021/01/dwayne-the-rock-.jpg"} username={"username"} user_image={NotFound} caption={"Caption Of this cool post"} share_link={"http://localhost:3000/post/424433"} />
          <NormalPost image={"https://pbs.twimg.com/media/CmUPSBuUMAEvfoh.jpg"} username={"milf"} user_image={NotFound} caption={"Mother I Would Like Film."} share_link={"http://localhost:3000/post/424433"}  />
          <NormalPost image={"https://media.giphy.com/media/5UcptWaEkMwbDo9FnB/giphy.gif"} username={"username"} user_image={NotFound} caption={"Minecraft is cool"} share_link={"http://localhost:3000/post/424433"}  />
        </div>
    </div>
  )
}

export default PostList