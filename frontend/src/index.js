import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Outlet, RouterProvider, createBrowserRouter} from "react-router-dom";
import Home from './components/Home';

import Staff from './components/Staff';
import StaffDashboard from './components/StaffDashboard';
import GlobalProvider from './store/index';
import OrderPage from './components/OrderPage';
import { ToastContextProvider } from './contexts/ToastContext';

const root = ReactDOM.createRoot(document.getElementById('root'));



const router = createBrowserRouter([
  {
    path: "/",
    element:<App/>,
    children:[
      {
        path: "/",
        element: <Home/>,
      },
      {
        path: "order/",
        element:<OrderPage/>
      }

    ],
  },
  {
    path: '/staff/',
    element: <Outlet/>, // setting an outlet elements adds the children elemnt to the parent 
    children:[     
      {
        index: true,
        element:<Staff/>,
      },
      {
        path: "dashboard/",
        element: <StaffDashboard/>,
      },

    ],
  }, 
])


root.render(
    <GlobalProvider>
      <ToastContextProvider>
    <RouterProvider router={router} />
    </ToastContextProvider>
    </GlobalProvider>
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
