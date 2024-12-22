import React,{ useContext, useState} from "react";
import { Link } from "react-router-dom";
import { GlobalContext } from "../store";
import Cookies from "js-cookie";
import { login } from "../store/action/action";
import {useToast} from '../hooks/useToast'

function UserLoginModal({setLOS}){

    const [inputValue, setInputValue] = useState({mobile:"",password:""})
    const {authState,authDispatch} =useContext(GlobalContext)

    const toast = useToast()

    //const dispatch = useDispatch()

    /*useEffect(() => {
        //fetchData();
    }, []);*/
    
    function closeModal(){
            document.querySelector(".modalBackground").style.visibility = "hidden"
    }

    const handleChange = (e) => {
        const { name, value } = e.target;

        setInputValue({...inputValue,[name]: value})
    }

   

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loginAction = login(authDispatch, toast)
        await loginAction(inputValue)

        setInputValue({...inputValue,mobile:"",password:""})
        closeModal();


    }

    return(
        <div className={`LoginModal col-4`}>
            <div className="LoginModal-top">
                <h5>Login</h5>
                <a onClick={closeModal}><i className="material-icons">close</i></a>
            </div>
            <div className="LoginModal-mid">
                <p>Mobile Number</p>
                <form onSubmit={handleSubmit} className="LoginModal-mid">
                    <input type="text" name="mobile" value={inputValue.mobile} onChange={handleChange} placeholder="Enter you Number"></input>
                    <input type="password" name="password" value={inputValue.password} onChange={handleChange} placeholder="Enter Password" required></input>
                    <input type="submit" value="Submit"/>
                </form>

            </div>
            <div className="LoginModal-bottom">
                <p>Don't have an Account <Link className="links" onClick={() => setLOS("signup")} style={{textDecoration: 'none'}} >Sign Up</Link></p>
            </div>
        </div>

    );
}

export default UserLoginModal;