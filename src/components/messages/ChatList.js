import axios from 'axios'
import React, { useEffect } from 'react'
import Cookies from 'universal-cookie'
import { useState } from 'react'
import { CHAT } from '../../config/api.config'

import ChatListItem from './ChatListItem'

function MessagesList({setError, error}) {
  const newCookies = new Cookies()

  const [chats, setChats] = useState()

  function getCookie(){
    if(newCookies.get('user')){
      return newCookies.get('user')
    }
  }  

  useEffect(() => {
    const user = getCookie()

    axios.get(CHAT + "all", {
      headers: {
        'x-access-token': user
      }
    })
      .then((response) => {
        if(response.data.success){
          setChats(response.data.data)
        } else {
          setError(response.data.message)
          console.log(response.data);
        }
      })
  }, [])
  

  return (
    <div>
      <div className="container">
        <h1 className="text-center mb-3">Chats</h1>

        {chats && chats.map((chat, key) => {
          console.log(chat);
          return <ChatListItem key={key} chatroom_id={chat.chatroom_id} username={chat.username} user_image={chat.profile_image} />
        })}
      </div>
    </div>
  )
}

export default MessagesList