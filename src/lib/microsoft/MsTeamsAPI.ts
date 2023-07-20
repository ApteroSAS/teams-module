import {MicrosoftLoginService} from "./service/MicrosoftLoginService";
import {redirectToTeamsSidePanel} from "../aptTeamsApp/RedirectToSidePage";
import {changeUrlSettings, getContext, getMSEvents, processDeepLink} from "../aptTeamsApp/MsTeamsUtils";
import "../aptTeamsApp/TeamsTestHelper";
import {registerTeamsTestHelper} from "../aptTeamsApp/TeamsTestHelper";
import {app, pages, appInstallDialog} from "@microsoft/teams-js";
import {CookieStore, PhoenixAuthService, Properties} from "@aptero/axolotis-module-basic";
import {MicrosoftUrlService} from "./service/MicrosoftUrlService";
import {MicrosoftGraphService} from "@root/lib/microsoft/service/MicrosoftGraphService";
import {PropertiesFormat, PROPERTY_KEY} from "@root/lib/microsoft/PropertiesFormat";


export class MsTeamsAPI {
  private appid: string;

  constructor(
      private properties:Properties,
      private cookieStore :CookieStore,
      private phxAuth: PhoenixAuthService,
      private microsoftLoginService: MicrosoftLoginService,
      private microsoftUrlService: MicrosoftUrlService,
      private microsoftGraphService:MicrosoftGraphService
  ) {
    this.appid = properties.get<PropertiesFormat>(PROPERTY_KEY).MICROSOFT_APP_ID;
  }

  getLoginService(): MicrosoftLoginService {
    return this.microsoftLoginService;
  }

  getGraph(): MicrosoftGraphService {
    return this.microsoftGraphService;
  }

  getTeamsApp(): { app: typeof app; pages: typeof pages} {
    return { app, pages };
  }

  getPages(): typeof pages {
    return pages;
  }

  getApp(): typeof app {
    return app;
  }

  getAppId(): string {
    return this.appid;
  }

  getAppInstallDialog():typeof appInstallDialog {
    return appInstallDialog;
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
