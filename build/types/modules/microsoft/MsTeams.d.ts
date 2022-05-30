import { IService } from "@aptero/axolotis-player";
import { AuthInterface } from "@root/modules/phoenixAuth/AuthInterface";
export declare const MICROSOFT_AUTH_ERROR = "error_microsoft_not_authorized";
export declare const MSTEAMS_QUERY_PARAM = "msteams";
export declare class MsTeams implements IService, AuthInterface {
    private msmode;
    constructor();
    getType(): string;
    msTeams(): boolean;
    getContext(callback: any): Promise<void>;
    redirectToTeamsSidePanel(): void;
    msPassiveLoginCheckNeeded(): any;
    preFetchConvertMicrosoftUrl(url: any): Promise<any>;
    getAccount(): {
        email: any;
        displayName: any;
        id: any;
    };
    passiveLogIn(): Promise<true>;
    signIn(): Promise<true>;
    signOut(): Promise<true>;
}
