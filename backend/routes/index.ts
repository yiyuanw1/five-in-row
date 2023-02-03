import express from "express"

export default abstract class Routes{

  private RoutesPool: Array<Routes> = []

  app: express.Application
  name: string;

  constructor(app: express.Application, name: string){
    this.app = app
    this.name = name
    this.configureRoutes()
    this.RoutesPool.push(this)
  }

  getName(){
    return this.name
  }

  getPool() {
    return this.RoutesPool
  }

  abstract configureRoutes(): void;  

}