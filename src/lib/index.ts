import { getGlobalStorageValue, GLOBAL_WORLDS_ENTITY, registerItem, WorldEntity } from "@aptero/axolotis-player";
import { AxItem } from "./AxItem";
let worlds = getGlobalStorageValue<WorldEntity[]>(GLOBAL_WORLDS_ENTITY, false);
if (!(worlds && worlds.length > 0)) {
  throw new Error("Axolotis World Needs to be initialized");
}
registerItem(new AxItem()); //auto registration of service

export type { MsTeamsAPILight } from "./modules/microsoft/MsTeamsAPILight";
export type { Properties } from "./modules/properties/Properties";
export type { RoomService } from "./modules/roomAPI/RoomService";
export type { PhoenixAuthService } from "./modules/phoenixAuth/PhoenixAuthService";
export type { MsTeamsAPI } from "./modules/microsoft/MsTeamsAPI";

export * from "./modules/microsoft/MsTeamsAPILight";
export * from "./modules/properties/Properties";
export * from "./ImportHelper";
export * from "./modules/microsoft/Events";
