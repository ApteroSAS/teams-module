//INFO: Dynamic require of "@microsoft/microsoft-graph-client" is not supported
import "@microsoft/microsoft-graph-client";

export type { MicrosoftLoginService } from "@root/lib/microsoft/service/MicrosoftLoginService";
export type {MsTeamsAPILight} from "@root/lib/microsoft/MsTeamsAPILight";
export type {MsTeamsAPI} from "@root/lib/microsoft/MsTeamsAPI";
export type {MicrosoftGraphService} from "@root/lib/microsoft/service/MicrosoftGraphService";
export * from "./Identifier";

export const CHANGE_SETTINGS_URL = "ms-teams-change-settings-url";
export const PROCESS_DEEPLINK = "ms-teams-deep-link";
export const MSTEAMS_QUERY_PARAM = "msteams";
