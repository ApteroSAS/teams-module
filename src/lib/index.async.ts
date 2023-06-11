/**
 * Should only import type to stay lightweight
 */
import {MsTeamsAPILight} from "@root/lib/microsoft/MsTeamsAPILight";
import {ContainerModule, interfaces} from "inversify";
import {
  COOKIE_STORE_SERVICE,
  CookieStore, PhoenixAuthService,
  PHX_AUTH_SERVICE,
  Properties,
  PROPERTIES_SERVICE
} from "@aptero/axolotis-module-basic";
import {
  MICROSOFT_GRAPH_SERVICE,
  MICROSOFT_LOGIN_SERVICE,
  MICROSOFT_SERVICE,
  MICROSOFT_STATIC_SERVICE,
  MICROSOFT_URL_SERVICE
} from "@root/lib/Identifier";
import {MsTeamsAPI} from "@root/lib/microsoft/MsTeamsAPI";
import {MicrosoftLoginService} from "@root/lib/microsoft/service/MicrosoftLoginService";
import {MicrosoftUrlService} from "@root/lib/microsoft/service/MicrosoftUrlService";
import {MicrosoftGraphService} from "@root/lib/microsoft/service/MicrosoftGraphService";

export * from "./BasicExport";

export const TeamsModule = () => {
  return new ContainerModule((bind: interfaces.Bind) => {
    bind(MICROSOFT_STATIC_SERVICE).toDynamicValue((context) => {
      return new MsTeamsAPILight(
          ()=> { return context.container.get(MICROSOFT_STATIC_SERVICE)}
      );
    }).inSingletonScope();
    bind(MICROSOFT_SERVICE).toDynamicValue(async (context) => {
      const module = await import("@root/lib/microsoft/MsTeamsAPI");
      return new module.MsTeamsAPI(
          context.container.get<Properties>(PROPERTIES_SERVICE),
          context.container.get<CookieStore>(COOKIE_STORE_SERVICE),
          context.container.get<PhoenixAuthService>(PHX_AUTH_SERVICE),
          context.container.get<MicrosoftLoginService>(MICROSOFT_LOGIN_SERVICE),
          context.container.get<MicrosoftUrlService>(MICROSOFT_URL_SERVICE),
          context.container.get<MicrosoftGraphService>(MICROSOFT_GRAPH_SERVICE),
      );
    }).inSingletonScope();
  });
}
