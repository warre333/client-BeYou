import React from 'react'

import Logo from "../images/logo.png"

const styles = {
    header_container: {
        width: '100vw',
        margin: 0,
    },

    logo: {
        height: '80%',
        width: '50px',
        objectFit: 'cover',
    }
};

function header() {
    function logout(){
        // Log out
    }

  return (
        <header className="p-3 mb-3 border-bottom">
            <div className="container">
                <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                    <a href="/" className="d-flex align-items-center mb-2 mb-lg-0 text-dark text-decoration-none">
                        <img src={Logo} alt="logo" style={styles.logo}/>
                    </a>

                    <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                        <li><a href="/explore" className="nav-link px-2 link-dark">Explore</a></li>
                        <li><a href="/friends" className="nav-link px-2 link-dark">Friends</a></li>
                        <li><a href="/messages" className="nav-link px-2 link-dark">Messages</a></li>
                        {/* Shopping page */}
                    </ul>

                    <form className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3">
                        <input type="search" className="form-control" placeholder="Search..." aria-label="Search" />
                    </form>

                    <div className="dropdown text-end">
                        <a href="/" className="d-block link-dark text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                            <img src="https://github.com/mdo.png" alt="mdo" width="32" height="32" className="rounded-circle" />
                        </a>
                        <ul className="dropdown-menu text-small" aria-labelledby="dropdownUser1">
                            <li><a className="dropdown-item" href="/profile/{user}">Profile</a></li>
                            <li><a className="dropdown-item" href="/create">Create Post</a></li>
                            <li><a className="dropdown-item" href="/settings">Settings</a></li>

                            <li><hr className="dropdown-divider" /></li>
                            <li><button className="dropdown-item" onClick={logout}>Sign out</button></li>
                        </ul>
                    </div>
                </div>
            </div>
        </header>
  )
}

export default header