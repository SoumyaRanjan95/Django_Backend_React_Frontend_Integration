import React,{useContext } from "react";
import { GlobalContext } from "../store";
import { myreservations } from "../store/action/action";
import Reservations from "./Reservations"

function Cart(){
    const {authState,authDispatch} = useContext(GlobalContext)
    const {reservationDataState,reservationDataDispatch} = useContext(GlobalContext)
    function toggleShow(){
        document.querySelector(".reservations-background").style.visibility = "visible";
        const reservationsAction = myreservations(reservationDataDispatch)
        reservationsAction();
    }



    return(
        <>
        <div className="cart maticon">
            <i onClick={toggleShow} className="material-icons">event_seat</i>
        </div>
        <Reservations reservationslist = {reservationDataState.myreservations} reserveationdispatch={reservationDataDispatch}/>
        </>

    );
}

export default Cart;