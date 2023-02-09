import { io, Socket } from "socket.io-client";

const ENDPOINT = "http://localhost:5000";

export default class ISocket{
  private socket:Socket;
  private static instance: ISocket;

  private constructor(){
    this.socket = io(ENDPOINT)
  }

  static getInstance(){
    if (!ISocket.instance) ISocket.instance = new ISocket();
    return ISocket.instance
  }

  on(token: string, func: (...args: any) => void){
    this.socket.on(token, func)
  }

  emit(token: string, ...args: any[]){
    this.socket.emit(token, ...args)
  }

  off(token: string){
    this.socket.off(token)
  }
}