import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {Container, Navbar, Nav, Offcanvas, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const NavBar = () => {
    const [isLogged, setIsLogged] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        refreshToken();
    }, []);

    const refreshToken = async () => {
        await axios.get('https://flurrypuppy.herokuapp.com/api/users/gettoken').
            then(function (response) {
                // handle success
                setIsLogged(true);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
                if (error.response) {
                    setIsLogged(false);
                }
            })
    }

    const logout = async () => {
        await axios.get('https://flurrypuppy.herokuapp.com/api/users/logout').
            then(function (response) {
                // handle success
                navigate("/");
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
    }
    return (
        <Container>
            <Navbar  bg="light" expand="lg" className="mb-3">
                <Container fluid>
                    <Navbar.Brand href="#">Furry Puppy</Navbar.Brand>
                    <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-lg`} />
                    <Navbar.Offcanvas
                    id={`offcanvasNavbar-expand-lg`}
                    aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
                    placement="end"
                    >
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title id={`offcanvasNavbarLabel-expand-lg`}>
                        Furry Puppy
                        </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Nav className="justify-content-end flex-grow-1 pe-3">
                            {!isLogged &&
                                <>
                                    <NavLink to="/" className="nav-link">Login</NavLink>
                                    <NavLink to="/signup" className="nav-link">Register</NavLink>
                                </>
                            }
                            {isLogged &&
                                <button onClick={logout} className="ml-3 btn btn-small btn-main">Log Out</button>
                            } 
                        </Nav>
                    </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </Navbar>
        </Container>
    )
}
export default NavBar;