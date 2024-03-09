import React,{ useState } from 'react';
import './App.css';
import Annote from 'web-annotator-react';
import TestGrid from "./testGrid"

function App() {
  const [coords,setCoords]=useState({
   origin:{
    x:0,
    y:0
   },
   target:{
    x:0,
    y:0
   }
  })
let verificationID = '468c51dd-e9f1-47ed-8413-33adaff3ce29'
  return (
    <Annote
       onSelect={(e,coords)=>{
         setCoords({
          origin:coords.origin,
          target:coords.target
         })
       }}
       coords={coords}
       style={{
        backgroundColor: "rgba(0,0,255,0.4)",
        borderColor: "blue",
        borderColor: "5px dotted blue"
      }}
      annoteId={verificationID}
    >
      <TestGrid />
    </Annote>
  );
}

export default App;
