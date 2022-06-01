export declare class MicrosoftUrlService {
    preloaded: {};
    constructor();
    urlToToSharingToken(url: any): string;
    preFetchConvertMicrosoftUrl(url: any): Promise<any>;
    convertMicrosoftUrlSync(url: any): any;
    convertMicrosoftUrl(url: any): Promise<any>;
    convertSharingUrlToDownloadUrl(url: any): Promise<unknown>;
}
export declare const microsoftUrlService: MicrosoftUrlService;
