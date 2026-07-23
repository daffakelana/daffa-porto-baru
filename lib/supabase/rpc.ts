import { createClient } from "./server";
import type { Database } from "./database.types";

type RpcFunctions = Database["public"]["Functions"];

export async function rpc<
  TFunction extends keyof RpcFunctions,
  TResult
>(
  fn: TFunction,
  args: RpcFunctions[TFunction]["Args"]
): Promise<TResult> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(fn, args);

  if (error) {
    throw new Error(error.message);
  }

  return data as TResult;
}