import { MicrosoftGraphService } from "./MicrosoftGraphService";
import { MicrosoftOauthLoginService } from "./MicrosoftOauthLoginService";
import { TeamsLoginService } from "./TeamsLoginService";
import { MsToNativeLoginBridge } from "./MsToNativeLoginBridge";
export declare class MicrosoftLoginService {
    authInProgress: boolean;
    msGraphService: MicrosoftGraphService;
    msToNativeLoginBridge: MsToNativeLoginBridge;
    microsoftOauthLoginService: MicrosoftOauthLoginService;
    teamsLoginService: TeamsLoginService;
    private initialized;
    constructor();
    onReady(): Promise<boolean>;
    passiveLogin(): Promise<void>;
    private loginInternal;
    login(nofail?: boolean): Promise<void>;
    getUserAccount(): any;
    getName(): any;
    logout(): Promise<void>;
    displayProfilePhoto(): any;
    isSignedIn(): boolean;
}
export declare const microsoftLoginService: MicrosoftLoginService;
