import { Component, IServices } from "@aptero/axolotis-player";
import { Service } from "@aptero/axolotis-player";
import { MicrosoftLoginService } from "./service/MicrosoftLoginService";
import "./service/TeamsTestHelper";
import { app, pages } from "@microsoft/teams-js";
export declare class MsTeamsAPI implements Component {
    constructor();
    getLoginService(): MicrosoftLoginService;
    getTeamsApp(): {
        app: typeof app;
        pages: typeof pages;
    };
    redirectToTeamsSidePanel(): Promise<void>;
    getUrlService(): import("./service/MicrosoftUrlService").MicrosoftUrlService;
    getMSEvents(): any;
    getContext(callback: any): Promise<void>;
    processDeepLink(link: any): Promise<void>;
    getType(): string;
    registerTeamsTestHelper(): void;
}
export default class Factory implements Service<MsTeamsAPI> {
    constructor();
    createService(services: IServices): Promise<MsTeamsAPI>;
}
