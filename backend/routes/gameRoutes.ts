import { Application, Request, Response } from "express";
import Routes from ".";
import { Game, GamePool } from "../model/game";
import { SocketMethod } from "../socket";

export default class GameRoutes extends Routes {
  constructor(app: Application) {
    super(app, "game routes");
  }

  configureRoutes() {
    this.app.route(`/game/create`).post((req: Request, resp: Response) => {
      interface reqBody{
        pid: string
      }

      const {pid} = req.body as reqBody
      const game = new Game(pid)
      console.log('create game successful')
      resp.status(200).json({id: game.id})
    });

  }


}
