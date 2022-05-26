import { AdminRole } from "@root/lib/modules/phoenixAuth/AdminRole";
import AuthChannel from "@root/lib/modules/phoenixAuth/auth-channel";
import { IService } from "@aptero/axolotis-player";
import { AuthInterface } from "@root/lib/modules/phoenixAuth/AuthInterface";
export declare class PhoenixAuthService implements IService {
    adminRole: AdminRole;
    private ret;
    setGlobalReticulumChannel(ret: any): void;
    getGlobalReticulumChannel(ret: any): any;
    registerAuth(auth: AuthInterface): void;
    getAdmin(): AdminRole;
    connectToReticulum(debug?: boolean, params?: any, socketClass?: any): Promise<any>;
    createAuthChannel(store: any): AuthChannel;
    getType(): string;
    createAndRedirectToNewHub(name: any, sceneId: any, replace: any): Promise<void>;
    getReticulumFetchUrl(path: any, absolute?: boolean, host?: any, port?: any): any;
    fetchReticulumAuthenticated(url: any, method?: string, payload?: any): Promise<any>;
    isLocalClient(): boolean;
}
