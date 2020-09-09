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
    photo: ''
  })

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
        photo: ''
      }
      setUser(user);
      console.log(res);
    })
    .catch(error => {
      console.log(error);
    })
  }

  return (
    <div>
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
    </div>
  );
}

export default App;
