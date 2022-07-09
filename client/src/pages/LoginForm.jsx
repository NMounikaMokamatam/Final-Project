import React, { useState } from 'react';
import {Form, Button} from 'react-bootstrap'
import background from "../assets/background.jpeg";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import NavBar from "../components/Navbar";

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorAlert, setErrorAlert] = useState(false);
    const navigate = useNavigate();
    //login user
    const login =  async (e) =>{
        e.preventDefault();
        setErrorAlert(false);
        //check if password and email is not empty
        var validForm = true;
        if(email == ""){
            validForm = false;
            setErrorAlert("Email is required");
        }
        if(password == ""){
            validForm = false;
            setErrorAlert("Password is required");
        } 

        if(validForm){
            //sign in user
            await axios.post('https://flurrypuppy.herokuapp.com/api/users/login', {
                email: email,
                password: password,
            }).then(function (response) {
                setEmail('');
                setPassword('');
                // handle success
                console.log(response);
                navigate("/profile");
                
              })
              .catch(function (error) {
                // handle error
                console.log(error);
                if (error.response) {
                    setErrorAlert(error.response.data.msg);
                }
              })
        }
    }

    return (
        <React.Fragment>
            <NavBar/>
            <div className="auth-box" >
                <div className="auth-card" style={{ backgroundImage: `url(${background})` }}>
                    <h3 className="text-center">Login In</h3>
                    {errorAlert && 
                        <div className="alert alert-danger" role="alert">
                            {errorAlert}
                        </div>
                    }
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control value={email} onChange={(e) => setEmail(e.target.value)} className="transparent-input" type="email" placeholder="Enter email" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control value={password} onChange={(e) => setPassword(e.target.value)} className="transparent-input" type="password" placeholder="Password" />
                        </Form.Group>
                        <Button onClick={login} className="auth-btn" variant="primary" type="submit">
                            Login
                        </Button>
                    </Form>
                </div>
            </div> 
        </React.Fragment>                 
    )
}
export default LoginForm;