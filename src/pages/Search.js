import React, {useEffect, useState} from 'react'
import axios from 'axios'
import Cookies from "universal-cookie"

import Header from '../components/header'

import Error from '../components/states/Error'
import Success from '../components/states/Success'
import Loading from '../components/states/Loading'
import Login from '../components/auth/Login'
import Register from '../components/auth/Register'

import { AUTH, PROFILE_IMAGE, SEARCH } from '../config/api.config'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

const styles = {
  image: {
      objectFit: "contain",
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

  link: {
    textDecoration: "none",
    color: "black",
  }
}

function Page() {
  const newCookies = new Cookies();
  const navigate = useNavigate()

  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('keywords'))

  const [user, setUser] = useState()
  const [popup, setPopup] = useState()
  
  const [searchResult, setSearchResult] = useState()

  const [error, setError] = useState()
  const [success, setSuccess] = useState()
  const [loading, setLoading] = useState()

  function getCookie(){
    if(newCookies.get('user')){
      return newCookies.get('user')
    }
  }  

  useEffect(() => {
    function isAuthenticated(){
      const user = getCookie()
  
      if(user){
        axios.get(AUTH,
          {
            headers: {
              "x-access-token": user
            },
          },
        ).then((response) => {
          if(response.data.success){
            setUser(response.data.user_id)
          }  else {
            setUser("none")
            newCookies.remove('user', { path: '/' });
          }
        })
      } else { 
        setUser("none")
      }
    }

    isAuthenticated()
  }, [])

  function searchFunction(){
    axios.get(SEARCH + "?keywords=" + searchParams.get('keywords') + "&page=" + searchParams.get('page'))
      .then((response) => {
        console.log(response.data);
        if(response.data.success){
          setSearchResult(response.data.data)
        } else {
          setError(response.data.message)
        }
      })
  }

  useEffect(() => {
    searchFunction()
  }, [searchParams.get('keywords'), searchParams.get('page')])

  useEffect(() => {
    if(search != searchParams.get('keywords')){  
      setSearchParams({'keywords': search, 'page': searchParams.get('page')})
    }
  }, [search])
  
  function handleEnterSearch(e){
    if (e.code == "Enter") {
      navigate('/search?keywords=' + search + '&page=1')
    }
  }

  return (
    <div>
        <Header />

        {/* States */}
        { error && ( <Error message={error} changeMessage={setError} /> )}
        { success && ( <Success message={success} changeMessage={setSuccess} /> )}
        { loading && ( <Loading changeMessage={setLoading} /> )}


        {/* 
        
            Page content

        */}
        <div className="container mx-auto">      
          <div className='pt-8 mb-4 lg:ms-0'>
            <input className="py-1 px-4 w-full border rounded-xl" type="search" onKeyPress={handleEnterSearch} onChange={(e) => { setSearch(e.target.value) }} placeholder="Search..." aria-label="Search" />
          </div>

          {searchResult && searchResult.map((item, key) => {
            return (
              <a key={key} href={"/u/" + item.username} style={styles.link}>
                <div className='my-1'>
                    <div className="bg-gray-100 border rounded-2xl">
                        <div className="flex flex-row">
                            <div className="w-full">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div className='p-1'><img src={PROFILE_IMAGE + item.profile_image} alt="post" height="50" width="50" className="object-cover w-10 h-10 rounded-full" /></div>
                                            </td>
                                            <td>
                                                <h4 className="font-normal text-sm align-middle">{item.username}</h4>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="">
                                <table className="h-full">
                                    <tbody>
                                        <tr>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
              </a>
            )
          })}
          {searchResult == [] && (
            <div className="container mx-auto">
              <p className="text-center">No users are found.</p>
            </div>
          )}
        </div>
        

        {/* Login & register popups */}
        { popup === "login" && (
          <Login setPopup={setPopup} setError={setError} setSuccess={setSuccess} setLoading={setLoading} />
        )}

        { popup === "register" && (
          <Register setPopup={setPopup} setError={setError} setSuccess={setSuccess} setLoading={setLoading}  />
        )}
        
    </div>
  )
}

export default Page