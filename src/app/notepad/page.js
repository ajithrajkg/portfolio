import NotepadPwa from "../../components/NotepadPwa";
import "./notepad.css";

export const metadata = {
  title: "Notepad | Private Notes, Available Offline",
  description:
    "Write and organize notes in a simple notepad that saves privately in your browser and can be installed as an offline app.",
  applicationName: "Notepad",
  manifest: "/notepad/manifest.webmanifest",
  alternates: {
    canonical: "/notepad/",
  },
};

export default function NotepadPage() {
  return <NotepadPwa />;
}