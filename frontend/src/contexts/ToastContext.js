import { createContext, useContext, useReducer } from "react";
import ToastsContainer from "../components/ToastContainer";
const initialToastState = {
    toasts: [],
}

function toastReducer(state, action){

    switch(action.type){
        case 'ADD_TOAST':
            return {
                ...state,
                toasts: [...state.toasts,action.payload]
            }
        case 'DELETE_TOAST':
            const updatedToasts = state.toasts.filter((toast) => toast.id !== action.payload)

            return {...state,toasts: updatedToasts}
        default:
         throw new Error(`Unhandled Action Type : ${action.type}`)
    }
}


export const ToastContext = createContext()

export const ToastContextProvider = ({children}) => {

    const [toaststate, toastdispatch] = useReducer(toastReducer, initialToastState)
    const addToast = (type, message) => {
        const id = Math.floor(Math.random() * 10000000);
        toastdispatch({type:"ADD_TOAST", payload: {id, type, message}})
    }

    const success = (message) =>{
        console.log('zInsse the success')
        addToast('success', message);
    };

    const info = (message) =>{
        addToast('info', message);
    }
    const warning = (message) =>{
        addToast('warning', message);
    }
    const error = (message) =>{
        addToast('error', message);
    }

    const remove = (id) =>{
        toastdispatch({type:"DELETE_TOAST", payload: id})
    }

    const value = {success, info, warning, error, remove}
    return (
        <ToastContext.Provider value={value}>
            <ToastsContainer toasts={toaststate.toasts}/>
        {children}
        </ToastContext.Provider>
    )
}

