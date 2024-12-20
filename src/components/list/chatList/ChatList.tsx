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
import { addIdChat, addName } from "../../../redux/slices/chatListSlice"
import { selectCurrentChatSlice } from "../../../redux/slices/currentChatSlice"

export interface ChatUserList {
  chatId: string,
  isSeen: boolean,
  lastMessage: string,
  receiverId: string,
  updateAt: number,
  user: UserState,
}

export interface ChatListType {
  chatId: string,
  isSeen: boolean,
  lastMessage: string,
  receiverId: string,
  updateAt: number,
}

export type DocumentData = {
  chats: ChatListType[]; 
}

const ChatList = () => {

  const [chats, setChats] = useState<ChatUserList[]>([]);
  const [addMode, setAddMode] = useState(false);
  const [inputText, setInputText] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);

  const { currentUser } =  useSelector(selectUserSlice);
  const { currentChat } =  useSelector(selectCurrentChatSlice);  
  
  const dispatch = useAppDispatch();

  useEffect(() => {

    if(!currentUser?.id) {
      return
    }

    const unSub = onSnapshot(doc(db, "userchats", currentUser?.id), async (res) => {
      
      const chat = res.data() as DocumentData; 
      const data = chat.chats;
      
      if (data) {
        const promises = data.map(async(i: ChatListType) => {
        
          const userDocRef = doc(db, "users", i.receiverId);
          const userDocSnap = await getDoc(userDocRef);
  
          const user = userDocSnap.data() as UserState;
    
          return {...i, user};
        })
          
          const chatData = await Promise.all(promises);
          chatData.forEach((el) => {
            dispatch(addIdChat(el.receiverId));
            dispatch(addName(el.user.username));

          })
          
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
      if (currentUser) {
        dispatch(chageChat({chatId: chat.chatId, user: chat.user, currentUser}));
      }
      else {
        console.log("currentUser is null");
        
      }
      
    }catch(error) {
        console.log(error);
        
    }
    
  };

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
  
  const filteredChats = chats.filter((c) => c.user.username.toLowerCase().includes(inputText.toLowerCase()));

  useEffect(() => {
    setAddMode(false);
  }, [filteredChats.length])

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
          
          <div className="item" key={el.chatId} onClick={() => handleSelect(el)} style={{backgroundColor: currentChat === el.user.id ? "rgba(0, 207, 207, 0.57)" : "transparent"}}>
            <div className="user-description">
              <img src={avatar} alt="" />
              <div className="texts">
                <span>{el.user.username}</span>
                <p className="lastMess">{el.lastMessage}</p>
                {/* <p>{chat.length > 0 ? (chat.messages[0].senderId.id === currentUser?.id ? "Вы: " : "") : '' }{lastMes}</p> */}
              </div>
              <div className="new-message" style={{display: el.isSeen ? "none" : "flex"}}>
                {el.isSeen ? <></> : (<span>1</span>)}
              </div>
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
