import React, { useRef, useState, useEffect } from 'react'

function Example8 () {
  const inputRef = useRef(null);
  const onButtonClick = () => {
    inputRef.current.value = '大白菜～'
  }
  const [text, setText] = useState('dabaicai')
  const textRef = useRef()

  useEffect(() => {
    textRef.current = text
    console.log(textRef.current, 'textRef.cuurent')
  })
  return (
    <div>
      <input ref={inputRef} type="text"/>
      <button onClick={onButtonClick}>Clike me</button>
      <input value={text} onChange={(e) => setText(e.target.value)}/>
    </div>
  )
}

export default Example8
