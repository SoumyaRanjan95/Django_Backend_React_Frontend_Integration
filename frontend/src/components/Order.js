import React, { useContext, useEffect, useState } from "react";
import * as Data from "./Data";
import { GlobalContext } from "../store";
import { order } from "../store/action/action";
import {openModal} from "./UserLogin";
import { useToast } from "../hooks/useToast";

function Order(){

    const{restaurantDataState,restaurantDataDispatch}= useContext(GlobalContext)
    const{authState,authDispatch}=useContext(GlobalContext)
    const [tableNo, setTableNo] = useState('');
    const [reservationToken, setReservationToken] = useState('');
    const toast = useToast()

    console.log('Order-Component-rerendered')
    /*const RestMenu = Data.Menu.filter((item)=>{
        if(item.restaurant_id === rId){
            return true
        }else{
            return false
        }
    })*/

    console.log(restaurantDataState)
    const fillFalse = new Array(restaurantDataState.menu.length).fill(false)
    const fillZero = new Array(restaurantDataState.menu.length).fill(0)

    
    const [checkState, setCheckState] = useState(fillFalse)
    const [checkQuantity, setCheckQuantity] = useState(fillZero)
    const [price, setPrice] = useState(0)
console.log(fillFalse)
console.log(fillZero)
console.log(checkState)
console.log(checkQuantity)



    const [itemList, setItemList] = useState([])


    function findPostion(foodData,id){
        function getIndex(item){
            return item.id === id
        }
        return foodData.findIndex(getIndex,id)

    }

    useEffect(() =>{
        const totalPrice = checkState.reduce((acc, state, index) =>{
            if(state == true){
                return acc + (restaurantDataState.menu[index].price * checkQuantity[index])
            }
            return acc
        }, 0);

        setPrice(totalPrice)

    }, [checkState, checkQuantity, restaurantDataState])


    const handleCheckChange = (position,itm) => {

        const updatedCheck = checkState.map((item, index) => 
            index === position ? !item : item
        )
        const updatedQuantity = checkQuantity.map((item, index) =>{
            if(index == position){
                item = 0
                return item
            } 
            return item
        })
        setCheckState(updatedCheck)
        setCheckQuantity(updatedQuantity)
        const fltr = itemList.filter(item => {
            if(item.item === itm.name){
                return false
            }else{
                return true
            }
        })
       setItemList(fltr)

    }

    const handleQuantityChange = (e,position,itm) => {
        const updatedQuantity = checkQuantity.map((item, index) =>{
            if(index == position){
                item = e.target.value
                return item
            } 
            return item
        })

        setCheckQuantity(updatedQuantity)
        /*setItemList([...itemList,

        ])*/

        const itemdat =  {
            from_restaurant:restaurantDataState.id,
            menu_id: itm.id, //set this
            quantity:updatedQuantity[position],
            item_cancelled: false, //Restuarnat.Menu.price
        }
        setItemList( // Replace the state
            [ // with a new array
              ...itemList, // that contains all the old items
              itemdat // and one new item at the end
            ]
          );
    }
    const handleOrderSubmit = async(e) => {
        e.preventDefault();


        /*const hasReservation = Data.Reservations.filter((item) =>{
            if(item.reservation_token === reservationToken){
                return true
            }
        })*/

        if(authState.mobile !== null){
            const orders = {
                from_restaurant: restaurantDataState.id,
                reservation_token: reservationToken,
                table_no: tableNo,
                processed:false,
                items_ordered:[]
            }
            if(itemList.length !== 0){

                orders['items_ordered'] = itemList

                console.log(orders)
                //console.log(JSON.stringify(order))

                const orderAction = order(toast)
                orderAction(orders)

            }else{
                toast.warning('You didnt enter items')
            }

        }else{
            toast.error("You are not logged in..")
            openModal()
        }
        setTableNo('')
        setReservationToken('')
        setCheckState(new Array(restaurantDataState.menu.length).fill(false))
        setCheckQuantity(new Array(restaurantDataState.menu.length).fill(0))
        setItemList([])

    }



    function MenuElem({item,position,id, name, price, vegOrNonVeg, info, available}){
        let i = position;
        return (
            <>
                {available?(<>

                    <div className="menu-element">
                    <label for='input-elem'>{name}</label>
                    <div className="menu-element-items">
                        <span className={vegOrNonVeg}></span>
                        <span>&#x20B9;{price}</span>
                        <input
                         id={`checkbox-${i}`}
                         type="checkbox"
                         name={"item"}
                         checked={checkState[i]}
                         onChange={() => handleCheckChange(i,item)}
                         value={name}
                         />
                         <input  disabled={!checkState[i]?'disabled':''} type="number" id={`input-number-${i}`} name={"quantity"} min={0} onChange={(e) => handleQuantityChange(e,i, item)} value={checkQuantity[i]}/>
                    </div>

                </div>
                
                </>):(<>
                    
                    <del>
                    <div className="menu-element">
                    <label for='input-elem'>{name}</label>
                    <div className="menu-element-items">
                        <span className={vegOrNonVeg}></span>
                        <span>&#x20B9;{price}</span>
                        <input
                         id={`checkbox-${i}`}
                         type="checkbox"
                         name={"item"}
                         checked={checkState[i]}
                         onChange={() => handleCheckChange(i,item)}
                         disabled
                         value={name}
                         />
                         <input  disabled={'disabled'} type="number" id={`input-number-${i}`} name={"quantity"} min={0} onChange={(e) => handleQuantityChange(e,i, item)} value={checkQuantity[i]}/>
                         </div>

                </div>
                    </del>

                </>)}

                
            </>
        )
    }

    function ItemContainer({type}){
        const filtered = restaurantDataState.menu.map((item) => {
            let position=findPostion(restaurantDataState.menu,item.id)
            if(item.type === type){
                return <MenuElem item={item} position={position} id={item.id} name={item.name} price={item.price} vegOrNonVeg={item.vegOrNonVeg} info={item.info} available={item.available}/>
            }
            
        })
        return (
            <>
                <h5>{type}</h5>
                {filtered}
            </>

        )
    }

    function round(num, decimalPlaces = 0) {
        num = Math.round(num + "e" + decimalPlaces);
        return Number(num + "e" + -decimalPlaces);
    }
    function netPrice(price){

        return price + (price * (10/100))
    }

    return(<>

        {restaurantDataState.restaurant !== null?(
        <div className="menu col-12">
            <header className="menu-header">
                <h4> {restaurantDataState.restaurant}</h4>
            </header>
                <form onSubmit={handleOrderSubmit}>
                    <div className="form-input">
                    <input  required className='placeorder-form' name="reservation_token" type="text" value={reservationToken} onChange={(e) => setReservationToken(e.target.value)} placeholder="Enter reservation Token..."/>
                    <input  required className='placeorder-form' name="table_no" type="text" value={tableNo} onChange={(e) => setTableNo(e.target.value)} placeholder="Enter table No..."/>
                    </div>

                <div className="menu-body">
                            <div className="container">
                                <ItemContainer type='starter'/>
                            </div>

                            <div className="container">
                                <ItemContainer type='bread'/>
                            </div>

                            <div className="container">
                                <ItemContainer type='biriyani'/>
                            </div>
                </div>

            <footer className="menu-footer">
                <div className="menu-footer-right">
                    <p>Total Price         : {price}</p>
                    <p>Service charge 10%  : {(price * (10/100)).toFixed(2)} </p>
                    <p>Net total           : {netPrice(price)}</p>
                </div>
                <div className="menu-footer-left">
                    <button type="submit" className="btn-order">Order</button>
                </div>
            </footer>
            </form>

        </div>
        ):(<div className="col-12" style={{'height':'250px','backgroundColor':'var(--bg-color)','color':'var(--color-foreground)','paddingTop':'200px','justifyItems':"center",'textAlign':'center'}}><p style={{'fontSize':'19px','fontWeight':'800'}}>Please Select a Restaurant ...</p></div>)}
        </>
    )
}
export default Order