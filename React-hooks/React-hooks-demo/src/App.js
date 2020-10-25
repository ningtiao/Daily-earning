import React from 'react';
import './App.css';
import { renderRoutes } from 'react-router-config'; // renderRouter 读取路由配置转化为 Route 标签
import routes from './routes/index.js';
import { HashRouter } from 'react-router-dom';
function App() {
  return (
    <HashRouter>
      { renderRoutes (routes) }
    </HashRouter>
  );
}

export default App;
