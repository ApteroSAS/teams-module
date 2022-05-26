import { IService, getService } from "@aptero/axolotis-player";
import { MICROSOFT_SERVICE } from "@root/lib";

export const MICROSOFT_AUTH_ERROR = "error_microsoft_not_authorized";
export const MSTEAMS_QUERY_PARAM = "msteams";

declare const window;

export class MsTeams implements IService {
  private msmode: boolean;
  constructor() {
    const qs = new URLSearchParams(location.search);
    this.msmode = !!qs.get(MSTEAMS_QUERY_PARAM);
  }

  getType(): string {
    return MsTeams.name;
  }
  msTeams() {
    return this.msmode;
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
}
