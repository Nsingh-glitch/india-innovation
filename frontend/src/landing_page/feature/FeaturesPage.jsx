import FeatureCard from "./FeatureCard";
import {
  FaUserShield,
  FaUpload,
  FaChartBar,
  FaExclamationTriangle,
  FaProjectDiagram,
  FaList,
  FaCogs,
} from "react-icons/fa";

function FeaturesPage() {
  return (
    <div style={{ minHeight: "100vh" }}>
      
      {/* 🔹 ROW 1 (LIGHT) */}
      <section style={{ background: "#f8fafc", padding: "40px 0" }}>
        <div className="container">
          <div className="row g-4">
            <div className="col-md-6">
              <FeatureCard
                icon={<FaUserShield />}
                title="Secure Authentication"
                desc="Supabase-powered login system for secure and scalable access control."
              />
            </div>

            <div className="col-md-6">
              <FeatureCard
                icon={<FaUpload />}
                title="Issue Ingestion"
                desc="Users can submit complaints and simulate real-world civic issue reporting."
              />
            </div>
          </div>
        </div>
      </section>

      {/* 🔹 ROW 2 (LIGHT BLUE) */}
      <section
        style={{
          background: "linear-gradient(to right, #e0f2fe, #dbeafe)",
          padding: "40px 0",
        }}
      >
        <div className="container">
          <div className="row g-4">
            <div className="col-md-6">
              <FeatureCard
                icon={<FaChartBar />}
                title="Analytics Dashboard"
                desc="Visualize data using charts, sentiment distribution, and location insights."
              />
            </div>

            <div className="col-md-6">
              <FeatureCard
                icon={<FaExclamationTriangle />}
                title="High Urgency Alerts"
                desc="Detect and highlight critical issues that need immediate attention."
              />
            </div>
          </div>
        </div>
      </section>

      {/* 🔹 ROW 3 (LIGHT) */}
      <section style={{ background: "#f8fafc", padding: "40px 0" }}>
        <div className="container">
          <div className="row g-4">
            <div className="col-md-6">
              <FeatureCard
                icon={<FaProjectDiagram />}
                title="Issue Clustering"
                desc="Group similar complaints together to identify trends and patterns."
              />
            </div>

            <div className="col-md-6">
              <FeatureCard
                icon={<FaList />}
                title="Processed Events Feed"
                desc="View all processed complaints with filters like category, urgency, and location."
              />
            </div>
          </div>
        </div>
      </section>

      {/* 🔹 ROW 4 (LIGHT BLUE) */}
      <section
        style={{
          background: "linear-gradient(to right, #e0f2fe, #dbeafe)",
          padding: "40px 0",
        }}
      >
        <div className="container">
          <div className="row g-4 justify-content-center">
            <div className="col-md-6">
              <FeatureCard
                icon={<FaCogs />}
                title="AI Processing Engine"
                desc="Trigger AI pipelines to process raw data into structured insights."
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default FeaturesPage;