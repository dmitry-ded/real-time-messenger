import "./chatList.css"
import plus from "../../../assets/img/plus.png"
import search from "../../../assets/img/search.png"
import minus from "../../../assets/img/minus.png"
import avatar from "../../../assets/img/avatar.jpg"
import { useEffect, useRef, useState } from "react"
import AddUser from "./addUser/AddUser"
import { useSelector } from "react-redux"
import { selectUserSlice } from "../../../redux/slices/userSlice"
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore"
import { db } from "../../../lib/firebase"
import { chageChat, UserState } from "../../../redux/slices/chatSlice"
import { useAppDispatch } from "../../../redux/store"

export interface ChatUserList {
  chatId: string,
  isSeen: boolean,
  lastMessage: string,
  receiverId: string,
  updateAt: number,
  user: UserState,
}

export interface ChatList {
  chatId: string,
  isSeen: boolean,
  lastMessage: string,
  receiverId: string,
  updateAt: number,
}

export interface DocumentData {
  chats: ChatList[]; 
}

const ChatList = () => {

  const [chats, setChats] = useState<ChatUserList[]>([]);
  const [addMode, setAddMode] = useState(false);
  const [inputText, setInputText] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);

  const { currentUser } =  useSelector(selectUserSlice);
  
  const dispatch = useAppDispatch();

  useEffect(() => {

    if(!currentUser?.id) {
      return
    }

    const unSub = onSnapshot(doc(db, "userchats", currentUser?.id), async (res) => {
      
      const chat = res.data() as DocumentData; 
      const data = chat.chats;
      
      if (data) {
        const promises = data.map(async(i: ChatList) => {
        
          const userDocRef = doc(db, "users", i.receiverId);
          const userDocSnap = await getDoc(userDocRef);
  
          const user = userDocSnap.data() as UserState;
    
          return {...i, user};
        })
          
          const chatData = await Promise.all(promises);
          
          setChats(chatData.sort((a, b) => b.updateAt - a.updateAt));
      }
      
    });

    return () => {
      unSub();
    }
  }, [currentUser?.id]);

  const handleSelect = async (chat: ChatUserList) => {
    
    const userChats = chats.map(item => {
      const { user, ...rest } = item;
      return rest;
    })

    const chatIndex = userChats.findIndex(item => item.chatId === chat.chatId)

    userChats[chatIndex].isSeen = true;
    const userChatsRef = doc(db, "userchats", currentUser!.id); // убрать оператор ! и типизировать по-другому 

    
    try {
      await updateDoc(userChatsRef, {
        chats: userChats,
      });
      
      dispatch(chageChat({chatId: chat.chatId, user: chat.user, currentUser}));
      
    }catch(error) {
        console.log(error);
        
    }
    
  }  

  // useEffect(() => {
  //   if (!chatId) return;
  //   const unSub = onSnapshot(doc(db, "chats", chatId), async (res: any) => {   
  //     const data = res.data();
  //     setChat(data);
  //     console.log(chat);

      
  //   });
    
  //   return () => {
  //     unSub();
  //   };
  // }, [chatId])


  const filteredChats = chats.filter((c) => c.user.username.toLowerCase().includes(inputText.toLowerCase()))

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      
      if (
        containerRef.current && 
        !containerRef.current.contains(target) && 
        !target.classList.contains("add")
      ) {
        setAddMode(false);
        
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className='chat-list'>
      <div className="search">
        <div className="search-bar">
          <img src={search} alt=""/>
          <input type="text" placeholder='Поиск' name="" id="" onChange={(e) => setInputText(e.target.value)}/>
        </div>
        <img src={addMode ? minus : plus} alt="" className="add" onClick={() => setAddMode(!addMode)} />
      </div>
      {
        filteredChats.map((el) => (

          <div className="item" key={el.chatId} onClick={() => handleSelect(el)} style={{backgroundColor: el.isSeen ? "transparent" : "rgba(227, 255, 255, 0.42)"}}>
            <img src={avatar} alt="" />
            <div className="texts">
              <span>{el.user.username}</span>
              <p className="lastMess">{el.lastMessage}</p>
              {/* <p>{chat.length > 0 ? (chat.messages[0].senderId.id === currentUser?.id ? "Вы: " : "") : '' }{lastMes}</p> */}
            </div>
          </div>
        ))
      }
      <div ref={containerRef}>
        {addMode && <AddUser />}
      </div>
      
    </div>
  )
}

export default ChatList
