import React from 'react';
import SidePanel from "./SidePanel";


function BreadCrumb(){

  //let [visibility, setvisibility] = useState("hidden")
  function toggleShow(){
    document.querySelector(".sidepanel-background").style.visibility = "visible";

  }
  

  return (
    <>
      <div className='maticon'id="breadcrumb">
        <a  onClick={() => toggleShow()}> <i className="material-icons">menu</i></a>
      </div>
      <SidePanel/>

    </>


  )
}


 


export default BreadCrumb;
