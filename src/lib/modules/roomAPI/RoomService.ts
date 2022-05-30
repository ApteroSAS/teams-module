import axios from "axios";
import { COOKIE_STORE_SERVICE, NAME_SERVICE, PHX_AUTH_SERVICE, Properties, STORE_SERVICE } from "@root/index";
import { PropertiesFormat, PROPERTY_KEY } from "@root/modules/roomAPI/PropertiesFormat";
import { getServiceSync, IService } from "@aptero/axolotis-player";
import { changeUrlSettings } from "@root/modules/microsoft/service/MsTeams";

//import Cookies from "js-cookie";
import { createHubChannelParams } from "./hub-utils";
/*import {
    connectToReticulum,
    createAndRedirectToNewHub,
    fetchReticulumAuthenticated,
    getReticulumFetchUrl, isLocalClient
} from "../../../../utils/phoenix-utils";*/
import { NameGenerationService } from "@root/modules/nameGeneration/NameGenerationService";
import Store from "@root/modules/store/Store";
import { PhoenixAuthService } from "@root/modules/phoenixAuth/PhoenixAuthService";
import { CookieStore } from "@root/modules/store/CookieStore";

declare const window;

export class RoomService implements IService {
  getType(): string {
    return RoomService.name;
  }
  parseUrl(url) {
    //https://alphahub.aptero.co/fTj63Hg/room?msteams=true&embed_token=846d38e7d0bc3c49716f5f5cb2577ff8
    let urlObj = new URL(url);

    if (window.location.origin.startsWith("https://localhost")) {
      return {
        origin: urlObj.origin,
        roomSID: urlObj.searchParams.get("hub_id")
      };
    } else {
      return {
        origin: urlObj.origin,
        roomSID: urlObj.pathname.split("/")[1]
      };
    }
  }

  createAndRedirectToNewHub(a, b, c) {
    return getServiceSync<PhoenixAuthService>(PHX_AUTH_SERVICE).createAndRedirectToNewHub(a, b, c);
  }

  async getEmbedToken(roomSID, origin) {
    if (window.location.origin.startsWith("https://localhost")) {
      let conf = getServiceSync<Properties>(Properties.name).get<PropertiesFormat>(PROPERTY_KEY);
      origin = conf.ROOM_TOKEN_SERVICE || window.location.origin;
    }
    let res = await axios.get(origin + "/service/room/" + "room/" + roomSID + "/embed/token");
    return res.data;
  }

  fetchSpokeProject(userId) {
    return cursor => {
      if (userId) {
        //https://alphahub.aptero.co/api/v1/media/search?filter=my-scenes&source=scenes&user=640407050966269961
        return getServiceSync<PhoenixAuthService>(PHX_AUTH_SERVICE).fetchReticulumAuthenticated(
          `/api/v1/media/search?filter=my-scenes&source=scenes&user=${userId}&cursor=${cursor}`
        );
      } else {
        return Promise.reject(new Error("Not signed in"));
      }
    };
  }

  fetchFavoriteRoom(userId) {
    return cursor => {
      if (userId) {
        return getServiceSync<PhoenixAuthService>(PHX_AUTH_SERVICE).fetchReticulumAuthenticated(
          `/api/v1/media/search?source=favorites&type=rooms&user=${userId}&cursor=${cursor}`
        );
      } else {
        return Promise.reject(new Error("Not signed in"));
      }
    };
  }

  async setFavorite(hubId) {
    const socket = await getServiceSync<PhoenixAuthService>(PHX_AUTH_SERVICE).connectToReticulum(false);
    socket.onClose(() => {});
    // Reticulum global channel
    window.APP.retChannel = socket.channel(`ret`, { hub_id: hubId });
    getServiceSync<PhoenixAuthService>(PHX_AUTH_SERVICE).setGlobalReticulumChannel(window.APP.retChannel);
    window.APP.retChannel
      .join()
      .receive("ok", () => {
        const OAUTH_FLOW_PERMS_TOKEN_KEY = "ret-oauth-flow-perms-token";
        const oauthFlowPermsToken = getServiceSync<CookieStore>(COOKIE_STORE_SERVICE).get(OAUTH_FLOW_PERMS_TOKEN_KEY);
        if (oauthFlowPermsToken) {
          getServiceSync<CookieStore>(COOKIE_STORE_SERVICE).remove(OAUTH_FLOW_PERMS_TOKEN_KEY);
        }
        const hubChannelParamsForPermsToken = permsToken => {
          return createHubChannelParams({
            profile: getServiceSync<Store>(STORE_SERVICE).state.profile,
            pushSubscriptionEndpoint: null,
            permsToken,
            isMobile: false,
            isMobileVR: false,
            isEmbed: false,
            hubInviteId: null,
            authToken: getServiceSync<Store>(STORE_SERVICE).state.credentials && getServiceSync<Store>(STORE_SERVICE).state.credentials.token
          });
        };
        const hubPhxChannel = socket.channel(`hub:${hubId}`, hubChannelParamsForPermsToken(oauthFlowPermsToken));
        hubPhxChannel
          .join()
          .receive("ok", async () => {
            hubPhxChannel.push("favorite", {});
          })
          .receive("error", res => {
            console.error(res);
          });
      })
      .receive("error", res => {
        console.error(res);
      });
  }

  async createAndSelect(sceneId, name = undefined) {
    const createUrl = getServiceSync<PhoenixAuthService>(PHX_AUTH_SERVICE).getReticulumFetchUrl("/api/v1/hubs");
    let nameService = getServiceSync<NameGenerationService>(NAME_SERVICE);
    const payload: any = { hub: { name: name || nameService.generateHubName() } };

    if (sceneId) {
      payload.hub.scene_id = sceneId;
    }

    const headers: any = { "content-type": "application/json" };
    const store = getServiceSync<Store>(STORE_SERVICE);
    if (store.state && store.state.credentials.token) {
      headers.authorization = `bearer ${store.state.credentials.token}`;
    }

    let res = await fetch(createUrl, {
      body: JSON.stringify(payload),
      headers,
      method: "POST"
    }).then(r => r.json());

    if (res.error === "invalid_token") {
      // Clear the invalid token from store.
      store.update({ credentials: { token: null, email: null } });

      // Create hub anonymously
      delete headers.authorization;
      res = await fetch(createUrl, {
        body: JSON.stringify(payload),
        headers,
        method: "POST"
      }).then(r => r.json());
    }

    const hub = res;
    let url = hub.url;

    const creatorAssignmentToken = hub.creator_assignment_token;
    if (creatorAssignmentToken) {
      store.update({ creatorAssignmentTokens: [{ hubId: hub.hub_id, creatorAssignmentToken: creatorAssignmentToken }] });

      // Don't need to store the embed token if there's no creator assignment token, since that means
      // we are the owner and will get the embed token on page load.
      const embedToken = hub.embed_token;

      if (embedToken) {
        store.update({ embedTokens: [{ hubId: hub.hub_id, embedToken: embedToken }] });
      }
    }

    if (getServiceSync<PhoenixAuthService>(PHX_AUTH_SERVICE).isLocalClient()) {
      url = window.location.origin + `/hub.html?hub_id=${hub.hub_id}`;
    }
    this.setFavorite(hub.hub_id);
    return url;
  }

  async createRoom(sceneid) {
    let url = await this.createAndSelect(sceneid);
    console.log("created room : " + url);
    changeUrlSettings(url);
  }

  createRoomEntry(name, sceneid, imageUrl) {
    return {
      allow_remixing: false,
      attributions: {
        content: [
          {
            title: "Salle"
          },
          {
            title: "Image"
          },
          {
            title: "Image 1"
          },
          {
            title: "Video"
          }
        ],
        creator: ""
      },
      description: null,
      id: sceneid, //"EW4e3CG"
      images: {
        preview: {
          url: imageUrl //"https://alphahub.aptero.co/files/cb50c02d-585a-4feb-8461-e6d8cd34b656.jpg"
        }
      },
      name: name,
      project_id: "XXXXX",
      type: "scene",
      url: window.location.origin + "/" + sceneid
    };
  }
}
