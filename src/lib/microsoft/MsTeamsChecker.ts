import {MSTEAMS_QUERY_PARAM} from "@root/lib/microsoft/MsTeamsAPILight";

export function isMsTeams(){
    const qs = new URLSearchParams(location.search);
    return !!qs.get(MSTEAMS_QUERY_PARAM);
}
