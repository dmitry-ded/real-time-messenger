import { useEffect, useRef, useState } from 'react'
import "./popupChats.css"
import avatar from "../../assets/img/avatar.jpg"
import plus from "../../assets/img/plus.png"
import search from "../../assets/img/search.png"
import minus from "../../assets/img/minus.png"
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { chageChat } from '../../redux/slices/chatSlice';
import { useAppDispatch } from '../../redux/store';
import { useSelector } from 'react-redux';
import { selectUserSlice } from '../../redux/slices/userSlice';
import { Chat } from '../list/chatList/ChatList';
import AddUser from '../list/chatList/addUser/AddUser'
import more2 from "../../assets/img/more2.png"

interface User {
  id: string;
  email: string,
  username: string,
  blocked: [],
}

const PopupChats = () => {

  const sortRef = useRef<HTMLDivElement>(null);

  const [chats, setChats] = useState<Chat[]>([]);
  const [addMode, setAddMode] = useState(false);
  const [inputText, setInputText] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);

  const addModeRef = useRef<HTMLDivElement>(null);
  
  const { currentUser } =  useSelector(selectUserSlice);

  const dispatch = useAppDispatch();
  

  const [isVisible, setIsVisible] = useState(false);


  useEffect(() => {
  
      if(!currentUser?.id) {
        return
      }
  
      const unSub = onSnapshot(doc(db, "userchats", currentUser?.id), async (res: any) => {
        
        const data = res.data().chats;
      
        if (data){
          const promises = data.map(async(i: any) => {
            const userDocRef = doc(db, "users", i.receiverId);
            const userDocSnap = await getDoc(userDocRef);
    
            const user = userDocSnap.data();
    
            return {...i, user};
          })
          
          const chatData: any = await Promise.all(promises)
          setChats(chatData.sort((a: any, b:any) => b.updatedAt - a.apdatedAt));
  
        }
      });
  
      return () => {
        unSub();
      }
    }, [currentUser?.id]);

    console.log(currentUser);
    

  const handleSelect = async (chat: any) => {
      
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

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      
      if (
        containerRef.current && 
        !containerRef.current.contains(event.target) && 
        addModeRef.current && 
        !addModeRef.current.contains(event.target as Node) && 
        !event.target.classList.contains("add")
        ) {
          setIsVisible(false);
          
        if (
          containerRef.current && 
          !containerRef.current.contains(event.target) && 
          !event.target.classList.contains("add2")
          ) {
            setAddMode(false);

        }
      }

      if (
        addModeRef.current && 
        !addModeRef.current.contains(event.target) && 
        !event.target.classList.contains("add2")
        ) {
        setAddMode(false);
      }

    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const filteredChats = chats.filter((c) => c.user.username.toLowerCase().includes(inputText.toLowerCase()))
  
  return (
    <div className="chats-popup">
      <div className="chats-label">
        <img src={more2} alt="" className="add" onClick={() => setIsVisible(!isVisible)} />
      </div>
      {
        isVisible && (
          <div className='chats-popup-block' ref={containerRef}>
            <div className="search">
              <div className="search-bar">
                <img src={search} alt=""/>
                <input type="text" placeholder='Поиск' name="" id="" onChange={(e) => setInputText(e.target.value)}/>
              </div>
              <img src={addMode ? minus : plus} alt="" className="add2" onClick={() => setAddMode(prev => !prev)} />
            </div>
            <div className="chats-popup-add">
              {
                filteredChats.map((el) => (
                  <div className="item"  onClick={() => handleSelect(el)} style={{backgroundColor: el.isSeen ? "transparent" : "rgba(227, 255, 255, 0.42)"}} >
                    <img src={avatar} alt="" />
                    <div className="texts">
                      <span>{el.user.username}</span>
                      <p className="lastMess">{el.lastMessage}</p>
                      {/* <p>{chat.length > 0 ? (chat.messages[0].senderId.id === currentUser?.id ? "Вы: " : "") : '' }{lastMes}</p> */}
                    </div>
                  </div>
                ))
              }
              
            </div>
          </div>
        )
      }
      <div className="popup-add-user" ref={addModeRef}>
        {addMode && <AddUser />}
      </div>
    </div>
  )
}

export default PopupChats
