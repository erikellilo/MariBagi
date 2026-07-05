import { createListenerMiddleware } from "@reduxjs/toolkit";
import getLocalStorage from "../assets/getLocalStorage";

import { insertBagi } from "./bagiSlice";
import { deleteUser } from "./usersSlice";
import { inserNewItem, deleteItem } from "./itemsSlice";

const localStorageMiddleware = createListenerMiddleware();

const actionDelete = (listArray, uniqId, localStorageName, uniqueKey) => {
  const filterData = listArray.filter((data) => data[uniqueKey] !== uniqId);
  localStorage.setItem(localStorageName, JSON.stringify(filterData));
};

localStorageMiddleware.startListening({
  actionCreator: insertBagi,
  effect: (action, listenerApi) => {
    const { bagi, user } = listenerApi.getState();

    const existingLocalBagi = getLocalStorage("bagi");
    const existingLocalUser = getLocalStorage("user").filter(
      (user) => user.bagiId !== bagi.bagiId
    );
    const newUsersList = existingLocalUser.concat(user);

    const isExistinLocal = existingLocalBagi.findIndex(
      (data) => data.bagiId === bagi.bagiId
    );

    isExistinLocal === -1
      ? existingLocalBagi.push(bagi)
      : (existingLocalBagi[isExistinLocal] = bagi);

    localStorage.setItem("bagi", JSON.stringify(existingLocalBagi));
    localStorage.setItem("user", JSON.stringify(newUsersList));
  },
});

localStorageMiddleware.startListening({
  actionCreator: deleteUser,
  effect: (action) => {
    const existingLocalUser = getLocalStorage("user");
    actionDelete(existingLocalUser, action.payload, "user", "userId");
  },
});

localStorageMiddleware.startListening({
  actionCreator: inserNewItem,
  effect: (action, listenerApi) => {
    const { bagi, item } = listenerApi.getState();

    const existingLocalitem = getLocalStorage("item").filter(
      (item) => item.bagiId !== bagi.bagiId
    );
    const combineList = existingLocalitem.concat(item);
    localStorage.setItem("item", JSON.stringify(combineList));
  },
});

localStorageMiddleware.startListening({
  actionCreator: deleteItem,
  effect: (action) => {
    const existingLocalitem = getLocalStorage("item");
    actionDelete(existingLocalitem, action.payload, "item", "itemId");
  },
});

export default localStorageMiddleware;
