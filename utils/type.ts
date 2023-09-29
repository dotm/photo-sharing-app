import { Database } from "./database";

export type Nullable<T> = { [K in keyof T]: T[K] | null };
export function notNullOrUndefined<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}

export type stlUserDetail = Database['public']['Tables']['stlUserDetail']['Row']
