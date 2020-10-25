// src/views/Home/index.js
import React, { useEffect } from 'react';

function Home (props) {
  useEffect (() => {
    console.log('useEffect home 页，老弟你来了')
    return () => {
      console.log('老弟你走了')
    }
  })
  return (
    <div>
      <div>HomeHome</div>
    </div>
  )
}

export default React.memo (Home);