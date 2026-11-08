import Banner from "../components/Banner";
import ProfileSummary from "../components/ProfileSummary";
import SkillsCard from "../components/SkillsCard";
import DesignSummary from "../components/DesignSummary";
import MilestoneTimeline from "../components/MilestoneTimeline";

export default function Home() {
  return (
    <div>
      <Banner
        ctaText="Explore My Work"
        ctaLink="#professional-summary"
        imageAlt="Ajith Raj, UI Engineering Lead, Frontend Developer and Creative Artist"
      />

      <ProfileSummary />
      <SkillsCard />
      <DesignSummary />
      <MilestoneTimeline />
    </div>
  );
}