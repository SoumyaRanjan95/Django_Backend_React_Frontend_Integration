import React, { useRef, useEffect, useState, useContext } from "react";
import DropDown from "./DropDown";
import { GlobalContext } from "../store";


function Search(){

  const ref = useRef();
  const [isOpen, setIsOpen] = useState(false)
  const {restaurantDataState,restaurantDataDispatch} = useContext(GlobalContext)



  useEffect(()=>{

    const closeDropDown = (e) => {
      const contgt1 = ref.current.contains(e.target) 
      if(!contgt1){
        setIsOpen(false)
      }
    };

    document.body.addEventListener('click',closeDropDown);

    return ()=> document.body.removeEventListener('click', closeDropDown)
  },[]);
      //{isOpen?(<DropDown/>):(<></>)}

  
  return (
    <>
    <div onClick={() => setIsOpen(true)} ref={ref}  className="searchbar">
      <i className="material-icons">location_on</i>
      {restaurantDataState.restaurant == null?(<i className="searchbar-restname" >Select Restaurant</i>):(<i className="searchbar-restname">{restaurantDataState.restaurant.length < 10? restaurantDataState.restaurant: restaurantDataState.restaurant.slice(0,10)+"..."}</i>)} 
      <i className="material-icons">keyboard_arrow_down</i>
      {isOpen?(<DropDown restaurant={restaurantDataState.restaurant} rId={restaurantDataState.id}/>):(<></>)}
    </div>

    </>


  )
}


 


export default Search;
