import { getContext } from "./MsTeams";
import { MsTeams, MSTEAMS_QUERY_PARAM } from "../MsTeams";
import { getServiceSync } from "@aptero/axolotis-player";
import { MICROSOFT_STATIC_SERVICE } from "@root/index";

export async function redirectToTeamsSidePanel() {
  if (getServiceSync<MsTeams>(MICROSOFT_STATIC_SERVICE).msTeams()) {
    let url = new URL(window.location.href);
    if (url.searchParams.get("msForceHub")) {
      return; //do not redirect in this case
    }
    await getContext((context) => {
      if (context.frameContext === "sidePanel") {
        window.location.replace(window.location.origin + "/microsoft-settings.html?" + MSTEAMS_QUERY_PARAM + "=true");
      }
      //else continue
    });
  }
}
