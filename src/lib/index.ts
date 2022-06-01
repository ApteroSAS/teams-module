import { getGlobalStorageValue, GLOBAL_WORLDS_ENTITY, registerItem, WorldEntity } from "@aptero/axolotis-player";
import { AxItem } from "@root/AxItem";
let worlds = getGlobalStorageValue<WorldEntity[]>(GLOBAL_WORLDS_ENTITY, false);
if (!(worlds && worlds.length > 0)) {
  throw new Error("Axolotis World Needs to be initialized");
}
registerItem(new AxItem()); //auto registration of service

export * from "./modules/microsoft/MsTeams";
export * from "./modules/microsoft/MicrosoftService";
export * from "./modules/properties/Properties";
export * from "./ImportHelper";
