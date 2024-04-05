import {getContext} from "./MsTeamsUtils";
import {MSTEAMS_QUERY_PARAM} from "../microsoft/MsTeamsAPILight";
import {isMsTeams} from "@root/lib/microsoft/MsTeamsChecker";

export async function redirectToTeamsSidePanel() {
  //TEMPORARY DISABLED
  /*if (isMsTeams()) {
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
  }*/
}
