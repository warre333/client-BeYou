import React, {useState, useEffect} from 'react'
import useWindowDimensions from '../../hooks/useWindowDimensions';
// import "../../styles/colors.css"

const styles = {
    bg:  {
        position: "fixed",
        height: "100vh",
        width: "100vw",
        top: 0,
        left: 0,
        backgroundColor: "rgba(33, 37, 41, .9)"
    },

    centerWhiteCard: {
        top: "12.5%",
        left: "12.5%",        
    },

    centerWhiteCardMobile: {   
    },
}

function Edit() {
    // Screen sizing
    const { width } = useWindowDimensions();
    const [isOnMobile, setIsOnMobile] = useState(false)

    useEffect(() => {
        if(width < 768){
            setIsOnMobile(true)
        } else {
            setIsOnMobile(false)
        }
    })

  return (
    <div style={styles.bg}>
        <div className={isOnMobile ? "w-100 h-100 position-fixed bg-light" : "w-75 h-75 position-fixed bg-light rounded-3"} style={isOnMobile ? styles.centerWhiteCardMobile : styles.centerWhiteCard}>
            {/* The top, x (doesn't save states) edit profile checkmark */}
            <div id="top" className="row m-3">
                <div className="col-1 align-items-center justify-content-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                    </svg>   
                </div>

                <div className="col">
                    <h2 className="text-center">Edit profile</h2>
                </div>
                
                <div className="col-1 align-items-center justify-content-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="blue" class="bi bi-check2" viewBox="0 0 16 16">
                      <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                    </svg>
                </div>
            </div>

            {/* Input fields save on checkmark click */}
        </div>
    </div>
  )
}

export default Edit