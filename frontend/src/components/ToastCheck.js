import React from "react";
import { useToast } from "../hooks/useToast";
function ToastCheck(){ 
    const toast = useToast();
    return (
        <div className="btn-container">

          <button
            className="success-btn"
            onClick={() => toast.success("Success toast notification")}
          >
            Success
          </button>
          <button
            className="info-btn"
            onClick={() => toast.info("Info toast notification")}
          >
            Info
          </button>
          <button
            className="warning-btn"
            onClick={() => toast.warning("Warning toast notification")}
          >
            Warning
          </button>
          <button
            className="error-btn"
            onClick={() => toast.error("Error toast notification")}
          >
            Error
          </button>
        </div>
  )}


export default ToastCheck;