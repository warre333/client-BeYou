import React from 'react'

import Friend from './Friend'

function FriendsList({ friendsList }) {
  return (
    <div>        
      <div className="container mx-auto">
        <h1 className="text-center mb-3 font-bold text-xl">Friends</h1>

        {/* Mapping of friends list */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 md:gap-3">
          {friendsList && friendsList.map((friend, key) => {
            console.log(friend);
            return <Friend key={key} username={friend.username} user_image={friend.profile_image} user_id={friend.user_id}  />
          })}
        </div>
      </div>
    </div>
  )
}

export default FriendsList