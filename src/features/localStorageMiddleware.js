import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
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
  matcher: isAnyOf(insertBagi, deleteUser, inserNewItem, deleteItem),
  effect: (action, listenerApi) => {
    const { bagi, user, item } = listenerApi.getState();

    if (action.type === "bagi/insertBagi") {
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
    }

    if (action.type === "users/deleteUser") {
      const existingLocalUser = getLocalStorage("user");
      actionDelete(existingLocalUser, action.payload, "user", "userId");
    }

    if (action.type === "items/inserNewItem") {
      const existingLocalitem = getLocalStorage("item").filter(
        (item) => item.bagiId !== bagi.bagiId
      );
      const combineList = existingLocalitem.concat(item);
      localStorage.setItem("item", JSON.stringify(combineList));
    }

    if (action.type === "items/deleteItem") {
      const existingLocalitem = getLocalStorage("item");
      actionDelete(existingLocalitem, action.payload, "item", "itemId");
    }
  },
});

export default localStorageMiddleware;
