import { IService } from "@aptero/axolotis-player";

export default class RoomService implements IService {
  //public static dependencies: string[] = [PHX_AUTH_SERVICE, STORE_SERVICE, PROPERTIES_SERVICE, NAME_SERVICE, COOKIE_STORE_SERVICE];

  constructor() {}

  getType(): string {
    return RoomService.name;
  }

  async createRoom(sceneid) {
    //TODO get hubs room service
    /*let url = await this.createAndSelect(sceneid);
    console.log("created room : " + url);
    changeUrlSettings(url);*/
    throw new Error();
  }

  changeUrlSettings(url) {
    /*//TODO get hubs room service
    return changeUrlSettings(url);*/
    throw new Error();
  }
}
