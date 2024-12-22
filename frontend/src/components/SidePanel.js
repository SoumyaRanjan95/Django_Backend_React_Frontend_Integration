import React from "react";

function SidePanel(){

    function toggleClose(){
        document.querySelector(".sidepanel-background").style.visibility = "hidden";


    }



    return (
        <div className="sidepanel-background">

            <div className="sidepanel col-12">

                <div className="sidepanel-head">
                    <h1>Logo</h1>
                    <a id="sidepanel-head-clsbtn" onClick={toggleClose}>×</a>
                </div>

                <div className="sidepanel-body">
                    <div className="sidepanel-body-container">
                        <h3>Our Restaurant</h3>
                        <div className="sidepanel-body-options">
                            <p className="links">Home</p>
                            <p className="links">Delivery/Takeaway</p>
                            <p className="links">Happiness Card</p>
                            <p className="links">What's here</p>
                            <p className="links">Today's Menu</p>
                            <p className="links">Catering</p>
                        </div>
                    </div>

                    <div className="sidepanel-body-container">
                        <h3>About</h3>
                        <div className="sidepanel-body-options">
                            <p className="links">About Us</p>
                            <p className="links">Smiles</p>
                            <p className="links">Nutrition Information</p>
                            <p className="links">Blog</p>
                            <p className="links">News</p>
                        </div>
                    </div>

                    <div className="sidepanel-body-container">
                        <h3>Others</h3>
                        <div className="sidepanel-body-options">
                            <p className="links">Contact Us</p>
                            <p className="links">Corporate Enquiry</p>
                            <p className="links">Investor Relations</p>
                            <p className="links">FAQ</p>
                            <p className="links">Media Coverage</p>
                            <p className="links">Our Restaurant Partnership</p>
                        </div>
                    </div>
                </div>

            </div>

        </div>
   
  
    )
  }
  
  
   
  
  
  export default SidePanel;
  