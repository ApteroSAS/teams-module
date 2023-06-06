import {MicrosoftGraphService} from "./MicrosoftGraphService";
import {MicrosoftOauthLoginService} from "./MicrosoftOauthLoginService";
import {TeamsLoginService} from "./TeamsLoginService";
import type {CookieStore} from "@aptero/axolotis-module-basic";
import {AuthInterface, MsToNativeLoginBridge, Properties} from "@aptero/axolotis-module-basic";
import {AUTH_SERVICE_INITIALIZE, getAuthEvents} from "./AuthEvent";
import {isMsTeams} from "@root/lib/microsoft/MsTeamsChecker";
import {PropertiesFormat, PROPERTY_KEY} from "@root/lib/microsoft/PropertiesFormat";

export class MicrosoftLoginService implements AuthInterface {
  authInProgress = false;
  msGraphService = new MicrosoftGraphService();
  microsoftOauthLoginService: MicrosoftOauthLoginService;
  teamsLoginService: TeamsLoginService;
  private initialized: boolean = false;

  getTeamsLoginService() {
    return this.teamsLoginService;
  }

  constructor(
      private properties:Properties,
      private cookieStore :CookieStore,
      private msToNativeLoginBridge: MsToNativeLoginBridge
  ) {
    this.microsoftOauthLoginService = new MicrosoftOauthLoginService(
        properties.get<PropertiesFormat>(PROPERTY_KEY),
        this.msGraphService,
        this.msToNativeLoginBridge
    );
    this.teamsLoginService = new TeamsLoginService(
        this.msGraphService,
        this.msToNativeLoginBridge,
        properties,
        cookieStore
    );
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
          getAuthEvents().off(AUTH_SERVICE_INITIALIZE, onInitialized);
          resolve(true);
        };
        getAuthEvents().on(AUTH_SERVICE_INITIALIZE, onInitialized);
      });
    }
  }

  async passiveLogin() {
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
      getAuthEvents().emit(AUTH_SERVICE_INITIALIZE);
    }
  }

  private async loginInternal() {
    if (!this.authInProgress) {
      this.authInProgress = true;
      setTimeout(() => {
        this.authInProgress = false;
      }, 1000);
      if (isMsTeams()) {
        await this.teamsLoginService.userInteractionAuth();
        this.authInProgress = false;
      } else {
        await this.microsoftOauthLoginService.login();
        this.authInProgress = false;
      }
    }
  }

  async login(nofail = true) {
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

  getUserAccount() {
    return this.msToNativeLoginBridge.getUserAccount();
  }

  getName() {
    return this.msToNativeLoginBridge.getName();
  }

  async logout() {
    if (!this.authInProgress) {
      this.authInProgress = true;
      setTimeout(() => {
        this.authInProgress = false;
      }, 1000);
      this.msToNativeLoginBridge.clearProfile();
      if (isMsTeams()) {
        await this.teamsLoginService.logout();
        this.authInProgress = false;
      } else {
        await this.microsoftOauthLoginService.logout();
        this.authInProgress = false;
      }
    }
  }

  displayProfilePhoto() {
    return this.msToNativeLoginBridge.displayProfilePhoto();
  }

  isSignedIn() {
    return this.msToNativeLoginBridge.isLogged();
  }

  getAccount(): { email; displayName; id } {
    return { displayName: undefined, email: undefined, id: undefined };
  }

  passiveLogIn(): Promise<void> {
    return this.passiveLogin();
  }

  signIn(): Promise<void> {
    return this.login();
  }

  signOut(): Promise<void> {
    return this.signOut();
  }
}
