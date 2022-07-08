/**
 * Should only import type to stay lightweight
 */
import type MsTeamsAPILight from "./modules/microsoft/MsTeamsAPILight";
import type RoomService from "./modules/roomAPI/RoomService";
import type { MsTeamsAPI } from "./modules/microsoft/MsTeamsAPI";
export declare const MICROSOFT_SERVICE = "@aptero/axolotis-module-teams/MicrosoftService";
export declare const MICROSOFT_STATIC_SERVICE = "@aptero/axolotis-module-teams/MicrosoftStaticService";
export declare const PROPERTIES_SERVICE = "@aptero/axolotis-module-properties/Properties";
export declare const ROOM_SERVICE = "@aptero/axolotis-module-room/RoomService";
export declare function msTeamsAPILight(): MsTeamsAPILight;
export declare function roomService(): RoomService;
export declare function msTeamsAPILightAsync(): Promise<MsTeamsAPILight>;
export declare function msTeamsAPI(): Promise<MsTeamsAPI>;
