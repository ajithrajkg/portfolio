import PanchangamClient from "@/components/panchangam/PanchangamClient";
import "@/components/panchangam/panchangam.css";

export const metadata = {
  title: "Personal Panchangam | Malayalam Daily Panchangam",
  description: "A private, installable Malayalam Panchangam with locally calculated daily timings.",
  applicationName: "Personal Panchangam",
  alternates: {
    canonical: "/panchangam/",
  },
};

export default function PanchangamPage() {
  return <PanchangamClient />;
}
