import React from 'react'

import Login from '../components/auth/Login'
import Header from '../components/header'
import PostList from '../components/posts/PostList'

function Homepage() {
  return (
    <div>
        <Header />

        <Login />
        
        <PostList />        
    </div>
  )
}

export default Homepage