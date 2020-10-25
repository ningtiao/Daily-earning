// src/views/Index/index.js

import React, { useState, useEffect } from 'react'
import { renderRoutes } from "react-router-config";
import { NavLink } from 'react-router-dom';// 利用 NavLink 组件进行路由跳转
function Example (props) {
  const { route } = props;
  const [count, setCount] = useState(0); // 数组解构
  useEffect (() => {
    console.log('useEffect Index 页，老弟你来了')
  }, [])
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>点击我</button>
      <NavLink to="/home" activeClassName="selected">跳转</NavLink>
      { renderRoutes (route.routes) }
    </div>
  )
}

export default React.memo (Example);