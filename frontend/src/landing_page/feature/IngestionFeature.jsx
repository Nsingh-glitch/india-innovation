import FeatureCard from "./FeatureCard";
import { FaUpload } from "react-icons/fa";

function IngestionFeature() {
  return (
    <section className="py-5" style={{ background: "#f1f5f9" }}>
      <h2 className="text-center fw-bold mb-4">Add Issues</h2>

      <div className="container d-flex justify-content-center">
        <FeatureCard
          icon={<FaUpload />}
          title="Manual Input"
          desc="Submit complaints and simulate real-world data ingestion"
        />
      </div>
    </section>
  );
}

export default IngestionFeature;