import React, { useState, useEffect, useRef } from 'react';
import ChatHeader from './ChatHeader';
import { useSelector } from "react-redux";
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import CardGiftcardIcon from '@material-ui/icons/CardGiftcard';
import GifIcon from '@material-ui/icons/Gif';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import { selectChannelId, selectChannelName } from './features/appSlice';
import { selectUser } from './features/userSlice';
import Message from './Message';
import './Chat.scss';
import db from './firebase';
import firebase from 'firebase';

function Chat() {
  const user = useSelector(selectUser);
  const channelId = useSelector(selectChannelId);
  const channelName = useSelector(selectChannelName);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (channelId) {
      db.collection("channels")
        .doc(channelId)
        .collection("messages")
        .orderBy("timestamp")
        .onSnapshot((snapshot) => 
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, [channelId]);

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = e => {
    e.preventDefault();
    if (input.trim() !== "") {
      db.collection("channels").doc(channelId).collection("messages")
      .add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        message: input,
        user: user,
      });
    }

    setInput("");
  }
  

  return (
    <div className="chat">
      <ChatHeader channelName={channelName} />

      <div className="chat__messages">
          {messages.map((message, i) => (
            <Message
              timestamp={message.timestamp}
              message={message.message}
              user={message.user}
              key={i}
            />
          ))}
          <div ref={messagesEndRef} />
      </div>

      <div className="chat__input">
        <AddCircleRoundedIcon />
        <form className="chat__form">
          <input
            value={input}
            disabled={!channelId}
            onChange={e => setInput(e.target.value)}
            className="chat__formInput"
            placeholder={`Message #${channelName}`}
          />
          <button onClick={sendMessage} className="chat__inputButton" type="submit">
            Send Message
          </button>
        </form>

        <div className="chat__inputIcons">
          <CardGiftcardIcon className="chat__icon" />
          <GifIcon className="chat__icon" />
          <EmojiEmotionsIcon className="chat__icon" />
        </div>
      </div>
    </div>
  )
}

export default Chat