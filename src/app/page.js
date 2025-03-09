import Boxes from "./components/dashboard/Boxes";
import RecentStudents from "./components/dashboard/RecentStudents";
import Sidebar from "./components/dashboard/Sidebar";

export default function Home() {
  return (
    <div dir="rtl" className="bg-white p-10">
      <div className="bg-[#DFECF1] rounded-3xl flex flex-row flex-wrap p-12 gap-12">
        <Sidebar />

        <div className="flex flex-col flex-wrap">
          <Boxes />
          <RecentStudents />
        </div>
      </div>
      <div></div>
    </div>
  );
}
