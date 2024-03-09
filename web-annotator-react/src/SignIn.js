import React from 'react'
import "./AuthButton.css"
export default function SignIn(props) {
    const handleClick=()=>{
        props.handleSignIn()
    }
  return (
    <div>
      <button className="signIn--btn" onClick={handleClick}>
        Sign In
      </button>
    </div>
  );
}
