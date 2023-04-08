import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react'
import Cookies from 'universal-cookie'

import { ADS, AUTH, POSTS } from '../../config/api.config'

import PreviewPost from './PreviewPost'

function SelectPost({ changePage, changePaymentIntent, selectedPost }) {
    const cookies = new Cookies()

    const [error, setError] = useState("")

    const [budget, setBudget] = useState(5.00)

    function getCookie(){
      if(cookies.get('user')){
        return cookies.get('user')
      }
    }  

    function close(){
        changePage(0)
    }

    function create(){
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
                if(selectedPost && budget){
                    if(budget >= 1.00){
                        axios.post(ADS, {
                            post_id: selectedPost,
                            budget: budget,
                        },
                            {
                            headers: {
                                "x-access-token": user
                            },
                        })
                            .then((response) => {
                                if(response.data.success){
                                    changePaymentIntent(response.data.data)
                                    changePage(3)
                                } else {
                                    console.log(response)
                                    setError("There was an error starting the payment.")
                                }
                            })    
                    } else {
                        setError("The budget should be greater then €1,00.")
                    }
                } else {
                    setError("You must fill in all fields.")
                }
            }  else {
              cookies.remove('user', { path: '/' });
              window.location.reload() 
            }
          })
        } else { 
            cookies.remove('user', { path: '/' });
            window.location.reload() 
        }
    }
    
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
            <div className="mt-2">
                <p className="ml-4 text-left w-full"><span className="font-bold">Current rate:</span> 10 views/€1</p>
            </div>  

            <div className="mt-2">
                <label htmlFor="budget" className="text-left w-full ml-4">Budget</label>
                <div className="w-full mb-2 py-1 px-4 border border-gray-200 focus:border-none bg-white rounded-2xl flex flex-row">€<input type="number" defaultValue={5.00} min={1.00} name="budget" id="budget" className="w-full" onChange={(e) => { setBudget(e.target.value)}} /></div>
            </div>

            <button className="w-full text-center bg-blue-500 rounded-full py-1 text-white mt-4" onClick={create}>Proceed to checkout</button>
            {error && <p className="mt-1 text-red-500">{error}</p>}
        </div>
    </div>
  )
}

export default SelectPost