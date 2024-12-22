import React, {useRef,useEffect, useState} from 'react'
import { useToast } from '../hooks/useToast'

const ToastTypes = {
    success: {
        icon: 'check',
        iconClass:'success-icon',
        progressBarClass: "success",
    },
    warning: {
        icon: 'warning',
        iconClass:'warning-icon',
        progressBarClass: "warning",
    },
    info: {
        icon: 'info',
        iconClass:'info-icon',
        progressBarClass: "info",
    },
    error: {
        icon: 'report',
        iconClass:'error-icon',
        progressBarClass: "error",
    },
}

function Toast({id, type,message}){


    const toast = useToast()
    const {icon, iconClass,progressBarClass} = ToastTypes[type]

    const timerID = useRef(null)
    const [dismissed, setDismissed] = useState(false)
    const progressRef = useRef(null)




    const handleToastClose = () => {
        setDismissed(true)
        setTimeout(() => {
            toast.remove(id);
          }, 400); 
    }

    const handleMouseEnter = () =>{
        clearTimeout(timerID.current);
        progressRef.current.style.animationPlayState = "paused";
    }

    const handleMouseLeave = () => {
        const remainingTime =
        (progressRef.current.offsetWidth /
          progressRef.current.parentElement.offsetWidth) *
        4000;
  
      progressRef.current.style.animationPlayState = "running";
  
      timerID.current = setTimeout(() => {
        handleToastClose();
      }, remainingTime);
    }

    useEffect(() => {
        timerID.current = setTimeout(() => {
            handleToastClose();
        },4000);

        return () => {
            clearTimeout(timerID.current)
        }
    },[])


    return (
        <div className={`toasts ${dismissed?"toasts-dismissed":""}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <div className='toast-body-top'>
                <div className='toast-body-top-left'>
                    <div className={iconClass}><i className="material-icons">{icon}</i></div>
                    <p className="toast-msg">{message}</p>
                </div>
                <div className='toast-body-top-right'>
                    <i onClick={handleToastClose} className="material-icons dismiss-btn">close</i>
                </div>

            </div>
            <div className='toast-body-bottom'>
                <div className={`toast-progress ${progressBarClass}`}>
                        <div ref={progressRef} className={`toast-progress-bar ${progressBarClass}`}></div>
                </div>
            </div>
        </div>

    )
}

export default Toast;