import React, { useRef, useState } from 'react'

// function Example4 () {
//   const [count, setCount] = useState(0);

//   const handleClick = () => {
//       setTimeout(() => {
//           setCount(count + 1);
//       }, 3000);
//   };

//   return (
//       <div>
//           <p>{count}</p>
//           <button onClick={() => setCount(count + 1)}>
//               setCount
//           </button>
//           <button onClick={handleClick}>
//               Delay setCount
//           </button>
//       </div>
//   );
// }

function Example4 () {
  const [count, setCount] = useState(0)
  const currentCount = useRef(count)
  currentCount.current = count
  const handelClick = () => {
    setTimeout(() => {
      setCount(currentCount.current + 1)
    }, 3000)
  }
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>Set Count</button>
      <button onClick={handelClick}>Delay setCount</button>
    </div>
  )
}

export default Example4
