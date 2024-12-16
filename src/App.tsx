import { useEffect } from "react";
import Chat from "./components/chat/Chat";
import Detail from "./components/detail/Detail";
import List from "./components/list/List";
import Login from "./components/login/Login";
import Notification from "./components/notification/Notification";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useAppDispatch } from "./redux/store";
import { useSelector } from "react-redux";
import { fetchUserInfo, removeUser, selectUserSlice } from "./redux/slices/userSlice";
import { selectChatSlice } from "./redux/slices/chatSlice";



function App() {

  const dispatch = useAppDispatch();
  const { currentUser, isLoading } = useSelector(selectUserSlice);
  const { chatId } = useSelector(selectChatSlice);
  

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user)=> {
      if (user?.uid) {
        dispatch(fetchUserInfo(user?.uid));
      } else {
        dispatch(removeUser());
      }
      
    })
    
    return () => {
      unSub();
    };
  }, [dispatch])
  

  if (isLoading) {
    return <div className="loading">Загрузка...</div>
  }
  
  return (
    <div className="container">
      {
        currentUser 
        ? (
          <> 
            <List />
            {chatId && <Chat />}
            {chatId && <Detail />}
          </>
        ) : (<Login />)
      }
      <Notification />
    </div>
  );
}

export default App;
