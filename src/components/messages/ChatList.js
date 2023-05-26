import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react'

import ChatListItem from './ChatListItem'
import { getCookie } from '../../functions/Common'

import { CHAT } from '../../config/api.config'


function MessagesList({ setError }) {
  const [chats, setChats] = useState()


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
        }
      })
  }, [])
  

  return (
    <div>
      <div className="container mx-auto">
        <h1 className="text-center mb-3">Chats</h1>

        {chats && chats.map((chat, key) => {
          return <ChatListItem key={key} chatroom_id={chat.chatroom_id} username={chat.username} user_image={chat.profile_image} />
        })}
      </div>
    </div>
  )
}

export default MessagesList