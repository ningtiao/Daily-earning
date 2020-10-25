import React, { useState, useMemo } from 'react'

function ExampleDemo () {
  const [xiaohong, setXiaohong] = useState('小红等待中')
  const [zhiling, setZhiling] = useState('志林等待中')
  return (
    <>
      <button onClick={() => setXiaohong(new Date().getTime() + '小红向我走来')}>小红</button>
      <button  onClick={() => setZhiling(new Date().getTime() + '志林向我走来')}>志林</button>
      <ChildComponent name={xiaohong}>{zhiling}</ChildComponent>
    </>
  )
}

function ChildComponent ({name, children}) {
  function changeXiaohong () {
    console.log('小红向我走来')
    return name + '小红来了～～～'
  }
  const xiaohongAction = useMemo(() => changeXiaohong(name), [name])
  return (
    <>
      <div>{xiaohongAction}</div>
      <div>{children}</div>
    </>
  )
}


export default ExampleDemo
