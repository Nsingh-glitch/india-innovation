import FeatureCard from "./FeatureCard";
import { FaList } from "react-icons/fa";

function EventsFeature() {
  return (
    <section className="py-5" style={{ background: "#f1f5f9" }}>
      <h2 className="text-center fw-bold mb-4">Processed Events</h2>

      <div className="container d-flex justify-content-center">
        <FeatureCard
          icon={<FaList />}
          title="Events Feed"
          desc="Browse analyzed complaints with filters"
        />
      </div>
    </section>
  );
}

export default EventsFeature;