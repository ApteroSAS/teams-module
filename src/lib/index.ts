/**
 * Should only import type to stay lightweight
 */
import "reflect-metadata";
import {MsTeamsAPILight} from "@root/lib/microsoft/MsTeamsAPILight";
import {MsTeamsAPI} from "@root/lib/microsoft/MsTeamsAPI";
import {ContainerModule, interfaces} from "inversify";
import {
  COOKIE_STORE_SERVICE,
  CookieStore,
  PhoenixAuthService,
  PHX_AUTH_SERVICE,
  Properties, NATIVE_LOGIN_BRIDGE_SERVICE, NativeLoginBridge, PROPERTIES_SERVICE
} from "@aptero/axolotis-module-basic";
import {
  MICROSOFT_DEEP_LINK_SERVICE,
  MICROSOFT_GRAPH_SERVICE, MICROSOFT_LOGIN_SERVICE, MICROSOFT_OAUTH_LOGIN_SERVICE,
  MICROSOFT_SERVICE,
  MICROSOFT_STATIC_SERVICE,
  MICROSOFT_TEAMS_LOGIN_SERVICE, MICROSOFT_URL_SERVICE,
} from "@root/lib/Identifier";
import {TeamsLoginService} from "@root/lib/microsoft/service/TeamsLoginService";
import {MicrosoftGraphService} from "@root/lib/microsoft/service/MicrosoftGraphService";
import {MicrosoftLoginService} from "@root/lib/microsoft/service/MicrosoftLoginService";
import {MicrosoftUrlService} from "@root/lib/microsoft/service/MicrosoftUrlService";
import {DeepLinkService} from "@root/lib/microsoft/service/DeepLinkService";
import {MicrosoftOauthLoginService} from "@root/lib/microsoft/service/MicrosoftOauthLoginService";

export * from "./BasicExport";

export const TeamsModule = () => {
  return new ContainerModule((bind: interfaces.Bind) => {
    bind(MICROSOFT_STATIC_SERVICE).toDynamicValue((context) => {
      return new MsTeamsAPILight(
          async ()=> { return await context.container.getAsync(MICROSOFT_SERVICE)}
      );
    }).inSingletonScope();

    bind(MICROSOFT_SERVICE).toDynamicValue((context) => {
      return new MsTeamsAPI(
          context.container.get<Properties>(PROPERTIES_SERVICE),
          context.container.get<CookieStore>(COOKIE_STORE_SERVICE),
          context.container.get<PhoenixAuthService>(PHX_AUTH_SERVICE),
          context.container.get<MicrosoftLoginService>(MICROSOFT_LOGIN_SERVICE),
          context.container.get<MicrosoftUrlService>(MICROSOFT_URL_SERVICE),
          context.container.get<MicrosoftGraphService>(MICROSOFT_GRAPH_SERVICE),
      );
    }).inSingletonScope();

    bind(MICROSOFT_DEEP_LINK_SERVICE).toDynamicValue((context) => {
      return new DeepLinkService();
    }).inSingletonScope();

    bind(MICROSOFT_GRAPH_SERVICE).toDynamicValue((context) => {
      return new MicrosoftGraphService(context.container.get<MicrosoftLoginService>(MICROSOFT_LOGIN_SERVICE));
    }).inSingletonScope();

    bind(MICROSOFT_LOGIN_SERVICE).toDynamicValue((context) => {
      return new MicrosoftLoginService(
            context.container.get<NativeLoginBridge>(NATIVE_LOGIN_BRIDGE_SERVICE),
            context.container.get<MicrosoftOauthLoginService>(MICROSOFT_OAUTH_LOGIN_SERVICE),
            context.container.get<TeamsLoginService>(MICROSOFT_TEAMS_LOGIN_SERVICE),
      );
    }).inSingletonScope();

    bind(MICROSOFT_OAUTH_LOGIN_SERVICE).toDynamicValue((context) => {
      return new MicrosoftOauthLoginService(
            context.container.get<Properties>(PROPERTIES_SERVICE),
            context.container.get<NativeLoginBridge>(NATIVE_LOGIN_BRIDGE_SERVICE),
      );
    }).inSingletonScope();

    bind(MICROSOFT_URL_SERVICE).toDynamicValue((context) => {
      return new MicrosoftUrlService(
            context.container.get<MicrosoftLoginService>(MICROSOFT_LOGIN_SERVICE),
            context.container.get<MicrosoftGraphService>(MICROSOFT_GRAPH_SERVICE),
            context.container.get<DeepLinkService>(MICROSOFT_DEEP_LINK_SERVICE),
      );
    }).inSingletonScope();

    bind(MICROSOFT_TEAMS_LOGIN_SERVICE).toDynamicValue((context) => {
      return new TeamsLoginService(
            context.container.get<NativeLoginBridge>(NATIVE_LOGIN_BRIDGE_SERVICE),
            context.container.get<Properties>(PROPERTIES_SERVICE),
            context.container.get<CookieStore>(COOKIE_STORE_SERVICE)
      );
    }).inSingletonScope();


  });
}
