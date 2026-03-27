import FeatureCard from "./FeatureCard";
import { FaChartBar } from "react-icons/fa";

function DashboardFeature() {
  return (
    <section className="py-5">
      <h2 className="text-center fw-bold mb-4">Analytics Dashboard</h2>

      <div className="container d-flex gap-4 justify-content-center flex-wrap">
        <FeatureCard icon={<FaChartBar />} title="Charts" desc="Visual insights with bar & pie charts" />
        <FeatureCard icon={<FaChartBar />} title="Trends" desc="Track issue trends across locations" />
      </div>
    </section>
  );
}

export default DashboardFeature;