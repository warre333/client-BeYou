import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Cookies from "universal-cookie"

import { AUTH, IMAGES, POSTS, POST_IMAGE, PROFILE_IMAGE, USERS } from '../../config/api.config';

import "../../styles/like_animation.css"

import Error from "../../components/states/Error"
import isOnScreen from "../../hooks/isOnScreen"

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

  deleteButtonDiv: {
    marginRight: "2vw",
  },

  noDecorationLink: {
    color: "#000000",
    textDecoration: "none",
  },
}

function Normal(props) {
  const newCookies = new Cookies()

  // Functions
  const [error, setError] = useState()
  const [liked, setLiked] = useState(false);
  const [likeAnimation, setLikeAnimation] = useState(false);
  const [viewed, setViewed] = useState(false);
  // const [viewSend, setViewed] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState();
  const [user, setUser] = useState();
  const [userId, setUserId] = useState();
  const [commentsSuccess, setCommentsSuccess] = useState(false);
  const [share, setShare] = useState(false)
  const [poster, setPoster] = useState()

  const ref = useRef()
  const isVisible = isOnScreen(ref)

  useEffect(() => {
    // console.log(isVisible, viewed)
    if(isVisible && !viewed){
      const cookies = getCookie()

      // Send viewed to API
      axios.post(POSTS + "view", {
        post_id: props.post_id
      }, {
        headers: {
          "x-access-token": cookies
        },
      },).then((response) => {
        console.log(response)
        setViewed(true)
      })
    }
  })

  
  function getCookie(){
    if(newCookies.get('user')){
      return newCookies.get('user')
    }
  } 

  function likePost(){
    const cookies = getCookie()

    if(cookies){
      setLikeAnimation(true)

      if(liked){
        setLiked(false)

        // Remove like from database
        axios.delete(POSTS + "like?post_id=" + props.post_id, 
          // headers
          {
            headers: {
              "x-access-token": cookies
            },
          },
        )
          .then((response) => {
            if(!response.data.success){
              setError("There has an error occurred.")
            }
          })
      } else {
        setLiked(true)


        // Add like to database
        axios.post(POSTS + "like", 
          // body
          {
            "post_id": props.post_id,
          },
          // headers
          {
            headers: {
              "x-access-token": cookies
            },
          },
        )
          .then((response) => {
            if(!response.data.success){
              setError("There has an error occurred.")
            }
          })
      }
    } else {
      setError("You need to logged in to like this post")
    }
  }

  function copyLink(){
    // Works only with HTTPS or on localhost
    navigator.clipboard.writeText(props.share_link).then(() => {
      setShare(true)   
    })
  }

  async function placeComment(){
    const cookies = getCookie()
    
    // Post to DB
    // Add new post to the list
    if(cookies){
      if(comment != ""){
        axios.post(POSTS + "comment", {
          post_id: props.post_id,
          comment: comment,
        }, 
        {
          headers: {
            "x-access-token": cookies
          },
        }).then((response) => {
          if(response.data.success){
            const newComment = {comment: comment, comment_id: response.data.comment_id, post_id: props.post_id, profile_image: user.profile_image, username: user.username}
            const newCommentSection = [newComment, ...comments]

            setComments(newCommentSection)
          } else {
            setError("There occurred an error while commenting.")
          }
        })
      } else {
        setError("No message was entered")
      }   
    } else {
      setError("You need to be logged in to comment.")
    } 
  }

  async function deleteComment(e){
    const cookies = getCookie()
    
    axios.delete(POSTS + "comment?comment_id=" + e.target.value, {
      headers: {
        "x-access-token": cookies
      },
    }).then((response) => {
      if(response.data.success){
        comments.splice(e.target.id, 1);
        getComments()
      } else {
        setError(response.data.message)
      }      
    })
  }

  async function getComments(){
    const cookies = getCookie()

    axios.get(POSTS + "comment/all?post_id=" + props.post_id, {
      headers: {
        "x-access-token": cookies
      },
    }).then((response) => {
      if(response.data.success){
        setCommentsSuccess(true)
        setComments(response.data.data)
      } else {
        setCommentsSuccess(false)
      }
    })
  }

  async function isLiked(){
    const cookies = getCookie()
    axios.get(POSTS + "like?post_id=" + props.post_id,
      {
        headers: {
          "x-access-token": cookies
        },
      },
    ).then((response) => {
      // Check if liked
      if(response.data.liked){
        setLiked(true)
      }
    })
  }

  function openComments(){
    if(commentsOpen){
      setCommentsOpen(false)
    } else {
      getComments()
      setCommentsOpen(true)
    }
  }

  function getPosterInfo(){
    axios.get(USERS + "?user_id=" + props.user_id).then((response) => {
      if(response.data.success){
        setPoster(response.data.data)
      }
    })
  }

  async function getUserInfo(){
    
    if(userId){
      axios.get(USERS + "?user_id=" + userId).then((response) => {
        setUser(response.data.data)
      })
    }
  }

  async function isAuthenticated(){
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
          setUserId(response.data.user_id)
        }       
      })
    }
  }

  useEffect(() => {
    getPosterInfo()
    isLiked()
  }, [])

  useEffect(() => {
    isAuthenticated()    
    getUserInfo()
  })
  
  return (
    <div className='mt-5' id={props.post_id} ref={ref}>
      <div className="bg-light border rounded-3">
        {/* User image + username */}
        <div className="border-bottom">
          <table>
            <tbody>
              <tr>
                {poster && (                
                  <a href={"/u/" + poster.username} style={styles.noDecorationLink}>
                    <td>
                      {/* <ProfileImage url={PROFILE_IMAGE + poster.profile_image} /> */}
                      {poster.profile_image && ( <img src={PROFILE_IMAGE + poster.profile_image} alt="post" height="50" width="50" className="rounded-circle" style={styles.image} /> )}
                    </td>
                    <td className=''>
                      <h4 className="font-weight-normal small align-middle h-100">{poster.username}</h4>
                    </td>
                  </a>
                )}
                {!poster && (              
                  <a href={""} style={styles.noDecorationLink}>
                    <td>
                      {/* <ProfileImage url={PROFILE_IMAGE + poster.profile_image} /> */}
                      <img src={PROFILE_IMAGE + "NOT_FOUND.jpg"} alt="post" height="50" width="50" className="rounded-circle" style={styles.image} /> 
                    </td>
                    <td className=''>
                      <h4 className="font-weight-normal small align-middle h-100">USER NOT FOUND</h4>
                    </td>
                  </a>
                )}
              </tr>
            </tbody>
          </table> 
        </div>

        {/* Image div (image/video + caption, name, ..) */}
        <div className="border-top">
          {/* Image div (black background, image/video is scaling within it) */}
          <div className="bg-image-post max-image-size text-center" >
              {/* Scaled image within the parent with object-fit: contain */}  
              {props.image && props.image.slice(-3) != "mp4" && props.image.slice(-3) != "mkv" && ( <img src={POST_IMAGE + props.image} alt="post" className='ms-auto me-auto' style={styles.image} /> )}
              {props.image && props.image.slice(-3) == "mp4" && ( <video style={styles.image} controls ><source src={POST_IMAGE + props.image} type="video/mp4" alt="post" className='ms-auto me-auto' style={styles.image} /></video> )}
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
                  <button style={styles.button} onClick={openComments}>
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

              {error && (
                <Error changeMessage={setError} message={error} />
              )} 

              {/* @username: caption */}
              <table className='ms-2 mt-2'>
                <tbody>
                  <tr>
                    {poster && (<td className='pe-1'>{poster.username}: </td>)}
                    <td>{props.caption}</td>
                  </tr>
                </tbody>
              </table>

              {/* Comments */}
              {!commentsOpen && (
                <button onClick={openComments} style={styles.button} className="ms-2">
                  <h5 className="font-weight-normal small text-muted">View all comments</h5>
                </button>
              )}

              {commentsOpen && (
                <div className="">
                  <button onClick={openComments} style={styles.button} className="ms-2">
                    <h5 className="font-weight-normal small text-muted">Close all comments</h5>
                  </button>

                  <div className="container" id="comments">
                    <div className="row mt-3 mb-3" style={styles.postComment}>
                      <div className="col h-100">
                        <textarea className="form-control h-100" aria-label="With textarea" onChange={(e) => { setComment(e.target.value) }}></textarea>
                      </div>

                      <div className="col h-100">
                        <button type="submit" className="btn btn-primary h-100" onClick={placeComment}>post</button>
                      </div>
                    </div>
                    
                    { comments && ( 
                      comments.map((item, index) => {
                         return (
                          <div id="comment" key={index}>                  
                            <table className='ms-2 mt-2 w-100'>
                              <tbody>
                                <tr>
                                  <td>
                                    <div className="pe-1">
                                      <td className='pe-1'>                        
                                        {item.profile_image && ( <img src={PROFILE_IMAGE + item.profile_image} style={styles.image} alt="profile_image" width="32" height="32" className="rounded-circle" /> )}
                                      </td>

                                      <td className='pe-1'>
                                        {item.username}: 
                                      </td>

                                      <td>
                                        {item.comment}
                                      </td>
                                    </div>
                                  </td>

                                  <td>
                                    {userId == item.user_id && (
                                      <div className="float-end" style={styles.deleteButtonDiv}>
                                        <input type="hidden" name="comment_id"  />
                                        <button className="text-danger" style={styles.button} id={index} value={item.comment_id} onClick={deleteComment}>delete</button>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        )
                      })
                    )}

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