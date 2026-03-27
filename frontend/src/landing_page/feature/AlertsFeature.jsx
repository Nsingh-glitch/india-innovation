import FeatureCard from "./FeatureCard";
import { FaExclamationTriangle } from "react-icons/fa";

function AlertsFeature() {
  return (
    <section className="py-5" style={{ background: "#fef2f2" }}>
      <h2 className="text-center fw-bold mb-4 text-danger">
        High Urgency Alerts
      </h2>

      <div className="container d-flex justify-content-center">
        <FeatureCard
          icon={<FaExclamationTriangle />}
          title="Critical Issues"
          desc="Detect and highlight urgent public problems instantly"
        />
      </div>
    </section>
  );
}

export default AlertsFeature;