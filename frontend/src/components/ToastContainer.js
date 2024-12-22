import React from 'react';
import Toast from './Toast';

const ToastsContainer = ({toasts}) =>{
    console.log(toasts)
    const items = toasts.map((toast) => {
        return <Toast key={toast.id} {...toast}/>
    })
    return (
        <div className='toasts-container'>
            {items}
        </div>
    )
}

export default ToastsContainer