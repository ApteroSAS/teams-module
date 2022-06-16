import { IService } from "@aptero/axolotis-player";
export default class NameGenerationService implements IService {
    getType(): string;
    generateHubName(): string;
}
