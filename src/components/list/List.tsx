import { useEffect, useState } from 'react'
import "./list.css"
import UserInfo from './userInfo/UserInfo'
import ChatList from './chatList/ChatList'
import { selectChatSlice } from '../../redux/slices/chatSlice'
import { useSelector } from 'react-redux'

const List = () => {

  const { chatId } = useSelector(selectChatSlice);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 450);
    };

    handleResize();
    
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };

  }, []);

  return (
    <div className='list' style={{display: !chatId || !isMobile ? "flex" : "none"}}>
      <UserInfo />
      <ChatList />
    </div>
  )
}

export default List
