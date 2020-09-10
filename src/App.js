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

  let isEmailValid, isPasswordValid;


  // My trying
  // const handleBlur = (event) => {
    
  //   // console.log(event.target.name, event.target.value);
  //   if(event.target.name === 'email'){
  //     isEmailValid = /\S+@\S+\.\S+/.test(event.target.value);
  //   }
  //   if(event.target.name === 'password'){
  //     isPasswordValid = event.target.value.length >= 6 && /\d{1}/.test(event.target.value);
  //   }
  //   if(isEmailValid && event.target.name === 'email'){
  //     const newUser = {...user};
  //     newUser[event.target.name] = event.target.value;
  //     setUser(newUser);
  //   }
  //   if(isPasswordValid  && event.target.name === 'password'){
  //     const newUser = {...user};
  //     newUser[event.target.name] = event.target.value;
  //     setUser(newUser);
  //   }
  //   else{
  //     console.log('jhamala ase');
  //   }
  // }

  // According to jhankar vhai

  const is_valid_email = email =>  /(.+)@(.+){2,}\.(.+){2,}/.test(email); 
  const hasNumber = input => /\d/.test(input);

  const handleBlur = (event) =>{
    const newUserInfo = {
      ...user
    };
    //debugger;
    // perform validation
    let isValid = true;
    if(event.target.name === 'email'){
      isValid = is_valid_email(event.target.value);
    }
    if(event.target.name === "password"){
      isValid = event.target.value.length > 8 && hasNumber(event.target.value);
    }

    newUserInfo[event.target.name] = event.target.value;
    newUserInfo.isValid = isValid;
    setUser(newUserInfo);
  }

  const handleSubmit = () => {

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
        <input type="submit" value="Sign In"/>
      </form>
    </div>
  );
}

export default App;
