import { myreservations, reservations } from "../action/action";
import {
    LOGIN_FAIL,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGOUT,
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    REGISTER_REQUEST
  } from "../constants/constants";
  
  // Reducer function to handle login actions
export function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_REQUEST':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { ...state, loading: false, mobile: action.payload.mobile, name: action.payload.fullname };
    case 'LOGIN_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'LOGOUT':
      return { ...state, mobile: null, name: null};
    default:
      return state;
  }
}
  
export function registerReducer(state,action){
    // Reducer function to handle login actions
  switch (action.type) {
    case 'REGISTER_REQUEST':
      return { ...state, loading: true, error: null };
    case 'REGISTER_SUCCESS':
      return { ...state, loading: false, success: true };
    case 'REGISTER_FAILURE':
      return { ...state, loading: false, error: true, success: false };
    default:
      return state;
  }
}

export function listRestaurantReducer(state,action){
  switch(action.type){
    case 'GET_RESTAURANT_LIST_SUCCESS':
      return {...state, restaurantlist: action.payload}
    case 'GET_RESTAURANT_LIST_FAILED':
      return {...state, restaurantlist: []}

    default:
      return state
  }
}


export function restaurantDataReducer(state, action){
  switch(action.type){
    case 'GET_RESTAURANT_MENU_SUCCESS':
      return {...state, menu: action.payload}
    case 'GET_RESTAURANT_MENU_FAILURE':
      return {...state, menu: []}
    case 'SET_RESTAURANT':
        return {...state,restaurant: action.payload}
    case 'SET_RESTAURANT_ID':
      return {...state,id: action.payload}
    case 'ORDER_SUBMITTED':
      return {}
      default:
      return state
  }
}

export function reservationDataReducer(state, action){
  switch(action.type){
    case 'RESERVATION_SUCCESS':
      return {...state, date:null,slot:null,guests:0,reservation_at:null}
    case 'GET_RESERVATIONS_SUCCESS':
      return {...state,myreservations: action.payload}
    default:
    return state
  }
}

// ---------------------- Staff Logic Here ----------------------------//

export function staffAuthReducer(state, action){

  switch(action.type){
    case 'STAFF_AUTH_LOGIN_SUCCESS':
      return {...state, user: action.payload.user, staff_of_restaurant: action.payload.staff_of_restaurant,restaurant_id:action.payload.restaurant_id}

    case 'GET_RESTAURANT_MENU_SUCCESS':
      return {...state, available_menu: action.payload}

    case 'GET_RESTAURANT_ORDERS_SUCCESS':
      return {...state, todays_orders: action.payload}

    case "GET_BILL_DATA_SUCCESS":
      return {...state, bill_data: action.payload}

    case "STAFF_LOGOUT":
      return {...state, user: null, restaurant_id: null, staff_of_restaurant: null, available_menu:[],todays_orders:[],bill_data:[] }
    default:
      return state;
  }
}