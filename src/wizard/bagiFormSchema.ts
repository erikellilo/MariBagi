import { z } from "zod";

const allocationSchema = z.object({
  memberId: z.string().min(1),
  quantity: z.number().int().min(0),
});

const memberSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, "Member name cannot be empty"),
});

const itemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, "Item name cannot be empty"),
  amount: z.number().int().positive("Amount must be greater than 0"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  paidBy: z.string().min(1, "Must assign who paid"),
  allocation: z.array(allocationSchema),
});

export const bagiFormSchema = z
  .object({
    name: z.string().min(1, "Bagi name cannot be empty"),
    inputMode: z.enum(["form", "scan"]),
    members: z.array(memberSchema).min(2, "Need at least 2 members"),
    items: z.array(itemSchema),
  })
  .superRefine((data, ctx) => {
    const names = data.members.map((m) => m.name.toLowerCase());
    const seen = new Set<string>();
    names.forEach((name, index) => {
      if (seen.has(name)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Duplicate member name",
          path: ["members", index, "name"],
        });
      }
      seen.add(name);
    });

    const memberIds = new Set(data.members.map((m) => m.id));

    data.items.forEach((item, itemIndex) => {
      if (item.allocation.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Must assign who shares this item",
          path: ["items", itemIndex, "allocation"],
        });
        return;
      }

      item.allocation.forEach((alloc, allocIndex) => {
        if (!memberIds.has(alloc.memberId)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Allocation references an unknown member",
            path: ["items", itemIndex, "allocation", allocIndex, "memberId"],
          });
        }
      });

      if (!memberIds.has(item.paidBy)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "paidBy references an unknown member",
          path: ["items", itemIndex, "paidBy"],
        });
      }
    });
  });

export type BagiFormData = z.infer<typeof bagiFormSchema>;
