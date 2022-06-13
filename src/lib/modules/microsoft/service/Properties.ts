import { PropertiesFormat, PROPERTY_KEY } from "@root/modules/microsoft/PropertiesFormat";
import { getServiceSync } from "@aptero/axolotis-player";
import { PROPERTIES_SERVICE } from "@root/ImportHelper";
import Properties from "@root/modules/properties/Properties";

export function getMsProperties() {
  return getServiceSync<Properties>(PROPERTIES_SERVICE).get<PropertiesFormat>(PROPERTY_KEY);
}
