import React, {useContext, useState} from 'react';
import * as Data from './Data'
import {setrestaurantdata } from '../store/action/action';
import { GlobalContext } from '../store';
function DropDown({restaurant, rId}){

    const [filterText, setFilterText] = useState("") 
    const {listRestaurantState ,listRestaurantDispatch} =useContext(GlobalContext)
    const {restaurantDataState ,restaurantDataDispatch} =useContext(GlobalContext)
    const [lists, setLists] = useState(listRestaurantState.restaurantlist)


    /*const lists= [
        {city:  "Banglore", restaurant: ["IndiraNagar","Lido Mall","IndiraNagar","IndiraNagar","IndiraNagar"]},
        {city:  "Mumbai", restaurant: ["IndiraNagar", "Ido","IndiraNagar","IndiraNagar","IndiraNagar"]},
        {city:  "Delhi", restaurant: ["IndiraNagar", "IndiraNagar","IndiraNagar","IndiraNagar","IndiraNagar"]},
        {city:  "Kolkata", restaurant: ["IndiraNagar", "IndiraNagar","IndiraNagar","IndiraNagar","IndiraNagar"]},
        {city:  "Pune", restaurant: ["IndiraNagar", "IndiraNagar","IndiraNagar","IndiraNagar","IndiraNagar"]},
        {city:  "GuruGram", restaurant: ["IndiraNagar", "IndiraNagar","IndiraNagar","IndiraNagar","IndiraNagar"]},
    
    ]*/



console.log(restaurantDataState)



    

    function SearchBar({filterText, onFilterTextChange}){   
        
        const handleChange = (e) =>{
            setFilterText(e.target.value)
        }


        return(
            <input className="dropdown-search"
                   type="text"
                   placeholder="Search..."
                   autoFocus="autoFocus"
                   value={filterText}
                   onChange={handleChange}/>


        )
    }

    function DropDownList({lists,filterText,resturant,setResturant}){


        const handleSetRestaurant = (item) => {

            restaurantDataDispatch({type:'SET_RESTAURANT',payload: item.restaurant})
            restaurantDataDispatch({type:'SET_RESTAURANT_ID', payload: item.id})

            const restaurantdataAction = setrestaurantdata(restaurantDataDispatch)
            restaurantdataAction(item.id)
            
        }

        let filtered = lists.filter((item) => {
            if(item.restaurant.toLowerCase().includes(filterText.toLowerCase()) || item.city.toLowerCase().includes(filterText.toLowerCase())){
                return item
            }
        })

        let items = filtered.map((item) => {
            return <a key={item.id} onClick={()=> handleSetRestaurant(item)}><p className='resturants'>{item.restaurant}</p></a>
        })

        /*function CityResturantHolder({items}){

        }*/ //use javascript reduce to see if things work


        return(
            <div className="dropdown-restaurant-list" id="restaurants-list">
                {items.length?items:<p>No results found</p>}
            </div>
        )
    }



    return(
        <>
        <div className="dropdown ">
            <SearchBar
                filterText={filterText}
                onFilterTextChange={setFilterText}
            />
            <DropDownList
                lists={lists}
                filterText={filterText}
                restaurant = {restaurant}
            />
        </div>
        </>
    )
}
export default DropDown