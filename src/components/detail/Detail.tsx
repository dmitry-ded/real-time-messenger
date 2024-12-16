import React from 'react'
import "./detail.css"
import avatar from "../../assets/img/avatar.jpg"
import arrowUp from "../../assets/img/arrowUp.png"
import arrowDown from "../../assets/img/arrowDown.png"
import download from "../../assets/img/download.png"
import { auth, db } from '../../lib/firebase'
import { useSelector } from 'react-redux'
import { changeBlock, selectChatSlice } from '../../redux/slices/chatSlice'
import { selectUserSlice } from '../../redux/slices/userSlice'
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore'


const Detail = () => {

  const { user, isCurrentUserBlocked, isReceiverBlocked } = useSelector(selectChatSlice);
  const { currentUser } = useSelector(selectUserSlice);

  const handleBlock = async () => {
    alert("В разработке")

    // if (!user) return;

    // const userDocRef = doc(db, "users", currentUser?.id);

    // try {
    //   await updateDoc(userDocRef, {
    //     blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
    //   })
    //   changeBlock()
    //   console.log(123);
      
    // }catch (error) {
    //   console.log(error);
      
    // }
  }

  return (
    <div className='detail'>
      <div className="user">
        <img src={avatar} alt="" />
        <h2>{user.username}</h2>
        <p>Lorem ipsum dolor</p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Настройки чата</span>
            <img src={arrowUp} alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Конфиденциальность</span>
            <img src={arrowUp} alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Вложения</span>
            <img src={arrowDown} alt="" />
          </div>
          <div className="photos">
            <div className="photos-scroll">
              <div className="photo-item">
                <div className="photo-detail">
                  <img src={avatar} alt="" />
                  <span>photo_2024_02_12</span>
                </div>
                <img src={download} alt="" className="icon"/>
              </div>
              <div className="photo-item">
                <div className="photo-detail">
                  <img src={avatar} alt="" />
                  <span>photo_2024_02_12</span>
                </div>
                <img src={download} alt="" className="icon"/>
              </div>
              <div className="photo-item">
                <div className="photo-detail">
                  <img src={avatar} alt="" />
                  <span>photo_2024_02_12</span>
                </div>
                <img src={download} alt="" className="icon"/>
              </div>
              <div className="photo-item">
                <div className="photo-detail">
                  <img src={avatar} alt="" />
                  <span>photo_2024_02_12</span>
                </div>
                <img src={download} alt="" className="icon"/>
              </div>
              <div className="photo-item">
                <div className="photo-detail">
                  <img src={avatar} alt="" />
                  <span>photo_2024_02_12</span>
                </div>
                <img src={download} alt="" className="icon"/>
              </div>
              <div className="photo-item">
                <div className="photo-detail">
                  <img src={avatar} alt="" />
                  <span>photo_2024_02_12</span>
                </div>
                <img src={download} alt="" className="icon"/>
              </div>
              <div className="photo-item">
                <div className="photo-detail">
                  <img src={avatar} alt="" />
                  <span>photo_2024_02_12</span>
                </div>
                <img src={download} alt="" className="icon"/>
              </div>
              <div className="photo-item">
                <div className="photo-detail">
                  <img src={avatar} alt="" />
                  <span>photo_2024_02_12</span>
                </div>
                <img src={download} alt="" className="icon"/>
              </div>
              <div className="photo-item">
                <div className="photo-detail">
                  <img src={avatar} alt="" />
                  <span>photo_2024_02_12</span>
                </div>
                <img src={download} alt="" className="icon"/>
              </div>
              <div className="photo-item">
                <div className="photo-detail">
                  <img src={avatar} alt="" />
                  <span>photo_2024_02_12</span>
                </div>
                <img src={download} alt="" className="icon"/>
              </div>
              <div className="photo-item">
                <div className="photo-detail">
                  <img src={avatar} alt="" />
                  <span>photo_2024_02_12</span>
                </div>
                <img src={download} alt="" className="icon"/>
              </div>
            </div>
          </div>
        </div>
        <div className="button-block">
          <button className='block' onClick={handleBlock}>
            {isCurrentUserBlocked ? "Вы заблокированы" : isReceiverBlocked ? "Пользователь заблокирован" : "Заблокировать пользователя"}
          </button>
          <button className='logout' onClick={() => auth.signOut()}>Выйти из системы</button>
        </div>
      </div>
    </div>
  )
}

export default Detail
