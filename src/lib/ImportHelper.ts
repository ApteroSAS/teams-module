import { getService, getServiceSync } from "@aptero/axolotis-player";
import { MsTeams } from "@root/lib/modules/microsoft/MsTeams";
import { MICROSOFT_SERVICE, MICROSOFT_STATIC_SERVICE, MicrosoftService } from "@root/lib/index";

export function msTeamsService() {
  return getServiceSync<MsTeams>(MICROSOFT_STATIC_SERVICE);
}

export async function microsoftService() {
  return getService<MicrosoftService>(MICROSOFT_SERVICE);
}
