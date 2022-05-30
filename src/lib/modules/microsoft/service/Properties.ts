import { propertyService } from "@root/ImportHelper";
import { PropertiesFormat, PROPERTY_KEY } from "@root/modules/microsoft/PropertiesFormat";

export function getMsProperties() {
  return propertyService().get<PropertiesFormat>(PROPERTY_KEY);
}
