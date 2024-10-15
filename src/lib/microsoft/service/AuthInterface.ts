import {Client} from "@microsoft/microsoft-graph-client";

export interface MSAuthInterface {
  updateProfile(profile: {
    phoneNumber?: string;
    jobTitle?: string;
    companyName?: string;
    picture?: string;
    email?: string;
    displayName?: string;
    id?: string;
  }): Promise<void>;

  getGraph(): Promise<Client | null>;

  onChange(callback: () => void): () => void;

  /**
   * This is allways called on the start of the app to try to passive login should not trigger any popup - TODO will try to setup graph or logout the user if failled
   */
  passiveLogin(): Promise<boolean>;

  /**
   * This is called when the user click on signin - this perfor a user interaction auth login and may trigger popup
   * store the tenant
   * id
   * JWT decripting of the token
   */
  login(): Promise<boolean>;

  logout(): Promise<void>;
}
