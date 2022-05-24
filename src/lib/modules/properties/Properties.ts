import {IService} from "@aptero/axolotis-player";
declare const window;

export class Properties implements IService{
    getType(): string {
        return "";
    }

    getGlobalProperties():any{
        if (typeof window !== "undefined") {
            return window.APP_PROPS || {};
        }else{
            return {};
        }
    }

    get<T>(key:string):T{
        return this.getGlobalProperties()[key] as T;
    }

}