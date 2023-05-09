import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react'

import PreviewPost from '../advertisements/PreviewPost'
import { getCookie, isAuthenticated } from '../../functions/Common'

import { AUTH, POSTS, USERS } from '../../config/api.config'
import Steps from './Steps'

function SelectPost({ changePage, changeSelectedPost }) {
    const [posts, setPosts] = useState()

    function close(){
        changePage(0)
    }
    
    function select(e){
        changeSelectedPost(e.currentTarget.id)
    }

    useEffect(() => {
        const user = getCookie()

        async function auth(){
          await isAuthenticated()
            .then((response) => {
              if(response.success){
                axios.get(USERS + "?user_id=" + response.data.user_id).then((responseUser) => {
                  if(responseUser.data.success){
                    axios.get(POSTS + "?user_id=" + response.data.user_id,
                        {
                        headers: {
                            "x-access-token": user
                        },
                    })
                        .then((response) => {
                            if(response.data.success){
                                setPosts(response.data.data)
                            } 
                        })
                  } 
                })
              }      
            })       
        }
  
        auth()         
  
    }, [])
    
  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-white">
        <div className="flex flex-row justify-between m-3">
            <div className="align-center">
                <button onClick={close}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                    </svg>  
                </button> 
            </div>

            <div className="">
                <p className="text-center font-bold text-2xl">Create advertisement</p>
            </div>
                      
            <div />
        </div>

        <div className="container mx-auto mt-6">            
            <Steps step={1} />

            <p className="text-center font-medium text-xl">Choose a post.</p>

            <div className="my-5">
                <div className="grid grid-cols-5 gap-4">
                    { posts && (
                        posts.map((post, key) => {
                            return (
                                <button key={key} onClick={select} id={post.post_id}>
                                    <PreviewPost post_id={post.post_id} image={post.media_link} />
                                </button>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    </div>
  )
}

export default SelectPost