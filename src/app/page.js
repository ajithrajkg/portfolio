import Banner from "../components/Banner";
import ProfileSummary from "../components/ProfileSummary";
import SkillsCard from "../components/SkillsCard";
import DesignSummary from "../components/DesignSummary";
import MilestoneTimeline from "../components/MilestoneTimeline";

export default function Home() {
  return (
    <div>
      <Banner
        title="Welcome to My Portfolio"
        subtitle="Explore my projects and skills"
        ctaText="Get Started"
        ctaLink="#professional-summary"
        imageSrc="/ajithraj.jpg"
        imageAlt="Ajith Raj profile photo"
      />

      <ProfileSummary />
      <SkillsCard />
      <DesignSummary />
      <MilestoneTimeline />
    </div>
  );
}