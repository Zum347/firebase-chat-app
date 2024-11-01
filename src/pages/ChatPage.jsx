import {
    collection,
    addDoc,
    serverTimestamp,
    onSnapshot,
    query,
    orderBy,
    where,
  } from 'firebase/firestore';
  import { auth, db } from '../firebase/config';
  import { useEffect } from 'react';
  import { useState } from 'react';
  import Message from '../components/Message';
  
  const ChatPage = ({ room, setRoom }) => {
    const [messages, setMessages] = useState([]);
    const handleSubmit = async (e) => {
      e.preventDefault();
      const messagesCol = collection(db, 'messages');
      await addDoc(messagesCol, {
        text: e.target[0].value,
        room,
        author: {
          name: auth.currentUser?.displayName,
          id: auth.currentUser?.uid,
          photo: auth.currentUser.photoURL,
        },
        createdAt: serverTimestamp(),
      });
      e.target.reset();
    };

    useEffect(() => {
  
      const messagesCol = collection(db, 'messages');
      const q = query(
        messagesCol,
        where('room', '==', room),
        orderBy('createdAt', 'asc')
      );
      onSnapshot(q, (snapshot) => {
        const tempMsg = [];
        snapshot.docs.forEach((doc) => {
          tempMsg.push(doc.data());
        });
        setMessages(tempMsg);
      });
    }, []);
  
    return (
      <div className="chat-page">
        <header>
          <p>{auth.currentUser?.displayName}</p>
          <p>{room}</p>
          <button onClick={() => setRoom(null)}>Farklı Oda</button>
        </header>
  
        <main>
          {messages.map((data, i) => (
            <Message key={i} data={data} />
          ))}
        </main>
  
        <form onSubmit={handleSubmit}>
          <input
            required
            placeholder="mesajınızı yazınız"
            type="text"
          />
          <button>Gönder</button>
        </form>
      </div>
    );
  };
  
  export default ChatPage;