import { redirect } from "next/navigation";

export const metadata = {
  title: "SVG Color Studio",
  description: "Create reusable CSS color treatments for source artwork.",
};

export default function AssetTintPage() {
  redirect("/svg-color");
}