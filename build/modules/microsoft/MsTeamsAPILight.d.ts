import { IService } from "@aptero/axolotis-player";
export declare const MICROSOFT_AUTH_ERROR = "error_microsoft_not_authorized";
export declare const MSTEAMS_QUERY_PARAM = "msteams";
/**
 * aims of this class is to perform siple check to see if we need to load the complet MsTeams Bundle with its
 * dependencies. Thus this module should be lightweight and not import big library.
 */
export default class MsTeamsAPILight implements IService {
    private msmode;
    constructor();
    getType(): string;
    msTeams(): boolean;
    redirectToTeamsSidePanel(): void;
    private msPassiveLoginCheckNeeded;
    preFetchConvertMicrosoftUrl(url: any): Promise<any>;
    conditionalPassiveLogIn(): Promise<boolean>;
}
