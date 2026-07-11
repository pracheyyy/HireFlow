import { FileText } from "lucide-react";
import FeaturePlaceholder from "../../components/FeaturePlaceholder";

export default function ResumeAnalyzer() {
  return (
    <FeaturePlaceholder
      icon={FileText}
      title="AI resume analyzer"
      description="Upload your resume to get an ATS compatibility score, missing keyword detection, and AI-powered suggestions to improve it."
      previewLabel="Resume upload and scoring will appear here."
    />
  );
}
