import { Component, IServices } from "@aptero/axolotis-player";
import { Service } from "@aptero/axolotis-player";
import { MicrosoftLoginService } from "./service/MicrosoftLoginService";
import "./service/TeamsTestHelper";
export declare class MsTeamsAPI implements Component {
    constructor();
    getLoginService(): MicrosoftLoginService;
    redirectToTeamsSidePanel(): Promise<void>;
    getUrlService(): import("./service/MicrosoftUrlService").MicrosoftUrlService;
    getMSEvents(): any;
    getContext(callback: any): Promise<void>;
    processDeepLink(link: any): Promise<void>;
    getType(): string;
    registerTeamsTestHelper(): void;
}
export declare class Factory implements Service<MsTeamsAPI> {
    constructor();
    createService(services: IServices): Promise<MsTeamsAPI>;
}
