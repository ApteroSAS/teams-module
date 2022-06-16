import { ModulePromise } from "@aptero/axolotis-player";
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
} from "@root/ImportHelper";

export class AxItem implements Item {
  constructor() {
    console.log("@aptero/axolotis-module-teams installed");
  }

  modules(): { [id: string]: ModulePromise } {
    let ret: { [id: string]: ModulePromise } = {};
    ret[MICROSOFT_SERVICE] = () =>
      import(
        /*  webpackPrefetch: 0,  webpackMode: 'lazy',  webpackChunkName: "@aptero/axolotis-module-teams/MsTeamsAPI"  */
        "./modules/microsoft/MsTeamsAPI"
      );
    ret[MICROSOFT_STATIC_SERVICE] = () =>
      import(
        /*  webpackPrefetch: 0,  webpackMode: 'lazy',  webpackChunkName: "@aptero/axolotis-module-teams/MicrosoftStaticService"  */
        "@root/modules/microsoft/MsTeamsAPILight"
      );
    ret[PROPERTIES_SERVICE] = () =>
      import(
        /*  webpackPrefetch: 0,  webpackMode: 'lazy',  webpackChunkName: "@aptero/axolotis-module-properties/Properties"  */
        "@root/modules/properties/Properties"
      );
    ret[STORE_SERVICE] = () =>
      import(
        /*  webpackPrefetch: 0,  webpackMode: 'lazy',  webpackChunkName: "@aptero/axolotis-module-storage/Store"  */
        "@root/modules/store/Store"
      );
    ret[PHX_AUTH_SERVICE] = () =>
      import(
        /*  webpackPrefetch: 0,  webpackMode: 'lazy',  webpackChunkName: "@aptero/axolotis-module-name/PhoenixAuthService"  */
        "@root/modules/phoenixAuth/PhoenixAuthService"
      );
    ret[NAME_SERVICE] = () =>
      import(
        /*  webpackPrefetch: 0,  webpackMode: 'lazy',  webpackChunkName: "@aptero/axolotis-module-name/PhoenixAuthService"  */
        "@root/modules/nameGeneration/NameGenerationService"
      );
    ret[COOKIE_STORE_SERVICE] = () =>
      import(
        /*  webpackPrefetch: 0,  webpackMode: 'lazy',  webpackChunkName: "@aptero/axolotis-module-storage/CookieStore"  */
        "@root/modules/store/CookieStore"
      );
    ret[ROOM_SERVICE] = () =>
      import(
        /*  webpackPrefetch: 0,  webpackMode: 'lazy',  webpackChunkName: "@aptero/axolotis-module-room/RoomService"  */
        "@root/modules/roomAPI/RoomService"
      );
    return ret;
  }
}
