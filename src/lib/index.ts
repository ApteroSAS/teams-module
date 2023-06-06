/**
 * Should only import type to stay lightweight
 */
import "reflect-metadata";
import {MsTeamsAPILight} from "@root/lib/microsoft/MsTeamsAPILight";
import {MsTeamsAPI} from "@root/lib/microsoft/MsTeamsAPI";
import {ContainerModule, interfaces} from "inversify";
import {COOKIE_STORE_SERVICE, PHX_AUTH_SERVICE} from "@aptero/axolotis-module-basic";
import {MICROSOFT_SERVICE, MICROSOFT_STATIC_SERVICE, PROPERTIES_SERVICE} from "@root/lib/Identifier";

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
          context.container.get(PROPERTIES_SERVICE),
          context.container.get(COOKIE_STORE_SERVICE),
          context.container.get(PHX_AUTH_SERVICE)
      );
    }).inSingletonScope();
  });
}
