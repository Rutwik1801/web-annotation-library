import React from 'react'

function TestGrid() {
  return (
    <div className="App" >
    <h1>Grid Layout</h1>
<p>This grid layout contains six columns and three rows:</p>
<div class="grid-container">
  <div class="item1">Header
  <h1>Hello World</h1>
  <p>Test Paragraph</p>
  </div>
  <div class="item2">Menu
  <h1>Hello World</h1>
  <p>Test Paragraph</p>
  </div>
  <div class="item3">
   Test Div 1
  </div>  
  <div class="item4">Right
  {/* <h1>Hello World</h1> */}
  <p>Test Paragraph</p></div>
  <div class="item5">Footer
Test Div 5
  </div>
</div>
  </div>
  )
}

export default TestGrid;