import React, { useState, useEffect } from 'react'

function Example4 () {
  const [count, setCount] = useState(0); // 数组解构
  useEffect(() => {
    console.log(`You Clicked ${count} Times`)
  })

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>click me</button>
    </div>
  )

}

export default Example4