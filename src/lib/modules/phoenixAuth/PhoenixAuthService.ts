import {AdminRole} from "@root/lib/modules/phoenixAuth/AdminRole";
import {
    connectToReticulum,
    createAndRedirectToNewHub,
    fetchReticulumAuthenticated,
    getReticulumFetchUrl, isLocalClient
} from "@root/lib/modules/phoenixAuth/phoenix-utils";
import AuthChannel from "@root/lib/modules/phoenixAuth/auth-channel";
import {IService} from "@aptero/axolotis-player";
import {AuthInterface} from "@root/lib/modules/phoenixAuth/AuthInterface";

export class PhoenixAuthService implements IService{

    adminRole = new AdminRole();
    private ret: any;

    setGlobalReticulumChannel(ret){
        this.ret = ret;
    }

    getGlobalReticulumChannel(ret){
        return ret;
    }

    registerAuth(auth:AuthInterface){
        throw new Error();
    }

    getAdmin(){
        return this.adminRole;
    }

    async connectToReticulum(debug=false, params=null, socketClass=null){
        return connectToReticulum(debug, params, socketClass);
    }

    createAuthChannel(store){
        return new AuthChannel(store);
    }

    getType(): string {
        return PhoenixAuthService.name;
    }

    async createAndRedirectToNewHub(name, sceneId, replace){
        return createAndRedirectToNewHub(name, sceneId, replace);
    }

    getReticulumFetchUrl(path, absolute = false, host = null, port = null) {
        return getReticulumFetchUrl(path, absolute , host, port);
    }

    fetchReticulumAuthenticated(url, method = "GET", payload = null){
        return fetchReticulumAuthenticated(url, method, payload)
    }

    isLocalClient() {
        return isLocalClient();
    }
}