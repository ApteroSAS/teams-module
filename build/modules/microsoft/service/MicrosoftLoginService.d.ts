import { MicrosoftGraphService } from "./MicrosoftGraphService";
import { MicrosoftOauthLoginService } from "./MicrosoftOauthLoginService";
import { TeamsLoginService } from "./TeamsLoginService";
import { MsToNativeLoginBridge } from "../../phoenixAuth/MsToNativeLoginBridge";
import { AuthInterface } from "../../../common/AuthInterface";
export declare class MicrosoftLoginService implements AuthInterface {
    authInProgress: boolean;
    msGraphService: MicrosoftGraphService;
    msToNativeLoginBridge: MsToNativeLoginBridge;
    microsoftOauthLoginService: MicrosoftOauthLoginService;
    teamsLoginService: TeamsLoginService;
    private initialized;
    getTeamsLoginService(): TeamsLoginService;
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
    getAccount(): {
        email: any;
        displayName: any;
        id: any;
    };
    passiveLogIn(): Promise<void>;
    signIn(): Promise<void>;
    signOut(): Promise<void>;
}
export declare const microsoftLoginService: MicrosoftLoginService;
