import { Module } from "@aptero/axolotis-player";
import { Item } from "@aptero/axolotis-player";
export declare class AxItem implements Item {
    constructor();
    modules(): {
        [id: string]: Module;
    };
}
