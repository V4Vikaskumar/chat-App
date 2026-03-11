import axios from "axios";

export const chatHandler = async ({receiverId,messageType,text,socket,setText,setSelectedFile,selectedFile,fileInputRef}) => {
    try {
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