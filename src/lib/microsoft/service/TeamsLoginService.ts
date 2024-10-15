import {
    TeamsUserCredential, TeamsUserCredentialAuthConfig, UserInfo
} from "@microsoft/teamsfx";
import {getScopes, getScopesLight} from "../../aptTeamsApp/scope";
import {app} from "@microsoft/teams-js";
import {CookieStore, NativeLoginBridge, Properties} from "@aptero/axolotis-module-basic";
import {PropertiesFormat, PROPERTY_KEY} from "../PropertiesFormat";
import {isMsTeams} from "@root/lib/microsoft/MsTeamsChecker";
import {Client} from "@microsoft/microsoft-graph-client";
import {EventEmitter} from "eventemitter3";
import {
    TokenCredentialAuthenticationProvider
} from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";
import {MSAuthInterface} from "@root/lib/microsoft/service/AuthInterface";

declare const window;
//To test and revoke application auth
// https://myapplications.microsoft.com/
// https://portal.office.com/account/?ref=MeControl#apps

//Code exmaple:
//https://github.com/OfficeDev/Microsoft-Teams-Samples

const FORCE_STAY_LOGOUT = "ms_force_stay_logout";
export const LOGGED_BASIC_INFO = "ms-auth-basic-info";
export const LOGIN = "ms-auth-service-login";
export const LOGOUT = "ms-auth-service-logout";

export class TeamsLoginService implements MSAuthInterface{
    private ppt: PropertiesFormat;
    private teamsUserCredential: TeamsUserCredential = null;
    private eventEmitter = new EventEmitter();
    private graph: Client;
    private wip = null;

    constructor(
        private msToNativeLoginBridge: NativeLoginBridge,
        properties: Properties,
        private cookieStore: CookieStore,
    ) {
        this.ppt = properties.get<PropertiesFormat>(PROPERTY_KEY);
    }

    public async getGraph(): Promise<Client | null> {
        if(!this.graph){
            await this.passiveLogin();
        }
        return this.graph;
    }

    public async updateProfile(profile:{
        phoneNumber?: string,
        jobTitle?: string,
        companyName?: string,
        picture?: string,
    } = {}) : Promise<void>{
        let teamsFx = this.getTeamsUserCredential();
        const basicUserInfo: UserInfo = await teamsFx.getUserInfo();//confirmed by stephano no user popup
        const user: any = {};
        user.email = basicUserInfo.preferredUserName;
        user.displayName = basicUserInfo.displayName;
        user.id = basicUserInfo.objectId;
        await this.msToNativeLoginBridge.setProfile({
            email: user.email,
            displayName: user.displayName,
            phoneNumber: profile.phoneNumber,
            jobTitle: profile.jobTitle,
            companyName: profile.companyName,
            microsoftUserprofilePicture: profile.picture,
            microsoftUser: user.id,
        });
    }

    public async login():Promise<boolean> {
        return this.wipLoginWrap(async () => {
            console.log("TeamsLoginService : login from user interaction");
            this.cookieStore.remove(FORCE_STAY_LOGOUT); //Only in case of user requested login do we remove this flag
            await this.nativeLogin(getScopesLight(), false);
            await this.msToNativeLoginBridge.setProfile({
                displayName: (await this.getTeamsUserCredential().getUserInfo()).displayName,
            }); //HACK reset the display name since another process in the code seems to set Guest name
            this.eventEmitter.emit(LOGIN);
            return true;
        });
    }

    public async passiveLogin():Promise<boolean> {
        return this.wipLoginWrap(async () => {
            if (!isMsTeams()) {
                throw new Error("not in teams");
            }
            try {
                await app.initialize();
            } catch (e) {
                console.warn("microsoftTeams.initialize failed (probably not in teams so we skip it)", e);
                return false;
            }

            await app.getContext();
            console.log("notifySuccess");
            app.notifySuccess();//end the default loading screen once the app is initialized

            //!this.msToNativeLoginBridge.isLogged()
            if (this.cookieStore.get(FORCE_STAY_LOGOUT)) {
                return false;
            }
            try {
                //if msteams
                // log using token from msteams
                //if cookie oauth microsoft
                // Initialize the Microsoft Teams SDK
                await this.nativeLogin(getScopesLight(), true);
            } catch (error) {
                //passive login should never really fail - just ignore
                console.warn("passive login failed", error);
                await this.msToNativeLoginBridge.logout();
                return false;
            }
            return true;
        });
    }

    public async logout() : Promise<void> {
        this.cookieStore.set(FORCE_STAY_LOGOUT, "true");
        await this.msToNativeLoginBridge.logout();
        this.eventEmitter.emit(LOGOUT);
    }

    public onChange(callback: () => void):()=>void {
        this.eventEmitter.on(LOGGED_BASIC_INFO, callback);
        this.eventEmitter.on(LOGIN, callback);
        this.eventEmitter.on(LOGOUT, callback);
        return () => {
            this.eventEmitter.off(LOGGED_BASIC_INFO, callback);
            this.eventEmitter.off(LOGIN, callback);
            this.eventEmitter.off(LOGOUT, callback);
        };
    }

    ///PRIVATE

    /**
     * native log of user if this one is not logged already
     * @param basicUserInfo
     * @param scope
     * @param silent if true, no popup will be displayed
     * @param force relog the user even if he is already logged
     * @private
     */
    private async nativeLogin(scope: string[], silent = true) {
        //basic login
        let teamsFx = this.getTeamsUserCredential();
        const basicUserInfo: UserInfo = await teamsFx.getUserInfo();//confirmed by stephano no user popup
        console.log("[native login] basic login:", basicUserInfo);
        this.eventEmitter.emit(LOGGED_BASIC_INFO);

        ///////////////
        //Graph login
        //////////////
        try {
            this.getTeamsUserCredential();
            await this.initGraphTeamsUserCredential(scope, silent);
        }catch (e){
            console.error("[native login] login failed",e);
        }

        ///////////////
        //Native login
        //////////////
        if(!this.isUserNativeLogged()) {
            //log native user to match microsoft auth
            //only this data available {"displayName":"Admin Aptero","objectId":"abb64646-d3e2-473d-8d13-0b6faff23605","preferredUserName":"admin@aptero.co"}
            await this.updateProfile();
            const email = basicUserInfo.preferredUserName;
            const token = basicUserInfo.objectId;
            await this.msToNativeLoginBridge.nativeLogin(email, token);
            console.log("native login : ", basicUserInfo);
            this.eventEmitter.emit(LOGIN);
        }
    }

    private async wipLoginWrap<T>(cb: () => T):Promise<T> {
        console.log(this.wip);
        if(this.wip){
            return await this.wip;
        }
        this.wip = new Promise(async (resolve, reject) => {
            try {
                resolve(await cb());
            }catch (e){
                reject(e);
            }
            this.wip = null;
        });
        return await this.wip;
    }

    //@deprecated
    async getUserInfo(): Promise<UserInfo> {
        let teamsFx = this.getTeamsUserCredential();
        return teamsFx.getUserInfo();
    }

    //@deprecated
    async upgrade() {
        console.log("upgrade");
        let scope = getScopes();
        const teamsFx = this.getTeamsUserCredential();
        await teamsFx.login(scope); //Trigger authorization popup
        await this.nativeLogin(getScopes(), false);//update graph instance
        return true;
    }

    private isUserNativeLogged(): boolean {
        return (
          this.msToNativeLoginBridge.getProfile().microsoftUser &&
          this.msToNativeLoginBridge.getProfile().displayName &&
          window.APP.store.state.credentials.token
        );
    }

    //////////////
    /////TeamsUserCredential
    ////////////
    getAuthLoginPageUrl(): string {
        return window.location.origin + "/auth-start.html";
    }

    private getTeamsUserCredential(): TeamsUserCredential {
        if (!this.teamsUserCredential) {
            const authConfig: TeamsUserCredentialAuthConfig = {
                clientId: this.ppt.MICROSOFT_APP_ID,
                initiateLoginEndpoint: this.getAuthLoginPageUrl(),
                //authorityHost:this.ppt.MICROSOFT_APP_AUTHORITY,
            };
            this.teamsUserCredential = new TeamsUserCredential(authConfig);
        }
        return this.teamsUserCredential;
    }

    private async triggerScopeAuthPopUpTeamsUserCredential(scopes:string[]): Promise<TeamsUserCredential> {
        const teamsUserCredential = this.getTeamsUserCredential();
        console.log("[TeamsUserCredential/popup] login:" , scopes);
        await teamsUserCredential.login(scopes); //Trigger authorization popup
        console.log("[TeamsUserCredential/popup] login passed");
        return teamsUserCredential;
    }

    private async initGraphTeamsUserCredential<T>(scope: string[], silent: boolean = true): Promise<{ graph: Client, scope: string[] }> {
        let credential: TeamsUserCredential = this.getTeamsUserCredential();
        try {
            const authProvider = new TokenCredentialAuthenticationProvider(credential, { scopes: scope });
            this.graph = Client.initWithMiddleware({
                authProvider: authProvider,
            });
            console.log("[graph/me]", await this.graph.api("/me").get());//try to get basic scope
            return {graph:this.graph, scope};
        } catch (err: unknown) {
            console.info("[graph6] app not authorized - no graph support - re-login");
            console.info("[graph] scopes : " + scope);
            console.info("[graph] app id : " + this.ppt.MICROSOFT_APP_ID + " / " + this.ppt.MICROSOFT_APP_AUTHORITY);
            console.info("[graph] auth page : " + this.getAuthLoginPageUrl());//you need to change the Appid if you are using localhost
            if (!silent) {
                // Silently fail for user didn't consent error
                await this.triggerScopeAuthPopUpTeamsUserCredential(scope);
                const authProvider = new TokenCredentialAuthenticationProvider(credential, { scopes: scope });
                this.graph = Client.initWithMiddleware({
                    authProvider: authProvider,
                });
                console.log("[graph/me]", await this.graph.api("/me").get());//try to get basic scope
                return {graph:this.graph, scope};
            } else {
                throw err;
            }
        }
    }

}
