import React from 'react'

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

function Register() {
  return (
    <div className='vw-100 vh-100 top-0 position-fixed' style={styles.opacityBackground}>
        {/* Darkend background */}
        <div className="w-50 h-50 top-25 left-25 position-fixed bg-light" style={styles.centerWhiteCard}>

            {/* centered white space */}
            <div className="h-100 text-center">
                <h1 className="text-center m-4">Register</h1>

                <div className="w-75 p-2" style={styles.marginLeft25}>
                    <label for="email" className="text-start w-100">Email Address:</label>
                    <input type="email" name="email" id="email" className="form-control mb-2" />

                    <label for="username" className="text-start w-100">Username</label>
                    <input type="text" name="username" id="username" className="form-control mb-2" />

                    <label for="password" className="text-start w-100">Password</label>
                    <input type="password" name="password" id="password" className="form-control mb-2" />

                    <div className="row mt-3">
                        <div className="col">
                            <button className="btn btn-primary w-100">Register</button>
                        </div>

                        <div className="col">
                            <a className="btn btn-secondary w-100">Login</a>
                        </div>
                    </div>   
                </div>
            </div>
        </div>
    </div>
  )
}

export default Register