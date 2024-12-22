import React, { useContext } from "react";
import { GlobalContext } from "../store";
import { deletereservations } from "../store/action/action";
function Reservations({reservationslist,reserveationdispatch}){


    const {authState,authDispatch} = useContext(GlobalContext)
    let items = null;
    const handleReservationsClose = () => {
        document.querySelector('.reservations-background').style.visibility = 'hidden'
    }

    const handleDeleteReservation = (item) => {

       const deleteReservationAction =  deletereservations(reserveationdispatch)
       deleteReservationAction(item.reservation_token)

    }



    if(Array.isArray(reservationslist) && reservationslist.length !== 0){

        items = reservationslist.map((item) => {
            return (
                <div className="reservations-list-holder">
                    <div className="reservations-list-holder-left">
                        <div className="reservations-list-holder-left-top">
                            <h5>{item.reservation_at}</h5>
                            <p><b>{item.date}</b></p>
                            <p>Reservation Token: <i>{item.reservation_token}</i></p>
                        </div>
                        <div className="reservations-list-holder-left-bottom">
                            <p>Slot : {item.slot}</p>
                            <p>Guests: {item.guests}</p>
                        </div>
                    </div>
                    <div className="reservations-list-holder-right">
                        <i onClick={() => handleDeleteReservation(item)} class='material-icons delete'>delete</i>
                    </div>

                </div>
            )
        })

    }


    return(
        <>
        <div className="reservations-background">
            <div className="reservations col-6">
                <div className="reservations-head">
                    <h4>Our Restaurant</h4>
                    <i onClick={handleReservationsClose} className='material-icons'>close</i>
                </div>

                    {((authState.mobile==null)||(reservationslist.length==0))?(<>
                        <div className="reservations-body" style={{'display':"flex","flexDirection":"column","justifyContent":"center","alignItems":"center"}}>
                            No reservations
                        </div>
                    </>):(<>
                        <div className="reservations-body">
                            {items}
                        </div>
                    </>)}




            </div>

        </div>
        </>
    )
}

export default Reservations;