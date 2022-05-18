import React from 'react'

import ChatList from "../components/messages/ChatList"
import Header from "../components/header"

function Messages() {
  return (
    <div>
        <Header />

        <ChatList />
    </div>
  )
}

export default Messages