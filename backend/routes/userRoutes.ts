import { Application, Request, Response } from "express";
import Routes from ".";
import { PlayerPool, Player } from "../model/player";

export default class UserRoutes extends Routes {
  constructor(app: Application) {
    super(app, "user routes");
  }
  configureRoutes() {
    this.app.route(`/register`).post((req: Request, resp: Response) => {
      const player: Player = new Player(req.body.name, "Cyberman")
      console.log('register successful')
      resp.status(200).json(player)
    });

  }
}
