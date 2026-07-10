export interface Allocation {
  memberId: string;
  quantity: number;
}

export interface Bagi {
  id: string;
  name: string;
  date: number;
  createdAt: number;
}

export interface Userbagi {
  id: string;
  bagiId: string;
  name: string;
  createdAt: number;
}

export interface Item {
  id: string;
  bagiId: string;
  name: string;
  amount: number;
  quantity: number;
  paidBy: string;
  includeService: boolean;
  includeTax: boolean;
  allocation: Allocation[];
  createdAt: number;
}

export interface BagiDetail extends Bagi {
  members: Userbagi[];
  items: Item[];
}

export interface BagiListItem {
  id: string;
  name: string;
  date: number;
  memberCount: number;
  itemCount: number;
}
