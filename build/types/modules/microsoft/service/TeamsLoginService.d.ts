import { TeamsFx } from "@microsoft/teamsfx";
import { MicrosoftGraphService } from "./MicrosoftGraphService";
import { MsToNativeLoginBridge } from "../../phoenixAuth/MsToNativeLoginBridge";
export declare const startLoginPageUrl: string;
export declare const clientId: string;
export declare function getCredential(): TeamsFx;
export declare class TeamsLoginService {
    private microsoftGraphService;
    private msToNativeLoginBridge;
    constructor(microsoftGraphService: MicrosoftGraphService, msToNativeLoginBridge: MsToNativeLoginBridge);
    initBasicInfo(): Promise<TeamsFx>;
    initGraph(scopes: any): Promise<void>;
    userInteractionAuth(): Promise<TeamsFx>;
    upgrade(): Promise<TeamsFx>;
    passiveLogin(): Promise<void>;
    isUserBasicLogged(): any;
    isGraphDataFilled(): any;
    initBasic(basicUserInfo: any, force: any): Promise<void>;
    logout(): Promise<void>;
}
