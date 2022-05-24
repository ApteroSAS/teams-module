export declare class RoomService {
    parseUrl(url: any): {
        origin: string;
        roomSID: string;
    };
    getEmbedToken(roomSID: any, origin: any): Promise<any>;
}
export declare const roomService: RoomService;
