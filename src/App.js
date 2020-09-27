import React from 'react';
import firebase, { firestore } from 'firebase/app'
import {useAuthState} from 'react-firebase-hooks/auth'
import {useCollectionData} from 'react-firebase-hooks/firestore'
import './App.css';
import 'firebase/firestore'
import 'firebase/auth'

firebase.initializeApp({
  apiKey: "AIzaSyDgTbRJvqFZnSYD4vGrFAQG4WIWo4ETKSg",
    authDomain: "chat-dc70f.firebaseapp.com",
    databaseURL: "https://chat-dc70f.firebaseio.com",
    projectId: "chat-dc70f",
    storageBucket: "chat-dc70f.appspot.com",
    messagingSenderId: "665289931996",
    appId: "1:665289931996:web:d6af2de6b5436050e4c819",
    measurementId: "G-PKS9C2GQK2"
})
const auth = firebase.auth();
function App() {
const firestore = firebase.firestore();
const [user] = useAuthState(auth)
  return (
    <div>
      {user?<div><ChatRoom/><SignOut/></div>:<SignIn/>}
    </div>
  );
}




function SignIn(){
  const signInWithGoogle = () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider);
  }
  return(
      <button onClick={signInWithGoogle}>SignIn</button>
  )
}





function ChatRoom(){
  const messageRef = firestore().collection('messages');
  const query = messageRef.orderBy('createdAt').limit(25);
const [messages] = useCollectionData(query, {idField:'id'});
console.log(messages);
  return(
    <div>
        <h1>ChatRoom</h1>
        <div>
        {messages?console.log(messages):null}
        {messages && messages.map(msg=><ChatMessage key={msg.id} message={msg}/>)}
        </div>
    </div>
  )
}

function ChatMessage(props){
const {text, uid} = props.message;
const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
return(
<p>{text}:{messageClass}</p>
)

}


function SignOut(){
  return auth.currentUser && (
  <button onClick={()=>auth.signOut()}>SignOut</button>
  )
}
export default App;
