import { Component, IServices } from "@aptero/axolotis-player";
import { Service } from "@aptero/axolotis-player";
import "./service/TeamsTestHelper";
export declare class MicrosoftService implements Component {
    constructor();
    getLoginService(): import("./service/MicrosoftLoginService").MicrosoftLoginService;
    redirectToTeamsSidePanel(): Promise<void>;
    getUrlService(): import("./service/MicrosoftUrlService").MicrosoftUrlService;
    processDeepLink(link: any): Promise<void>;
    getType(): string;
}
export declare class Factory implements Service<MicrosoftService> {
    constructor();
    createService(services: IServices): Promise<MicrosoftService>;
}
