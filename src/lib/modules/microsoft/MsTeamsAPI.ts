import { Component } from "@aptero/axolotis-player";
import { MicrosoftLoginService } from "./service/MicrosoftLoginService";
import { redirectToTeamsSidePanel } from "./service/RedirectToSidePage";
import { getContext, getMSEvents, processDeepLink } from "./service/MsTeamsUtils";
import "./service/TeamsTestHelper";
import { registerTeamsTestHelper } from "./service/TeamsTestHelper";
import { app, pages } from "@microsoft/teams-js";
import { PhoenixAuthService } from "@aptero/axolotis-module-basic";
import { PHX_AUTH_SERVICE } from "@aptero/axolotis-module-basic";
import { MicrosoftUrlService } from "@root/modules/microsoft/service/MicrosoftUrlService";

export class MsTeamsAPI implements Component {
  private microsoftLoginService: MicrosoftLoginService;
  private microsoftUrlService: MicrosoftUrlService;

  public static dependencies: string[] = [PHX_AUTH_SERVICE];
  constructor(private phxAuth: PhoenixAuthService) {
    this.microsoftLoginService = new MicrosoftLoginService(phxAuth.getNativeInterface());
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

  getContext(callback) {
    return getContext(callback);
  }

  async processDeepLink(link) {
    return processDeepLink(link);
  }

  getType(): string {
    return MsTeamsAPI.name;
  }

  registerTeamsTestHelper() {
    return registerTeamsTestHelper();
  }
}
