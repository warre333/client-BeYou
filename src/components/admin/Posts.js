import React, { useEffect, useState } from 'react'
import axios from 'axios';

import { ADMIN, POST_IMAGE } from '../../config/api.config';
import { getCookie } from '../../functions/Common';

function Posts() {
    const [searchResult, setSearchResult] = useState()
  
    function searchFunction(username){
      const cookies = getCookie()

      axios.get(ADMIN + "posts/search?username=" + username,
      {
        headers: {
          "x-access-token": cookies
        },
      })
        .then((response) => {
          if(response.data.success){
            setSearchResult(response.data.data)
          } else {            
            console.log(response.data.message);
          }
        })
    }

    function getAllFunction(){
      const cookies = getCookie()

      axios.get(ADMIN + "posts",
      {
        headers: {
          "x-access-token": cookies
        },
      })
        .then((response) => {
          if(response.data.success){
            setSearchResult(response.data.data)
          } else {            
            console.log(response.data.message);
          }
        })
    }

    useEffect(() => {
      getAllFunction()
    }, [])
  
    
    function handleEnterSearch(e){
      if (e.code === "Enter") {
        searchFunction(e.target.value)
      }
    }

    function handleSearch(e){
        searchFunction(e.target.value)
    }

    const remove = (id) => {
      const newPosts = searchResult.filter((post) => post.post_id.toString() !== id)

      searchResult.filter((post) => console.log(post.post_id, id, post.post_id.toString() !== id))

      setSearchResult(newPosts)
    };

    function handleModerate(e){
      const cookies = getCookie()      
      const id = e.target.id

      if (window.confirm("Are you sure you want to delete this post")) {
        axios.delete(ADMIN + "posts?post_id=" + id, {
          headers: {
            "x-access-token": cookies
          },
        })
          .then((response) => {
            if(response.data.success){
              remove(id)
            } else {
              console.log(response);
            }
          })
      }   
    }

  return (    
    <div className="w-full bg-gray-100 mt-12 mx-8 rounded-xl"> 
      <div className='pt-8 mb-4 mx-4'>
        <input className="py-1 px-4 w-full border rounded-xl" type='text' onKeyPress={handleEnterSearch} onChange={handleSearch} placeholder="Search..." aria-label="Search" />
      </div>

      <div className="w-full grid grid-cols-4 gap-4">
        {searchResult && searchResult.map((item, key) => {
          return (
            <div className="" key={key}>
              <div className='my-1 mx-4'>
                <div className="bg-gray-100 border rounded-2xl">
                  <div className="w-full flex flex-col">
                    <a key={key} className="w-full" href={"/post/" + item.post_id}>
                      <div className='p-1 w-full'>
                        <img src={POST_IMAGE + item.media_link} alt="post" height="200" width="200" className="object-cover aspect-square px-1 pt-1 rounded-xl mx-auto" />
                      </div>
                    </a>
                    <button onClick={handleModerate} id={item.post_id} className="bg-red-500 text-white rounded-xl z-20 my-2 mx-auto h-1/2 py-1 px-4">
                      Delete post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        {searchResult === [] && (
            <div className="container mx-auto">
              <p className="text-center">No users are found.</p>
            </div>
        )}
      </div>
    </div>
  )
}

export default Posts