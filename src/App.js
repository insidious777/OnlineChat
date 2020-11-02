import React,{useState, useRef} from 'react';
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
const [user] = useAuthState(auth)
  return (
    <div className="App">
      {user
      ?<div>
        <header>
          <h1>OnlineChat</h1>
          <SignOut/>
        </header>
        <ChatRoom/>
      </div>
      :<div className="SignIn">
        <h1>Welcome! Please sign in!</h1>
        <SignIn/>
      </div>}
    </div>
  );
}

function SignIn(){
  const signInWithGoogle = () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider);
  }
  return(
      <button onClick={signInWithGoogle}>Sign In</button>
  )
}

function ChatRoom(){
  const dummy = useRef();
  const messageRef = firestore().collection('messages');
  const query = messageRef.orderBy('createdAt');
  const [messages] = useCollectionData(query, {idField:'id'});
  const [formValue, setFormValue] = useState('');

const sendMessage = async(e) =>{
  
  e.preventDefault();
  if(formValue!==''){
  const {uid, photoURL} = auth.currentUser;
  const name = auth.currentUser.displayName;
  await messageRef.add({
    text : formValue,
    createdAt : firebase.firestore.FieldValue.serverTimestamp(),
    uid,
    photoURL,
    name
  })
  setFormValue('');
  dummy.current.scrollIntoView({behavior : 'smooth'});
}
 }
  return(
    <div>
      <div className="ChatRoom">
    {messages && messages.forEach((msg,i)=>{
      if(messages.length!==1&&i<messages.length-1){
      let firstMessage = i;
      let secondMessage = i+1<messages.length?i+1:i;
      console.log(firstMessage)
      console.log(secondMessage)
     if(messages[firstMessage].uid===messages[secondMessage].uid) messages[secondMessage].atr='dontDisplay'
    }
    })}
    {messages && messages.map(msg=>(<ChatMessage key={msg.id} message={msg}/>)
  )}
            <div ref={dummy}></div>
      </div>
      <form onSubmit={sendMessage}>
        <input value={formValue} placeholder="say something..."onChange={(e)=>{setFormValue(e.target.value)}}/>
        <button type="submit">Send</button>
      </form>
  </div>
  )
}

function ChatMessage(props){
let {text, uid, photoURL, name} = props.message;
const atr=props.message.atr?props.message.atr:null;
console.log(name,atr);
const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
return(
  <div className={"ChatMessage "+ messageClass}>
    <h3>{atr?null:name}</h3>
    <div className={"messageContent"}>
      <img src={photoURL} alt={uid}/>
      <p>{text}</p>
    </div>
  </div>)
}

function SignOut(){
  return auth.currentUser && (
  <button onClick={()=>auth.signOut()}>Sign Out</button>
  )
}
export default App;
