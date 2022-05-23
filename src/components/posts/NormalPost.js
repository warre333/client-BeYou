import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Cookies from "universal-cookie"

import { POSTS, USERS } from '../../config/api.config';

import NOT_FOUND from "../../images/NOT_FOUND.jpg"

import "../../styles/like_animation.css"

const styles = {
  image: {
    maxHeight: "80vh",
    maxWidth: "100%",
    objectFit: "cover",
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

  postComment: {
    height: "4vh",
  },
}

function Normal(props) {
  const cookies = new Cookies()

  // Functions
  const [liked, setLiked] = useState(false);
  const [likeAnimation, setLikeAnimation] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [share, setShare] = useState(false)
  const [poster, setPoster] = useState(false)

  
  function getCookie(){
    if(cookies.get('user')){
      return cookies.get('user')
    }
  } 

  function likePost(){
    setLikeAnimation(true)


    if(liked){
      setLiked(false)

      const cookie = getCookie()

      // Remove like from database
      axios.delete(POSTS + "like?post_id=" + props.post_id, 
        // headers
        {
          headers: {
            "x-access-token": cookie
          },
        },
      )
        .then((response) => {
          if(!response.data.success){
            props.setError("There has an error occurred.")
          }
        })
    } else {
      setLiked(true)

      const cookie = getCookie()

      // Add like to database
      axios.post(POSTS + "like", 
        // body
        {
          "post_id": props.post_id,
        },
        // headers
        {
          headers: {
            "x-access-token": cookie
          },
        },
      )
        .then((response) => {
          if(!response.data.success){
            props.setError("There has an error occurred.")
          }
        })
    }
  }

  function copyLink(){
    navigator.clipboard.writeText(props.share_link)
    setShare(true)
    
  }

  async function placeComment(){
    // Post to DB
    // Add new post to the list
    axios.post(POSTS + "comment")
  }

  function getPosterInfo(){
    axios.get(USERS + "user?user_id=" + props.user_id).then((response) => {
      if(response.data.success){
        setPoster(response.data.data)
      }
    })
  }

  useEffect(() => {
    getPosterInfo()
  }, [])
  
  return (
    <div className='mt-5'>
      <div className="bg-light border rounded-3">
        {/* User image + username */}
        <div className="border-bottom">
          <table>
            <tbody>
              <tr>
                <td>
                  <svg width="50" height="50" className='rounded-circle m-2'>
                    {poster.profile_image && ( poster.profile_image == "http://localhost:3000/images/NOT_FOUNG.jpg" && ( 
                      <image href={NOT_FOUND} height="50" width="50"/>
                    ))}

                    {poster.profile_image && ( poster.profile_image != "http://localhost:3000/images/NOT_FOUNG.jpg" && ( 
                      <image href={poster.profile_image} height="50" width="50"/>
                    ))}
                    
                  </svg>
                </td>
                <td>
                  <h4 className="font-weight-normal small align-middle">{poster.username}</h4>
                </td>
              </tr>
            </tbody>
          </table> 
        </div>

        {/* Image div (image/video + caption, name, ..) */}
        <div className="border-top">
          {/* Image div (black background, image/video is scaling within it) */}
          <div className="bg-image-post max-image-size text-center" >
              {/* Scaled image within the parent with object-fit: contain */}
              {props.image && ( props.image != "http://localhost:3000/images/NOT_FOUNG.png" && ( 
                <img 
                  // Change src to image from db
                  src={props.image} 
                  alt="post" 
                  className=''
                  style={styles.image}
                />
              ))}

              {props.image && ( props.image == "http://localhost:3000/images/NOT_FOUNG.png" && ( 
                <img src={NOT_FOUND} alt="profile_image" width="32" height="32" className="rounded-circle" /> 
              ))}
          </div>

          {/* Lower div with caption etc */}
          <div className="">
              {/* Like / Comment / ... */}
              <div className="row text-center py-2 border-bottom">
                <div className="col">
                  <button style={styles.button} onClick={likePost} onAnimationEnd={() => setLikeAnimation(false)} >
                    <svg width="24" height="24" fill={liked ? "red " : "currentColor"} className={likeAnimation ? "bi bi-heart-fill zoom-in-out-box" : "bi bi-heart-fill"} viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                    </svg>
                  </button>                  
                </div>

                <div className="col">
                  <button style={styles.button} onClick={() => { setCommentsOpen(true) }}>
                    <svg width="24" height="24" fill="currentColor" className="bi bi-chat-fill" viewBox="0 0 16 16">
                      <path d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6-.097 1.016-.417 2.13-.771 2.966-.079.186.074.394.273.362 2.256-.37 3.597-.938 4.18-1.234A9.06 9.06 0 0 0 8 15z"/>
                    </svg>
                  </button>
                </div>

                <div className="col">
                  <button style={styles.button} onClick={copyLink}>
                    <svg width="24" height="24" fill="currentColor" className="bi bi-send-fill" viewBox="0 0 16 16">
                      <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"/>
                    </svg>
                  </button>
                </div>
              </div>

              {share &&
                <div>
                  <div className="alert alert-secondary" role="alert">
                    <div className="row">
                      <div className="col-11">The link has been copied to share.</div>
                      <div className="col"><button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => { setShare(false) }}></button></div>
                    </div>
                    
                    
                  </div>
                </div>
              } 

              {/* @username: caption */}
              <table className='ms-2 mt-2'>
                <tbody>
                  <tr>
                    <td className='pe-1'>{poster.username}: </td>
                    <td>{props.caption}</td>
                  </tr>
                </tbody>
              </table>

              {/* Comments */}
              {!commentsOpen && (
                <button onClick={() => { setCommentsOpen(true) }} style={styles.button} className="ms-2">
                  <h5 className="font-weight-normal small text-muted">View all comments</h5>
                </button>
              )}

              {commentsOpen && (
                <div className="">
                  <button onClick={() => { setCommentsOpen(false) }} style={styles.button} className="ms-2">
                    <h5 className="font-weight-normal small text-muted">Close all comments</h5>
                  </button>

                  <div className="container" id="comments">
                    <div className="row" style={styles.postComment}>
                      <div className="col h-100">
                        <textarea className="form-control h-100" aria-label="With textarea"></textarea>
                      </div>

                      <div className="col h-100">
                        <button type="submit" className="btn btn-primary h-100" onClick={comment}>post</button>
                      </div>
                    </div>
                    

                    <div id="comment">                  
                      <table className='ms-2 mt-2'>
                        <tbody>
                          <tr>
                            <td className='pe-1'>@{props.username}: </td>
                            <td>{props.caption}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div id="comment">                  
                      <table className='ms-2 mt-2'>
                        <tbody>
                          <tr>
                            <td className='pe-1'>@{props.username}: </td>
                            <td>{props.caption}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

      
          </div>
        </div>        
      </div>  
    </div>
  )
}

export default Normal