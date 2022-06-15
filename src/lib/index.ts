import { getGlobalStorageValue, GLOBAL_WORLDS_ENTITY, registerItem, WorldEntity } from "@aptero/axolotis-player";
import { AxItem } from "./AxItem";

import type MsTeamsAPILightDefault from "./modules/microsoft/MsTeamsAPILight";
export type MsTeamsAPILight = MsTeamsAPILightDefault;
import type PropertiesDefault from "./modules/properties/Properties";
export type Properties = PropertiesDefault;
import type RoomServiceDefault from "./modules/roomAPI/RoomService";
export type RoomService = RoomServiceDefault;
import type PhoenixAuthServiceDefault from "./modules/phoenixAuth/PhoenixAuthService";
export type PhoenixAuthService = PhoenixAuthServiceDefault;
export type { MsTeamsAPI } from "./modules/microsoft/MsTeamsAPI";

export * from "./modules/microsoft/MsTeamsAPILight";
export * from "./modules/properties/Properties";
export * from "./ImportHelper";
export * from "./modules/microsoft/Events";

export const register = () => {
  const worlds = getGlobalStorageValue<WorldEntity[]>(GLOBAL_WORLDS_ENTITY, false);
  if (!(worlds && worlds.length > 0)) {
    throw new Error("Axolotis World Needs to be initialized");
  }
  registerItem(new AxItem()); //auto registration of service
};
