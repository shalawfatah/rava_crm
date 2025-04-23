"use client";
import React, { useEffect, useState } from "react";
import GeneralCard from "./GeneralCard";
import { supabase } from "@/app/utils/supabase/client";

const ProfitCard = () => {
  const [profit, setProfit] = useState(0);

  const profit_calculator = async () => {
    const { data, error } = await supabase.rpc("get_income_minus_expense");

    if (error) {
      console.error("Error getting total income:", error.message);
    }
    setProfit(data);
  };

  useEffect(() => {
    profit_calculator();
  }, []);

  const formatted_profit = new Intl.NumberFormat("en-US").format(profit);

  return (
    <GeneralCard
      title="سندوق"
      amount={formatted_profit}
      progress="w-[49%]"
      color="bg-emerald-500"
    />
  );
};

export default ProfitCard;
