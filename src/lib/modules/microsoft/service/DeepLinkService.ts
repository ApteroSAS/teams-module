import * as microsoftTeams from "@microsoft/teams-js";
import { getMSEvents } from "./MsTeamsUtils";
import { PROCESS_DEEPLINK } from "@root/modules/microsoft/Events";

export class DeepLinkService {
  start() {
    getMSEvents().on(PROCESS_DEEPLINK, (data) => {
      try {
        const link = data.link;
        microsoftTeams.executeDeepLink(link, (status, reason) => {
          console.log(status, reason);
        });
      } catch (err) {
        console.error(err);
      }
    });
  }
}

export const deepLinkService = new DeepLinkService();
