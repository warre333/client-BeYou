import React from "react";

import "../../styles/loading_animation.css"

function Loading() {
    return (
        <div className="text-center">
            {/* Loading animation */}
            <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>


            <p className="w-100 mx-auto text-center text-secondary mt-5">If this is taking to long, try to refresh.</p>
        </div>
        
    );
}

export default Loading;