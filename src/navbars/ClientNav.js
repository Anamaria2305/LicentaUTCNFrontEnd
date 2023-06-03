import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {APP_NAME} from '../res/STRINGS';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSignOut, faHome, faCar, faUser, faMessage} from '@fortawesome/free-solid-svg-icons';
import React from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import './NavBar.css';


function ClientNav() {
    const navigate = useNavigate();

    async function handleLogout() {
        let username = localStorage.getItem("username")
        try {
            const response = await axios.post(
                "http://localhost:8000/api/logout",
                {username}
            );
        } catch (error) {
            console.log(error);
        }
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("role");
        navigate("/");
    }

    return <Navbar className="max-width">
        <Container className="max-width">
            <Nav className="me-auto, max-width">
                <Nav.Link className="navbar-home" href="/home"><FontAwesomeIcon icon={faHome} color="black" size="xl"/></Nav.Link>
                <Nav.Link className="navbar-button" href="/car"><FontAwesomeIcon icon={faCar} color="black" size="xl"/></Nav.Link>
                <Nav.Link className="navbar-button" href="/profile"><FontAwesomeIcon icon={faUser} color="black" size="xl"/></Nav.Link>
                <Nav.Link className="navbar-button" href="/notifications"><FontAwesomeIcon icon={faMessage} color="black" size="xl"/></Nav.Link>
                <Navbar.Brand className="navbar-title">{APP_NAME}</Navbar.Brand>
                <div className="navbar-buttons">
                    <li><button className="navbar-logout" onClick={handleLogout}><FontAwesomeIcon icon={faSignOut} color="black" size="xl"/></button></li>
                </div>
            </Nav>
        </Container>
    </Navbar>;
}

export default ClientNav;