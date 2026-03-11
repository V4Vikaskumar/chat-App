import React, { useEffect, useState, useRef } from 'react'
import useAuth from '../context/AuthProvider';
import { io } from 'socket.io-client'
import axios from '../Apis/Api';
import { find, lastOnline } from '../Apis/Auth';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { logout, token, user } = useAuth();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [connected, setIsConnected] = useState(false);
  const [receiverId, setReceiverId] = useState('');
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [friendList, setFriendsList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [messageType, setMessageType] = useState("text");

  const newfriend = useRef('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    const newSocket = io('https://chat-app-1-lbg4.onrender.com', {
      auth: { token },
    });

    newSocket.on("connect", () => {
      setIsConnected(true);
    });

    newSocket.on("disconnect", async () => {
      await lastOnline();
      setIsConnected(false);
    });

    newSocket.on("chat:new", (data) => {
      
      if (
        data.sender.id === user.id ||
        data.sender.id === receiverId
      ) {
        setMessages(prev => [...prev, data]);
      }
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("user:online", (userId) => {
      setFriendsList(prev =>
        prev.map(f =>
          f.userA.id === userId
            ? { ...f, userA: { ...f.userA, online: true } }
            : f.userB.id === userId
            ? { ...f, userB: { ...f.userB, online: true } }
            : f
        )
      );
    });

    socket.on("user:offline", ({ userId, lastSeen }) => {
      setFriendsList(prev =>
        prev.map(f =>
          f.userA.id === userId
            ? { ...f, userA: { ...f.userA, online: false, lastSeen } }
            : f.userB.id === userId
            ? { ...f, userB: { ...f.userB, online: false, lastSeen } }
            : f
        )
      );
    });

    return () => {
      socket.off("user:online");
      socket.off("user:offline");
    };
  }, [socket]);

  useEffect(() => {
  if (!socket) return;

  socket.on("message:delivered", ({ messageId }) => {
    setMessages(prev =>
      prev.map(m =>
        m.id === messageId ? { ...m, delivered: true } : m
      )
    );
  });

  socket.on("message:read:update", ({ conversationId }) => {
    setMessages(prev =>
      prev.map(m =>
        m.conversationId === conversationId
          ? { ...m, read: true }
          : m
      )
    );
  });

  return () => {
    socket.off("message:delivered");
    socket.off("message:read:update");
  };
}, [socket]);
  
  useEffect(() => {
    if (!connected) return;

    axios.get('/api/users/friends')
      .then(({ data }) => setFriendsList(data));

  }, [connected]);

  
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const chatHandler = async () => {
    if (!receiverId) return alert("Select a friend");

    if (messageType === "text") {
      if (!text.trim()) return;

      socket.emit("chat:send", {
        receiverId,
        text,
        type: "text"
      });

      setText("");
      return;
    }

    if (!selectedFile) return alert("Select a file");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const { data } = await axios.post("/api/start/upload", formData);

      socket.emit("chat:send", {
        receiverId,
        text: data.fileUrl,
        type: messageType
      });
      // console.log("data",data);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  };

  async function Addfriend() {
    const nameofFriend = newfriend.current.value;

    const isAvailble = await find({ nameofFriend });
    if (!isAvailble) return alert('User Not Found');

    await axios.post('/api/start/conversation', {
      receiverId: isAvailble.id,
      asp: user
    });

    setMessages([]);
    newfriend.current.value = '';
  }

  useEffect(() => {
    if (!socket || !receiverId) return;

    const activeConversation = friendList.find(f =>
      (f.userA.id === user.id && f.userB.id === receiverId) ||
      (f.userB.id === user.id && f.userA.id === receiverId)
    );

    if (!activeConversation) return;

    socket.emit("message:read", {
      conversationId: activeConversation.id,
      senderId: receiverId
    });

  }, [receiverId, socket]); 

  return (
    <div className="chat-app">

      <div className="chat-header">
        <div>
          <h3>{user.name}</h3>
          <span className={connected ? "online" : "offline"}>
            {connected ? "Online" : "Connecting..."}
          </span>
        </div>
        <div>
          <button onClick={() => navigate("/settings")}>
            ⚙ Settings
          </button> 
          <span>   </span>
          <button onClick={logout}>Logout</button>
      </div>
      </div>

      <div className="chat-body">
        <div className="chat-sidebar">
          <h4>Friends</h4>

          <input type="text" placeholder='Enter Email Id' ref={newfriend} />
          <button onClick={Addfriend} disabled={!connected}>Add New Friend</button>

          {friendList.map((f) => (
            <div
              key={f.id}
              className="friend"
              onClick={async () => {

                const id =
                  f.userA.id === user.id
                    ? f.userB.id
                    : f.userA.id;

                setReceiverId(id);

                const { data } = await axios.get('/api/users/message', {
                  params: { conversationId: f.id }
                });

                setMessages(data);
              }}
            >
              {f.userA.id !== user.id && <div>{f.userA.name} <span>
                    {f.userA.online
                      ? " 🟢 Online"
                      : f.userA.lastSeen
                      ? ` Last seen ${new Date(f.userA.lastSeen).toLocaleTimeString()}`
                      : ""}
                  </span>
                </div>}
              {f.userB.id !== user.id && <div>{f.userB.name}
                <span>
                    {f.userB.online
                      ? " 🟢 Online"
                      : f.userB.lastSeen
                      ? ` Last seen ${new Date(f.userB.lastSeen).toLocaleTimeString()}`
                      : ""}
                  </span>
                </div>}
              {f.userA.id !== user.id && (
                <div>
                  {/* {f.userA.name} */}
                  
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="chat-area">

          <div className="messages">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`message ${m.senderId === user.id ? "sent" : "received"}`}
              >
                {m.senderId !== user.id && <strong>{m.sender.name}</strong>}

                {m.type === "image" && (
                  <img src={m.text} alt="img"  width="300" />
                )}

                {(!m.type || m.type === "text") && (
                  <p>{m.text}</p>
                )}

                {m.senderId === user.id && (
                  <span style={{ fontSize: "12px" }}>
                    {m.read
                      ? "✔✔ Read"
                      : m.delivered
                      ? "✔✔ Delivered"
                      : "✔ Send"}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="chat-input">

            <select
              value={messageType}
              onChange={(e) => setMessageType(e.target.value)}
            >
              <option value="text">Text</option>
              <option value="image">Image</option>
            </select>

            {messageType === "text" && (
              <input
                type="text"
                placeholder="Type a message"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            )}

            {(messageType === "image") && (
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            )}

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