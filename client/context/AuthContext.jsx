import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {io} from "socket.io-client";
import { useNavigate } from "react-router-dom";


const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl
console.log("Backend URL:", backendUrl);

export const AuthContext = createContext();

export const Authprovider = ({ children })=>{

    const navigate = useNavigate();
    
    const [token, settoken] = useState(localStorage.getItem("token")) 
    const [authUser, setauthUser] = useState(null);
    const [onlineUsers, setonlineUsers] = useState([]);
    const [socket, setsocket] = useState(null);


    // check if user is authenticated and if so, set the user data and connect the socket
        const CheckAuth = async()=>{
            try {

                const {data} =  await axios.get("/api/auth/check")
                if(data.success){
                    setauthUser(data.user)
                    connectSocket(data.user)
                }
                
            } catch (error) {
                toast.error(error.message)   
            }
        }

    // login function to handle user authentication and socket connection
        const login = async(state, credentials)=>{
            try {
                const {data} = await axios.post(`/api/auth/${state}`, credentials)
                if(data.success){
                    setauthUser(data.user);
                    connectSocket(data.user);
                    axios.defaults.headers.common["token"] = data.token;
                    settoken(data.token);
                    localStorage.setItem("token", data.token)
                    toast.success(data.message)
                  
                    navigate("/")
                }else{
                toast.error(data.message || 'Login failed')   

                }
                
            } catch (error) {
                toast.error(error.message)   
            }

        }
    
    // logout function to handle user logout and socket disconnection
    const logout = async()=>{
        localStorage.removeItem("token");
        settoken(null);
        setauthUser(null);
        setonlineUsers([]);
        axios.defaults.headers.common["token"] = null
        toast.success("logout successfully");
        if(socket) socket.disconnect();
    }

    // update profile function to handle user profile updates
    const updateProfile = async(body)=>{
        try {
            
            const {data } = await axios.put("/api/auth/update-profile", body);
            if(data.success){
                setauthUser(data.user)
                toast.success("prifile updated successfully")
            }
        } catch (error) {
                toast.error(error.message)   
            
        }

    }

    // connect socket function to handle socket connection and online users updates
        const connectSocket = (userData)=>{
            if(!userData || socket?.connected) return;

            const newSocket = io(backendUrl, 
               { query: {
                userId : userData._id,

                }
            });
            newSocket.connect();
            setsocket(newSocket);

            newSocket.on("getOnlineUsers", (userIds)=>{
                setonlineUsers(userIds);
            })
        }


    // useeffect
    useEffect(()=>{
       if(token){
        axios.defaults.headers.common["token"] = token;
       }

       CheckAuth();
    },[]) 
    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile
    }
    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )

}