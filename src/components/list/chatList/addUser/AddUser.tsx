import { useState } from 'react'
import "./addUser.css"
import avatar from "../../../../assets/img/avatar.jpg"
import { db } from '../../../../lib/firebase'
import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import { useSelector } from 'react-redux'
import { selectUserSlice } from '../../../../redux/slices/userSlice'
import { UserState } from '../../../../redux/slices/chatSlice'


const AddUser = () => {

  const [user, setUser] = useState<UserState>({
    id: "",
    email: "",
    blocked: [],
    username: ""
  });

  const { currentUser } = useSelector(selectUserSlice);
 
  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();  

    const formData = new FormData(e.target as HTMLFormElement);
    let username = formData.get("username")

    //сделать чтобы можно было искать в любом регистре
    // if (typeof username === "string") {
    //   username = username.toLowerCase(); 
    // }

    try {
      
      const userRef = collection(db, "users");

      const q = query(userRef, where("username", "==", username));
      
      const querySnapShot = await getDocs(q);
      
      if (!querySnapShot.empty) {
        const userData = querySnapShot.docs[0].data() as UserState;
        
        if(userData.id !== currentUser?.id) {
          setUser(userData);
        }
      }
      

    }catch(err) {
      console.log(err);
      
    }

  }

  const handleAdd = async () => {
    
    const chatRef = collection(db, "chats")
    const userChatsRef = collection(db, "userchats")


    try{
      const newChatRef = doc(chatRef);

      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],

      })

      await updateDoc(doc(userChatsRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser?.id,
          updateAt: Date.now(),
        })
      })
      await updateDoc(doc(userChatsRef, currentUser?.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updateAt: Date.now(),
        })
      })

    }catch(err) {
      console.log(err);
      
    }
  }

  // const filteredChats = chats.filter((c) => c.user.username.toLowerCase().includes(inputText.toLowerCase()))
  
  return (
    <div className='add-user'>
      <form onSubmit={handleSearch}>
        <input type="text" placeholder='Имя' name='username' />
        <button>Поиск</button>
      </form>
      {
        user && 
        <div className="user">
          <div className="detail-add-user">
            <img src={avatar} alt="" />
            <span>{user.username}</span>
          </div>
          <button onClick={handleAdd}>+</button>
        </div>
      }
      
    </div>
  )
}

export default AddUser
