import React, {useEffect, useState} from 'react'
import axios from 'axios'
import Cookies from "universal-cookie"
import { useNavigate } from "react-router-dom";

import Header from '../components/header'

import Error from '../components/states/Error'
import Success from '../components/states/Success'
import Loading from '../components/states/Loading'
import Login from '../components/auth/Login'
import Register from '../components/auth/Register'

import { AUTH, POSTS } from '../config/api.config'

const newCookies = new Cookies();
const styles = {
  image: {
    maxHeight: "80vh",
    maxWidth: "100%",
    objectFit: "cover",
  },

  bg:  {
      position: "fixed",
      height: "100vh",
      width: "100vw",
      top: 0,
      left: 0,
      backgroundColor: "rgba(33, 37, 41, .9)"
  },

  button: {    
    background: "none",
    color: "inherit",
    border: "none",
    padding: 0,
    font: "inherit",
    cursor: "pointer",
    outline: "inherit",
  },

  centerWhiteCard: {
      top: "12.5%",
      left: "12.5%",        
  },

  centerWhiteCardMobile: {   
  },

  centerInputs: {
      marginLeft: "25%"
  },

  profileImage: {
      height: "50px",
      width: "50px",
  },
}

function Page() {
  const [user, setUser] = useState()
  const [popup, setPopup] = useState()
  
  const [error, setError] = useState()
  const [success, setSuccess] = useState()
  const [loading, setLoading] = useState()

  const [previewPost, setPreviewPost] = useState()
  const [postMedia, setPostMedia] = useState()
  const [caption, setCaption] = useState("")

  const navigate = useNavigate()

  function getCookie(){
    if(newCookies.get('user')){
      return newCookies.get('user')
    }
  }  

  function loadPreview(e){
    setPreviewPost(URL.createObjectURL(e.target.files[0]))
    setPostMedia(e.target.files[0])
  }

  function post(){
    const cookies = getCookie()
    const formData = new FormData()
    formData.append('postImage', postMedia)
    formData.append('caption', caption)

    axios.post(POSTS + "post", formData, {
      headers: {
        "x-access-token": cookies,
        'Content-Type': 'multipart/form-data'
      }
    }).then((response) => {
      if(response.data.success){
        navigate("/post/" + response.data.data.post_id)
      } else {
        console.log("error:", response.data)
      }
    })
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
        setPopup("login")
      }
    }

    isAuthenticated()
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
        {/* Create Post */}
        <div className="text-center h-3/4" >
          {/* Upload image, show image */}
          <div className="text-center">
            {/* show image */}
            { previewPost && (
              <div className="bg-image-post max-image-size text-center w-1/4 mx-auto my-3" >                     
                  {/* {props.image && ( <img src={POST_IMAGE + props.image} alt="post" className='ms-auto me-auto' style={styles.image} /> )} */}
                <img src={previewPost} alt="preview of uploaded file" className='mx-auto' style={styles.image} />
              </div>
            )}

            {/* upload image */}
            <div className="w-1/2 mx-auto mt-3"> 
              <label htmlFor="" className="w-full text-center">Upload media to post:</label>
              <div className="flex flex-row">
                <div className="w-full md:w-1/2">
                  <label htmlFor="" className="w-full text-center">Open files</label>
                  <input type="file" onChange={(e) => { loadPreview(e) }} className="w-full" />
                </div>
                <div className="w-full md:w-1/">
                  <label htmlFor="" className="w-full text-center">Open camera</label>
                  <input type="file" onChange={(e) => { loadPreview(e) }} accept="image/*" capture="camera" className="form-control" data-classButton="py-1 px-4 bg-blue-500" data-input="false" data-classIcon="icon-plus" data-buttonText="Your label here." />
                </div>
              </div>
            </div>
          </div>

          {/* Choose caption */}
          <div className="w-1/2 mx-auto mt-3"> 
            <label htmlFor="bio" className="w-full text-start mt-3">
              Enter caption:
            </label>
            <input 
              type="text" 
              name='caption' 
              className="w-full form-control" 
              defaultValue={caption}
              onChange={(e) => {
                setCaption(e.target.value)
              }}
            />
          </div>   

          {/* Post */}
          <div className="">
            <button className="btn btn-primary btn-lg w-50 mt-4" onClick={post} name="post">POST</button>
            </div>
        </div>

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