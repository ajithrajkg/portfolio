import { redirect } from "next/navigation";

export const metadata = {
  title: "Code Editor | Online HTML, CSS & JavaScript Editor",
  description:
    "Code Editor is a fast online HTML, CSS, and JavaScript editor with a live preview. Write code, run it instantly, and test your web ideas in the browser.",
};

export default function ProductsPage() {
  redirect("/code-editor");
}