import { getContext } from "./MsTeamsUtils";
import MsTeamsAPILight, { MSTEAMS_QUERY_PARAM } from "../MsTeamsAPILight";
import { getServiceSync } from "@aptero/axolotis-player";
import { MICROSOFT_STATIC_SERVICE } from "@root/ImportHelper";

export async function redirectToTeamsSidePanel() {
  if (getServiceSync<MsTeamsAPILight>(MICROSOFT_STATIC_SERVICE).msTeams()) {
    let url = new URL(window.location.href);
    if (url.searchParams.get("msForceHub")) {
      return; //do not redirect in this case
    }
    await getContext((context) => {
      if (context && context.page.frameContext === "sidePanel") {
        window.location.replace(window.location.origin + "/microsoft-settings.html?" + MSTEAMS_QUERY_PARAM + "=true");
      }
      //else continue
    });
  }
}
