import { getService, getServiceSync } from "@aptero/axolotis-player";
/**
 * Should only import type to stay lightweight
 */
import type MsTeamsAPILight from "@root/modules/microsoft/MsTeamsAPILight";
import type { MsTeamsAPI } from "@root/modules/microsoft/MsTeamsAPI";

export const MICROSOFT_SERVICE = "@aptero/axolotis-module-teams/MicrosoftService";
export const MICROSOFT_STATIC_SERVICE = "@aptero/axolotis-module-teams/MicrosoftStaticService";
export const PROPERTIES_SERVICE = "@aptero/axolotis-module-properties/Properties";

//msTeamsAPILight
export function msTeamsAPILight(): MsTeamsAPILight {
  return getServiceSync<MsTeamsAPILight>(MICROSOFT_STATIC_SERVICE);
}

//Helps to transition to 100% async
export function msTeamsAPILightAsync(): Promise<MsTeamsAPILight> {
  return getService<MsTeamsAPILight>(MICROSOFT_STATIC_SERVICE);
}

//msTeamsAPI
export async function msTeamsAPI(): Promise<MsTeamsAPI> {
  return getService<MsTeamsAPI>(MICROSOFT_SERVICE);
}
