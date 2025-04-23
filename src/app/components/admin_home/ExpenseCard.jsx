"use client"
import React, { useEffect, useState } from "react";
import GeneralCard from "./GeneralCard";
import { supabase } from "@/app/utils/supabase/client";

const ExpenseCard = () => {
  const [expense, setExpense] = useState(0);

  const expense_calculator = async () => {
    const { data, error } = await supabase.rpc("get_total_expense");

    if (error) {
      console.error("Error getting total income:", error.message);
    }
    setExpense(data);
  };

  useEffect(() => {
    expense_calculator();
  }, []);

  const formattedExpense = new Intl.NumberFormat("en-US").format(expense);

  return (
    <GeneralCard
      title="خەرجی"
      amount={formattedExpense}
      progress="w-[32%]"
      color="bg-red-500"
      link="/expense"
    />
  );
};

export default ExpenseCard;
