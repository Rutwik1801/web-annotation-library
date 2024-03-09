
# Website Annotator

Easy to use react website annotation library. Incorporate Annotation function in just few
Line of Code.


## Installation

Install my-project with npm
```bash
  npm install react-annote
```
    
## Run Locally

Clone the project

```bash
  git clone https://github.com/Rutwik1801/Website-Annotator.git
```

Go to the project directory

```bash
  cd website-annotator
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm  start
```

## Verification ID

You need to generate a unique  verification id for each project. You can do this using the link below

[Link](https://unique-id-generator-dun.vercel.app/)

## Usage/Examples

```javascript
import React,{ useState } from 'react';
import Annote from './annotation/ann';
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
  let verificationID = {ENTER THE GENERATED ID HERE}
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
      annoteId = {verificationID}
    >
    <div className="App" >
    //  your Code
    </div>
    </Annote>
  );
}

export default App;

```



## Tech Stack

**Frontend:** ReactJs

**Backend:** FireBase


## Features

- Annotate all Sections of the Website
- SignIn
- Comment and Resolve Issues

