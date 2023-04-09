import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

import Header from '../components/header'
import Error from '../components/states/Error'
import Success from '../components/states/Success'
import Loading from '../components/states/Loading'
import Login from '../components/auth/Login'
import Register from '../components/auth/Register'
import NormalPost from '../components/posts/NormalPost'

import { IMAGES, AUTH, POSTS, WEBSITE_URL } from '../config/api.config'

function Post() {
  const params = useParams()
  const [post, setPost] = useState()
  const [postMedia, setPostMedia] = useState()
  const [popup, setPopup] = useState()
  
  const [error, setError] = useState()
  const [success, setSuccess] = useState()
  const [loading, setLoading] = useState()

  useEffect(() => {
    axios.get(POSTS + "post?post_id=" + params.post)
      .then((response) => {
        if(response.data.success){
          const media_link = IMAGES + "posts/" + response.data.data.media_link

          setPost(response.data.data)
          setPostMedia(media_link)
        } else {          
          setPost({post_id: 0, user_id: 0, media_link: "NOT_FOUND.PNG", caption: "", time_placed: "0"})
          setPostMedia("NOT_FOUND.PNG")
        }
      })
  }, [])
  
  return (
    <div>
        <Header />

        {/* States */}
        { error && ( <Error message={error} changeMessage={setError} /> )}
        { success && ( <Success message={success} changeMessage={setSuccess} /> )}
        { loading && ( <Loading changeMessage={setLoading} /> )}


        {/* 
        
            Page content

        */}

        {post && (<div className="posts__container"><NormalPost image={post.media_link} user_id={post.user_id} caption={post.caption} share_link={WEBSITE_URL + "post/" + post.post_id} views={post.views} post_id={post.post_id} time_placed={post.time_placed} setError={setError} /></div>)}
        
        

        {/* Login & register popups */}
        { popup === "login" && (
          <Login setPopup={setPopup} setError={setError} setSuccess={setSuccess} setLoading={setLoading} />
        )}

        { popup === "register" && (
          <Register setPopup={setPopup} setError={setError} setSuccess={setSuccess} setLoading={setLoading}  />
        )}
        
    </div>
  )
}

export default Post