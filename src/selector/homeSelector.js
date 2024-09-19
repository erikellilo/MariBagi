import { createSelector } from "reselect";

// Input selectors
const selectBagiState = (state) => state.bagi;
const selectUserState = (state) => state.user;

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

// Combined selector
export const homeSelector = createSelector(
  [selectBagi, selectUsers],
  (bagi, users) => ({
    bagiId: bagi.bagiId,
    namaBagi: bagi.namaBagi,
    userIds: users.map((usr) => usr.userId),
    userNames: users.map((usr) => usr.userName),
  })
);

export default homeSelector;
