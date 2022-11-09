import { io } from "socket.io-client";
import { API_URL } from "../config/api.config";

const socket = io(API_URL, { autoConnect: true });

socket.onAny((event, ...args) => {
    console.log(event, args);
});
  
export default socket;