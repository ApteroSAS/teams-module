import {MicrosoftOauthLoginService} from "./MicrosoftOauthLoginService";
import {TeamsLoginService} from "./TeamsLoginService";
import {AuthInterface, NativeLoginBridge} from "@aptero/axolotis-module-basic";
import {isMsTeams} from "@root/lib/microsoft/MsTeamsChecker";
import {EventEmitter} from "eventemitter3";

const AUTH_SERVICE_INITIALIZE = "AUTH_SERVICE_INITIALIZE";
const LOGOUT = "LOGOUT";

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

    async onReady(): Promise<boolean> {
        if (this.initialized) {
            return Promise.resolve(true);
        } else {
            return new Promise<boolean>((resolve) => {
                const onInitialized = () => {
                    this.eventEmitter.off(AUTH_SERVICE_INITIALIZE, onInitialized);
                    resolve(true);
                };
                this.eventEmitter.on(AUTH_SERVICE_INITIALIZE, onInitialized);
            });
        }
    }

    onChange(callback: () => void): () => void {
        let r1 = this.teamsLoginService.onChange(callback);
        this.eventEmitter.on(AUTH_SERVICE_INITIALIZE, callback);
        this.eventEmitter.on(LOGOUT, callback);
        return () => {
            r1();
            this.eventEmitter.off(AUTH_SERVICE_INITIALIZE, callback);
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
            this.eventEmitter.emit(AUTH_SERVICE_INITIALIZE);
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
