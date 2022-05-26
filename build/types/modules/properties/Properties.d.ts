import { IService } from "@aptero/axolotis-player";
export declare class Properties implements IService {
    getType(): string;
    getGlobalProperties(): any;
    get<T>(key: string): T;
}
