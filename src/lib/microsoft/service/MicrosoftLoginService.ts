import {MicrosoftOauthLoginService} from "./MicrosoftOauthLoginService";
import {TeamsLoginService} from "./TeamsLoginService";
import {AuthInterface, NativeLoginBridge} from "@aptero/axolotis-module-basic";
import {isMsTeams} from "@root/lib/microsoft/MsTeamsChecker";
import {EventEmitter} from "eventemitter3";
import {Client} from "@microsoft/microsoft-graph-client";

const PASIVE_LOGIN_DONE = "PASIVE_LOGIN_DONE";
const LOGOUT = "LOGOUT";
const LOGIN_DONE = "LOGIN_DONE";


export class MicrosoftLoginService implements AuthInterface {
    authInProgress = false;
    private initialized: boolean = false;
    private eventEmitter = new EventEmitter();

    getTeamsLoginService() {
        return this.teamsLoginService;
    }

    constructor(
        private nativeLoginBridge: NativeLoginBridge,
        private microsoftOauthLoginService: MicrosoftOauthLoginService,
        private teamsLoginService: TeamsLoginService,
    ) {
        this.onReady().then(() => {
            this.initialized = true;
        });
    }

    /**
     * Await the first passive login
     */
    async onReady(): Promise<boolean> {
        if (this.initialized) {
            return true;
        } else {
            return new Promise<boolean>((resolve) => {
                const onInitialized = () => {
                    this.eventEmitter.off(PASIVE_LOGIN_DONE, onInitialized);
                    resolve(true);
                };
                this.eventEmitter.on(PASIVE_LOGIN_DONE, onInitialized);
            });
        }
    }

    async updateProfile(profile:{
        phoneNumber?: string,
        jobTitle?: string,
        companyName?: string,
        picture?: string,
        email?: string,
        displayName?: string,
        id?: string,
    } = {}){
        if (isMsTeams()) {
            await this.teamsLoginService.updateProfile(profile);
        } else {
            await this.microsoftOauthLoginService.updateProfile(profile);
        }
    }

    public async getGraphClient():Promise<Client> {
        if (isMsTeams()) {
            return await this.teamsLoginService.getGraph();
        } else {
            return await this.microsoftOauthLoginService.getGraph();
        }
    }

    onLogin(callback: () => void): () => void {
        this.eventEmitter.on(LOGIN_DONE, callback);
        return () => {
            this.eventEmitter.off(LOGIN_DONE, callback);
        }
    }

    onChange(callback: () => void): () => void {
        let r1 = this.teamsLoginService.onChange(callback);
        this.eventEmitter.on(PASIVE_LOGIN_DONE, callback);
        this.eventEmitter.on(LOGOUT, callback);
        return () => {
            r1();
            this.eventEmitter.off(PASIVE_LOGIN_DONE, callback);
            this.eventEmitter.off(LOGOUT, callback);
        }
    }

    public async passiveLogin() {
        if (!this.authInProgress) {
            this.authInProgress = true;
            setTimeout(() => {
                this.authInProgress = false;
            }, 1000);
            if (isMsTeams()) {
                await this.teamsLoginService.passiveLogin();
                this.authInProgress = false;
            } else {
                await this.microsoftOauthLoginService.passiveLogin();
                this.authInProgress = false;
            }
            this.eventEmitter.emit(PASIVE_LOGIN_DONE);
            this.eventEmitter.emit(LOGIN_DONE);
        }
    }

    private async loginInternal() {
        if (!this.authInProgress) {
            this.authInProgress = true;
            setTimeout(() => {
                this.authInProgress = false;
            }, 1000);
            if (isMsTeams()) {
                await this.teamsLoginService.login();
                this.authInProgress = false;
            } else {
                await this.microsoftOauthLoginService.login();
                this.authInProgress = false;
            }
        }
    }

    ///PUBLIC

    public async login(nofail = true) {
        if (nofail) {
            try {
                return await this.loginInternal();
            } catch (e) {
                this.authInProgress = false;
                //avoid any throw
                console.error(e);
            }
        } else {
            return await this.loginInternal();
        }
        this.eventEmitter.emit(LOGIN_DONE);
    }

    public getUserAccount() {
        return this.nativeLoginBridge.getUserAccount();
    }

    public getName() {
        return this.nativeLoginBridge.getName();
    }

    public async logout() {
        if (!this.authInProgress) {
            this.authInProgress = true;
            setTimeout(() => {
                this.authInProgress = false;
            }, 1000);
            this.nativeLoginBridge.clearProfile();
            if (isMsTeams()) {
                await this.teamsLoginService.logout();
                this.authInProgress = false;
            } else {
                await this.microsoftOauthLoginService.logout();
                this.authInProgress = false;
            }
        }
        this.eventEmitter.emit(LOGOUT);
    }

    public displayProfilePhoto() {
        return this.nativeLoginBridge.displayProfilePhoto();
    }

    public isSignedIn() {
        return this.nativeLoginBridge && this.nativeLoginBridge.isLogged();
    }

    public getAccount(): { email; displayName; id } {
        return {displayName: undefined, email: undefined, id: undefined};
    }

    public passiveLogIn(): Promise<void> {
        return this.passiveLogin();
    }

    public signIn(): Promise<void> {
        return this.login();
    }

    public signOut(): Promise<void> {
        return this.logout();
    }
}
