"use client";
import React, { useEffect, useState } from "react";
import GeneralCard from "./GeneralCard";
import { supabase } from "@/app/utils/supabase/client";

const IncomeCard = () => {
  const [income, setIncome] = useState(0);

  const income_calculator = async () => {
    const { data, error } = await supabase.rpc("get_total_income");

    if (error) {
      console.error("Error getting total income:", error.message);
    }
    setIncome(data);
  };

  useEffect(() => {
    income_calculator();
  }, []);

  const formattedIncome = new Intl.NumberFormat("en-US").format(income);

  return (
    <GeneralCard
      title="داهات"
      amount={formattedIncome}
      progress="w-[75%]"
      color="bg-indigo-500"
      link="/income"
    />
  );
};

export default IncomeCard;
