import ClientNav from "../../navbars/ClientNav";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';
import {toast, ToastContainer} from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Button, Form } from "react-bootstrap";
import { Card, Classes } from "@blueprintjs/core";
import "../../css/Login.css";
import { validate } from 'react-email-validator';
const Profile = () => {
    const [showPassword, setShowPassword] = useState(false);

    const username = localStorage.getItem('username')

    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [disbl, setDis] = useState(false);
    const [errorMessage, setMessage] = useState("");
    const [errorMessage2, setMessage2] = useState("");
    const [errorMessage3, setMessage3] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            // const { data } = await axios.get(`http://localhost:8000/api/users/${username}`);
            // console.log(data)
            // setUserName(data.username);
            // setEmail(data.email);
            // setPhone(data.phone);
            // setPassword(data.password);
        };
        fetchUser();
    }, [username]);

    const showSuccessToastMessageEditUser = (message) =>
        toast.info(message, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 3000
        });
    
    const showErrorToastMessageEditUser = (message) =>
        toast.error(message, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 3000
        });

    const handleUserEdit = async (e) => {
        e.preventDefault();
        try {
            const url = "http://localhost:8000/api/users";
            const data = {email, phone, password, username};
            await axios.put(url, data);
            localStorage.removeItem('username');
            localStorage.setItem('username', email);
            showSuccessToastMessageEditUser('User data has been added successfully! Page will be reloaded');
            setTimeout(() => {
                window.location.reload()
            }, 3005);
        } catch (error) {
            showErrorToastMessageEditUser( 'An error occurred')
        }
    }

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    const onChangeEmail = (e) => {
        var email = e.target.value
        if(!validate(email)){
         setMessage("E-mail invalid.")
         setDis(true)
        }
        else
        {setDis(false)
        setMessage("")}
      }
    
      const onChangePhone = (e) => {
        var nr = e.target.value
        let nrREG = new RegExp('^(0([7][457623])([0-9]){7})$')
        if(!nrREG.test(nr)){
         setMessage2("Phone number is invalid.")
         setDis(true)
        }
        else
        {
        setMessage2("")
        setDis(false)
        }
      }

      const onChangePass = (e) => {
        var pass = e.target.value
        let nrREG = new RegExp('^.{6,15}$')
        if(!nrREG.test(pass)){
         setMessage3("Introduce minimum 6 characters.")
         setDis(true)
        }
        else
        {
        setMessage3("")
        setDis(false)
        }
    }

    return (
        <div className="loginpage">
             <ClientNav/>
        <div className="loginform">
            <ToastContainer />
            <Card className={Classes.ELEVATION_3}>
                <Form onSubmit={handleUserEdit}>
                    <fieldset className="fieldset-bordered">
                        <Form.Label>
                            <legend>My Profile</legend>
                        </Form.Label>
                        <Form.Group>
                            <Form.Label>E-mail :</Form.Label>
                            <Form.Control type="text" required name="uname" onChange={(e) => onChangeEmail(e)}
                                placeholder="E-mail" />
                        </Form.Group>
                        <Form.Group>
                        <Form.Label>Phone number:</Form.Label>
                        <Form.Control type="number" required name= "tel" onChange={(e) => onChangePhone(e)} placeholder="Phone" />
                        </Form.Group>
                        <Form.Group>
                        <Form.Label>Password:</Form.Label>
                        <div style={{ display: "flex" }}>
                        <Form.Control type={showPassword ? "text" : "password"} required name="pass" placeholder="Password" onChange={(e) => onChangePass(e)} />
                        <FontAwesomeIcon style={{height:"20px",position:"absolute",right:"5%",top:"242px"}} onClick={toggleShowPassword} icon={showPassword ? faEye : faEyeSlash}/>
                        </div>
                        </Form.Group>
                        <Form.Group style={{display:"flex",flexDirection:"column"}}>
                        <Form.Label style={{fontWeight: "bold",fontSize:15,color:"#dc3545"}}>{errorMessage}</Form.Label>
                        <Form.Label style={{fontWeight: "bold",fontSize:15,color:"#dc3545"}}>{errorMessage2}</Form.Label>
                        <Form.Label style={{fontWeight: "bold",fontSize:15,color:"#dc3545"}}>{errorMessage3}</Form.Label>
                        </Form.Group>
                        <Button className="but" variant="warning" disabled={disbl} type="submit" style={{ margin: "20px" }}>
                           Edit Profile
                        </Button>
                    </fieldset>
                </Form>
            </Card>
        </div>
    </div>
    );
};

export default Profile;