import React, {useEffect, useState} from 'react'
import axios from 'axios'
import Cookies from "universal-cookie"

import Header from '../components/header'

import Error from '../components/states/Error'
import Success from '../components/states/Success'
import Loading from '../components/states/Loading'
import Login from '../components/auth/Login'
import Register from '../components/auth/Register'

import { IMAGES, AUTH, POSTS } from '../config/api.config'
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
        )
      } else { 
        setUser("none")
      }
    }

    isAuthenticated()
  }, [])

  useEffect(() => {
    axios.get(POSTS + "post?post_id=" + params.post).then((response) => {
      setPost(response.data.data)
      const media_link = IMAGES + "posts/" + response.data.data.media_link
      setPostMedia(media_link)
    })
  }, [])
  

  return (
    <div>
        <Header />

        {/* States */}
        { error && ( <Error changeMessage={setError} /> )}
        { success && ( <Success changeMessage={setSuccess} /> )}
        { loading && ( <Loading changeMessage={setLoading} /> )}


        {/* 
        
            Page content

        */}

        {post && (postMedia && (<img src={postMedia} alt="user post" />))}
        
        

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