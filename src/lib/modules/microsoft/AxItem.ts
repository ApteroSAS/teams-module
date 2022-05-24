import {IService, Module} from "@aptero/axolotis-player";
import {Item} from "@aptero/axolotis-player";
import {Properties} from "@root/lib/modules/properties/Properties";
import {MICROSOFT_SERVICE, MICROSOFT_STATIC_SERVICE, MsTeams, PROPERTIES_SERVICE} from "@root/lib";
import {registerItem} from "@aptero/axolotis-player";

export class AxItem implements Item{
  staticService():{[id:string]:IService}{
    let ret = {};
    ret[MICROSOFT_STATIC_SERVICE] = new MsTeams();
    ret[PROPERTIES_SERVICE] = new Properties();
    return ret;
  }

  modules():{[id:string]:Module}{
    let ret = {};
    ret[MICROSOFT_SERVICE] = async () => {
      const module = await import("../microsoft/MicrosoftService");
      return {module, classname: module.Factory.name}
    };
    return ret;
  }
}

registerItem(new AxItem());