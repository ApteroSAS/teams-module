import { IService } from "@aptero/axolotis-player";
import Cookies from "js-cookie";

export default class CookieStore implements IService {
  getType(): string {
    return CookieStore.name;
  }

  get(key) {
    return Cookies.get(key);
  }

  remove(key) {
    return Cookies.remove(key);
  }
}
