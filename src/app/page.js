import ExpenseCard from "./components/admin_home/ExpenseCard";
import IncomeCard from "./components/admin_home/IncomeCard";
import IncomeFlowChart from "./components/admin_home/IncomeFlowChart";
import ProfitCard from "./components/admin_home/Profit";

export default function Home() {
  return (
    <div
      dir="rtl"
      className="p-5 min-h-screen bg-gradient-to-b from-gray-200 to-gray-400"
    >
      <div className="max-w-[1200px] m-auto">
        <div className="flex flex-row flex-wrap gap-4 justify-around my-6">
          <IncomeCard />
          <ExpenseCard />
          <ProfitCard />
        </div>
        <div className="my-8">
        <IncomeFlowChart />
        </div>
      </div>
    </div>
  );
}
