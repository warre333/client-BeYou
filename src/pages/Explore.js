import React, {useEffect, useState} from 'react'
import axios from 'axios'

import Header from '../components/header'
import PostList from '../components/posts/PostList'
import Login from '../components/auth/Login'
import Register from '../components/auth/Register'
import Error from '../components/states/Error'
import Success from '../components/states/Success'
import Loading from '../components/states/Loading'

import { POSTS } from '../config/api.config'
import { getCookie, isAuthenticated } from '../functions/Common'

function Explore() {
  const [posts, setPosts] = useState()
  const [popup, setPopup] = useState()
  
  const [error, setError] = useState()
  const [success, setSuccess] = useState()
  const [loading, setLoading] = useState()

  useEffect(() => {    
    const isAuthenticatedResult = isAuthenticated()
    const cookies = getCookie()

    if (isAuthenticatedResult.success) {
      axios.get(POSTS + "trending", {
        headers: {
          "x-access-token": cookies
        },
      })
        .then((response) => {
          if(response.data.success){
            setPosts(response.data.data)
          } else {
            setError("An unkown error has occurred.")
          }
      })    
    } else {
      setPopup("login");
    }
  }, [])
  

  return (
    <div>
        <Header />

        {/* States */}
        { error && ( <Error changeMessage={setError} message={error} /> )}
        { success && ( <Success changeMessage={setSuccess} message={success} /> )}
        { loading && ( <Loading changeMessage={setLoading} /> )}

        <PostList posts={posts} />


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

export default Explore