import React from 'react'
import NormalPost from './NormalPost'
import AdPost from './AdPost'

import { WEBSITE_URL } from '../../config/api.config'

function PostList(props) {
  const posts = props.posts

  return (
    <div>
        <div className="posts__container">
          { posts && (
            posts.map((post, index) => {
              console.log(post)
              if(post.ad_id){
                return <AdPost key={index} ad_id={post.ad_id} image={post.media_link} user_id={post.user_id} caption={post.caption} share_link={WEBSITE_URL + "post/" + post.post_id} post_id={post.post_id} time_placed={post.time_placed} setError={props.setError} />
              } else {
                return <NormalPost key={index} views={post.views} likes={post.likes} image={post.media_link} user_id={post.user_id} caption={post.caption} share_link={WEBSITE_URL + "post/" + post.post_id} post_id={post.post_id} time_placed={post.time_placed} setError={props.setError} />
              }
            })
          )}

          <p className="text-center mt-10">You've seen all your posts from your feed.</p>
        </div>
    </div>
  )
}

export default PostList