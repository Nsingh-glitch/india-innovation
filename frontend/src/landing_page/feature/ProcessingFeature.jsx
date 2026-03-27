import FeatureCard from "./FeatureCard";
import { FaCogs } from "react-icons/fa";

function ProcessingFeature() {
  return (
    <section className="py-5">
      <h2 className="text-center fw-bold mb-4">Processing Engine</h2>

      <div className="container d-flex justify-content-center">
        <FeatureCard
          icon={<FaCogs />}
          title="Run Pipeline"
          desc="Trigger AI processing manually"
        />
      </div>
    </section>
  );
}

export default ProcessingFeature;