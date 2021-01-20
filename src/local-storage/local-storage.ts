/* Local Storage Keys */
export enum LocalStorageKey {
  USERNAME = "username",
  TOKEN = "token",
}

export class LocalStorage {
  public static get(key: LocalStorageKey, defaultValue?: any) {
    const value = localStorage.getItem(key);

    if (value) {
      return JSON.parse(value);
    }

    return defaultValue;
  }
}
