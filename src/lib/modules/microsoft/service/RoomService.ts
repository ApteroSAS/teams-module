import axios from "axios";
import {getServiceSync} from "../../../../../../../../axolotis/axolotis-player/build/types/lib";
import {Properties} from "@root/lib";
import {PropertiesFormat, PROPERTY_KEY} from "@root/lib/modules/microsoft/PropertiesFormat";

export class RoomService{
    parseUrl(url){
        //https://alphahub.aptero.co/fTj63Hg/room?msteams=true&embed_token=846d38e7d0bc3c49716f5f5cb2577ff8
        let urlObj = new URL(url)

        if(window.location.origin.startsWith("https://localhost")){
            return {
                origin: urlObj.origin,
                roomSID: urlObj.searchParams.get("hub_id")
            }
        }else {
            return {
                origin: urlObj.origin,
                roomSID: urlObj.pathname.split("/")[1]
            }
        }
    }

    async getEmbedToken(roomSID,origin){
        if(window.location.origin.startsWith("https://localhost")){
            let conf = getServiceSync<Properties>(Properties.name).get<PropertiesFormat>(PROPERTY_KEY);
            origin = ((conf.ROOM_TOKEN_SERVICE) || window.location.origin)
        }
        let res = await axios.get(origin+"/service/room/"+"room/"+roomSID+"/embed/token");
        return res.data;
    }
}

export const roomService = new RoomService();