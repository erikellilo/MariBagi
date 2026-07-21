export interface CreateBagiRequest {
  name: string;
}

export interface UpdateBagiRequest {
  name?: string;
}

export interface CreateUserbagiRequest {
  name: string;
}

export interface UpdateUserbagiRequest {
  name: string;
}

export interface CreateItemRequest {
  name: string;
  amount: number;
  quantity: number;
  paidBy: string;
  includeService: boolean;
  includeTax: boolean;
  allocation: { memberId: string; quantity: number }[];
}

export interface UpdateItemRequest {
  name?: string;
  amount?: number;
  quantity?: number;
  paidBy?: string;
  includeService: boolean;
  includeTax: boolean;
  allocation?: { memberId: string; quantity: number }[];
}

export interface BatchCreateItemsRequest {
  items: { name: string; amount: number; quantity: number }[];
}

export interface ScanResponse {
  bagi: {
    name: string;
    date: number;
  };
  items: { name: string; amount: number; quantity: number; includeService: boolean; includeTax: boolean }[];
}
