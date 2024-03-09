import React,{useState,useEffect} from 'react'
import { v4 as uuidv4 } from 'uuid';
import { getDocs,collection, orderBy,deleteDoc,doc } from 'firebase/firestore';
import { auth, db } from './firebase';
import "./commentsBox.css";
import { SendCommentData } from './AsyncFunctions';

export default function CommentsBox(props){
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  const handleBoxCloseClick = () => {
    props.handleBoxCloseClick();
  };
  const handleChange = (e) => {
    setComment(e.target.value);
  };

  // load all comments when site loads
  useEffect(() => {
    const gets = async () => {
      const querySnapshot = await getDocs(
        collection(db, "comments"),
        orderBy("createdAt", "desc")
      );
      let temp = [];
      querySnapshot.forEach((e) => {
        if (e.data().commentBoxId === props.commentBoxId)
          temp.push({docId: e.id, ...e.data() });
      });
      setComments(temp);
    };
    gets();
  }, [setComments]);
  // =============================
  // async call to send typed comment
  const handleSendComment = async (e) => {
    e.preventDefault();
    SendCommentData(
      comment,
      props.commentBoxId,
      uuidv4(),
      props.user.uid,
      props.user.displayName,
      props.user.photoURL
    );
    // get all comments again
    const querySnapshot = await getDocs(
      collection(db, "comments"),
      orderBy("createdAt", "desc")
    );
    let temp = [];
    querySnapshot.forEach((e) => {
      if (e.data().commentBoxId === props.commentBoxId)
        temp.push({docId: e.id, ...e.data() });
    });
    setComments(temp);
    setComment("");

  };
  // ===========================

  const handleResolveClick = async (e) => {
    // props.handleResolveComments(e.target.id);
    await deleteDoc(doc(db, "comments", `${e.target.id}`));
        // get all comments again
        const querySnapshot = await getDocs(
          collection(db, "comments"),
          orderBy("createdAt", "desc")
        );
        let temp = [];
        querySnapshot.forEach((e) => {
          if (e.data().commentBoxId === props.commentBoxId)
            temp.push({docId: e.id, ...e.data() });
        });
        setComments(temp);
  };

  return (
    <div className="main-comments--div">
      <button className="btn-close" onClick={handleBoxCloseClick}>
        X
      </button>
      <form
        onSubmit={handleSendComment}
        style={{ overflow: "hidden", marginBottom: "40px" }}
      >
        <input
          className="add-comment--input"
          type="text"
          placeholder="type your comment"
          value={comment}
          onChange={handleChange}
        />
        <button className="add-comment--btn" type="submit">
          Post Comment
        </button>
      </form>
      <div
        style={{
          display: "flex",
          flexDirection: "column-reverse",
          alignItems: "flex-start",
        }}
      >
        {comments.map((commentObj) => {
          return (
            <div
              className={
                commentObj.userId === auth.currentUser.uid
                  ? "sent--comment"
                  : "recieved--comment"
              }
            >
              {
                <img
                  style={{
                    height: "50px",
                    width: "50px",
                    borderRadius: "50%",
                    border: "2px solid #224B0C",
                  }}
                  src={commentObj.photoURL}
                />
              }
              <p style={{ fontWeight: "bold" }}>{commentObj.userName}</p>
              <p>{commentObj.comment}</p>
              {commentObj.userId === auth.currentUser.uid && (
                <button
                  id={commentObj.docId}
                  className="resolve--btn"
                  onClick={(e) => {
                    handleResolveClick(e);
                  }}
                >
                  Resolve
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}