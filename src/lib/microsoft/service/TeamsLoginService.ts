import {
    AuthenticationConfiguration,
    createMicrosoftGraphClient, createMicrosoftGraphClientWithCredential,
    IdentityType,
    LogLevel,
    setLogFunction,
    setLogLevel,
    TeamsFx, TeamsUserCredential, TeamsUserCredentialAuthConfig, UserInfo
} from "@microsoft/teamsfx";
import {getScopes, getScopesLight} from "../../aptTeamsApp/scope";
import {MicrosoftGraphService} from "./MicrosoftGraphService";
import {app} from "@microsoft/teams-js";
import {CookieStore, NativeLoginBridge, Properties} from "@aptero/axolotis-module-basic";
import {PropertiesFormat, PROPERTY_KEY} from "../PropertiesFormat";
import {isMsTeams} from "@root/lib/microsoft/MsTeamsChecker";
import {Client, GraphError} from "@microsoft/microsoft-graph-client";
import {EventEmitter} from "eventemitter3";

declare const window;
//To test and revoke application auth
// https://myapplications.microsoft.com/
// https://portal.office.com/account/?ref=MeControl#apps

const FORCE_STAY_LOGOUT = "ms_force_stay_logout";
export const LOGGED_BASIC_INFO = "ms-auth-basic-info";
export const LOGIN = "ms-auth-service-login";
export const LOGOUT = "ms-auth-service-logout";

export class TeamsLoginService {
    private ppt: PropertiesFormat;
    teamsFx: TeamsFx = null;
    teamsUserCredential: TeamsUserCredential = null;
    eventEmitter = new EventEmitter();

    getAuthLoginPageUrl(): string {
        const startLoginPageUrlCommon = window.location.origin + "/auth-start.html";
        const startLoginPageUrlTenant = window.location.origin + "/auth-start-tenant.html";
        if(this.ppt.MICROSOFT_APP_AUTHORITY.indexOf("common") !== -1){
            return startLoginPageUrlCommon;
        }else{
            return startLoginPageUrlTenant;
        }
    }

    constructor(
        private microsoftGraphService: MicrosoftGraphService,
        private msToNativeLoginBridge: NativeLoginBridge,
        properties: Properties,
        private cookieStore: CookieStore,
    ) {
        this.ppt = properties.get<PropertiesFormat>(PROPERTY_KEY);
    }

    //////////////
    /////TeamsFx
    ////////////
    private getTeamsFx(): TeamsFx {
        if (!this.teamsFx) {
            if (process.env.NODE_ENV === "development") {
                setLogLevel(LogLevel.Warn);
                setLogFunction((leve, message) => {
                    console.warn(message);
                });
            }
            //https://docs.microsoft.com/en-us/microsoftteams/platform/toolkit/teamsfx-sdk
            this.teamsFx = new TeamsFx(IdentityType.User, {
                authorityHost:this.ppt.MICROSOFT_APP_AUTHORITY,
                initiateLoginEndpoint: this.getAuthLoginPageUrl(),
                //simpleAuthEndpoint: teamsfxEndpoint,//https://github.com/OfficeDev/TeamsFx/wiki/How-Authentication-Works-in-TeamsFx-Tab-Template
                clientId: this.ppt.MICROSOFT_APP_ID, //process.env.REACT_APP_CLIENT_ID;
            });
        }
        return this.teamsFx;
    }

    private async triggerScopeAuthPopUpTeamsFx(scopes:string[]): Promise<TeamsFx> {
        const teamsFx = this.getTeamsFx();
        console.log("login TeamsFx :" , scopes);
        await teamsFx.login(scopes); //Trigger authorization popup
        let credential = teamsFx.getCredential();//checks credential
        console.log(await credential.getToken(scopes));//checks credential
        return teamsFx;
    }

    private async initGraphTeamsFx(scope: string[], silent: boolean = true): Promise<{ graph: Client, scope: string[] }> {
        const teamsFx = this.getTeamsFx();
        try {
            const graph = createMicrosoftGraphClient(teamsFx, scope);
            await this.microsoftGraphService.init(graph);
            return {graph, scope};
        } catch (err) {
            if (err.toString().indexOf("please login first") !== -1) {
                console.info("app not authorized - no graph support - re-login");
                console.info("app id : " + this.ppt.MICROSOFT_APP_ID + " / " + this.ppt.MICROSOFT_APP_AUTHORITY);
                console.info("auth page : " + this.getAuthLoginPageUrl());
                if (!silent) {
                    await this.triggerScopeAuthPopUpTeamsFx(scope);//trigger login popup
                    const graph = createMicrosoftGraphClient(teamsFx, scope);
                    await this.microsoftGraphService.init(graph);
                    return {graph, scope};
                }else {
                    throw err;
                }
            } else {
                throw err;
            }
        }
    }
    //////////////
    /////TeamsUserCredential
    ////////////
    private getTeamsUserCredential(): TeamsUserCredential {
        if (!this.teamsUserCredential) {
            const authConfig: AuthenticationConfiguration = {
                clientId: this.ppt.MICROSOFT_APP_ID,
                initiateLoginEndpoint: this.getAuthLoginPageUrl(),
                authorityHost:this.ppt.MICROSOFT_APP_AUTHORITY,
            };
            this.teamsUserCredential = new TeamsUserCredential(authConfig);
        }
        return this.teamsUserCredential;
    }

    private async triggerScopeAuthPopUpTeamsUserCredential(scopes:string[]): Promise<TeamsUserCredential> {
        const teamsUserCredential = this.getTeamsUserCredential();
        console.log("login teamsUserCredential :" , scopes);
        await teamsUserCredential.login(scopes); //Trigger authorization popup
        console.log(await teamsUserCredential.getToken(scopes));//checks credential
        return teamsUserCredential;
    }
    async initGraphTeamsUserCredential<T>(scope: string[], silent: boolean = true): Promise<{ graph: Client, scope: string[] }> {
        let credential: TeamsUserCredential = this.getTeamsUserCredential();
        try {
            const graph = createMicrosoftGraphClientWithCredential(credential, scope);
            await this.microsoftGraphService.init(graph);
            return {graph, scope};
        } catch (err: unknown) {
            console.info("app not authorized - no graph support - re-login");
            console.info("scopes : " + scope);
            console.info("app id : " + this.ppt.MICROSOFT_APP_ID + " / " + this.ppt.MICROSOFT_APP_AUTHORITY);
            console.info("auth page : " + this.getAuthLoginPageUrl());//you need to change the Appid if you are using localhost
            if (!silent) {
                // Silently fail for user didn't consent error
                await this.triggerScopeAuthPopUpTeamsUserCredential(scope);
                const graph = createMicrosoftGraphClientWithCredential(credential, scope);
                await this.microsoftGraphService.init(graph);
                return {graph, scope};
            } else {
                throw err;
            }
        }
    }

    ////////////
    //////////////

    /**
     * native log of user if this one is not logged already
     * @param basicUserInfo
     * @param scope
     * @param silent if true, no popup will be displayed
     * @param force relog the user even if he is already logged
     * @private
     */
    private async nativeLogin(scope: string[], silent = true, force: boolean = false) {
        //basic login
        let teamsFx = this.getTeamsFx();
        const basicUserInfo: UserInfo = await teamsFx.getUserInfo();//confirmed by stephano no user popup
        console.log("basic login:", basicUserInfo);
        this.eventEmitter.emit(LOGGED_BASIC_INFO);

        //complete login only if needed
        if (this.isUserLogged() && this.microsoftGraphService.isInitialized() && this.isGraphDataFilled() && !force) {
            //Do not  force login if user is already logged
            return;
        }

        this.getTeamsFx();
        this.getTeamsUserCredential();

        console.log("native login : ", basicUserInfo);
        //await this.triggerScopeAuthPopUpTeamsFx(scope);//trigger login popup
        try {
            await this.initGraphTeamsUserCredential(scope, silent);
        }catch (e){
            console.error(e);
            //TODO cancel login?
        }

        //in this case we login without a graph token
        //only this data available {"displayName":"Admin Aptero","objectId":"abb64646-d3e2-473d-8d13-0b6faff23605","preferredUserName":"admin@aptero.co"}
        const user: any = {};
        user.email = basicUserInfo.preferredUserName;
        user.displayName = basicUserInfo.displayName;
        user.id = basicUserInfo.objectId;

        let profilePicture = "";
        let organization = "";
        let phoneNumber = "";
        let jobTitle = "";
        if (this.microsoftGraphService.isInitialized()) {
            const user = await this.microsoftGraphService.getUserDetails();
            phoneNumber = user.mobilePhone;
            jobTitle = user.jobTitle;
            profilePicture = await this.microsoftGraphService.getUserPhotoAsBase64();
            organization = await this.microsoftGraphService.getUserOrganization();
        }
        let token = user.id;
        await this.msToNativeLoginBridge.setProfile({
            email: user.email,
            displayName: user.displayName,
            phoneNumber: phoneNumber,
            jobTitle: jobTitle,
            companyName: organization,
            microsoftUserprofilePicture: profilePicture,
            microsoftUser: user.id,
        });
        await this.msToNativeLoginBridge.nativeLogin(user.email, token);
        this.eventEmitter.emit(LOGIN);
    }

    /**
     * This is called when the user click on signin - this perfor a user interaction auth login and may trigger popup
     * store the tenant
     * id
     * JWT decripting of the token
     */
    public async login() {
        console.log("TeamsLoginService : login from user interaction");
        this.cookieStore.remove(FORCE_STAY_LOGOUT); //Only in case of user requested login do we remove this flag
        await this.nativeLogin(getScopesLight(), false, true);
        await this.msToNativeLoginBridge.setProfile({
            displayName: (await this.getTeamsFx().getUserInfo()).displayName,
        }); //HACK reset the display name since another process in the code seems to set Guest name
        this.eventEmitter.emit(LOGOUT);
        return true;
    }

    public async upgrade() {
        console.log("upgrade");
        let scope = getScopes();
        const teamsFx = this.getTeamsFx();
        await teamsFx.login(scope); //Trigger authorization popup
        await this.nativeLogin(getScopes(), false, true);//update graph instance
        return true;
    }

    /**
     * This is allways called on the start of the app to try to passive login should not trigger any popup - TODO will try to setup graph or logout the user if failled
     */
    public async passiveLogin() {
        if (!isMsTeams()) {
            throw new Error("not in teams");
        }
        try {
            await app.initialize();
        } catch (e) {
            console.warn("microsoftTeams.initialize failed (probably not in teams so we skip it)", e);
            return;
        }
        //!this.msToNativeLoginBridge.isLogged()
        if (this.cookieStore.get(FORCE_STAY_LOGOUT)) {
            return;
        }
        try {
            //if msteams
            // log using token from msteams
            //if cookie oauth microsoft
            // Initialize the Microsoft Teams SDK
            await this.nativeLogin(getScopesLight(), true, false);
        } catch (e) {
            //passive login should never fail - just ignore
            console.warn("passive login failed", e);
            await this.msToNativeLoginBridge.logout();
        }
    }

    public async logout() {
        let cookieStore = await this.cookieStore;
        cookieStore.set(FORCE_STAY_LOGOUT, "true");
        await this.msToNativeLoginBridge.logout();
    }

    public async getUserInfo(): Promise<UserInfo> {
        let teamsFx = this.getTeamsFx();
        return teamsFx.getUserInfo();
    }

    private isUserLogged(): boolean {
        return (
            this.msToNativeLoginBridge.getProfile().microsoftUser &&
            this.msToNativeLoginBridge.getProfile().displayName &&
            window.APP.store.state.credentials.token
        );
    }

    private isGraphDataFilled() {
        return (
            this.msToNativeLoginBridge.getProfile().jobTitle ||
            this.msToNativeLoginBridge.getProfile().phoneNumber ||
            this.msToNativeLoginBridge.getProfile().companyName ||
            this.msToNativeLoginBridge.getProfile().microsoftUserprofilePicture
        );
    }

    onChange(callback: () => void):()=>void {
        this.eventEmitter.on(LOGGED_BASIC_INFO, callback);
        this.eventEmitter.on(LOGIN, callback);
        this.eventEmitter.on(LOGOUT, callback);
        return () => {
            this.eventEmitter.off(LOGGED_BASIC_INFO, callback);
            this.eventEmitter.off(LOGIN, callback);
            this.eventEmitter.off(LOGOUT, callback);
        }
    }
}
