import { IService } from "@aptero/axolotis-player";
export declare const MICROSOFT_AUTH_ERROR = "error_microsoft_not_authorized";
export declare const MSTEAMS_QUERY_PARAM = "msteams";
export declare class MsTeams implements IService {
    private msmode;
    constructor();
    getType(): string;
    msTeams(): boolean;
    msPassiveLoginCheckNeeded(): any;
    preFetchConvertMicrosoftUrl(url: any): Promise<any>;
}
