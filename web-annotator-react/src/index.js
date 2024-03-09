import React,{useState,useEffect} from 'react'
import "./annote.css"
import { validate as uuidValidate } from 'uuid';
import CommentsBox from './commentsBox';
import { collection,getDocs,getDoc,query,where } from "firebase/firestore"; 
import  { db } from './firebase';
import {SendBoxData, GetBoxData} from './AsyncFunctions';
// auth------
import { doc, deleteDoc } from "firebase/firestore";

import { signInWithPopup, GoogleAuthProvider,getAuth,signOut } from "firebase/auth";
import { auth,provider } from './firebase';
import SignOut from "./Signout";
import SignIn from './SignIn';

// ========================

export default function Annote(props) {

    const [animationInProgress,setAnimationInProgress]=useState();
    const [viewCommentsFlag,setViewCommentsFlag]=useState(false)
    // id of annotation box as a whole
    const [commentBoxId,setCommentBoxId]=useState(-1)
    // =================== 
    const [allComments,setAllComments]=useState([])
    const [particularComments,setParticularComments]=useState([])
    const [flag,setFlag]=useState(false)
    const [hold,setHold]=useState(false)
    const [selectionBox,setSelectionBox]=useState(false)
    const [selectionBoxOrigin,setSelectionBoxOrigin]=useState([0,0]);
    const [selectionBoxTarget,setSelectionBoxTarget]=useState([0,0]);
    const [animation,setAnimation]=useState("");
    // to stop the overlapping boxes
    const [once,setOnce]=useState(false)
    // ========================
    let [allBoxes,setAllBoxes]=useState([]);

    // login auth state
    const [user,setUser]=useState()
    // ==========================

// load all boxes when the site loads
useEffect(()=>{
GetBoxData(props.annoteId)
},[setAllBoxes])
  
  //  =============================
  if(!uuidValidate(props.annoteId)){
    // alert('wrong id')
    return(<div>
      <h1>The Verification ID is not in the required format..Please visit the doc to understand how to give it a valid ID</h1>
    </div>);
   }

// auth -------------------
// signIn
const handleSignIn=async ()=>{
  signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const authData = result.user;
    setUser(authData)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
}
// =============
// signout---------
const handleSignOut=()=>{
  signOut(auth).then(() => {
    // Sign-out successful.
    setUser()
  }).catch((error) => {
    // An error happened.
    console.log(error)
  });
}
// =====================

   const handleTransformBox=()=> {
        if(flag){
          // const { selectionBoxOrigin, selectionBoxTarget } = this.state;
          if (
            selectionBoxOrigin[1] > selectionBoxTarget[1] &&
            selectionBoxOrigin[0] > selectionBoxTarget[0]
          )
            return "scaleY(-1) scaleX(-1)";
      
          if (selectionBoxOrigin[1] > selectionBoxTarget[1]) return "scaleY(-1)";
          if (selectionBoxOrigin[0] > selectionBoxTarget[0]) return "scaleX(-1)";
          return null;
        }
    
      }


     const closeSelectionBox=async ()=> {
        if(flag && once){
      // storing all the selected rectangles----------
    SendBoxData({flag:true,rectHt: Math.abs(
      selectionBoxTarget[1] -selectionBoxOrigin[1] - 1
    ),
   rectWt: Math.abs(
      selectionBoxTarget[0] -selectionBoxOrigin[0] - 1
    ),
    x:selectionBoxOrigin[0],
    y:selectionBoxOrigin[1],
  },props.annoteId)
  let dbBoxes=await GetBoxData(props.annoteId)
    setAllBoxes(dbBoxes);  
      // -------------
      //   ------------------------------------
      if (props.onMouseUp) props.onMouseUp();
      setHold(false);
      setAnimation("react-rectangle-selection--fadeout")
       setTimeout(() => {
        setAnimation("")
        setSelectionBox(false)
        setAnimationInProgress();
      }, 300);
        }
        setOnce(false)
      }
    

     const  handleMouseDown=(e)=> {
      setOnce(true);
        if(flag){
          // if (this.props.disabled) return;
          // let doubleClick = false;
          clearTimeout(animationInProgress);
          setAnimationInProgress();
          setAnimation("");
          setSelectionBox(false)
      
          if (
            animation.length > 0 &&
            e.target.id === "react-rectangle-selection"
          ) {
            setSelectionBox(false);
            setAnimation("")
            // doubleClick = true;
          }
            setHold(true);
            setSelectionBoxOrigin([e.nativeEvent.pageX, e.nativeEvent.pageY]);
            setSelectionBoxTarget([e.nativeEvent.pageX, e.nativeEvent.pageY])
        }
      }

      const baseStyle = {
        zIndex: 10,
        left: selectionBoxOrigin[0],
        top: selectionBoxOrigin[1],
        height: Math.abs(
          selectionBoxTarget[1] - selectionBoxOrigin[1] - 1
        ),
        width: Math.abs(
          selectionBoxTarget[0] - selectionBoxOrigin[0] - 1
        ),
        userSelect: "none",
        transformOrigin: "top left",
        transform: handleTransformBox()
      };


      // delete a box 
   const handleBoxDeleteClick= async (e)=>{
    await deleteDoc(doc(db, "boxes", e.target.id));
    const querySnapshot = await getDocs(collection(db, "boxes"));
    let temp=[]
    querySnapshot.forEach((doc) => {
      temp.push({boxDocId:doc.id,
        ...doc.data()});
    });
    setAllBoxes(temp)
   }

// delete/resolve a comment
  const handleResolveComments=async (docId)=>{

    // DeleteComment
    // await deleteDoc(doc(db, "comments", `${docId}`));
    // ==================
  }

// ============================

  // close the comment box when the user clicks on x
      const handleBoxCloseClick=()=>{
        setViewCommentsFlag(false)
      }
// ==============================================

  return (
    <div>
      <div
        style={{ height: "inherit", width: "inherit" }}
        onMouseLeave={() => {
          closeSelectionBox();
        }}
        onMouseDown={(e) => handleMouseDown(e)}
        onMouseUp={() => closeSelectionBox()}
        onMouseMove={(evt) => {
          if (hold && !selectionBox) {
            if (props.onMouseDown) props.onMouseDown();
            setSelectionBox(true);
          }
          if (selectionBox && !animationInProgress) {
            setSelectionBoxTarget([
              evt.nativeEvent.pageX,
              evt.nativeEvent.pageY,
            ]);

            props.onSelect(evt, {
              origin: selectionBoxOrigin,
              target: selectionBoxTarget,
            });
          }
        }}
      >
        {selectionBox && (
          <div
            className={`react-rectangle-selection ${animation}`}
            id={"react-rectangle-selection"}
            style={Object.assign(baseStyle, props.style)}
          />
        )}
        {props.children}
        {/* all the boxes created by the user will be displayed--------- */}
        {user && allBoxes.map((e, idx) => {
          return (
            <div>
              
              <div
                key={idx}
                style={{
                  height: e.rectHt,
                  width: e.rectWt,
                  backgroundColor: "rgba(0,0,255,0.1)",
                  border: "2px dashed rgba(0,0,255,0.4)",
                  position: "absolute",
                  zIndex: 10,
                  left: e.x,
                  top: e.y,
                }}
              >
                {!flag && (
                  <div>
                    {/* view comments button */}
                    {user && (
                      <button
                        id={idx}
                        className="comment-btn"
                        onClick={() => {
                          setViewCommentsFlag(true);
                          setCommentBoxId(idx);
                        }}
                      ></button>
                      
                    )}
                    <button id={e.boxDocId} style={{color:"red"}} onClick={(e)=>{handleBoxDeleteClick(e)}}>X</button>
                  </div>
                )}
              </div>
              {viewCommentsFlag && (
          <CommentsBox
          user={user}
            handleBoxCloseClick={handleBoxCloseClick}
            commentBoxId={commentBoxId}
            comments={particularComments}
            handleResolveComments={handleResolveComments}
          />
        )}
            </div>
          );
        })}
        {/* {viewCommentsFlag && (
          <CommentsBox
          user={user}
            handleBoxCloseClick={handleBoxCloseClick}
            commentBoxId={commentBoxId}
            comments={particularComments}
            handleResolveComments={handleResolveComments}
          />
        )} */}
        {/* ============================ */}
      </div>

      {user && <button
        className="annotation-trigger--btn"
        onClick={() => {
          setFlag(!flag);
        }}
      >
       {flag ? "Stop Annotation" : "Start Annotation"}
      </button>}
      {!user && <SignIn handleSignIn={handleSignIn} />}
      {user && <SignOut handleSignOut={handleSignOut} />}
    </div>
  );
}
