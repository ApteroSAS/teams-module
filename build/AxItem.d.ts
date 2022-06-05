import { IService, Module } from "@aptero/axolotis-player";
import { Item } from "@aptero/axolotis-player";
export declare class AxItem implements Item {
    constructor();
    staticService(): {
        [id: string]: IService;
    };
    modules(): {
        [id: string]: Module;
    };
}
