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
            const newComment = {comment: comment, comment_id: response.data.comment_id, post_id: props.post_id, profile_image: user.profile_image, user_id: user.user_id, username: user.username}
            const newCommentSection = [newComment, ...comments]

            setComment("")
          
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
      <div className="bg-light border rounded-lg">
        {/* User image + username */}
        <div className="border-b">
          <table>
            <tbody>
              <tr>
                {poster && (                
                  <a href={"/u/" + poster.username} style={styles.noDecorationLink}>
                    <td >
                      {/* <ProfileImage url={PROFILE_IMAGE + poster.profile_image} /> */}
                      {poster.profile_image && ( <div className='mt-1 ml-1'><img src={PROFILE_IMAGE + poster.profile_image} alt="post" height="50" width="50" className="object-cover w-10 h-10 rounded-full" /></div> )}
                    </td>
                    <td className='align-middle'>
                      <h4 className="text-sm align-middle h-full">{poster.username}</h4>
                    </td>
                  </a>
                )}
                {!poster && (              
                  <a href={""} style={styles.noDecorationLink}>
                    <td>
                      {/* <ProfileImage url={PROFILE_IMAGE + poster.profile_image} /> */}
                      <div className='mt-1 ml-1'><img src={PROFILE_IMAGE + "NOT_FOUND.jpg"} alt="post" height="50" width="50" className="object-cover w-10 h-10 rounded-full" /></div>
                    </td>
                    <td className='align-middle'>
                      <h4 className="text-sm align-middle h-full">USER NOT FOUND</h4>
                    </td>
                  </a>
                )}
              </tr>
            </tbody>
          </table> 
        </div>


        {/* Image div (image/video + caption, name, ..) */}
        <div className="border-t">
          {/* Image div (black background, image/video is scaling within it) */}
          <div className="bg-image-post max-image-size text-center" >
              {/* Scaled image within the parent with object-fit: contain */}  
              {props.image && props.image.slice(-3) != "mp4" && props.image.slice(-3) != "mkv" && ( <img src={POST_IMAGE + props.image} alt="post" className='mx-auto' style={styles.image} /> )}
              {props.image && props.image.slice(-3) == "mp4" && ( <video style={styles.image} controls ><source src={POST_IMAGE + props.image} type="video/mp4" alt="post" className='mx-auto' style={styles.image} /></video> )}
          </div>

          {/* Lower div with caption etc */}
          <div className="">
              {/* Like / Comment / ... */}
              <div className="flex flex-row justify-between text-center py-2 px-16 md:px-32">
                <div className="">
                  <button style={styles.button} onClick={likePost} onAnimationEnd={() => setLikeAnimation(false)} >
                    <svg width="24" height="24" fill={liked ? "red " : "currentColor"} className={likeAnimation ? "bi bi-heart-fill zoom-in-out-box" : "bi bi-heart-fill"} viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                    </svg>
                  </button>                  
                </div>

                <div className="">
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
              
              <hr className='m-0 ' />

              {share &&
                <div>
                  <div className="bg-gray-200 w-full" role="alert">
                    <div className="flex flex-row">
                      <div className="w-full my-1 ml-2">The link has been copied to share.</div>
                      <div className="">
                        <button type="button" className="" data-bs-dismiss="alert" aria-label="Close" onClick={() => { setShare(false) }}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-x mt-2 mr-2" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg></button>
                      </div>
                    </div>
                    
                    
                  </div>
                </div>
              } 

              {error && (
                <Error changeMessage={setError} message={error} />
              )} 

              {/* @username: caption */}
              <table className='ml-2 mt-2'>
                <tbody>
                  <tr>
                    {poster && (<td className='pr-1'>{poster.username}: </td>)}
                    <td>{props.caption}</td>
                  </tr>
                </tbody>
              </table>

              {/* Comments */}
              {!commentsOpen && (
                <button onClick={openComments} style={styles.button} className="ml-2">
                  <h5 className="text-sm text-gray-500">View all comments</h5>
                </button>
              )}

              {commentsOpen && (
                <div className="">
                  <button onClick={openComments} style={styles.button} className="ml-2">
                    <h5 className="text-sm text-gray-500">Close all comments</h5>
                  </button>

                  <div className="ml-2" id="comments">
                    <div className="flex flex-row mt-3 mb-3" style={styles.postComment}>
                      <div className="h-full">
                        <textarea className="h-full bg-white border border-gray-200 rounded-full px-4" type="reset" value={comment} aria-label="With textarea" onChange={(e) => { setComment(e.target.value) }}></textarea>
                      </div>

                      <div className="h-full">
                        <button type="submit" className="h-full text-white bg-blue-500 px-6 ml-2 rounded-full" onClick={placeComment}>post</button>
                      </div>
                    </div>
                    
                    { comments && ( 
                      comments.map((item, index) => {
                         return (
                          <div id="comment" key={index}>                  
                            <table className='ml-2 mt-2 w-full'>
                              <tbody>
                                <tr>
                                  <td>
                                    <div className="pr-1">
                                      <td className='pr-1 align-middle'>                        
                                        {item.profile_image && ( <img src={PROFILE_IMAGE + item.profile_image} style={styles.image} alt="profile_image" width="32" height="32" className="rounded-full w-[32px] h-[32px]" /> )}
                                      </td>

                                      <td className='pr-1 align-middle'>
                                        {item.username}: 
                                      </td>

                                      <td className='align-middle'>
                                        {item.comment}
                                      </td>
                                    </div>
                                  </td>

                                  <td>
                                    {userId == item.user_id && (
                                      <div className="float-right" style={styles.deleteButtonDiv}>
                                        <input type="hidden" name="comment_id"  />
                                        <button className="text-red-400" style={styles.button} id={index} value={item.comment_id} onClick={deleteComment}><p className="text-red-400">delete</p></button>
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