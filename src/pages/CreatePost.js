import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";

import Header from '../components/header'
import Error from '../components/states/Error'
import Success from '../components/states/Success'
import Loading from '../components/states/Loading'
import Login from '../components/auth/Login'
import Register from '../components/auth/Register'

import { POSTS } from '../config/api.config'
import { getCookie, isAuthenticated } from '../functions/Common';

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

function CreatePost() {
  const navigate = useNavigate()

  const [popup, setPopup] = useState()  
  const [error, setError] = useState()
  const [success, setSuccess] = useState()
  const [loading, setLoading] = useState()

  const [previewPost, setPreviewPost] = useState()
  const [postMedia, setPostMedia] = useState()
  const [caption, setCaption] = useState("")

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
        setError(response.data.message)
      }
    })
  }

  useEffect(() => {
    async function auth(){
      await isAuthenticated()
        .then((response) => {
          if(!response.success){
            setPopup("login");
          }        
        })       
    }

    auth()
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
        <div className="text-center h-3/4 mx-auto" >
          {/* Upload image, show image */}
          <div className="text-center w-1/2 mx-auto">
            {/* show image */}
            { previewPost && (
              <div className="bg-image-post max-image-size text-center w-1/4 mx-auto my-3" >                     
                {/* {props.image && ( <img src={POST_IMAGE + props.image} alt="post" className='ms-auto me-auto' style={styles.image} /> )} */}
                <img src={previewPost} alt="preview of uploaded file" className='mx-auto' style={styles.image} />
              </div>
            )}

            {/* upload image */}
            <div className="w-full mx-auto mt-3"> 
              <label htmlFor="" className="w-full text-center">Upload media to post:</label>
              <div className="md:flex md:flex-row">
                <div className="w-full md:w-1/2 mb-2 md:mb-0">
                    <label htmlFor="file-upload" className="border border-blue-400 bg-blue-200 rounded-xl inline-block py-1 px-10">
                        Open files
                    </label>
                    <input id="file-upload" className='hidden' type="file" onChange={(e) => { loadPreview(e) }} />
                </div>
                <div className="w-full md:w-1/2">
                    <label htmlFor="file-upload" className="border border-blue-400 bg-blue-200 rounded-xl inline-block py-1 px-10">
                        Open camera
                    </label>
                    <input id="file-upload" className='hidden' type="file" onChange={(e) => { loadPreview(e) }} accept="image/*" capture="camera" />
                </div>
              </div>
            </div>
          </div>

          {/* Choose caption */}
          <div className="w-1/2 mx-auto mt-3 text-left"> 
            <label htmlFor="bio" className="w-full mt-3">
              Enter caption:
            </label>
            <input 
              type="text" 
              name='caption' 
              className="w-full py-1 px-4 border rounded-xl" 
              defaultValue={caption}
              onChange={(e) => {
                setCaption(e.target.value)
              }}
            />
          </div>   

          {/* Post */}
          <div className="">
            <button className="py-2 w-1/2 text-white rounded-xl bg-blue-500 mt-4" onClick={post} name="post">POST</button>
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

export default CreatePost