import React,{ createContext, useReducer } from "react";
import {authReducer, registerReducer, listRestaurantReducer, restaurantDataReducer, reservationDataReducer,staffAuthReducer} from './reducers/reducers'

const initialAuthState = {
    mobile: null,
    name: null,
    loading:false,
    error: null,
}

const initialregisterState = {
    loading: false,
    success: false,
    error: false,
}

const initialRestuarantListState = {
    restaurantlist: [],
}

const initialRestaurantDataState = {
    restaurant: null,
    id: null,
    menu:[],
}

const initialReservationDataState = {
    date: null,
    slot: null,
    guests: 0,
    reservation_at:null,
    myreservations:[],
}
// ------------------------------------------------ Staff Code -------------------------------------------------------------- //

const initialStaffAuthState = {
    user: null,
    restaurant_id: null,
    staff_of_restaurant: null,
    available_menu: [],
    todays_orders: [],
    bill_data:[],

}

const theme = {
    theme: '',
}


export const GlobalContext = createContext(initialAuthState)

const GlobalProvider = ({children}) => {
    const [authState, authDispatch] = useReducer(authReducer, initialAuthState)
    const [registerState,registerDispatch] = useReducer(registerReducer, initialregisterState)
    const [listRestaurantState,listRestaurantDispatch] = useReducer(listRestaurantReducer, initialRestuarantListState)
    const [restaurantDataState,restaurantDataDispatch] = useReducer(restaurantDataReducer, initialRestaurantDataState)
    const [reservationDataState, reservationDataDispatch] = useReducer(reservationDataReducer, initialReservationDataState)
    const [staffAuthState, staffAuthDispatch] = useReducer(staffAuthReducer, initialStaffAuthState)

    return <GlobalContext.Provider value={{
        authState: authState,
        authDispatch: authDispatch,
        registerState:registerState,
        registerDispatch:registerDispatch,
        listRestaurantState:listRestaurantState,
        listRestaurantDispatch:listRestaurantDispatch,
        restaurantDataState:restaurantDataState,
        restaurantDataDispatch:restaurantDataDispatch,
        reservationDataState:reservationDataState,
        reservationDataDispatch:reservationDataDispatch,
        staffAuthState: staffAuthState,
        staffAuthDispatch:staffAuthDispatch,

    }}>
        {children}
    </GlobalContext.Provider>
}

export default GlobalProvider;