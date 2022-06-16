import { ModulePromise } from "@aptero/axolotis-player";
import { Item } from "@aptero/axolotis-player";
export declare class AxItem implements Item {
    constructor();
    modules(): {
        [id: string]: ModulePromise;
    };
}
