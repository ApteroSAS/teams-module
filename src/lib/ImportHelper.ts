import { getService, getServiceSync } from "@aptero/axolotis-player";
/**
 * Should only import type to stay lightweight
 */
import type { MsTeamsAPILight } from "@root/modules/microsoft/MsTeamsAPILight";
import type { Properties } from "@root/modules/properties/Properties";
import type { RoomService } from "@root/modules/roomAPI/RoomService";
import type { PhoenixAuthService } from "@root/modules/phoenixAuth/PhoenixAuthService";
import type { MsTeamsAPI } from "@root/modules/microsoft/MsTeamsAPI";

export const MICROSOFT_SERVICE = "@aptero/axolotis-module-teams/MicrosoftService";
export const MICROSOFT_STATIC_SERVICE = "@aptero/axolotis-module-teams/MicrosoftStaticService";
export const PROPERTIES_SERVICE = "@aptero/axolotis-module-properties/Properties";
export const STORE_SERVICE = "@aptero/axolotis-module-storage/Store";
export const COOKIE_STORE_SERVICE = "@aptero/axolotis-module-storage/CookieStore";
export const PHX_AUTH_SERVICE = "@aptero/axolotis-module-phx-auth/PhoenixAuthService";
export const NAME_SERVICE = "@aptero/axolotis-module-name/PhoenixAuthService";
export const ROOM_SERVICE = "@aptero/axolotis-module-room/RoomService";

//msTeamsAPILight
export function msTeamsAPILight() {
  return getServiceSync<MsTeamsAPILight>(MICROSOFT_STATIC_SERVICE);
}

export function propertyService() {
  return getServiceSync<Properties>(PROPERTIES_SERVICE);
}

export function roomService() {
  return getServiceSync<RoomService>(ROOM_SERVICE);
}

export function phoenixAuth() {
  return getServiceSync<PhoenixAuthService>(PHX_AUTH_SERVICE);
}

//msTeamsAPI
export async function msTeamsAPI() {
  return getService<MsTeamsAPI>(MICROSOFT_SERVICE);
}
