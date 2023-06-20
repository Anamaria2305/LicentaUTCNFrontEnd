import AdminNav from "../navbars/AdminNav";
import React from "react";
import ClientNav from "../navbars/ClientNav";
import clientCar from "./pozaMasina.jpg";
const Home = () => {

    const role = localStorage.getItem("role");
    return (
        <div>
            {role === 'Admin' ? <AdminNav/> : <ClientNav/>}
            <h2 style={{marginLeft:"105px",paddingTop:"20px"}}>Welcome to our website!</h2>
            <div>
            <img style={{float:"right",marginRight:"20px"}} src={clientCar} alt="Client's car" />
            </div>
            <div style={{marginLeft:"55px",width:"600px",marginTop:"30px"}}>
                {role === 'Admin' && (
                    <div>
                    <div>
                        As an admin, you play a crucial role in managing and overseeing various aspects of our platform. 
                        With your expertise and administrative capabilities, you have the power to ensure smooth operations and 
                        maintain user satisfaction.
                    </div>
                    <div><br></br>
                        <b>You can do the following operations:</b><br></br><br></br>
                        <b>1. You can schedule the electric vehicles in our programme for charge/ discharge for tomorrow.
                        </b><br></br><br></br>Don't forget to press finalize if you are content with the scheduling, in this way our users will be notified
                        of their scheduling for the next day.<br></br><br></br>
                        <b>2. You can test different scenarios in the experiment section.<br></br>
                        </b><br></br>You are not bound by database data. You can choose just the configuration parameters, and the data will be generated randomly
                        and you will be able to save it.
                        <br></br><br></br>or<br></br><br></br> You can upload your own csv containtaining data.But be careful! You must give the csv in the same format as
                        we give them to you when you save it, so maybe it's better if you first take a look there.
                    </div>
                    </div>
                )}
            </div>
            <div>
                {role === 'Client' && (
                    <div style={{marginLeft:"55px",width:"600px",marginTop:"30px"}}>
                        <div>
                        Thank you for choosing our Electric Vehicle Charge Scheduling Platform! We are thrilled to have you as our valued client in the realm of sustainable transportation. Our platform is designed to revolutionize the way you manage and optimize the charging of your electric vehicle.
                       </div>
                       <div><br></br>
                        <b>You can do the following operations:</b><br></br><br></br>
                        <b>1. You can view and edit your profile.
                        </b><br></br><br></br>
                        You can change your e-mail, password or telephone number.
                        <br></br><br></br>
                        <b>2. You can add your electric vehicle in the programme if you did not do it already or edit it if you did.<br></br>
                        </b><br></br>You are able to choose your favourite charging station and we will do our best to schedule you there.<br></br><br></br>
                        Also, you can choose the time window in which you are available and also to tell us how to prioritize these two: your time and your favourite 
                        location.<br></br><br></br>
                        <b>3. Don't forget to check your notifications daily, after 8 P.M. to see your scheduling for tomorrow.
                        </b><br></br><br></br>
                        We try to send you notifications everyday around the same time to let you know as soon as possible what the scheduling for tomorrow is.
                    </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;