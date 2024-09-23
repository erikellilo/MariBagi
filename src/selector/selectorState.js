import { createSelector } from "reselect";

// Input selectors
const selectBagiState = (state) => state.bagi;
const selectUserState = (state) => state.user;
const selectItemState = (state) => state.item;

// Memoized selectors
const selectBagi = createSelector([selectBagiState], (bagi) => ({
  bagiId: bagi.bagiId,
  namaBagi: bagi.namaBagi,
}));

const selectUsers = createSelector(
  [selectUserState],
  (users) =>
    users?.map((usr) => ({
      userId: usr.userId,
      userName: usr.userName,
    })) || []
);

const selectItem = createSelector(
  [selectItemState],
  (items) => items.map((item) => ({ calculateName: item.calculateName })) || []
);

const selectItemAllObject = createSelector(
  [selectItemState],
  (items) => items.map((item) => item) || []
);

// Combined selector for Home
export const homeSelector = createSelector(
  [selectBagi, selectUsers],
  (bagi, users) => ({
    bagiId: bagi.bagiId,
    namaBagi: bagi.namaBagi,
    userIds: users.map((usr) => usr.userId),
    userNames: users.map((usr) => usr.userName),
  })
);

export const calculateSelector = createSelector(
  [selectBagi, selectUsers, selectItem],
  (bagi, users, items) => ({
    bagiId: bagi.bagiId,
    namaBagi: bagi.namaBagi,
    userObject: users,
    calculateName: items.map((item) => item.calculateName),
  })
);

export const resultSelector = createSelector(
  [selectBagi, selectUsers, selectItemAllObject],
  (bagi, users, items) => ({
    namaBagi: bagi.namaBagi,
    userObject: users,

    itemObject: items,
    itemObjectLength: users.length || 0,
  })
);
