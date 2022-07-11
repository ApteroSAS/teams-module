import { ModulePromise } from "@aptero/axolotis-player";
import { Item } from "@aptero/axolotis-player";
import { MICROSOFT_SERVICE, MICROSOFT_STATIC_SERVICE } from "@root/ImportHelper";

export class AxItem implements Item {
  constructor() {
    console.log("@aptero/axolotis-module-teams installed");
  }

  modules(): { [id: string]: ModulePromise } {
    let ret: { [id: string]: ModulePromise } = {};
    ret[MICROSOFT_SERVICE] = async () => {
      let module = await import(
        /*  webpackPrefetch: 0,  webpackMode: 'lazy',  webpackChunkName: "@aptero/axolotis-module-teams/MsTeamsAPI"  */
        "./modules/microsoft/MsTeamsAPI"
      );
      return { module, classname: module.MsTeamsAPI.name };
    };
    ret[MICROSOFT_STATIC_SERVICE] = () =>
      import(
        /*  webpackPrefetch: 0,  webpackMode: 'lazy',  webpackChunkName: "@aptero/axolotis-module-teams/MicrosoftStaticService"  */
        "@root/modules/microsoft/MsTeamsAPILight"
      );
    return ret;
  }
}
