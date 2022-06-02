import { Component, IServices } from "@aptero/axolotis-player";
import { Service } from "@aptero/axolotis-player";
import { MicrosoftLoginService, microsoftLoginService } from "./service/MicrosoftLoginService";
import { redirectToTeamsSidePanel } from "./service/RedirectToSidePage";
import { microsoftUrlService } from "./service/MicrosoftUrlService";
import { getContext, getMSEvents, processDeepLink } from "./service/MsTeamsUtils";
import "./service/TeamsTestHelper";
import { registerTeamsTestHelper } from "./service/TeamsTestHelper";

export class MsTeamsAPI implements Component {
  constructor() {}

  getLoginService(): MicrosoftLoginService {
    return microsoftLoginService;
  }

  async redirectToTeamsSidePanel() {
    await redirectToTeamsSidePanel();
  }

  getUrlService() {
    return microsoftUrlService;
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

export class Factory implements Service<MsTeamsAPI> {
  constructor() {}
  async createService(services: IServices): Promise<MsTeamsAPI> {
    return new MsTeamsAPI();
  }
}
