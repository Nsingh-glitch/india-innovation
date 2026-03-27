import Hero from "./Hero";
import AIWorkflowSection from "./AIWorkflowSection";
import LeadershipStory from "./LeadershipStory";
import Roles from "./Roles";
import Testimonials from "./Testimonials";

function Home() {
  return (
    <>
      <Hero/>
      <LeadershipStory/>
      <Testimonials/>
      <Roles/>
      <AIWorkflowSection />
    </>
  );
}

export default Home;