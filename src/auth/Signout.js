import React from 'react'
import "./AuthButton.css"
export default function SignOut(props) {
    const handleClick=()=>{
        props.handleSignOut()
    }
  return (
    <div>
      <button className="signIn--btn" onClick={handleClick}>
        Sign Out
      </button>
    </div>
  );
}
