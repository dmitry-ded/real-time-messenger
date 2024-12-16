import { useState } from 'react'
import "./login.css"
import avatar from "../../assets/img/avatar.jpg"
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../../lib/firebase';
import { doc, setDoc } from "firebase/firestore"; 
// import upload from '../../lib/upload';

const Login = () => {

  const [ava, setAva] = useState({
    file: null,
    url: '',
  });

  const [load, setLoad] = useState(false);

  const handleAvatar = (e: any) => {
    if (e.target.files[0]) {
      setAva({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      })
    }
  }

  const handleRegister = async (e: any) => {
    e.preventDefault();
    setLoad(true);
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData)

    if (typeof email !== 'string' || typeof password !== 'string') {
      toast.error('Неверный формат email или пароля');
      return
    }

    try{ 

      const res = await createUserWithEmailAndPassword(auth, email, password);   
      
      // const imgUrl = await upload(ava.file)
      

      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email, 
        // avatar: imgUrl,
        id: res.user.uid,
        blocked: [],
      });

      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });


      toast.success("Вы успешно зарегестрировались!")
    }catch(error) {
      console.log(error);
      toast.error("Ошибка при регистрации!")
    } finally{ 
      setLoad(false)
    }
    
  }

  const handleLogin  = async (e: any) => {
    e.preventDefault();
    setLoad(true)
    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData)

    if (typeof email !== 'string' || typeof password !== 'string') {
      toast.error('Неверный формат email или пароля');
      return
    }

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);

    }catch(e: any) {
      console.log(e);
      toast.error('Неверный формат email или пароля');
    }finally{ 
      setLoad(false)
    }
  }

  return (
    <div className='login'>
      <div className="item">
        <h2>Добро пожаловать!</h2>
        <form onSubmit={handleLogin}>
          <input type="text" name="email" placeholder='Введите почту' />
          <input type="password" name="password" placeholder='Введите пароль' />
          <button disabled={load} >{load ? "Загрузка" : "Войти" }</button>
        </form>
      </div>
      <div className="separator"></div>
      <div className="item">
        <h2>Создайте учетную запись!</h2>
        <form onSubmit={handleRegister}>
          <label htmlFor="file">
            <img src={ava.url || avatar} alt="" />
            Загрузи фотографию
          </label>
          <input type="file" id='file' style={{display: "none"}} onChange={handleAvatar}/>
          <input type="text" name="username" placeholder='Введите имя' />
          <input type="text" name="email" placeholder='Введите почту' />
          <input type="password" name="password" placeholder='Введите пароль' />
          <button disabled={load} >{load ? "Загрузка" : "Зарегистрироваться" }</button>
        </form>
      </div>
    </div>
  )
}

export default Login
