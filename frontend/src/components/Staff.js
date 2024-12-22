import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState , useEffect} from "react";
import { stafflogin } from "../store/action/action";
import {GlobalContext} from '../store'
import { useToast } from "../hooks/useToast";

function Staff(){

    const [inputValue, setInputValue] = useState({mobile:"",password:""})
    const [failedMsg, setFailedMsg] = useState("")
    const {staffAuthState,staffAuthDispatch} = useContext(GlobalContext)
    const toast = useToast()


    const navigate = useNavigate()


    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputValue({...inputValue,[name]: value})
    }


    const handleSubmit = async (e) => {

        e.preventDefault();
        const staffloginAction = stafflogin(staffAuthDispatch, toast);
        staffloginAction(inputValue)

        setInputValue({...staffAuthDispatch,mobile:"",password:""});
        navigate("dashboard/")


    }

    return(
        <>
        <Link to={'/'}>Home</Link>
        <div className="LoginModal col-4">
            <div className="LoginModal-top">
                <h5>Staff Login</h5>
            </div>
            <div className="LoginModal-mid">
                <p>Mobile Number</p>
                <form onSubmit={handleSubmit} className="LoginModal-mid">
                    <input type="text" name="mobile" value={inputValue.mobile} onChange={handleChange} placeholder="Enter you Number"></input>
                    <input type="password" name="password" value={inputValue.password} onChange={handleChange} placeholder="Enter Password" required></input>
                    <input type="submit" value="Submit"/>
                </form>

            </div>

        </div>

        </>


    );
}

export default Staff;