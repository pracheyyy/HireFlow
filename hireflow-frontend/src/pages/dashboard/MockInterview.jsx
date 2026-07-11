import { Mic } from "lucide-react";
import FeaturePlaceholder from "../../components/FeaturePlaceholder";

export default function MockInterview() {
  return (
    <FeaturePlaceholder
      icon={Mic}
      title="AI mock interviews"
      description="Practice HR and technical interview rounds with an AI interviewer, then get a detailed score and feedback breakdown."
      previewLabel="Interview simulation and feedback will appear here."
    />
  );
}
