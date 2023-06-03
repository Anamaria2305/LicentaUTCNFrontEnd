import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { Button, Form } from "react-bootstrap";
import { Card, Classes } from "@blueprintjs/core";
import "../css/Login.css";
const Login = () => {

    const navigate = useNavigate();

    const showToastMessage = () =>
        toast.error('Incorrect credentials !', {
            position: toast.POSITION.TOP_CENTER
        });

    async function handleLogin(event) {
        event.preventDefault();
        var { uname, pass } = document.forms[0];
        try {
            const response = await axios.post(
                "http://localhost:8000/api/login",
                { uname: uname.value, pass: pass.value }
            );
            //insert my api here
            console.log(response.data.email)
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("email", response.data.email);
            localStorage.setItem("role", response.data.role);
            navigate('/home');
        } catch (error) {
            showToastMessage();
        }
    }

    return (
        <div className="loginpage">
            <div className="loginform">
                <ToastContainer />
                <Card className={Classes.ELEVATION_3}>
                    <Form onSubmit={handleLogin}>
                        <fieldset className="fieldset-bordered">
                            <Form.Label>
                                <legend>Log in to the Application</legend>
                            </Form.Label>
                            <Form.Group>
                                <Form.Label>E-mail :</Form.Label>
                                <Form.Control type="text" required name="uname"
                                    placeholder="E-mail" />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Password:</Form.Label>
                                <Form.Control type="password" required name="pass" placeholder="Password" />
                            </Form.Group>
                            <Button className="but" variant="danger" type="submit" style={{ margin: "20px" }}>
                                Log In
                            </Button>
                        </fieldset>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default Login;