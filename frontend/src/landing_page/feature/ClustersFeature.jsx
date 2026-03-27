import FeatureCard from "./FeatureCard";
import { FaProjectDiagram } from "react-icons/fa";

function ClustersFeature() {
  return (
    <section className="py-5">
      <h2 className="text-center fw-bold mb-4">Issue Clusters</h2>

      <div className="container d-flex gap-4 justify-content-center flex-wrap">
        <FeatureCard
          icon={<FaProjectDiagram />}
          title="Water Cluster"
          desc="Ward 12 - 15 reports grouped"
        />
        <FeatureCard
          icon={<FaProjectDiagram />}
          title="Electricity Cluster"
          desc="Booth 4 - 10 reports grouped"
        />
      </div>
    </section>
  );
}

export default ClustersFeature;