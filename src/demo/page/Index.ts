//TODO MS login example
import {createWorld, getGlobalStorageValue, GLOBAL_WORLDS_ENTITY, WorldEntity} from "@aptero/axolotis-player";
import {msTeamsAPI, msTeamsAPILightAsync} from "../../lib";

async function initAxolotisPlayer(){
    const worlds = getGlobalStorageValue<WorldEntity[]>(GLOBAL_WORLDS_ENTITY, false);
    if ((worlds && worlds.length > 0)) {
        throw new Error("Axolotis World already initialized");
    }
    await createWorld();
    const {register} = await import("../../lib/index");
    await register();
    console.log("Axolotis player : loaded");
}


(async ()=> {
    await initAxolotisPlayer();
    await msTeamsAPILightAsync();
    await msTeamsAPI();
    console.log("loaded");
})()