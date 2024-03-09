import { collection,query,where, addDoc,getDocs,doc,deleteDoc } from "firebase/firestore"; 
import { db } from "./firebase";


export const SendBoxData=async (boxObject,id)=>{
    try {
        const docRef = await addDoc(collection(db,"boxes"), {
          ...boxObject,
          id:id
        });
        // console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
}


export const GetBoxData=async (id)=>{

  const q = query(collection(db, "boxes"),where("id", "==", id));
    const querySnapshot = await getDocs(q);
    let temp=[]
    querySnapshot.forEach((doc) => {
      temp.push({boxDocId:doc.id,
        ...doc.data()});
    });
    return temp;
}

export const SendCommentData=async (comment,commentBoxId,uniqueCommentId,uid,userName,photoURL)=>{
    try {
        const docRef = await addDoc(collection(db, "comments"), {
         commentBoxId:commentBoxId,
           uniqueCommentId:uniqueCommentId,
          comment:comment,
          userId:uid,
          userName:userName,
          photoURL:photoURL
        });
        // console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
}

export const GetCommentData=async (id,comment)=>{

}
export const DeleteComment=async (commentBoxId,uniqueCommentId)=>{
  await deleteDoc(doc(db, "comments", uniqueCommentId));

}
