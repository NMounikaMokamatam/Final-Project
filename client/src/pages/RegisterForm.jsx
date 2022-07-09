import React, { useState } from 'react';
import {Form, Button} from 'react-bootstrap'
import background from "../assets/background.jpeg";
import axios from "axios";
import NavBar from "../components/Navbar";

const SignupForm = () => {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorAlert, setErrorAlert] = useState(false);
    const [successAlert, setSuccessAlert] = useState(false);
    //login user
    const register = async (e) =>{
        e.preventDefault();
        defaultAlert();
        //check if password and email is not empty
        var validForm = true;
        if(email == ""){
            validForm = false;
            setErrorAlert("Email is required");
        }
        if(userName == ""){
            validForm = false;
            setErrorAlert("Name is required");
        }
        if(password == ""){
            validForm = false;
            setErrorAlert("Password is required");
        } 
        if(validForm){
            await axios.post('https://flurrypuppy.herokuapp.com/api/users/register', {
                username: userName,
                email: email,
                password: password,
            }).then(function (response) {
                // handle success
                console.log(response);
                setUserName('');
                setEmail('');
                setPassword('');
                setSuccessAlert(response.data.msg);
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

    const defaultAlert = () =>{
        setErrorAlert(false);
        setSuccessAlert(false);
    }
    return (
        <React.Fragment>
            <NavBar/>
            <div className="auth-box" >
                <div className="auth-card" style={{ backgroundImage: `url(${background})` }}>
                    <h3 className="text-center">Sign up</h3>
                    {successAlert && 
                        <div className="alert alert-success" role="alert">
                            {successAlert}
                        </div>
                    }

                    {errorAlert && 
                        <div className="alert alert-danger" role="alert">
                            {errorAlert}
                        </div>
                    }
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control value={userName} onChange={(e) => setUserName(e.target.value)}  className="transparent-input" type="text" placeholder="Enter name" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control value={email} onChange={(e) => setEmail(e.target.value)} className="transparent-input" type="email" placeholder="Enter email" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control value={password} onChange={(e) => setPassword(e.target.value)} className="transparent-input" type="password" placeholder="Password" />
                        </Form.Group>
                        <Button onClick={register} className="auth-btn sign-up" variant="primary" type="submit">
                            Register
                        </Button>
                    </Form>
                </div>
            </div> 
        </React.Fragment>
    )
}
export default SignupForm;