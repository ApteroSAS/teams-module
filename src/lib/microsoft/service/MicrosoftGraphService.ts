import {Buffer} from "buffer";
import {Client} from "@microsoft/microsoft-graph-client";
import {MicrosoftLoginService} from "@root/lib";

Buffer.from("anything", "base64");

type UsageRights = {
    '@odata.context': string;
    value: {
        id: string;
        catalogId: string;
        serviceIdentifier: string;
        state: string;
    }[];
};

function extractIdentifiers(data: UsageRights, keyword: string): string[] {
    let identifiers: string[] = [];

    data.value.forEach(element => {
        if (element.serviceIdentifier.includes(keyword)) {
            identifiers.push(element.serviceIdentifier);
        }
    });

    return identifiers;
}

export class MicrosoftGraphService {
    private client: Client;

    constructor(
        private microsoftLogin: MicrosoftLoginService,
    ) {
        console.log("MicrosoftGraphService : constructor 05");
        microsoftLogin.onLogin(async () => {
            await this.privateTryInit();
        });
    }

    private async init(client: Client) {
        if (!client) {
            return;
        }
        console.log("MicrosoftGraphService : init");
        this.client = client;
        const user = await this.getUserDetails();
        const phoneNumber = user.mobilePhone;
        const jobTitle = user.jobTitle;
        const profilePicture = await this.getUserPhotoAsBase64();
        const organization = await this.getUserOrganization();
        const mail = user.mail;
        let id = user.id;
        const displayName = user.displayName;
        await this.microsoftLogin.updateProfile({
            phoneNumber,
            jobTitle,
            picture: profilePicture,
            companyName: organization,
            email: mail,
            id,
            displayName,
        });
    }

    getClient() {
        return this.client;
    }

    isInitialized() {
        return !!this.client;
    }

    private async privateTryInit(){
        if (this.microsoftLogin.isSignedIn() && !this.client) {
            await this.init(await this.microsoftLogin.getGraphClient());
        }
    }

    async getUsagesRights(filter: string): Promise<string[]> {
        await this.privateTryInit();
        const data = await this.client.api("/me/usageRights").version("beta").get()
        return extractIdentifiers(data, filter);
    }

    async getUserDetails(): Promise<{
        jobTitle: string,
        mobilePhone: string,
        mail: string,
        displayName: string,
        id: string
    }> {
        /*
        {
    "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#users/$entity",
    "businessPhones": [
        "+1 412 555 0109"
    ],
    "displayName": "Megan Bowen",
    "givenName": "Megan",
    "jobTitle": "Auditor",
    "mail": "MeganB@M365x214355.onmicrosoft.com",
    "mobilePhone": null,
    "officeLocation": "12/1110",
    "preferredLanguage": "en-US",
    "surname": "Bowen",
    "userPrincipalName": "MeganB@M365x214355.onmicrosoft.com",
    "id": "48d31887-5fad-4d73-a9f5-3c356e68a038"
}
         */
        await this.privateTryInit();
        return await this.client.api("/me").get();
    }

    async getUserDetailsBetaV() {
        await this.privateTryInit();
        return await this.client.api("/me/profile").version("beta").get();
    }

    async getUserOrganization() {
        //https://graph.microsoft.com/v1.0/organization
        //check if the  user account is a work account (MSA For personal account and AAD for work account)
        try {
            await this.privateTryInit();
            const organization = await this.client.api("/organization").get();
            return organization.value[0].displayName;
        } catch (e) {
            return null;
        }
    }

    async blobToBase64(blob): Promise<string> {
        await this.privateTryInit();
        return new Promise((resolve, _) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
        });
    }

    async getUserPhotoAsBase64(): Promise<string> {
        try {
            await this.privateTryInit();
            let profile = await this.client.api("https://graph.microsoft.com/v1.0/me/photo/$value").get();
            let b64 = await this.blobToBase64(profile);
            return b64;
        } catch (e) {
            console.log("profile photo not found");
        }
        return null;
    }
}
