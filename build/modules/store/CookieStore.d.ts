import { IService } from "@aptero/axolotis-player";
export declare class CookieStore implements IService {
    getType(): string;
    get(key: any): string;
    remove(key: any): void;
}
