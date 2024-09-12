import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { clearError } from "./usersSlicer";
import getLocalStorage from "../assets/getLocalStorage";

import {
  insertName,
  deleteUser,
  inserNewItem,
  deleteItem,
} from "./usersSlicer";

const localStorageMiddleware = createListenerMiddleware();

localStorageMiddleware.startListening({
  matcher: isAnyOf(insertName, deleteUser, inserNewItem, deleteItem),
  effect: (action, listenerApi) => {
    const { users: userState } = listenerApi.getState();
    const existingLocal = getLocalStorage();

    if (Object.keys(userState.isError).length === 0) {
      const isExistinLocal = existingLocal.findIndex(
        (data) => data.bagiId === userState.bagiId
      );
      if (isExistinLocal === -1) {
        existingLocal.push(userState);
      } else {
        existingLocal[isExistinLocal] = userState;
      }

      localStorage.setItem("users", JSON.stringify(existingLocal));
      listenerApi.dispatch(clearError());
    }
  },
});

export default localStorageMiddleware;
