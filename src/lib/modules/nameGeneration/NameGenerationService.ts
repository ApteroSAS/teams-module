import {IService} from "@aptero/axolotis-player";
import {generateHubName} from "@root/lib/modules/nameGeneration/name-generation";

export class NameGenerationService implements IService{
    getType(): string {
        return NameGenerationService.name;
    }

    generateHubName() {
        return generateHubName();
    }
}