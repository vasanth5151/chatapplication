import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";


export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {

    const [messages, setmessages] = useState([]);
    const [users, setusers] = useState([]);
    const [selectedUsers, setselectedUsers] = useState(null);
    const [unseenmessages, setunseenmessages] = useState({});

    const { socket, axios } = useContext(AuthContext);

    // function to gell all users for sidebar
    const getUsers = async () => {
        try {
            const { data } = await axios.get("/api/messages/users");
            if (data.success) {
                setusers(data.users)
                setunseenmessages(data.unseenmessages || {})
            }
        } catch (error) {
            toast.error(error.message)

        }
    }


    // function to get messages for selected users
    const getMessages = async (userId) => {
        try {
            const { data } = await axios.get(`/api/messages/${userId}`);
            if (data.success) {
                setmessages(data.messages)

            }
        } catch (error) {
            toast.error(error.message)

        }
    }

    // function to send messages to selected users
    const sendMessages = async (messageData) => {
        try {
            const { data } = await axios.post(`/api/messages/send/${selectedUsers._id}`, messageData);
            if (data.success) {
                setmessages((prevMessages) => [...prevMessages, data.newMessage])
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // function to subscribe to messages for selected user
    const subscribeToMessages = () => {
        if (!socket) return;

        socket.on("newMessage", (newMessage) => {
            if (selectedUsers && newMessage.senderId === selectedUsers._id) {
                newMessage.seen = true;
                setmessages((preMessages) => [...preMessages, newMessage]);
                axios.put(`/api/messages/${newMessage._id}`);

            } else {
                setunseenmessages((prevUnseenMessages) => ({
                    ...prevUnseenMessages, [newMessage.senderId]:
                        prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1
                }))
            }

        })
    }

    // function to unsunscribe from messages
    const unsubscribeFromMessages = () => {
        if (socket) socket.off("newMessage");
    }

    useEffect(() => {
        subscribeToMessages();
        return () => {
            unsubscribeFromMessages();
        }
    }, [socket, selectedUsers])

    const value = {
        messages, users, selectedUsers, getUsers, getMessages,
        sendMessages, setselectedUsers,
        unseenmessages, setunseenmessages

    }
    return (
        <ChatContext.Provider value={value}>
            {children}

        </ChatContext.Provider>
    )
}