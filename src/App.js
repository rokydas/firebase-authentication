import React, { useState } from 'react';
import * as firebase from "firebase/app";
import "firebase/auth";
import './App.css';
import firebaseConfig from './firebase.config';
firebase.initializeApp(firebaseConfig);

function App() {
  
  const provider = new firebase.auth.GoogleAuthProvider();

  const btnStyle = {
    color: 'white',
    backgroundColor: 'black',
    padding: '10px 15px',
    fontSize: '20px',
    borderRadius: '10px',
    border: 'none',
    outline: 'none'
  }

  const [user, setUser] = useState({
    isSignedIn: false, 
    name: '', 
    email: '', 
    password: '',
    photo: ''
  })

  const [noti, setNoti] = useState('');
  const [color, setColor] = useState('');

  const handleSignIn = () => {
    console.log("it's working YAY");
    firebase.auth().signInWithPopup(provider)
    .then(res => {
      const { displayName, photoURL, email } = res.user;
      console.log(res.user);
      const signedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        password: '',
        photo: photoURL
      }
      
      setUser(signedInUser);
      console.log(displayName, photoURL, email);
    })
    .catch(error => {
      console.log(error);
      console.log(error.message);
    });
  }
  const handleSignOut = () => {
    firebase.auth().signOut()
    .then(res => {
      const user = {
        isSignedIn: false,
        name: '',
        email: '',
        password: '',
        photo: ''
      }
      setUser(user);
      console.log(res);
    })
    .catch(error => {
      console.log(error);
    })
  }

  const handleBlur = (event) => {
  
    let isFieldValid = true;

    // console.log(event.target.name, event.target.value);
    if(event.target.name === 'email'){
      isFieldValid = /\S+@\S+\.\S+/.test(event.target.value);
    }
    if(event.target.name === 'password'){
      isFieldValid = event.target.value.length >= 6 && /\d{1}/.test(event.target.value);
    }
    if(isFieldValid){
      const newUser = {...user};
      newUser[event.target.name] = event.target.value;
      setUser(newUser);
    }
  }

  const handleSubmit = (event) => {
    if(user.email && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res => {
        console.log(res);
        setNoti('User created successfully');
        setColor('green');
      })
      .catch(error => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage);
        // ...
        setNoti(errorMessage)
        setColor('red');
      });
    }
    event.preventDefault();
  }

  return (
    <div className="app">
      {
        user.isSignedIn ? <button onClick={handleSignOut} style={btnStyle}>Sign out</button> 
        : <button onClick={handleSignIn} style={btnStyle}>Sign in</button>
      }
      
      {
        user.isSignedIn && <div>
          <h3>Welcome {user.name}</h3>
          <h3>Your Email Address: {user.email}</h3>
          <img src={user.photo} alt=""/>
        </div>
      }

      {/* <h1>Our own authentication</h1>
      <h3>Your Email Address: {user.email}</h3>
      <h3>Your password: {user.password}</h3> */}
      
      {/* onChange
      <form onSubmit={handleSubmit}>
        <input name="email" type="text" onChange={handleChange} placeholder="Your Email address" required/><br/>
        <input name="password" type="password" onChange={handleChange} placeholder="Password" id="" required/><br/>
        <input type="submit" value="Sign In"/>
      </form> */}

      {/* onBlur */}
      <form onSubmit={handleSubmit}>
        <input name="email" type="text" onBlur={handleBlur} placeholder="Your Email address" required/><br/>
        <input name="password" type="password" onBlur={handleBlur} placeholder="Password" id="" required/><br/>
        <input type="submit" onClick={handleSubmit} value="Sign In"/>
      </form>
      {
        <h3 style={{color: color}}>{noti}</h3>
      }
    </div>
  );
}

export default App;
