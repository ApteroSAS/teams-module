export declare const CHANGE_SETTINGS_URL = "ms-teams-change-settings-url";
export declare const PROCESS_DEEPLINK = "ms-teams-deep-link";
export declare function sendEvent(type: any, data: any): void;
export declare function getMSEvents(): any;
export declare function msTeams(): boolean;
export declare function changeUrlSettings(url: any): void;
export declare function getContext(callback: any): Promise<void>;
export declare function processDeepLink(link: any): void;
