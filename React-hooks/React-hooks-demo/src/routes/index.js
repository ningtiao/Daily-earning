import React from 'react';
import { Redirect } from 'react-router-dom';
import Index from '../views/Index';
import Home from '../views/Home';
import useContext from '../views/Index/useContext';
import useReducer from '../views/Index/useReducer';
import Example from '../views/example4/index';
export default [
  {
    path: "/",
    component: Example,
    routes: [
      {
        path: "/",
        exact: true,
        render: () => (
          <Redirect to={"/recommend"}/>
        )
      },
      {
        path: "/home",
        exact: true,
        key: "home",
        component: Home
      },
      {
        path: "/useContext",
        exact: true,
        key: "useContext",
        component: useContext
      }
    ]
  }
]