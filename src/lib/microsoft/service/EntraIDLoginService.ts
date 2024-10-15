import {PublicClientApplication, AuthenticationResult} from "@azure/msal-browser";
import {Client} from "@microsoft/microsoft-graph-client";
import {CookieStore, NativeLoginBridge, Properties} from "@aptero/axolotis-module-basic";
import {EventEmitter} from "eventemitter3";
import {PropertiesFormat, PROPERTY_KEY} from "../PropertiesFormat";
import {MSAuthInterface} from "@root/lib/microsoft/service/AuthInterface";

const FORCE_STAY_LOGOUT = "ms_force_stay_logout";
export const LOGGED_BASIC_INFO = "ms-auth-basic-info";
export const LOGIN = "ms-auth-service-login";
export const LOGOUT = "ms-auth-service-logout";

export class EntraIDLoginService implements MSAuthInterface {
  private ppt: PropertiesFormat;
  private msalInstance: PublicClientApplication;
  private eventEmitter = new EventEmitter();
  private graph: Client;
  private wip = null;
  private isInitialized = false;

  constructor(
    private msToNativeLoginBridge: NativeLoginBridge,
    properties: Properties,
    private cookieStore: CookieStore,
  ) {
    this.ppt = properties.get<PropertiesFormat>(PROPERTY_KEY);
    this.msalInstance = new PublicClientApplication({
      auth: {
        clientId: this.ppt.MICROSOFT_APP_ID,
        authority: this.ppt.MICROSOFT_APP_AUTHORITY,
        redirectUri: this.ppt.SIGNIN_REDIRECT_URI,
      }
    });
  }

  public async getGraph(): Promise<Client | null> {
    const token = await this.getAccessToken(["User.Read"]);
    if (token) {
      const authProvider = {getAccessToken: async () => token};
      this.graph = Client.initWithMiddleware({authProvider});
      return this.graph;
    }
    return null;
  }

  public async updateProfile(profile: {
    phoneNumber?: string,
    jobTitle?: string,
    companyName?: string,
    picture?: string,
  } = {}): Promise<void> {
    const basicUserInfo = await this.getUserInfo();
    if (basicUserInfo) {
      const user = {
        email: basicUserInfo.preferredUserName,
        displayName: basicUserInfo.displayName,
        id: basicUserInfo.objectId
      };
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
  }

  public async login(): Promise<boolean> {
    return this.wipLoginWrap(async () => {
      await this.initialize();
      const loginRequest = {scopes: ["User.Read"]};
      const response = await this.msalInstance.loginPopup(loginRequest);

      console.log("handleAuthenticationResponse", JSON.stringify(response));
      if (response && response.account && response.idTokenClaims) {
        const displayName = response.account.name; //displayName
        const email = response.account.idTokenClaims.preferred_username; //email
        const token = response.accessToken;
        const accountID = response.account.homeAccountId;
        await this.msToNativeLoginBridge.setProfile({
          email: email,
          displayName: displayName,
          microsoftUser: accountID,
        });
        await this.msToNativeLoginBridge.nativeLogin(email, token);
        await this.msToNativeLoginBridge.setProfile({
          email: email,
          displayName: displayName,
          microsoftUser: accountID,
        }); //HACK Delayed the display name since another process in the code seems to set Guest name
        this.eventEmitter.emit(LOGIN);
      }
      return true;
    });
  }

  public async passiveLogin(): Promise<boolean> {
    return this.wipLoginWrap(async () => {
      if (this.cookieStore.get(FORCE_STAY_LOGOUT)) {
        return false;
      }
      await this.initialize();
      try {
        const account = this.msalInstance.getAllAccounts()[0];
        if (account) {
          await this.msalInstance.ssoSilent({account});
          await this.getGraph();
          return true;
        }
      } catch (error) {
        //passive login should never fail - just ignore
        console.warn("Passive login failed", error);
        await this.msToNativeLoginBridge.logout();
        return false;
      }
      return false;
    });
  }

  public async logout(): Promise<void> {
    this.cookieStore.set(FORCE_STAY_LOGOUT, "true");
    await this.msToNativeLoginBridge.logout();
    this.eventEmitter.emit(LOGOUT);
  }

  public onChange(callback: () => void): () => void {
    this.eventEmitter.on(LOGGED_BASIC_INFO, callback);
    this.eventEmitter.on(LOGIN, callback);
    this.eventEmitter.on(LOGOUT, callback);
    return () => {
      this.eventEmitter.off(LOGGED_BASIC_INFO, callback);
      this.eventEmitter.off(LOGIN, callback);
      this.eventEmitter.off(LOGOUT, callback);
    };
  }

  ////PRIVATE
  private async wipLoginWrap<T>(cb: () => T): Promise<T> {
    if (this.wip) return await this.wip;
    this.wip = new Promise(async (resolve, reject) => {
      try {
        resolve(await cb());
      } catch (e) {
        reject(e);
      }
      this.wip = null;
    });
    return await this.wip;
  }

  private async initialize() {
    if (!this.isInitialized) {
      await this.msalInstance.initialize();
      this.isInitialized = true;
    }
  }

  private async getAccessToken(scopes: string[]): Promise<string | null> {
    await this.initialize();
    try {
      const response = await this.msalInstance.acquireTokenSilent({scopes});
      return response.accessToken;
    } catch (error) {
      console.error("Token acquisition error: ", error);
      return null;
    }
  }

  private async getUserInfo(): Promise<{ displayName: string; preferredUserName: string; objectId: string } | null> {
    const account = this.msalInstance.getAllAccounts()[0];
    if (account) {
      return {
        displayName: account.name,
        preferredUserName: account.username,
        objectId: account.homeAccountId
      };
    }
    return null;
  }
}
