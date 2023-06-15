import {AuthenticationResult, PublicClientApplication} from "@azure/msal-browser";
import {getScopesLight} from "../../aptTeamsApp/scope";
import {NativeLoginBridge, Properties} from "@aptero/axolotis-module-basic";
import {PropertiesFormat, PROPERTY_KEY} from "@root/lib/microsoft/PropertiesFormat";
import {Client} from "@microsoft/microsoft-graph-client";

declare const window;

export class MicrosoftOauthLoginService {
  private accessToken = null;
  private publicClientApplication: PublicClientApplication | undefined;
  private properties: PropertiesFormat;
  private client: Client;

  constructor(
      propertiesService:Properties,
      private msToNativeLoginBridge: NativeLoginBridge
  ) {
    this.properties = propertiesService.get<PropertiesFormat>(PROPERTY_KEY)
  }

  async getGraph() {
    if(!this.client){
      await this.passiveLogin();
    }
    return this.client;
  }

  getPublicClientApplication() {
    if (!this.publicClientApplication) {
      this.publicClientApplication = new PublicClientApplication({
        auth: {
          clientId: this.properties.MICROSOFT_APP_ID,
          redirectUri: window.location.origin + "/signin",
          // to allow only AAD accounts: authority:https://login.microsoftonline.com/organizations
          authority: this.properties.MICROSOFT_APP_AUTHORITY || "https://login.microsoftonline.com/common",
        },
        cache: {
          cacheLocation: "sessionStorage",
          storeAuthStateInCookie: true,
        },
      });
    }
    return this.publicClientApplication;
  }

  async passiveLogin() {
    if (window.APP.store.state.profile.microsoftUser && !this.accessToken) {
      try {
        //  try silent login
        const account = this.getPublicClientApplication().getAllAccounts()[0];
        const accessTokenRequest = {
          scopes: getScopesLight(),
          account: account,
        };
        let authenticationResult = await this.getPublicClientApplication().acquireTokenSilent(accessTokenRequest);
        await this.basicAuth(authenticationResult);
      } catch (err) {
        console.error(err);
        // logout Moz to be sync
        //this.store.state.profile.microsoftUser = false; //will be done by the logout/signout
        this.accessToken = null; //passive clean of acces token
        this.msToNativeLoginBridge.clearProfile();
      }
    }
  }

  createGraphClient(token) {
    this.accessToken = token;
    this.client = Client.init(
        {
          authProvider: (done) => {
            done(null, this.accessToken);
          },
        }
    );
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
    await this.msToNativeLoginBridge.setProfile(profile);
  }

  async basicAuth(auth:AuthenticationResult) {
    this.createGraphClient(auth.accessToken);
    console.log(auth);
    const email = auth.account.homeAccountId;
    const token = auth.accessToken;
    await this.msToNativeLoginBridge.setProfile({
      email: auth.account.homeAccountId,
      displayName: auth.account.name,
    });
    await this.msToNativeLoginBridge.nativeLogin(email, token);
  }

  async login() {
    console.log("MicrosoftOauthLoginService : userInteractionAuth");
    try {
      const loginRequest = {
        scopes: getScopesLight(),
      };
      let response = await this.getPublicClientApplication().loginPopup(loginRequest);
      await this.basicAuth(response);
    } catch (error) {
      console.error("error", error);
    }
  }

  async logout() {
    if (window.APP.store.state.profile.microsoftUser) {
      this.msToNativeLoginBridge.clearProfile();
      if (this.publicClientApplication) {
        return this.getPublicClientApplication().logoutPopup();
      }
    }
  }
}
