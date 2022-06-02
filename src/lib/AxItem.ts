import { IService, Module } from "@aptero/axolotis-player";
import { Item } from "@aptero/axolotis-player";
import {
  COOKIE_STORE_SERVICE,
  MICROSOFT_SERVICE,
  MICROSOFT_STATIC_SERVICE,
  NAME_SERVICE,
  PHX_AUTH_SERVICE,
  PROPERTIES_SERVICE,
  ROOM_SERVICE,
  STORE_SERVICE,
} from "@root/index";

//These static imports should be lightweight
import { MsTeamsAPILight } from "@root/modules/microsoft/MsTeamsAPILight";

import { Properties } from "@root/modules/properties/Properties"; //TODO migrate to own package
import Store from "@root/modules/store/Store"; //TODO migrate to own package
import { PhoenixAuthService } from "@root/modules/phoenixAuth/PhoenixAuthService"; //TODO migrate to own package
import { NameGenerationService } from "@root/modules/nameGeneration/NameGenerationService"; //TODO migrate to own package
import { CookieStore } from "@root/modules/store/CookieStore"; //TODO migrate to own package
import { RoomService } from "@root/modules/roomAPI/RoomService"; //TODO migrate to own package

export class AxItem implements Item {
  staticService(): { [id: string]: IService } {
    let ret = {};
    ret[MICROSOFT_STATIC_SERVICE] = new MsTeamsAPILight();
    ret[PROPERTIES_SERVICE] = new Properties(); //TODO migrate to own package
    ret[STORE_SERVICE] = new Store(); //TODO migrate to own package
    ret[PHX_AUTH_SERVICE] = new PhoenixAuthService(); //TODO migrate to own package
    ret[NAME_SERVICE] = new NameGenerationService(); //TODO migrate to own package
    ret[COOKIE_STORE_SERVICE] = new CookieStore(); //TODO migrate to own package
    ret[ROOM_SERVICE] = new RoomService(); //TODO migrate to own package
    return ret;
  }

  modules(): { [id: string]: Module } {
    let ret = {};
    ret[MICROSOFT_SERVICE] = async () => {
      const module = await import(
        /*  webpackPrefetch: 0,  webpackMode: 'lazy',  webpackChunkName: "library/@aptero/axolotis-module-teams/MsTeamsAPI"  */
        "./modules/microsoft/MsTeamsAPI"
      );
      return { module, classname: module.Factory.name };
    };
    return ret;
  }
}
