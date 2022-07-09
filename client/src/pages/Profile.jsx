import React, { useState, useEffect } from 'react';
import {Container, Col, Modal, Form, Row, Card, Button} from 'react-bootstrap'
import jwt_decode from "jwt-decode";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import NavBar from "../components/Navbar";
import '../App.css'

const Home = () => {
    const [name, setName] = useState('');
    const [userId, setUserId] = useState('');
    const [isLoaded, setIsLoaded] = useState(false); //set true if tocken is valid
    const [token, setToken] = useState('');
    const [show, setShow] = useState(false);
    //posts
    const [title, setTitle] = useState('');
    const [post, setPost] = useState('');
    const [posts, setPosts] = useState([]);
    //alerts
    const [errorAlert, setErrorAlert] = useState(false);
    const [successAlert, setSuccessAlert] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        refreshToken();
    }, []);

    const refreshToken = async () => {
        await axios.get('https://furrypuppy.herokuapp.com/api/users/gettoken').
            then(function (response) {
                // handle success
                const decoded = jwt_decode(response.data.accessToken);
                setToken(response.data.accessToken);
                setIsLoaded(true);
                setUserId(decoded.user_id);
                setName(decoded.user_name);
              })
              .catch(function (error) {
                // handle error
                console.log(error);
                if (error.response) {
                    navigate("/");
                }
             })
    }
    //show or hide modal
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const deletePost = async (e,post) => {
        e.preventDefault();
        const options = {
            method: 'DELETE',
            credentials: "include",
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ post_id: post._id })
        };
        fetch('https://furrypuppy.herokuapp.com/api/posts/delete', options)
            .then(response =>response.json())
            .then(data => {
                //console.log('Success:', data);
                getUserPosts();
                alert(data.msg)
              })
            .catch(error => {
                if (error.response) {
                    alert('Error post not deleted');
                }
            });
    }

    const saveNewPost = async (e) => {
        e.preventDefault();
        setErrorAlert(false);
        setSuccessAlert(false);
        let validPost = true;
        if(title == ""){
            validPost = false;
            setErrorAlert("Please enter post title");
        }
        if(post == ""){
            validPost = false;
            setErrorAlert("Please enter post content");
        }

        if(validPost){
            await axios.post('https://furrypuppy.herokuapp.com/api/posts/save', {
                title: title,
                content: post,
                user_id: userId
            },{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(function (response) {
                // handle success
                console.log(response);
                setTitle('');
                setPost('');
                setSuccessAlert(response.data.msg);
                getUserPosts();
                setTimeout(()=>{
                    setSuccessAlert(false);
                    setErrorAlert(false);
                    handleClose();
                }, 4000);
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

    const getUserPosts = async () =>{
        await axios.post('https://furrypuppy.herokuapp.com/api/posts/userposts', {
            user_id: userId
        },{
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(function (response) {
            // handle success
            console.log(response.data);
            setPosts(response.data);
          })
          .catch(function (error) {
            // handle error
            console.log(error);
          })
    }

    if(isLoaded){
        getUserPosts();
        setIsLoaded(false);
    }

    return (
        <React.Fragment>
            <NavBar/>
            <Container>
                <Row className="justify-content-md-center">
                    
                    
                    <Col sm={12} md={8} xl={6}>
                        <div className="post-card mb-3">
                            <Card.Title className="text-center">Signed in As {name}</Card.Title>
                            <Row className="justify-content-center">
                                <button style={{width:"auto"}} onClick={handleShow} className="btn btn-sm btn-main">New post</button>
                            </Row>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                        <Modal.Title>New post</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
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
                                <Form.Group 
                                    className="mb-3" 
                                    controlId="exampleForm.ControlInput1">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        className="transparent-input-modal"
                                        type="text"
                                        placeholder="Enter title"
                                        autoFocus
                                        value={title} 
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group
                                    className="mb-3"
                                    controlId="exampleForm.ControlTextarea1">
                                    <Form.Label>Post</Form.Label>
                                    <Form.Control
                                        placeholder="Enter post content title"
                                        className="transparent-input-modal"
                                        as="textarea" 
                                        rows={3}
                                        value={post} 
                                        onChange={(e) => setPost(e.target.value)} />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>  
                        <button onClick={handleClose} className="btn btn-sm btn-close-modal">Close</button>
                        <button onClick={saveNewPost} className="btn btn-sm btn-main">Save</button>
                        </Modal.Footer>
                    </Modal>
                </Row>
                {posts.length === 0 &&
                    <Row className="justify-content-md-center">
                        <Col sm={12} md={8} xl={6} >
                            <div className="post-card mb-3">
                                <Card.Title className="text-center">O posts</Card.Title>
                            </div>
                        </Col>
                    </Row>
                }
                {posts.map((post, index) => (
                    <Row className="justify-content-md-center" key={index}>
                        <Col sm={12} md={8} xl={6} >
                            <div className="post-card mb-3">
                                <Card.Body>
                                    <Card.Title className="text-center" >{post.title}</Card.Title>
                                    <Card.Text className="text-center">{post.content}</Card.Text>
                                    <Row className="justify-content-center">
                                        <Button style={{width:"auto"}} variant="danger" className="btn-sm" onClick={e=> deletePost(e,post)}>
                                            Delete
                                        </Button>
                                    </Row>
                                </Card.Body>
                            </div>
                        </Col>
                    </Row>         
                ))}
            </Container>
            <br></br>
        </React.Fragment>
    )
}
export default Home;