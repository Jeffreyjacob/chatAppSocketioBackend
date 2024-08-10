import {Server as SocketIoServer} from "socket.io"
import Message from "./model/messagesModel.js";

const setUpSocket = (server) => {
    const io = new SocketIoServer(server,{
      cors:{
        origin:process.env.FRONTENDURL,
        methods:["GET","POST"],
        credentials:true
      }
    })

    const userSocketMap = new Map();

    const disconnect = (socket)=>{
         console.log(`Client Disconneted: ${socket.id}`)
         for(const [userId,socketId] of userSocketMap.entries() ){
            if(socketId === socket.id){
                userSocketMap.delete(userId);
                break;
            }
         }
    }

    // const sendMessage = async (message)=>{
    //     console.log(message)
        
    // }

    io.on("connection",(socket)=>{
      const userId = socket.handshake.query.userId;
      if(userId){
        userSocketMap.set(userId,socket.id)
        console.log(`User Connected: ${userId} with socket ID: ${socket.id}`)
      }else{
        console.log("User Id not provided during connection")
      }
      socket.on("sendMessage",async (message)=>{
        const senderSocketId = userSocketMap.get(message.sender);
        const recipientSocketId = userSocketMap.get(message.recipient)
         console.log(recipientSocketId,senderSocketId)
        const createdMesage = await Message.create(message);
         
        const messageData = await Message.findById(createdMesage._id)
        .populate("sender","id firstName email lastName image color ")
        .populate("recipient","id firstName email lastName image color ")
        
        if(recipientSocketId){
            io.to(recipientSocketId).emit("recieveMessage",messageData);
        }
        if(senderSocketId){
            io.to(senderSocketId).emit("recieveMessage",messageData);
        }
      })

      socket.on("disconnect",()=>disconnect(socket))
    })
};

export default setUpSocket;