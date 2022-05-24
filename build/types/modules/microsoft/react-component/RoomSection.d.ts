/// <reference types="react" />
export declare function useSpokeProject(): any;
export declare function useFavoriteRooms(): any;
export declare function createAndSelect(sceneId: any, name?: any): Promise<any>;
export declare function RoomSection(props: {
    roomUrl: string;
    suggestedDisplayName: string;
    onChangeSuggestedDisplayName: (text: string) => void;
    onChangeRoomUrl: (text: string) => void;
}): JSX.Element;
