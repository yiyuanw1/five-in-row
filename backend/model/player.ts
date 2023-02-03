var PlayerPool: Player[] = []
import {v4 as uid} from 'uuid';
import {Icon, getIcon} from './icon'
class Player{
  id: string
  name: string
  icon: Icon
  constructor(name: string, icon: string){
    this.name = name
    this.icon = getIcon(icon);
    this.id = this.generateUUID();
    PlayerPool.push(this)
  }

  generateUUID() :string {
    let temp = uid()
    if (PlayerPool.filter((p) => {p.id === temp}).length != 0){
      return this.generateUUID()
    }
    return temp
  }

}

export {PlayerPool, Player}