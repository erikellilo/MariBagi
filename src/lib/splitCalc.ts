import type { Item, Userbagi } from "@/types/entities";

export interface MemberShare {
  memberId: string;
  share: number;
}

export interface ItemShareBreakdown {
  itemId: string;
  amount: number;
  shares: { memberId: string; amount: number }[];
}

export interface SplitResult {
  grandTotal: number;
  members: MemberShare[];
  itemBreakdown: ItemShareBreakdown[];
}

interface Rounded {
  memberId: string;
  amount: number;
  error: number;
}

const splitItem = (item: Item): { memberId: string; amount: number }[] => {
  const allocation = item.allocation;
  if (allocation.length === 0) return [];

  const totalQty = allocation.reduce((sum, a) => sum + a.quantity, 0);
  const effective = totalQty === 0 ? allocation.map((a) => ({ memberId: a.memberId, qty: 1 })) : allocation.map((a) => ({ memberId: a.memberId, qty: a.quantity }));

  if (effective.length === 1) {
    return [{ memberId: effective[0].memberId, amount: item.amount }];
  }

  const total = effective.reduce((sum, e) => sum + e.qty, 0);
  const rounded: Rounded[] = effective.map((e) => {
    const exact = (e.qty / total) * item.amount;
    return { memberId: e.memberId, amount: Math.round(exact), error: exact - Math.round(exact) };
  });

  const diff = item.amount - rounded.reduce((sum, r) => sum + r.amount, 0);
  if (diff !== 0) {
    const order = [...rounded.keys()].sort((a, b) => (diff > 0 ? rounded[b].error - rounded[a].error : rounded[a].error - rounded[b].error));
    const delta = diff > 0 ? 1 : -1;
    const count = Math.abs(diff);
    for (let i = 0; i < count; i++) {
      rounded[order[i]].amount += delta;
    }
  }

  return rounded.map(({ memberId, amount }) => ({ memberId, amount }));
};

export const computeSplit = (members: Userbagi[], items: Item[]): SplitResult => {
  const itemBreakdown: ItemShareBreakdown[] = items.map((item) => ({
    itemId: item.id,
    amount: item.amount,
    shares: splitItem(item),
  }));

  const totals = new Map<string, number>();
  for (const m of members) totals.set(m.id, 0);
  for (const item of itemBreakdown) {
    for (const share of item.shares) {
      totals.set(share.memberId, (totals.get(share.memberId) ?? 0) + share.amount);
    }
  }

  const memberShares: MemberShare[] = members.map((m) => ({
    memberId: m.id,
    share: totals.get(m.id) ?? 0,
  }));

  const grandTotal = items.reduce((sum, item) => sum + item.amount, 0);

  return { grandTotal, members: memberShares, itemBreakdown };
};
