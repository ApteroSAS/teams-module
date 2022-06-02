/**
 * Should only import type to stay lightweight
 */
import type { MsTeamsAPILight } from "@root/modules/microsoft/MsTeamsAPILight";
import type { Properties } from "@root/index";
import type { RoomService } from "@root/modules/roomAPI/RoomService";
import type { PhoenixAuthService } from "@root/modules/phoenixAuth/PhoenixAuthService";
import type { MsTeamsAPI } from "@root/modules/microsoft/MsTeamsAPI";
export declare const MICROSOFT_SERVICE = "@aptero/axolotis-module-teams/MicrosoftService";
export declare const MICROSOFT_STATIC_SERVICE = "@aptero/axolotis-module-teams/MicrosoftStaticService";
export declare const PROPERTIES_SERVICE = "@aptero/axolotis-module-properties/Properties";
export declare const STORE_SERVICE = "@aptero/axolotis-module-storage/Store";
export declare const COOKIE_STORE_SERVICE = "@aptero/axolotis-module-storage/CookieStore";
export declare const PHX_AUTH_SERVICE = "@aptero/axolotis-module-phx-auth/PhoenixAuthService";
export declare const NAME_SERVICE = "@aptero/axolotis-module-name/PhoenixAuthService";
export declare const ROOM_SERVICE = "@aptero/axolotis-module-room/RoomService";
export declare function msTeamsAPILight(): MsTeamsAPILight;
export declare function propertyService(): Properties;
export declare function roomService(): RoomService;
export declare function phoenixAuth(): PhoenixAuthService;
export declare function msTeamsAPI(): Promise<MsTeamsAPI>;
