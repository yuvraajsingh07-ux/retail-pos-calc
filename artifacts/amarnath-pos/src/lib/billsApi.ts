import { supabase } from "@/lib/supabase";
import type { BillItem } from "@/pages/POSApp";

export interface SavedBill {
  id: string;
  customer_name: string;
  bill_date: string;
  items: BillItem[];
  total_amount: number;
  total_bags: number;
  cash_amount: number;
  online_amount: number;
  udhar_amount: number;
}

export interface BillPayload {
  customer_name: string;
  bill_date: string;
  items: BillItem[];
  total_amount: number;
  total_bags: number;
  cash_amount: number;
  online_amount: number;
  udhar_amount: number;
}

/** Insert a new bill row. Returns the new row's id. */
export async function saveBill(payload: BillPayload): Promise<string> {
  const { data, error } = await supabase
    .from("saved_bills")
    .insert([payload])
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  return data.id as string;
}

/** Update an existing bill row by id. */
export async function updateBill(
  id: string,
  payload: BillPayload
): Promise<void> {
  const { error } = await supabase
    .from("saved_bills")
    .update(payload)
    .eq("id", id);

  if (error) throw new Error(error.message);
}

/** Fetch all bills ordered by most recent first. */
export async function fetchBills(): Promise<SavedBill[]> {
  const { data, error } = await supabase
    .from("saved_bills")
    .select("id, customer_name, bill_date, items, total_amount, total_bags, cash_amount, online_amount, udhar_amount")
    .order("bill_date", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as SavedBill[];
}
