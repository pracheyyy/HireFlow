import { Code2 } from "lucide-react";
import FeaturePlaceholder from "../../components/FeaturePlaceholder";

export default function CodingTracker() {
  return (
    <FeaturePlaceholder
      icon={Code2}
      title="Coding progress tracker"
      description="Set daily coding goals, keep your streak alive, and see topic-wise progress across data structures and algorithms."
      previewLabel="Your coding streak and topic breakdown will appear here."
    />
  );
}
