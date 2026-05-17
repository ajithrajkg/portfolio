import Banner from "../components/Banner";
import ProfileSummary from "../components/ProfileSummary";
import SkillsCard from "../components/SkillsCard";
import DesignSummary from "../components/DesignSummary";
import MilestoneTimeline from "../components/MilestoneTimeline";

export default async function Home() {
  try {
    // const res = await fetch(
    //   `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/home-page`,
    //   { cache: 'no-store' }
    // );

    // if (!res.ok) {
    //   throw new Error(`Failed: ${res.status}`);
    // }

    // const json = await res.json();
    // const page = json.data;

    return (
      <div className="">
        <Banner
          title="Welcome to My Portfolio"
          subtitle="Explore my projects and skills"
          ctaText="Get Started"
          ctaLink="#projects"
        />

        <ProfileSummary />

        <SkillsCard />

        <DesignSummary />

        <MilestoneTimeline />

        {/* {!page ? (
          <p>No data found</p>
        ) : (
          <div>
            <p>ID: {page.id}</p>
            <p>Title: {page.title}</p>
          </div>
        )} */}
      </div>
    );
  } catch (error) {
    return <p>Error: {error.message}</p>;
  }
}