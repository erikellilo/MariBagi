export interface CreateBagiRequest {
  name: string;
  includeService: boolean;
  includeTax: boolean;
}

export interface UpdateBagiRequest {
  name?: string;
  includeService?: boolean;
  includeTax?: boolean;
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
  allocation: { memberId: string; quantity: number }[];
}

export interface UpdateItemRequest {
  name?: string;
  amount?: number;
  quantity?: number;
  paidBy?: string;
  allocation?: { memberId: string; quantity: number }[];
}

export interface BatchCreateItemsRequest {
  items: { name: string; amount: number; quantity: number }[];
}

export interface ScanResponse {
  bagi: {
    name: string;
    date: number;
    includeTax: boolean;
    includeService: boolean;
  };
  items: { name: string; amount: number; quantity: number }[];
}
