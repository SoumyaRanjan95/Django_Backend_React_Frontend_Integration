import React, { useContext } from "react";
import { GlobalContext } from "../store";
import { logout } from "../store/action/action";
import { useToast } from "../hooks/useToast";

function Logout(){

    const {authState,authDispatch} =useContext(GlobalContext)
    const toast = useToast()


    const handleLogout = () => {
        //dispatch(logoutUserThunk({})) 
        const logoutAction = logout(authDispatch, toast);
        logoutAction()

    }


    return (
        <div className='maticon' id="logout">
            <a  onClick={handleLogout}> <i class="material-icons">logout</i></a>
      </div>
    )

}

export default Logout