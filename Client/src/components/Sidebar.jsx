import React, { useContext, useEffect, useState } from 'react'
import logo from "../assets/logo.svg"
import menu from "../assets/menu.svg"
import {useNavigate} from 'react-router-dom'
import search from "../assets/search_icon.svg"
import assets, { userDummyData } from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'
import { ChatContext } from '../../context/ChatContext'

const Sidebar = () => {

  const { getUsers, users , selectedUser, setSelectedUser,
    unseenMessages, setUnseenMessages}= useContext(ChatContext)

  const {logout, onlineUsers} = useContext(AuthContext)
  const[input, setInput] = useState(false)

  const filteredUsers = input ? users.filter((user)=>{user.fullName.toLowerCase()
  .includes(input.toLowerCase())}) : users;

  useEffect (()=>{
    getUsers(); 

  },[onlineUsers])




  const navigate= useNavigate();
  return (
    <div className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${selectedUser? "max-md:hidden":''}`}>
      <div className='pb-5'>
        <div className='flex justify-between items-center'>
            <img src={logo} alt="logo" className='max-w-12 top-0'/>
            <h1 className='text-black'>WebChat</h1>
            <div className="relative py-2 group">
                <img src={menu} alt="Menu" className='max-h-8 cursor-pointer'/>
                <div className='absolute top-full right-0  z-20  w-32 p-5 rounded-md bg-amber-500 border border-gray-600 text-black
                hidden group-hover:block'>
                    <p onClick={()=>navigate('/profile')} className='cursor-pointer text-sm'>
                        Edit Profile
                    </p>
                    <hr className="my-2 border-t border-gray-500"/>
                    <p onClick={()=> logout()} className='cursor-pointer text-sm'>Logout</p>

                </div>

            </div>
        </div>
        <div className='flex bg-amber-400 rounded-full items-centre gap-2'>
          <img src={search} alt="search" className='w-8'/>
          <input onChange={(e)=>setInput(e.target.value)} type= 'text' className='bg-transparent border-none outline-none text-white text-lg placeholder-white flex-1'
          placeholder='Search User...'/> 
        </div>
      </div>

      <div className='flex  flex-col'>
        {filteredUsers.map((user, index)=>(
          <div onClick={()=>{setSelectedUser(user)}} key= {index} className={`relative flex text-black items-center gap-2 p-2 pl-4 rounded-lg space-1
             cursor-pointer max-sm:text-sm ${selectedUser?._id === user._id
            && 'bg-amber-200/50'}`}>
            <img src={user?.profilePic || assets.avatar_icon} alt=""
            className="w-8.75 aspect-square rounded-full" />
            <div className='flex flex-col leading-5'>
              <p>{user.fullName}</p>
              {
                onlineUsers.includes(user._id)
                ? <span className='text-green-400 text-xs'>Online</span>
                : <span className='text-gray-400 text-xs'>Offline</span>
              }

            </div>
            {unseenMessages[user._id] && <p className='absolute top-4 right-4 text-xs h-5 w-5 
            flex justify-center items-center rounded-full bg-purple-400'>{unseenMessages[user._id]}</p>}
          </div>
        ))}

      </div>
    </div>
  )
}

export default Sidebar
