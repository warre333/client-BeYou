import React, {useEffect, useState} from 'react'
import axios from 'axios'
import Cookies from "universal-cookie"

import Header from '../components/header'

import Error from '../components/states/Error'
import Success from '../components/states/Success'
import Loading from '../components/states/Loading'
import Login from '../components/auth/Login'
import Register from '../components/auth/Register'
import NormalPost from '../components/posts/NormalPost'

import { IMAGES, AUTH, POSTS, WEBSITE_URL } from '../config/api.config'
import { useParams } from 'react-router-dom'

const cookies = new Cookies();

function Page() {
  const params = useParams()
  const [user, setUser] = useState()
  const [post, setPost] = useState()
  const [postMedia, setPostMedia] = useState()
  const [popup, setPopup] = useState()
  
  const [error, setError] = useState()
  const [success, setSuccess] = useState()
  const [loading, setLoading] = useState()

  function getCookie(){
    if(cookies.get('user')){
      return cookies.get('user')
    }
  }  

  useEffect(() => {
    function isAuthenticated(){
      const cookies = getCookie()
  
      if(cookies){
        axios.get(AUTH,
          {
            headers: {
              "x-access-token": cookies
            },
          },
        ).then((response) => {
          if(response.data.success){
            setUser(response.data.user_id)
          }  else {
            setUser("none")
            setPopup("login")
            cookies.remove('user', { path: '/' });
          }
        })
      } else { 
        setUser("none")
      }
    }

    isAuthenticated()
  }, [])

  useEffect(() => {
    axios.get(POSTS + "?post_id=" + params.post)
      .then((response) => {
        if(response.data.success){
          setPost(response.data.data)
          const media_link = IMAGES + "posts/" + response.data.data.media_link
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

        {post && (<div className="posts__container"><NormalPost image={post.media_link} user_id={post.user_id} caption={post.caption} share_link={WEBSITE_URL + "post/" + post.post_id} post_id={post.post_id} time_placed={post.time_placed} setError={setError} /></div>)}
        
        

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

export default Page