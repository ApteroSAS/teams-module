import {MicrosoftLoginService} from "./service/MicrosoftLoginService";
import {redirectToTeamsSidePanel} from "../aptTeamsApp/RedirectToSidePage";
import {changeUrlSettings, getContext, getMSEvents, processDeepLink} from "../aptTeamsApp/MsTeamsUtils";
import "../aptTeamsApp/TeamsTestHelper";
import {registerTeamsTestHelper} from "../aptTeamsApp/TeamsTestHelper";
import {app, pages} from "@microsoft/teams-js";
import {CookieStore, PhoenixAuthService, Properties} from "@aptero/axolotis-module-basic";
import {MicrosoftUrlService} from "./service/MicrosoftUrlService";


export class MsTeamsAPI {
  private microsoftLoginService: MicrosoftLoginService;
  private microsoftUrlService: MicrosoftUrlService;

  constructor(
      private properties:Properties,
      private cookieStore :CookieStore,
      private phxAuth: PhoenixAuthService) {
    this.microsoftLoginService = new MicrosoftLoginService(properties,cookieStore,phxAuth.getNativeInterface());
    this.microsoftUrlService = new MicrosoftUrlService(this.microsoftLoginService);
  }

  getLoginService(): MicrosoftLoginService {
    return this.microsoftLoginService;
  }

  getTeamsApp(): { app: typeof app; pages: typeof pages } {
    return { app, pages };
  }

  async redirectToTeamsSidePanel() {
    await redirectToTeamsSidePanel();
  }

  getUrlService() {
    return this.microsoftUrlService;
  }

  getMSEvents() {
    return getMSEvents();
  }

  getContext(callback: (context) => void) {
    return getContext(callback);
  }

  async processDeepLink(link: string) {
    return processDeepLink(link);
  }

  changeUrlSettings(url: string) {
    return changeUrlSettings(url);
  }

  getType(): string {
    return MsTeamsAPI.name;
  }

  registerTeamsTestHelper() {
    return registerTeamsTestHelper();
  }
}
