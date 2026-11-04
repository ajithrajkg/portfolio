import LearnSpellingApp from "../../components/LearnSpellingApp";
import "./learn-spelling.css";

export const metadata = {
  title: "Learn Spelling | English to Malayalam Transliteration",
  description:
    "Convert English words and sentences to Malayalam script, then save your work with Netlify Blobs.",
  applicationName: "Learn Spelling",
};

export default function LearnSpellingPage() {
  return <LearnSpellingApp />;
}
