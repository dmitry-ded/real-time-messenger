import { useEffect, useRef, useState } from 'react'
import "./popupDetail.css"
import { auth } from '../../lib/firebase';
import more2 from "../../assets/img/more2.png"


const PopupDetail = () => {

  const sortRef = useRef<HTMLDivElement>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const [addMode, setAddMode] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      
      if (
        containerRef.current && 
        !containerRef.current.contains(event.target) && 
        !event.target.classList.contains("add")
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
    <div ref={sortRef} className="detail-popup">
      <div className="detail-label">
        <img src={more2} alt="" className="add" onClick={() => setAddMode(!addMode)} />
      </div>
      <div ref={containerRef}>
        {
          addMode && (
              <div className='detail-popup-block' >
                <div className="detail-popup-button">
                  <button className='logout' onClick={() => auth.signOut()}>Выйти из системы</button>
                </div>
              </div>
          )
        }
      </div>
    </div>
  )
}

export default PopupDetail
