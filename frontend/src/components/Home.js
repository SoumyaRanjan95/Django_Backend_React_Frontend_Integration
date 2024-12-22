import React, { useRef, useEffect, useState, useContext } from 'react';
import DropDown from './DropDown';
import ReserveTable from './ReserveTable';
import { GlobalContext } from '../store';
import { useToast } from '../hooks/useToast';






function Home(){

    const [isOpen1, setIsOpen1] = useState(false);
    const ref1 = useRef();
    const {restaurantDataState, restaurantDataDispatch} = useContext(GlobalContext)
    const toast = useToast()
    const handleClick = (e) => {
        setIsOpen1(true);
    }

    const handleReserverTable = () => {
      if(restaurantDataState.restaurant == null){
        toast.warning("Choose a restaurant first ...")
      }else{
        document.querySelector('.reservetable-sidepanel-background').style.visibility = "visible"
      }
    }

    useEffect(()=>{

        const closeDropDown = (e) => {
          const contgt2 = ref1.current.contains(e.target);
          if(!contgt2){
            setIsOpen1(false)
          }
        };
    
        document.body.addEventListener('click',closeDropDown);
    
        return ()=> document.body.removeEventListener('click', closeDropDown)
      },[]);

    return (
      <div className='Home col-12'>
        <div className='search-resturants col-6'>
          <div ref={ref1} onClick={handleClick} className='search-resturant-dropdown'>
                <div className='search-resturant-dropdown-left'>
                <p>Select Restaurants</p>
                {restaurantDataState.restaurant == null?(<h4>Select Restaurant</h4>):(<h4>{restaurantDataState.restaurant}</h4>)} 
                </div>
                <div className='search-resturant-dropdown-right'>
                <i className="material-icons">keyboard_arrow_down</i>
                </div>
                {isOpen1?(<div className='search-resturant-dropdown-searchbar'><DropDown restaurant={restaurantDataState.restaurant} rId={restaurantDataState.id} /></div>):(<></>)}
          </div>
          <button onClick={handleReserverTable}>Reserve Table</button>
          <ReserveTable/>
        </div>
  
        <div className='services col-12'>
          <h2 className='col-12'>Services we Provide</h2>
             <div className='services-container col-12'>
                <img className='services-container-img' src=''/>
                <div className='services-container-elem services-container-elem-end col-6'>
                  <h4 className='services-container-elem-tags'>OUR RESTAURANT</h4>
                  <h2 className='services-container-elem-tags'> Dine Out With Us</h2>
                  <button onClick={handleReserverTable} className='services-container-elem-tags'> Reserve <i className="material-icons">arrow_forward</i>
                  </button>
  
                </div>
             </div>
  
             <div className='services-container col-12'>
                <div className='services-container-elem services-container-elem-start col-6'>
                  <h4 className='services-container-elem-tags'>OUR RESTAURANT</h4>
                  <h2 className='services-container-elem-tags'> Catering By <br/> Our Restaurant</h2>
                  <button className='services-container-elem-tags'>Enquiry <i className="material-icons">arrow_forward</i>
                  </button>
  
                </div>
                <img className='services-container-img' src=''/>
  
             </div>
  
          </div>
        </div>
    )
  }

  export default Home;