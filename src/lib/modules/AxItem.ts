import {IService, Module} from "@aptero/axolotis-player";
import {Item} from "@aptero/axolotis-player";
import {Properties} from "@root/lib/modules/properties/Properties";
import {
  COOKIE_STORE_SERVICE,
  MICROSOFT_SERVICE,
  MICROSOFT_STATIC_SERVICE,
  MsTeams, NAME_SERVICE,
  PHX_AUTH_SERVICE,
  PROPERTIES_SERVICE, ROOM_SERVICE,
  STORE_SERVICE
} from "@root/lib";
import {registerItem} from "@aptero/axolotis-player";
import Store from "@root/lib/modules/store/store";
import {PhoenixAuthService} from "@root/lib/modules/phoenixAuth/PhoenixAuthService";
import {NameGenerationService} from "@root/lib/modules/nameGeneration/NameGenerationService";
import {CookieStore} from "@root/lib/modules/store/CookieStore";
import {RoomService} from "@root/lib/modules/roomAPI/RoomService";

export class AxItem implements Item{
  staticService():{[id:string]:IService}{
    let ret = {};
    ret[MICROSOFT_STATIC_SERVICE] = new MsTeams();
    ret[PROPERTIES_SERVICE] = new Properties();
    ret[STORE_SERVICE] = new Store();
    ret[PHX_AUTH_SERVICE] = new PhoenixAuthService();
    ret[NAME_SERVICE] = new NameGenerationService();
    ret[COOKIE_STORE_SERVICE] = new CookieStore();
    ret[ROOM_SERVICE] = new RoomService();
    return ret;
  }

  modules():{[id:string]:Module}{
    let ret = {};
    ret[MICROSOFT_SERVICE] = async () => {
      const module = await import("./microsoft/MicrosoftService");
      return {module, classname: module.Factory.name}
    };
    return ret;
  }
}

registerItem(new AxItem());