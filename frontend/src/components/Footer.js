import React from "react";
function Footer(){

    return(
        <div className="Footer col-12">
            <div className="Footer-top">
                <h5>Logo</h5>
            </div>
            <div className="Footer-mid col-12">
                <div className="Footer-mid-card col-4">
                    <h5 className="Footer-mid-elem">Our Story</h5>
                    <div className="Footer-mid-card-items">
                        <p className='links'>News</p>
                        <p className='links'>Coupons</p>
                        <p className='links'>Career</p>
                        <p className='links'>FAQ</p>
                        <p className='links'>Investor Relationship</p>
                        <p className='links'>Partnerships</p>
                    </div>
                </div>
                <div className="Footer-mid-card col-4">
                    <h5 className="Footer-mid-elem">Location</h5>
                    <div className="Footer-mid-card-items">
                        <p className='links'>Blog</p>
                        <p className='links'>What's here</p>
                        <p className='links'>Contact Us</p>
                        <p className='links'>Corporate Enquiry</p>
                        <p className='links'>Media Coverage</p>
                        <p className='links'>Nutrition Information</p>
                    </div>
                </div>
                <div className="Footer-mid-card col-4">
                    <div className="Footer-mid1-elem">Experience the vibrant atmosphere of our restaurants.<br/>Immerse yourself in the aroma of <br/>grilled delicacies.</div>
                </div>

            </div>
            <div className="Footer-bottom col-12">
                <div>©All Rights Reserved by <b>Our Restaurant</b></div>
            </div>
        </div>
    )
}
export default Footer;
