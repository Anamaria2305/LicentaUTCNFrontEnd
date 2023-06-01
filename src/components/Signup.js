import React, { useState } from 'react';
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Button, Form } from "react-bootstrap";
import { Card, Classes } from "@blueprintjs/core";
import "../css/Login.css";
import { validate } from 'react-email-validator';

function SignupPage() {

    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [disbl, setDis] = useState(false);
    const [errorMessage, setMessage] = useState("");
    const [errorMessage2, setMessage2] = useState("");
    const [errorMessage3, setMessage3] = useState("");
    const navigate = useNavigate();

    const showToastMessage = (message) =>
        toast.error(message, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 3000
        });

    const showSuccessToastMessage = () =>
        toast.info('Signup Successful! You will be redirected to the login page', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 3000
        });

    const handleSignup = async (e) => {
        e.preventDefault();
        var { uname,phone, pass } = document.forms[0];
        try {
            const role = 'Client'
            const response = await axios.post(
                "http://localhost:8000/api/signup",
                {uname,phone, pass, role}
            );
            // insert also my api here
            showSuccessToastMessage();
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            showToastMessage("Something went wrong, please try again.");
        }
        setEmail('');
        setPhone('');
        setPassword('');
    };

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
        <div className="loginform">
            <ToastContainer />
            <Card className={Classes.ELEVATION_3}>
                <Form onSubmit={handleSignup}>
                    <fieldset className="fieldset-bordered">
                        <Form.Label>
                            <legend>Register</legend>
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
                        <Form.Control type="password" required name="pass" placeholder="Password" onChange={(e) => onChangePass(e)} />
                        </Form.Group>
                        <Form.Group style={{display:"flex",flexDirection:"column"}}>
                        <Form.Label style={{fontWeight: "bold",fontSize:15,color:"#dc3545"}}>{errorMessage}</Form.Label>
                        <Form.Label style={{fontWeight: "bold",fontSize:15,color:"#dc3545"}}>{errorMessage2}</Form.Label>
                        <Form.Label style={{fontWeight: "bold",fontSize:15,color:"#dc3545"}}>{errorMessage3}</Form.Label>
                        </Form.Group>
                        <Button className="but" variant="danger" disabled={disbl} type="submit" style={{ margin: "20px" }}>
                           Sign Up
                        </Button>
                    </fieldset>
                </Form>
            </Card>
        </div>
    </div>
    );
}

export default SignupPage;
