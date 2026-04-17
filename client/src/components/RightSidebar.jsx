import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext';

const RightSidebar = () => {

  const { selectedUsers, messages } = useContext(ChatContext);
  const {logout, onlineUsers } = useContext(AuthContext);
  const [msgImages, setmsgImages] = useState([]);

  // get all the images from the messages and set them to state
  useEffect( ()=>{
    setmsgImages(
      messages.filter( msg => msg.image).map( msg => msg.image)
    )

  },[messages])

  return selectedUsers && (
    <div className={`bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll 
    ${selectedUsers ? 'max-md:hidden' : ''}`}>

      <div className='pt-16 flex flex-col items-center text-center gap-2 text-xs font-light mx-auto'>
          <img src={selectedUsers?.profilepic || assets.avatar_icon} alt="" 
          className='w-20 aspect-[1/1] rounded-full '/>
          <h1 className='text-xl font-medium mx-auto flex items-center justify-center gap-2'>
            { onlineUsers.includes(selectedUsers._id) &&  <span className='w-2 h-2 rounded-full bg-green-500 inline-block'></span> }
            {selectedUsers.fullName}
          </h1>
          <p className='px-10 mx-auto'>{selectedUsers.bio}</p>
      </div>

      <hr className='border-[#ffffff50] my-4'/>

      <div className='px-5 text-xs'>
        <p>Media</p>
        <div className='mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-2 opacity-80'>
          {msgImages.map((url, index)=>(
            <div key={index} onClick={()=> window.open(url)} className='cursor-pointer rounded'>
              <img src={url} alt="" className='h-full rounded-md'/>
            </div>
          ))}
        </div>
      </div>
       
       <button onClick={ ()=> logout()} className='absolute bottom-5 left-1/2 transform -translate-1/2
        bg-linear-to-r from-purple-400 to-violet-600 text-white border-none text-sm font-light py-2 px-20
         rounded-full cursor-pointer'>
        Logout
       </button>
    </div>
  )
}

export default RightSidebar