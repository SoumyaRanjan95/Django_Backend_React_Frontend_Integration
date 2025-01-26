import React, { useEffect, useState } from "react";
import  {useNavigate } from 'react-router-dom'
import { stafflogout, processorders } from "../store/action/action";
import { GlobalContext } from "../store";
import { useContext } from "react";
import {getrestaurantmenu,getrestaurantorders,updaterestaurantmenu, getbill, processbill} from '../store/action/action'
import { useToast } from "../hooks/useToast";
import { staff_is_authenticated } from "../store/action/action";

function StaffDashboard(){

    const {staffAuthState,staffAuthDispatch} = useContext(GlobalContext)
        
    const navigate = useNavigate()



    /*const foodData = Data.Menu
    const BillData = Data.BillData
    const orderData = Data.orderData*/

    const [show, setShow] = useState('menu')
    const [showBill, setShowBill] = useState(false)
    const [refVal, setRefVal] = useState('')
    const toast = useToast()

    useEffect(() => {
        const staff_auth_action = staff_is_authenticated(staffAuthDispatch)
        staff_auth_action()
    },[])




    const handleShowMenu = () => {
        setShow('menu')
        const getrestaurantmenuAction = getrestaurantmenu(staffAuthDispatch)
        getrestaurantmenuAction()

    }

    const handleTodaysOrder = () => {

        setShow('orders')
        const getrestaurantordersAction = getrestaurantorders(staffAuthDispatch)
        getrestaurantordersAction()
    }

    const handleGetBill = () => {
        setShow('bill')
        getbill(staffAuthDispatch);

    }

    const handleProcessBill = async (order_id) =>{
        processbill(order_id)
       
        //setShowBill(false)
        

    }

    const handleLogout = async () => {
        const logoutAction = stafflogout(staffAuthDispatch)
        logoutAction();
        navigate('/staff/')
        
    }


    function UpdateAvailableMenu(){



    
        const foodData = staffAuthState.available_menu

        const foodDataAvailableFill = foodData.map((item => item.available))
    
        const [checkState, setCheckState] = useState(foodDataAvailableFill)
        const [foodDataState, setFoodDataState] = useState(foodData)



        const [menuVal, setMenuVal] = useState('')

        const handleCheckChange = (position) => {
            const updatedCheck = checkState.map((item, index) => 
                index === position ? !item : item
            )
            const updateFoodDataState = foodDataState.map((item,index) => {
                if(index === position){
                    item.available = !item.available
                }
            })
            setCheckState(updatedCheck)
    
    
        }

        const handleUpdateRestaurantMenu = (e) => {
            e.preventDefault()
            console.log(foodDataState)
            const updaterestaurantmenuAction = updaterestaurantmenu(staffAuthDispatch, toast)
            updaterestaurantmenuAction(foodDataState)


        }
    
    
    
        function MenuElem({id, name, price, vegOrNonVeg, available}){
            function returnPosition(item){
                return item.id === id
            }
            let i = foodDataState.findIndex(returnPosition)
            
            return (
                <>
                    {available?(<>
    
                        <div className="menu-element">
                        <label for='input-elem'>{name}</label>
                        <div className="menu-element-items">
                            <span className={vegOrNonVeg}></span>
                            <span>&#x20B9;{price}</span>
                            <input
                             id={`checkbox-${id}`}
                             type="checkbox"
                             name={"item"}
                             checked={checkState[i]}
                             onChange={() => handleCheckChange(i)}
                             value={name}
                             />
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
                             id={`checkbox-${id}`}
                             type="checkbox"
                             name={"item"}
                             checked={checkState[i]}
                             onChange={() => handleCheckChange(i)}
                             value={name}
                             />
                        </div>
    
                    </div>
                        </del>
    
                    </>)}
    
                    
                </>
            )
        }
    
                



            let filtered = foodDataState.filter((item) => {
                if(item.name.toLowerCase().includes(menuVal.toLowerCase()) ){
                    return item
                }
            })
    
            let items = filtered.map((item) => {
                return <MenuElem  id={item.id} name={item.name} price={item.price} vegOrNonVeg={item.vegOrNonVeg} info={item.info} available={item.available}/>
            })


        return (
            <>
            <input className="menu-items-container-forstaff-input" type="text" onChange={(e)=> setMenuVal(e.target.value)} value={menuVal} placeholder="Search Food Items"/>
             <div className="menu-items-container-forstaff">
                <div className="item-container">
                    {items.length !==0?items:<p>No Such Items</p>}
                </div>
            </div> 
            <button className="menu-items-container-forstaff-button" onClick={(e) => handleUpdateRestaurantMenu(e)}>Update</button>
            </>

        )
    }



    function LiveOrders(){

        
        const orderData = staffAuthState.todays_orders
        const orderArrayFill = orderData.map((item => item.processed))

        const [orderState,setOrderState] = useState(orderArrayFill)
        const [orderDataState,setOrdeDataState] = useState(orderData)

        console.log(orderDataState)

        const handleOrderProcess = (position, order_id) => {

            /*const process = orderState.map((item, index) => {
                if(index === position){
                    orderDataState[position].processed = !item
                }
            })*/
           const processOrdersAction = processorders(staffAuthDispatch)
            processOrdersAction(order_id)


        }

        function OrderFrame({item,position, processed}){


            function OrderTable({items_ordered}){

                const items = items_ordered.map((item) => {
                    return(<>
                        <tr>
                            <td>{item.menu}</td>
                            <td>{item.quantity}</td>
                        </tr>
                    </>)
                })

                return(
                    <table className="items-table">
                        <tr>
                            <th>Items</th>
                            <th>No.s</th>
                        </tr>
                        {items}
                    </table>
                )

            }

            return(<>
                {!processed?(<>
                    <div className="order-frame">
                        <div className="order-frame-left">
                        <p>Table No: {item.table_no}</p>
                        <p>{new Date(item.order_datetime).toDateString()}</p>
                        <p>Name: {item.username}</p>
                        <p>Mobile: {item.mobile}</p>


                        </div>
                        <OrderTable items_ordered={item.items_ordered}/>
                        <div className="order-frame-right">
                            <button onClick={() => handleOrderProcess(position, item.order_id)}>Process</button>
                        </div>
                    </div>
                </>):(<>
                    <del>
                    <div className="order-frame">
                        <div className="order-frame-left">
                            <p>Table No: {item.table_no}</p>
                            <p>{new Date(item.order_datetime).toDateString()}</p>
                            <p>Name: {item.username}</p>
                            <p>Mobile: {item.mobile}</p>

                        </div>
                        <OrderTable items_ordered={item.items_ordered}/>
                        <div className="order-frame-right">
                            <button disabled onClick={() => handleOrderProcess(position, item.order_id)}>Process</button>
                        </div>
                    </div>
                    </del>
                </>)}
            </>)
        }

        let orders = orderDataState.map((item, index) =>{
            let i = index
            return(<OrderFrame item={item} position={i} processed={item.processed}/>)
        })


        return(
            <div className="menu-items-container-forstaff">
                <div className="item-container">
                    {orders.length!==0?orders:(<p> No Orders Present</p>)}
                </div>
            </div> 
        )
    }


    function printDiv(divName){

        window.print();
    }
    function GenerateBill(){

        const bills = staffAuthState.bill_data

        const filtered = bills.filter((item) => {
            if(item.mobile.includes(refVal)){
                return item
            }
        })

        const items = filtered.map((item) => {

            return (<>

                <div className="reservations-list-holder order-details">
                    <div className="reservations-list-holder-left">
                        <div className="reservations-list-holder-left-top">
                            <h5>{item.user}</h5>
                            <p><b>{item.mobile}</b></p>
                            <p>Reservation Token: <i>{item.reservation_token}</i></p>
                        </div>
                        <div className="reservations-list-holder-left-bottom">
                            <p>Order : <i>{item.order_id}</i></p>
                            <p>Processed: <b>{`${item.processed}`}</b></p>
                        </div>
                    </div>
                    <div className="reservations-list-holder-right">
                        {!item.processed ? (<>
                            <button className="reservations-list-holder-right-process-btn" onClick={() => handleProcessBill(item.order_id)}>Process</button>

                        </>):(<>
                            <button disabled className="reservations-list-holder-right-process-btn">Process</button>

                        </>)}
                    </div>
                </div>

            </>)
        })


        return(
            <>
            <div className="bill-dashboard">
            <div className="bill-dashboard-form">
                    <input type='text' name="ref_no" autoFocus value={refVal} onChange={(e) => setRefVal(e.target.value)} placeholder="Enter the Mobile Number to Search ..."/>
            </div>
            <div className="bill-dashboard-screen">

            {!showBill?(<>
                        {items.length!==0?(<>{items}</>):(<p>No items found...</p>)}
                    </>
                ):(<p>Enter the correct reservation token ...</p>)}
            </div>

            </div>

            </>
        )
    }







    function chooseDisplay(name){
        if(name == 'bill'){
            return <GenerateBill/>
        }
        if(name == 'orders'){
            return <LiveOrders/>
        }
        return <></>
    }




    return (

        <>
        {(staffAuthState.user !== null)?(<>
        <div className="dashboard-top col-12">
        <h4 className="staff_of_restaurant_top">{staffAuthState.staff_of_restaurant}</h4>
            <p><b>{new Date().toDateString()}</b></p>
        </div>
            <div className="dashboard col-12">
            <div className="dashboard-left">
                <button onClick={() => handleShowMenu()}>Available Menu</button>
                <button onClick={() => handleTodaysOrder()}>Today's Orders</button>
                <button onClick={() => handleGetBill()}>Process Bill</button>
                <button onClick={() => handleLogout()}>Logout</button>
            </div>
            <div className="dashboard-right">
                <div className="dashboard-right-container">
                {show == 'menu'?(<UpdateAvailableMenu/>):(chooseDisplay(show))}
                </div>
            </div>
        </div>

        </>):(<>
            <p>The Page Does Not Exists...</p>
        </>)}
        </>


    )

}

export default StaffDashboard;
