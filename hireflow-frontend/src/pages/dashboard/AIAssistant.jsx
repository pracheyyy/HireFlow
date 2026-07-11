import { Bot } from "lucide-react";
import FeaturePlaceholder from "../../components/FeaturePlaceholder";

export default function AIAssistant() {
  return (
    <FeaturePlaceholder
      icon={Bot}
      title="AI career assistant"
      description="Ask for resume writing guidance, interview tips, or a company-specific prep plan — answered instantly by your AI assistant."
      previewLabel="A chat interface for career guidance will appear here."
    />
  );
}
