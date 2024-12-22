import {
    LOGIN_FAIL,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGOUT
  } from "../constants/constants";
  import axios from "axios";
import Cookies from "js-cookie";

export const is_authenticated = (dispatch) => async () =>{
  try{
    const URL = `${process.env.REACT_APP_API_URL}/api/is_authenticated/`
    const response  = await fetch(URL,{
      method: 'GET',
      withCredentials: true,
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Token ${localStorage.getItem('token')}`, 
      },
    });
    const data = await response.json()
    if(data.is_authenticated){
      dispatch({type:"LOGIN_SUCCESS", payload: data})
    }
  }catch(error){
    console.log(error)
  }
}

export const login = (dispatch,toast) => async (credentials) => {
  try {
    dispatch({ type: 'LOGIN_REQUEST' });

    // Simulate an API call (replace with actual API call)
    const URL = `${process.env.REACT_APP_API_URL}/api/login/`
    const response = await fetch(URL,{
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              "X-CSRFToken": Cookies.get('csrftoken'), 
            },
            body: JSON.stringify(credentials)
          });
    let data = await response.json()
    console.log(data)
    localStorage.setItem("token", data.token); // This is a very unsecure format, convert to httponly-cookie later
    // Dont JSON.stringify the data token it adds additional "" to the token

    //const response = await fakeLoginAPI(credentials);

    if (data) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: data });
      toast.success('Successfully Logged In ...')
    } else {
      dispatch({ type: 'LOGIN_FAILURE', payload: response.error });

    }
  } catch (error) {
    dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
    toast.error('Login Failed ...')

  }
};
  

export const register = (dispatch, toast) => async (signUpData) => {
  try {
    dispatch({ type: 'REGISTER_REQUEST' });

    // Simulate an API call (replace with actual API call)
    const URL = `${process.env.REACT_APP_API_URL}/api/register/`
    const response = await fetch(URL,{
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              "X-CSRFToken": Cookies.get('csrftoken'), 
            },
            body: JSON.stringify(signUpData)
          });
    let data = await response.json()
    console.log(data)
    //const response = await fakeLoginAPI(credentials);

    if (data) {
      dispatch({ type: 'REGSITER_SUCCESS', payload: data });
      toast.success('Successfully Registered ...')
    } else {
      dispatch({ type: 'REGSITER_FAILURE', payload: response.error });
    }
  } catch (error) {
    dispatch({ type: 'REGSITER_FAILURE', payload: error.message });
    toast.success('Registration Failed ...')

  }
};
  

export const logout = (dispatch, toast) => async () =>{
  
  try{
    const URL = `${process.env.REACT_APP_API_URL}/api/logout/`
    await fetch(URL,{
      method: 'GET',
      withCredentials: true,
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Token ${localStorage.getItem('token')}`, 
      },
    });
    localStorage.removeItem('token')
    dispatch({type: "LOGOUT", payload: null})
    toast.success("Successfully Logged Out ...")
  }catch(error){
    console.log(error)
  }

}


export const restaurantlist = (dispatch) => async () => {

  try{
    const URL = `${process.env.REACT_APP_API_URL}/api/restaurants/`
    const response = await fetch(URL,{
      method: 'GET',
    });
    const data = await response.json();
    if(Array.isArray(data) && data.length!= 0){
      dispatch({type: "GET_RESTAURANT_LIST_SUCCESS", payload: data})
    }else{
      dispatch({type: "GET_RESTAURANT_LIST_FAILED", payload: [] })
    }
  }catch(error){
    console.log(error)
  }


}

export const setrestaurantdata = (dispatch) => async (id) => {

  try{
    const URL = `${process.env.REACT_APP_API_URL}/api/menu/${id}/`
    const response = await fetch(URL,{
      method: 'GET',
    });
    const data = await response.json();
      dispatch({type: "GET_RESTAURANT_MENU_SUCCESS", payload: data})

  }catch(error){
    console.log(error)
  }

}

export const order = (toast) => async (orders) =>{
  try{
    const URL = `${process.env.REACT_APP_API_URL}/api/orders/`
    const response = await fetch(URL,{
      method: 'POST',
      withCredentials: true,
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Token ${localStorage.getItem('token')}`, 
      },
      body: JSON.stringify(orders)
    });

    const data = await response.json()
    toast.success("Order Placed ...")
    console.log(data)
  }catch(error){
    console.log(error)
  }
}

export const reservetable = (dispatch, toast) => async (reservationData) => {

  try{
    console.log(reservationData)
    const URL = `${process.env.REACT_APP_API_URL}/api/reservations/`
    const response = await fetch(URL,{
      method: 'POST',
      withCredentials: true,
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Token ${localStorage.getItem('token')}`, 
      },
      body: JSON.stringify(reservationData)
    });

    const data = response.json()

    dispatch({type: 'RESERVATION_SUCCESS', payload: null})
    toast.success("Reservation successful ...")
  }catch(error){
    console.log(error)
  }


}

export const myreservations = (dispatch) => async () =>{

  try{
    const URL = `${process.env.REACT_APP_API_URL}/api/reservations/`
    const response = await fetch(URL,{
      method: 'GET',
      withCredentials: true,
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Token ${localStorage.getItem('token')}`, 
      },
    });
    const data = await response.json();
      dispatch({type: "GET_RESERVATIONS_SUCCESS", payload: data})

  }catch(error){
    console.log(error)
  }
}

export const deletereservations = (dispatch) => async (uuid) =>{


  try{
    const URL = `${process.env.REACT_APP_API_URL}/api/reservations/${uuid}/`
    const response = await fetch(URL,{
      method: 'DELETE',
      withCredentials: true,
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Token ${localStorage.getItem('token')}`, 
      },
    });
    if(response.status == 204){
      const reservationsAction = myreservations(dispatch)
      reservationsAction();
    }

  }catch(error){
    console.log(error)
  }
}


// ------------------------- Staff Actions --------------------------------------------------//


export const stafflogin = (dispatch, toast) => async (credentials) => {
  try {

    const URL = `${process.env.REACT_APP_API_URL}/api/staff_login/`
    const response = await fetch(URL,{
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              "X-CSRFToken": Cookies.get('csrftoken'), 
            },
            body: JSON.stringify(credentials)
          });
    let data = await response.json()
    console.log(data)
    localStorage.setItem("token", data.token); // This is a very unsecure format, convert to httponly-cookie later
    // Dont JSON.stringify the data token it adds additional "" to the token

    //const response = await fakeLoginAPI(credentials);

    if (data.token !== null) {
      dispatch({ type: 'STAFF_AUTH_LOGIN_SUCCESS', payload: data });
      toast.success("Successfully Logged In ...")
    } else {
      
    }
  } catch (error) {
    console.log(error)
  }
};


export const staff_is_authenticated = (dispatch) => async () =>{
  try{
    const URL = `${process.env.REACT_APP_API_URL}/api/staff_is_authenticated/`
    const response  = await fetch(URL,{
      method: 'GET',
      withCredentials: true,
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Token ${localStorage.getItem('token')}`, 
      },
    });
    const data = await response.json()
    if(data.is_authenticated){
      dispatch({type:"STAFF_AUTH_LOGIN_SUCCESS", payload: data})
    }
    
    console.log(data)
  }catch(error){
    console.log(error)
  }
}


export const stafflogout = (dispatch, toast) => async () =>{
  
  try{
    const URL = `${process.env.REACT_APP_API_URL}/api/logout/`
    await fetch(URL,{
      method: 'GET',
      withCredentials: true,
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Token ${localStorage.getItem('token')}`, 
      },
    });
    localStorage.removeItem('token')
    dispatch({type: "STAFF_LOGOUT"})
    toast.success("Successfully Logged Out ...")

  }catch(error){
    console.log(error)
  }

}


export const getrestaurantmenu = (dispatch) => async () => {
  try{
    const URL = `${process.env.REACT_APP_API_URL}/api/update/menu/`
    const response = await fetch(URL,{
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              "X-CSRFToken": Cookies.get('csrftoken'), 
              "Authorization": `Token ${localStorage.getItem('token')}`, 
            },
          });
    let data = await response.json()
    console.log(data)

    if (Array.isArray(data) && data.length !== 0) {
      dispatch({ type: 'GET_RESTAURANT_MENU_SUCCESS', payload: data });
    } else {
      
    }
  }catch(error){
    console.log(error)

  }
}

export const getrestaurantorders = (dispatch) => async () => {
  try{
    const URL = `${process.env.REACT_APP_API_URL}/api/process/orders/`
    const response = await fetch(URL,{
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              "X-CSRFToken": Cookies.get('csrftoken'), 
              "Authorization": `Token ${localStorage.getItem('token')}`, 
            },
          });
    let data = await response.json()
    console.log(data)

    if (Array.isArray(data) && data.length !== 0) {
      dispatch({ type: 'GET_RESTAURANT_ORDERS_SUCCESS', payload: data });
    } else {
      
    }
  }catch(error){
    console.log(error)

  }
}

export const processorders = (dispatch) => async (uuid) => {

  try{
    const URL = `${process.env.REACT_APP_API_URL}/api/process/orders/${uuid}/`
    const response = await fetch(URL,{
            method: 'PATCH',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              "X-CSRFToken": Cookies.get('csrftoken'), 
              "Authorization": `Token ${localStorage.getItem('token')}`, 
            },
            body: JSON.stringify({processed:true})
          });
    const status = response.status
    if(status == 200){
      const orderprocessAction = getrestaurantorders(dispatch)
      orderprocessAction()
    }
    console.log(status)
  }catch(error){
    console.log(error)

  }

}

export const updaterestaurantmenu = (dispatch) => async (menulist) => {
  try{
    const URL = `${process.env.REACT_APP_API_URL}/api/update/menu/`
    const response = await fetch(URL,{
            method: 'PATCH',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              "X-CSRFToken": Cookies.get('csrftoken'), 
              "Authorization": `Token ${localStorage.getItem('token')}`, 
            },
            body: JSON.stringify(menulist)
          });
    const status = response.status
    if(status == 200){
      const updatedRestaurantMenuAction = getrestaurantmenu(dispatch)
      updatedRestaurantMenuAction()
    }
    console.log(status)
  }catch(error){
    console.log(error)

  }
}


export const getbill = async (dispatch) => {

  try{
    const URL = `${process.env.REACT_APP_API_URL}/api/bills_list/`
    const response = await fetch(URL,{
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              "X-CSRFToken": Cookies.get('csrftoken'), 
              "Authorization": `Token ${localStorage.getItem('token')}`,
            },
          });
    const data = await response.json()
    console.log(data)

    if(Array.isArray(data) && data.length !==0){
      dispatch({type:"GET_BILL_DATA_SUCCESS", payload: data})
    }

  }catch(error){
    console.log(error)

  }

} 


export const processbill = async (order_id) => {
  try{
    const URL = `${process.env.REACT_APP_API_URL}/api/process_bills/${order_id}/`
    const response = await fetch(URL,{
            method: 'PATCH',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              "X-CSRFToken": Cookies.get('csrftoken'), 
              "Authorization": `Token ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({processed: true})
          });
    const data = await response.json()
    console.log(data)
  }catch{

  }
}