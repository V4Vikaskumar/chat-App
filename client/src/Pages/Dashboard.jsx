import React from 'react'
import { Navigate } from 'react-router-dom'
import useAuth from '../context/AuthProvider';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client'
import axios from '../Apis/Api';
import { useRef } from 'react';
import { find, lastOnline } from '../Apis/Auth';

const Dashboard = () => {
  const { logout, token, user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connected, setIsConnected] = useState(false);
  const [receiverId, setReceiverId] = useState('');
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [friendList, setFriendsList] = useState([]);
  const newfriend = useRef('');

  useEffect(() => {
    const socket = io("http://localhost:4444", {
      auth: { token },
    });

    socket.on("connect", () => console.log('user Connected'));
    socket.on("disconnect", async () => {
      console.log('user disConnected')
      await lastOnline();
    });

    socket.on("chat:new", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    setSocket(socket);
    setIsConnected(true);

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    if (!connected) return;

    axios.get('/api/users/friends')
      .then(({ data }) => setFriendsList(data))
  }, [connected])

  const chatHandler = () => {
    socket.emit("chat:send", { receiverId, text }, (msg) => {
      if (!msg.ok) return alert(msg.error);
    })
    setText('');
  }
  async function Addfriend(){
    const nameofFriend = newfriend.current.value;
      
      const isAvailble = await find({nameofFriend});
      if(!isAvailble){
        alert('User Not Found');
      }

      const { data } = await axios.post('/api/start/conversation', {
        receiverId: isAvailble.id,
        asp : user
      });

      setFriendsList(prev => [...prev, data]);

      setMessages([]);
      setIsConnected(true);
      newfriend.current.value = '';
  }

  return (
    <div className="chat-app">
      {/* HEADER */}
      <div className="chat-header">
        <div>
          <h3>{user.name}</h3>
          <span className={connected ? "online" : "offline"}>
            {connected ? "Online" : "Connecting..."}
          </span>
        </div>
        <button onClick={logout}>Logout</button>
      </div>

      {/* BODY */}
      <div className="chat-body">
        {/* FRIEND LIST */}
        <div className="chat-sidebar">
          <h4>Friends</h4>
          <input type="text" placeholder='Enter Email Id' ref={newfriend} />
          <button onClick={Addfriend}>Add New Friend</button>
          
          {friendList.map((f) => (
            <div key={f.id} className="friend" onClick={
              async () => {
                setReceiverId(f.userA.id === user.id ? f.userB.id : f.userA.id)
                await axios.get('/api/users/message', {
                      params : {
                        conversationId : f.id
                      }
                    })
                    .then(({data}) => {
                      console.log("data" ,f);

                      setMessages(data);
                    })
              }
              }>
              {f.userA.id !== user.id ? <div>{f.userA.name}</div> : ""}
              {f.userB.id !== user.id ? <div>{f.userB.name}</div> : ""}
            </div>
          ))}
        </div>

        {/* CHAT AREA */}
        <div className="chat-area">
          <div className="messages">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`message ${
                  m.senderId === user.id ? "sent" : "received"
                }`}
              >
                {m.senderId !== user.id && (
                  <strong>{m.sender.name}</strong>
                )}
                <p>{m.text}</p>
              </div>
            ))}
          </div>

          {/* INPUT */}
          <div className="chat-input">
            {/* <input
              type="text"
              placeholder="Receiver Id"
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
            /> */}
            <input
              type="text"
              placeholder="Type a message"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button onClick={chatHandler} disabled={!connected}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;
