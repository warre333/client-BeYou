import React, {useEffect, useState} from 'react'
import axios from 'axios'

import Header from '../components/header'
import PostList from '../components/posts/PostList'
import Error from '../components/states/Error'
import Success from '../components/states/Success'
import Loading from '../components/states/Loading'
import Login from '../components/auth/Login'
import Register from '../components/auth/Register'
import { getCookie, isAuthenticated } from '../functions/Common'

import { POSTS } from '../config/api.config'

function Homepage() {
  const [posts, setPosts] = useState()
  const [popup, setPopup] = useState("none")
  const [postsSeen, setPostsSeen] = useState(0)
  const [requestingPosts, setRequestingPosts] = useState(false)
  
  const [error, setError] = useState()
  const [success, setSuccess] = useState()
  const [loading, setLoading] = useState()


  useEffect(() => {    
    const user = getCookie()

    async function auth(){
      await isAuthenticated()
        .then((response) => {
          if(response.success) {
            axios.get(POSTS + "feed", {
              headers: {
                "x-access-token": user
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
        })       
    }

    auth()
  }, [])
  
  useEffect(() => {
    if(posts){
      if(postsSeen + 2 >= posts.length && !requestingPosts){
        setRequestingPosts(true)

        const cookies = getCookie()

        axios.get(POSTS + "feed", {
          headers: {
            "x-access-token": cookies
          },
        })
          .then((response) => {
            if(response.data.success){
              for(let i = 0; i < response.data.data.length; i++){
                setPosts(posts => [ ...posts, response.data.data[i] ]);
              }
            } else {
              setError("An unkown error has occurred.")
            }
            setRequestingPosts(false)
        })    
      }
    }
    
  }, [postsSeen])
  
  return (
    <div>
        <Header />

        {/* States */}
        { error && ( <Error message={error} changeMessage={setError} /> )}
        { success && ( <Success message={success} changeMessage={setSuccess} /> )}
        { loading && ( <Loading /> )}
        
        <PostList posts={posts} setError={setError} setPostsSeen={setPostsSeen} postsSeen={postsSeen} />  
        
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

export default Homepage