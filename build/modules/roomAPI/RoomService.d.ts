import { IService } from "@aptero/axolotis-player";
export default class RoomService implements IService {
    constructor();
    getType(): string;
    createRoom(sceneid: any): Promise<void>;
    changeUrlSettings(url: any): void;
}
