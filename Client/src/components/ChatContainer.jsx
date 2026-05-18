import React, { useContext, useEffect, useRef, useState } from 'react'
import male from "../assets/male.svg"
import arrow from "../assets/arro.svg"
import help from "../assets/helpicon.svg"
import logo from "../assets/logo.svg"
import assets, { messagesDummyData } from '../assets/assets'
import { formatMessageTime } from '../lib/utils'
import gallery from "../assets/gallery.png"
import send from "../assets/send.png"
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'

const ChatContainer = () => {

  const { messages, selectedUser, setSelectedUser, getMessages , sendMessage} = useContext(ChatContext)
  
  const {authUser, onlineUsers} = useContext(AuthContext)

  const [input , setInput] = useState('')

  const scrollEnd = useRef()
  
  useEffect(()=>{
    if (scrollEnd.current){
      scrollEnd.current.scrollIntoView({behaviour: "smooth"})
    }
  },[])

  return selectedUser ? (
    <div className='h-full overflow-scroll relative backdrop-blur-lg'>
      {/*----header----*/}
      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
        <img src={male} alt="" className='w-12 rounded-full'/>
        <p className='flex-1 text-lg text-black flex items-center gap-2'>
          Martin Jhonson
          <span className='w-3 h-3 rounded-full bg-green-500'></span>
        </p>
        <img onClick={()=>setSelectedUser(null)} src={arrow} alt="" className='md:hidden max-w-12'/>
        <img src={help} alt="" className='max-md:hidden max-w-8'/>
        
      </div>

      {/*---- chat area ----*/}
      <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
          {messagesDummyData.map((msg,index)=>{
            return (
            <div key={index} className={`flex items-end gap-2 justify-end ${msg.senderId !== '680f50e4f10f3cd28382ecf9' && 'flex-row-reverse'}`}>
              {msg.image? (
                <img src={msg.image} alt='' className='max-w-57.5 border border-gray-700 rounded-lg overflow-hidden mb-8'/>
              ) : (
                <p className={`p-2 max-w-50 md:text-sm font-light rounded-lg mb-8 break-all bg-amber-500/30 text-white 
                ${msg.senderId === '680f50e4f10f3cd28382ecf9' ? 'rounded-br-none' : 'rounded-bl-none'}`}>
                {msg.text}
                </p>
              )}
              <div className='text-center text-xs'>
                <img src={msg.senderId === '680f50e4f10f3cd28382ecf9' ? assets.avatar_icon : assets.male} alt='' className='w-7 rounded-full'/>
                <p className='text-gray-500'>{formatMessageTime(msg.createdAt) }</p>
              </div>

            </div>)
          })}
          <div ref={scrollEnd}></div>
      </div>

      {/* ---- bottom area ---- */}

      <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
        <div className='flex-1 flex items-center bg-amber-200 px-3 rounded-full'>
          <input onChange={(e)=>setInput(e.target.value)}  value={input} type="text" placeholder='Send a message' className=' flex-1 text-sm p-3 border-none rounded-lg outline-none
          text-black placeholder-black'/>
          <input onKeyDown={(e)=> e.key ==="Enter" ? handleSendMessage(e): null} type='file' id='image' accept='image/pmg, image/jpeg, image/svg' hidden/>
          <label htmlFor='image' >
            <img src={gallery} alt='' className="w-5 ml-2 cursor-pointer"/>
          </label>
        </div>
        <img src={send} alt='' className='w-7 cursor-pointer'/>

      </div>


    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
      <img src={logo} className='max-w-24' alt=''/>
      <p className='text-lg font-light text-black'>Chat anytime, anywhere</p>
    </div>
  )
}

export default ChatContainer
