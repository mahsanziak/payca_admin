// utils/menuHelpers.ts

import { supabase } from "../utils/supabaseClient";

export const fetchData = async (table: string, filters: any) => {
  const { data, error } = await supabase.from(table).select("*").match(filters);
  if (error) throw new Error(`Error fetching ${table}: ${error.message}`);
  return data || [];
};

export const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, setter: any) => {
  const { name, value } = e.target;
  setter((prev: any) => ({ ...prev, [name]: value }));
};
