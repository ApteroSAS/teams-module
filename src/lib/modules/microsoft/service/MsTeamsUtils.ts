import { getServiceSync } from "@aptero/axolotis-player";

const EventEmitter = require("eventemitter3");

import * as microsoftTeams from "@microsoft/teams-js";
import { MICROSOFT_STATIC_SERVICE } from "@root/ImportHelper";
import { MsTeamsAPILight } from "@root/modules/microsoft/MsTeamsAPILight";
import { CHANGE_SETTINGS_URL, PROCESS_DEEPLINK } from "@root/modules/microsoft/Events";

let eventListener = new EventEmitter();

export function sendEvent(type, data) {
  eventListener.emit(type, data);
}

export function getMSEvents() {
  return eventListener;
}

export function msTeamsUtils() {
  return getServiceSync<MsTeamsAPILight>(MICROSOFT_STATIC_SERVICE).msTeams();
}

export function changeUrlSettings(url) {
  sendEvent(CHANGE_SETTINGS_URL, { url });
}

export async function getContext(callback) {
  try {
    await microsoftTeams.initialize();
    // https://docs.microsoft.com/en-us/microsoftteams/platform/tabs/how-to/access-teams-context
    //"frameContext": "The context where tab URL is loaded (for example, content, task, setting, remove, sidePanel)",
    microsoftTeams.getContext(callback);
  } catch (e) {
    console.error(e);
  }
}

export function processDeepLink(link) {
  if (msTeamsUtils()) {
    sendEvent(PROCESS_DEEPLINK, { link });
  } else {
    window.open(link, "_blank");
  }
}
