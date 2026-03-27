import FeatureCard from "./FeatureCard";
import { FaUserShield } from "react-icons/fa";

function AuthFeature() {
  return (
    <section className="py-5">
      <h2 className="text-center fw-bold mb-4">Authentication</h2>
      <div className="container d-flex justify-content-center">
        <FeatureCard
          icon={<FaUserShield />}
          title="Secure Login"
          desc="Supabase powered authentication with secure sessions"
        />
      </div>
    </section>
  );
}

export default AuthFeature;