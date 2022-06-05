import { IService } from "@aptero/axolotis-player";
import { msTeamsAPI } from "@root/ImportHelper";
export const MICROSOFT_AUTH_ERROR = "error_microsoft_not_authorized";
export const MSTEAMS_QUERY_PARAM = "msteams";

declare const window;

/**
 * aims of this class is to perform siple check to see if we need to load the complet MsTeams Bundle with its
 * dependencies. Thus this module should be lightweight and not import big library.
 */
export class MsTeamsAPILight implements IService {
  private msmode: boolean;

  constructor() {
    const qs = new URLSearchParams(location.search);
    this.msmode = !!qs.get(MSTEAMS_QUERY_PARAM);
    if (this.msmode) {
      (async () => {
        (await msTeamsAPI()).registerTeamsTestHelper();
      })();
    }
  }

  getType(): string {
    return MsTeamsAPILight.name;
  }

  msTeams() {
    return this.msmode;
  }

  redirectToTeamsSidePanel() {
    if (this.msTeams()) {
      msTeamsAPI().then(async (service) => {
        await service.redirectToTeamsSidePanel();
      });
    }
  }

  private msPassiveLoginCheckNeeded() {
    return window.APP.store.state.profile.microsoftUser || this.msTeams();
  }

  async preFetchConvertMicrosoftUrl(url) {
    if (url.indexOf("sharepoint.com") === -1) {
      let urlService = (await msTeamsAPI()).getUrlService();
      url = await urlService.preFetchConvertMicrosoftUrl(url);
    }
    return url;
  }

  async conditionalPassiveLogIn(): Promise<boolean> {
    if (this.msPassiveLoginCheckNeeded()) {
      let service = await msTeamsAPI();
      await service.getLoginService().passiveLogin();
      return true;
    } else {
      return false;
    }
  }
}
