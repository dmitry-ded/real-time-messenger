import { useEffect, useRef, useState } from 'react'
import "./chat.css"
import avatar from "../../assets/img/avatar.jpg"
import video from "../../assets/img/video.png"
import phone from "../../assets/img/phone.png"
import emoji from "../../assets/img/emoji.png"
import mic from "../../assets/img/mic.png"
import camera from "../../assets/img/camera.png"
import image from "../../assets/img/img.png"
import EmojiPicker from 'emoji-picker-react'
import { EmojiClickData} from 'emoji-picker-react'
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useSelector } from 'react-redux'
import { selectChatSlice, UserState } from '../../redux/slices/chatSlice'
import { selectUserSlice } from '../../redux/slices/userSlice'
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import PopupChats from '../popupChats/PopupChats'
import PopupDetail from '../popupDetail/PopupDetail'
import { DocumentData } from '../list/chatList/ChatList'
import { useAppDispatch } from '../../redux/store'
import { addCurrentChat } from '../../redux/slices/currentChatSlice'

interface CreatedAtObj {
  nanoseconds: number
  seconds: number
}
interface MessagesList {
  createdAt: CreatedAtObj,
  img: null,
  senderId: UserState,
  text: string,
}
interface Chat {
  createdAt: {},
  messages: MessagesList[],
}

const Chat = () => {

  const [chat, setChat] = useState<Chat>({
    createdAt: {
      nanoseconds: 0,
      seconds: 0,
    },
    messages: []
  });
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState({
    file: null,
    url: "",
  });
  
  const endRef = useRef<HTMLDivElement>(null);

  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useSelector(selectChatSlice);
  const { currentUser } = useSelector(selectUserSlice);

  const dispatch = useAppDispatch();

  useEffect(() => {
    endRef.current?.scrollIntoView({behavior: "smooth"})

  }, [chat?.messages])


  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), async (res) => {   
      
      const tmp = res.data() as Chat
      const data = tmp;
      setChat(data);
      dispatch(addCurrentChat(user.id))
        
    });
    
    return () => {
      unSub();
    };
  }, [chatId])
  

  const handleEmoji = (e: EmojiClickData) => {
    
    setText((prev => prev + e.emoji))
    setOpen(false)
  }

  // const handleImg = (e: any) => {
  //   if (e.target.files[0]) {
  //     setImg({
  //       file: e.target.files[0],
  //       url: URL.createObjectURL(e.target.files[0]),
  //     })
  //   }
  // }

  const handleSend = async () => {
    if(text === "") return;

    let imgUrl = null;


    try {
      setText("");

      // if (img.file) {
      //   imgUrl = await upload(img.file);
      // }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser,
          text,
          createdAt: new Date(),
          ...(img && { img: imgUrl }),
        })
      })

      const userIDs = [currentUser?.id, user.id]

      userIDs.forEach(async (id) => {

        if (!id) {
          throw new Error("ID is undefined");
        }
        const userChatsRef = doc(db, "userchats", id)
        const userChatsSnapshot = await getDoc(userChatsRef);

        if(userChatsSnapshot.exists()) {
          const data = userChatsSnapshot.data();

          if (!data) {
            throw new Error("No data in snapshot");
          }
          const userChatsData = data as DocumentData;
          
          const chatIndex = userChatsData.chats.findIndex((c) => c.chatId === chatId)

          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen = id === currentUser?.id ? true : false;
          userChatsData.chats[chatIndex].updateAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          })
        }
      })

    }catch(err) {
      console.log(err);
      
    }
    setImg({
      file: null,
      url: "",
    })
  }  
  
  return (
    <div className='chat'>
      <div className="top">
        <div className="user">
          <div className="visible-popup">
            <PopupChats />
          </div>
          <img src={avatar} alt="" />
          <div className="texts">
            <span>{user.username}</span>
            <p>
              {/* Был в сети {chat?.length ? format(chat?.messages[0].createdAt.toDate(), "HH:mm", { locale: ru }) : "22:22"} */}
              Был в сети 22:22
            </p>
          </div>
        </div>
        <div className="icons">
          <img src={phone} alt="" />
          <img src={video} alt="" />
        </div>
        <div className="visible-popup">
            <PopupDetail />
        </div>
      </div>
      <div className="center">
        {
          chat?.messages.map((mes) => (
            <div className={mes.senderId.id === currentUser?.id ? "message own" : "message"} key={`${mes.createdAt.seconds}-${mes.createdAt.nanoseconds}`} >
              <div className="text">
                {mes.img && <img src={mes.img} alt="" />}
                <p>{mes.text}</p>
                <span>{format(new Date(mes.createdAt.seconds * 1000 + mes.createdAt.nanoseconds / 1e6), "HH:mm", { locale: ru })}</span>
              </div>
            </div>
          ))
        }
        {img.url && (
          <div className="message own">
            <div className="text">
              <img src={img.url} alt="" />
            </div>
          </div>
        )}
        {
          img.url && (
            <div className='message own'>
              <div className="texts">
                <img src={img.url} alt="" />
              </div>
            </div>
        )}
        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
            <img src={image} alt="" />
          </label>
          {/* <input type="file" id='file' style={{display: "none"}} onChange={handleImg}/> */}
          <img src={camera} alt="" />
          <img src={mic} alt="" />
        </div>
        <input 
          type="text" 
          value={text} 
          placeholder={(isCurrentUserBlocked || isReceiverBlocked) ? "Вы не можете отправить сообщение" : 'Введите сообщение'} 
          onChange={(e) => setText(e.target.value)} 
          onKeyDown={(e) => {if(e.key === "Enter") handleSend()}} 
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
        <div className="emoji">
          <img src={emoji} alt="" onClick={() => setOpen(prev => !prev)}/>
          <div className="picker">
            <EmojiPicker className="picker-emoji" open={open} onEmojiClick={handleEmoji}/>
          </div>
        </div>
        <button className='send-button' onClick={handleSend} disabled={isCurrentUserBlocked || isReceiverBlocked} >Отправить</button>
      </div>
    </div>
  )
}

export default Chat
