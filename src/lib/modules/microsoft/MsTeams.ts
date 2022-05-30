import { IService, getService } from "@aptero/axolotis-player";
import { MICROSOFT_SERVICE, microsoftService } from "@root/index";
import { AuthInterface } from "@root/modules/phoenixAuth/AuthInterface";
import { registerTeamsTestHelper } from "@root/modules/microsoft/service/TeamsTestHelper";
import { getContext } from "@root/modules/microsoft/service/MsTeams";

export const MICROSOFT_AUTH_ERROR = "error_microsoft_not_authorized";
export const MSTEAMS_QUERY_PARAM = "msteams";

declare const window;

export class MsTeams implements IService, AuthInterface {
  private msmode: boolean;
  constructor() {
    const qs = new URLSearchParams(location.search);
    this.msmode = !!qs.get(MSTEAMS_QUERY_PARAM);
    if (this.msmode) {
      registerTeamsTestHelper();
    }
  }

  getType(): string {
    return MsTeams.name;
  }
  msTeams() {
    return this.msmode;
  }

  getContext(callback) {
    return getContext(callback);
  }

  redirectToTeamsSidePanel() {
    if (this.msTeams()) {
      microsoftService().then(async service => {
        await service.redirectToTeamsSidePanel();
      });
    }
  }

  msPassiveLoginCheckNeeded() {
    return window.APP.store.state.profile.microsoftUser || this.msTeams();
  }

  async preFetchConvertMicrosoftUrl(url) {
    if (url.indexOf("sharepoint.com") === -1) {
      let urlService = (await getService<any>(MICROSOFT_SERVICE)).getUrlService();
      url = await urlService.preFetchConvertMicrosoftUrl(url);
    }
    return url;
  }

  getAccount(): { email; displayName; id } {
    return { displayName: undefined, email: undefined, id: undefined };
  }

  async passiveLogIn(): Promise<true> {
    return new Promise(resolve => {
      if (this.msPassiveLoginCheckNeeded()) {
        microsoftService().then(async service => {
          await service.getLoginService().passiveLogin();
          resolve(true);
        });
      }
    });
  }

  signIn(): Promise<true> {
    return new Promise(resolve => {
      if (this.msTeams()) {
        microsoftService().then(async service => {
          await service.getLoginService().login();
          resolve(true);
        });
      }
    });
  }

  signOut(): Promise<true> {
    return new Promise(resolve => {
      if (this.msTeams()) {
        microsoftService().then(async service => {
          await service.getLoginService().logout();
          resolve(true);
        });
      }
    });
  }
}
