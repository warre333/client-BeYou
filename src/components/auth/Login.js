import React, {useState} from 'react'
import sha256 from 'js-sha256'
import axios from 'axios'
import { AUTH } from '../../config/api.config'

const styles = {
    opacityBackground: {
        background: "rgba(33, 37, 41, .9)",
    },

    center: {
        top: "25%",
        left: "25%",
    },

    centerWhiteCard: {
        top: "25%",
        left: "25%",        
        borderRadius: "10px",
    },

    marginLeft25: {
        marginLeft: "12.5%",
    },
}

function Login(props) {
    const setError = props.setError
    const setSuccess = props.setSuccess
    const setLoading = props.setLoading

    const [username, setUsername] = useState()
    const [password, setPassword] = useState()

    async function login(){
        console.log(username)
        console.log(password)
        if(username){
            if(password){
                axios.post(AUTH + "login", {
                    username: username,
                    password: password
                })
                    .then((response) => {
                        console.log(response)
                    })
            } else {
                setError("You should enter an password")
            }
        } else {
            setError("You should enter an username")
        }
    }

    function goToRegister(){
        props.setPopup("register")
    }

  return (
    <div className='vw-100 vh-100 top-0 position-fixed' style={styles.opacityBackground}>
        {/* Darkend background */}
        <div className="w-50 h-50 top-25 left-25 position-fixed bg-light" style={styles.centerWhiteCard}>

            {/* centered white space */}
            <div className="h-100 text-center">
                <h1 className="text-center m-4">Login</h1>

                <div className="w-75 p-2" style={styles.marginLeft25}>
                    <label for="username" className="text-start w-100">Username</label>
                    <input type="text" name="username" id="username" className="form-control mb-2" onChange={(e) => { setUsername(e.target.value)}} />

                    <label for="password" className="text-start w-100">Password</label>
                    <input type="password" name="password" id="password" className="form-control mb-2" onChange={(e) => { setPassword(sha256(e.target.value))}} />

                    <div className="row mt-3">
                        <div className="col">
                            <button className="btn btn-primary w-100" onClick={login}>Login</button>
                        </div>

                        <div className="col">
                            <button className="btn btn-secondary w-100" onClick={goToRegister}>Register</button>
                        </div>
                    </div>   
                </div>
            </div>
        </div>
    </div>
  )
}

export default Login