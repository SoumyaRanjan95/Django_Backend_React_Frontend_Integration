import React, { useContext, useState , useRef, useEffect} from "react"
import { reservetable } from "../store/action/action";
import { GlobalContext } from "../store";
import { useToast } from "../hooks/useToast";
function ReserveTable(){

    const [isDisabled,setDisabled] = useState()
    const {reservationDataState,reservationDataDispatch}= useContext(GlobalContext)
    const {authState,authDispatch}= useContext(GlobalContext)
    const {restaurantDataState,restaurantDataDispatch} = useContext(GlobalContext)
    const toast = useToast()


    let btn_id = 0;

    const handleReserverTableClose = () => {
        document.querySelector('.reservetable-sidepanel-background').style.visibility = "hidden"
    }

    function handleOpenLogin(){
        //setIsVisible("visible")
        document.querySelector(".modalBackground").style.visibility = "visible"    
      }



    //const user = useSelector(state => state.authenticate)

    const [dateState, setdateState] = useState('')
    const [slotState, setslotState] = useState('')
    const [guest, setGuest] = useState(0)

    const ref = useRef();

    const [clicked, setClicked] = useState(false)


    


    // program to generate random strings


    let dateData = []
    let Month = ["Jan", "Feb", "Mar", "Apr","May","Jun","Jul","Aug","Sept", "Oct", "Nov", "Dec"]
    let timelist = ["12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30","18:00","18:30","19:00","19:30","20:00"]

    let dateobj = new Date()
    for(let i=0;i<=30;i++){
        dateobj.setDate(dateobj.getDate() + 1);
        dateData.push({id: i,month: Month[dateobj.getMonth()], day: dateobj.getDate(), iso: dateobj.toISOString().split('T')[0]})
    }

    const handleGuest = () => {
        if(guest <= 0){
            setGuest(0)
        }else{
            setGuest(guest-1)
        }
    }

    function handleDate(e, item){
        let id = e.target.id;
        document.querySelector(".reservetable-sidepanel-mid-date").childNodes.forEach(item => {
            item.style.backgroundColor = "whitesmoke";
            item.style.color = 'black';
        });
        document.getElementById(e.target.id).style.backgroundColor = "rgb(244, 197, 166)";
        document.getElementById(e.target.id).style.color = "white";
        setdateState(item.iso)



    }

    function handleSlot(e,time){
        let id = e.target.id;
        document.querySelector(".reservetable-sidepanel-mid-slot").childNodes.forEach(item => {
            item.style.backgroundColor = "whitesmoke"
            item.style.color = 'black';

        });
        document.getElementById(e.target.id).style.backgroundColor = "rgb(244, 197, 166)";
        document.getElementById(e.target.id).style.color = "white";


        setslotState(time)
    }

    /*async function funcreserve(){

        try{
            const URL = "http://localhost:8001/api/reservations/"
            let response = await fetch(URL,{
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify()
              });
    
              let data = await response.json();
              //setUser({...user,user:data["data"]["username"], isLogged: true, reservations:data["data"]["reservations"]})
        }catch{

        }
    }*/

    const handleReserve = () => {

        const reservation_data = {
            date: dateState,
            slot: slotState,
            guests: guest,
            reservation_at:restaurantDataState.id,
        }   

        console.log("This is the reservation Data", reservation_data)
           if(authState.mobile != null){
                const reservationAction = reservetable(reservationDataDispatch, toast)
                reservationAction(reservation_data)
                handleReserverTableClose()
            }else{
                toast.info('You are not Logged In')
                handleReserverTableClose();
                handleOpenLogin();
            }

        

    }


    /*if(dateState !== '' && slotState !=='' && guest !== 0){
        document.querySelector('.reserve-btn').disabled = false
    }*/




    return(
        <div className="reservetable-sidepanel-background">

            <div className="reservetable-sidepanel col-4">
                <div className="reservetable-sidepanel-top">
                    <h4>Reservation</h4>
                    <i onClick={handleReserverTableClose} id="reservetable-sidepanel-head-clsbtn">×</i>
                </div>

                <div className="reservetable-sidepanel-mid">
                    <h4>Dining at {restaurantDataState.restaurant}</h4>
                    <div className="reservetable-sidepanel-mid-dining">
                        <button><i className='material-icons'>widgets</i><p>Amenities</p></button>
                        <button><i className='material-icons'>menu_book</i><p>Menu</p></button>
                    </div>
                    <h4>Select Date</h4>
                    <div className="reservetable-sidepanel-mid-date">

                        {dateData.map((item) => {
                                btn_id = btn_id + 1;
                                return <button key={btn_id} id={btn_id} onClick={(e) => handleDate(e, item)} >{item.month} <b>{item.day}</b></button>
                        })}

                    </div>
                    <h4>Select Slot</h4>

                    <div className="reservetable-sidepanel-mid-slot">
                    {timelist.map((time) => {
                                return <button key={time} id={time} className="btn-slot" onClick={(e) => handleSlot(e,time)}>{time}</button>
                        })}
                    </div>

                    <h4>Select Guest</h4>

                    <div className="reservetable-sidepanel-mid-guest">
                        <div className="inc-dec" onClick={handleGuest}>-</div>
                        {guest > 0 ?(<div>{guest}</div>):(<div>0</div>)}
                        <div className="inc-dec" onClick={() => setGuest(guest + 1)}>+</div>

                    </div>
                    
                </div>

                <div className="reservetable-sidepanel-bottom">
                    {guest==0?(<>

                        <div className="reservetable-sidepanel-bottom-reserveguest">
                            <h4>Guests : {guest} </h4>
                        </div>
                        <button disabled className="reserve-btn-disabled" onClick={handleReserve}>Reserve</button>
                        
                    </>):(<>

                        <div className="reservetable-sidepanel-bottom-reserveguest">
                            <h4>Guests : {guest} </h4>
                        </div>
                        <button className="reserve-btn" onClick={() => handleReserve()}>Reserve</button>
                        
                    </>)}



                </div>
                

            </div>

        </div>
    )

} 

export default ReserveTable