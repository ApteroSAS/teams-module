import { Component } from "@aptero/axolotis-player";
export declare const MICROSOFT_AUTH_ERROR = "error_microsoft_not_authorized";
export declare const MSTEAMS_QUERY_PARAM = "msteams";
export declare function msTeams(): boolean;
export declare function msPassiveLoginCheckNeeded(): any;
export declare function preFetchConvertMicrosoftUrl(url: any): Promise<any>;
export declare class MsTeams implements Component {
    getType(): string;
    msTeams(): boolean;
    msPassiveLoginCheckNeeded(): any;
    preFetchConvertMicrosoftUrl(url: any): Promise<any>;
}
