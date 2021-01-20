import { createContext, Dispatch } from "react";
import { LocalStorage, LocalStorageKey } from "../local-storage/local-storage";

/* User Interface */
interface IUser {
  username?: string;
  token?: string;
}

/* Reducer Actions */
export enum UserActionType {
  LOGIN,
  SIGNUP,
  LOGOUT,
}

interface LoginAction {
  type: typeof UserActionType.LOGIN;
  payload: IUser;
}

interface SignUpAction {
  type: typeof UserActionType.SIGNUP;
  payload: IUser;
}

interface LogoutAction {
  type: typeof UserActionType.LOGOUT;
}

type UserActionTypes = LoginAction | SignUpAction | LogoutAction;

/* initial user state */
export const initial: IUser = {
  username: LocalStorage.get(LocalStorageKey.USERNAME),
  token: LocalStorage.get(LocalStorageKey.TOKEN),
};

/* User Context */
export const UserContext = createContext<{
  state: IUser;
  dispatch: Dispatch<UserActionTypes>;
}>({
  state: initial,
  dispatch: () => initial,
});

/* User Reducer */
export const userReducer = (state: IUser, action: UserActionTypes) => {
  switch (action.type) {
    case UserActionType.LOGIN:
    case UserActionType.SIGNUP: {
      // take values from payload
      const { username, token } = action.payload;

      // set items in local storage
      localStorage.setItem(LocalStorageKey.USERNAME, JSON.stringify(username));
      localStorage.setItem(LocalStorageKey.TOKEN, JSON.stringify(token));

      return {
        ...state,
        username,
        token,
      };
    }

    case UserActionType.LOGOUT:
      // undefine values
      const username = "";
      const token = "";

      // remove items from local storage
      localStorage.removeItem(LocalStorageKey.USERNAME);
      localStorage.removeItem(LocalStorageKey.TOKEN);

      return {
        ...state,
        username,
        token,
      };

    default:
      return state;
  }
};
