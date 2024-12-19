import { useState } from 'react'
import "./addUser.css"
import avatar from "../../../../assets/img/avatar.jpg"
import { db } from '../../../../lib/firebase'
import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import { useSelector } from 'react-redux'
import { selectUserSlice } from '../../../../redux/slices/userSlice'
import { UserState } from '../../../../redux/slices/chatSlice'
import { selectChatListSlice } from '../../../../redux/slices/chatListSlice'


const AddUser = () => {

  const [user, setUser] = useState<UserState>({
    id: "",
    email: "",
    blocked: [],
    username: ""
  });
  const [notFound, setNotFound] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [disabl, setDisabl] = useState(true);

  const { currentUser } = useSelector(selectUserSlice);
  const { idList } = useSelector(selectChatListSlice);
 
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
        setNotFound(false);

        if(userData.id !== currentUser?.id) {

          const isIdInList = idList.some((el) => el === userData.id);
          if (!isIdInList) {
            setIsAdded(false); 
            setDisabl(false);
            setUser(userData);
          }
          else {
            setIsAdded(true);
            setDisabl(true);
            
          }
        }
      }
      else {
        setNotFound(true);
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
      <div className="not-found-block">
        {
          notFound &&
          (
            <span>Такого пользователя не существует</span>
          )
        }
      </div>
      {
        user && 
        <>
          <div className="user-popup">
            <div className="detail-add-user">
              <img src={avatar} alt="" />
              <span>{user.username}</span>
            </div>
            <div className="add-user-button">
              <button onClick={handleAdd} disabled={disabl}>+</button>
            </div>
          </div>
          <div className="is-added-user">
            {
              isAdded &&
              (
                <span>Этот пользователь у вас уже есть</span>
              )
            }
          </div>
        </>
      }
      
    </div>
  )
}

export default AddUser
