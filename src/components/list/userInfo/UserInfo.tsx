import "./userInfo.css"
import avatar from "../../../assets/img/avatar.jpg"
import video from "../../../assets/img/video.png"
import more from "../../../assets/img/more.png"
import edit from "../../../assets/img/edit.png"
import { useSelector } from 'react-redux'
import { selectUserSlice } from '../../../redux/slices/userSlice'

const UserInfo = () => {

  const { currentUser } = useSelector(selectUserSlice);  

  return (
    <div className='user-info'>
      <div className='user'>
        <img src={avatar} alt="" />
        <h2>{currentUser?.username}</h2>
      </div>
      <div className="icons">
        <img src={video} alt="" />
        <img src={more} alt="" />
        <img src={edit} alt="" />
      </div>
    </div>
  )
}

export default UserInfo
