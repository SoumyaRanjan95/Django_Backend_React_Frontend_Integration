import React, { useContext, useEffect, useState} from "react"
import {Outlet,Link} from "react-router-dom";
import BreadCrumb from "./components/Breadcrumb";
import Search from "./components/Search";
import UserLogin from "./components/UserLogin"
import Footer from "./components/Footer"
import Cart from "./components/Cart"
import Logout from "./components/Logout"
import { GlobalContext } from './store';
import { restaurantlist } from './store/action/action';
import { useToast } from './hooks/useToast';
import {is_authenticated} from './store/action/action'
import DarkTheme from './components/DarkTheme'

function NavBar({state}){

  

/*

*/

  return (
    <div className='navbar col-12'>
      <div className='navleft col-6'>
        <DarkTheme/>
        <Link className='links'  to={`/`}>Home</Link>
        <Link className='links' to={`order`}>Order</Link>
      </div>
      <div className='navright col-3'>
        {(state.mobile==null)?(<UserLogin/>):(<Logout/>)}
        <Cart/>
        <Search/>
        <BreadCrumb/>
      </div>
  </div>

  )
}





function App() {

  const {authState,authDispatch} =useContext(GlobalContext)
  const {listRestaurantState,listRestaurantDispatch} =useContext(GlobalContext)

  const toast = useToast()

  const theme = localStorage.getItem('theme')
   console.log(theme)


  const [restaurantMenu, setRestaurantMenu] = useState([])
  const globalData = useContext(GlobalContext)
  console.log(globalData)


  async function fetchData(){

    try{

      const URL = `${process.env.REACT_APP_API_URL}/api/csrf/`
      const response = await fetch(URL, {
        credentials: 'include',
      });

        let data = await response.json();
      console.log(data)
    }catch(err){
      console.log(err)
    }
}
  useEffect(() => {
    fetchData();
    const authenticated_action = is_authenticated(authDispatch)
    authenticated_action()
    const getRestaurantListAction = restaurantlist(listRestaurantDispatch)
    getRestaurantListAction()
  },[])
  /*    
    */

  return (
    <>
    <NavBar state={authState}/>
    <Outlet/>
    <Footer/>
    </>
  );
}


 


export default App;
