import { createFileRoute } from "@tanstack/react-router";
import { Landing } from "@/components/landing/landing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PrepPilot AI — Practice. Improve. Get Interview Ready." },
      {
        name: "description",
        content:
          "PrepPilot AI is an AI-powered interview and communication coach for students. Practice mock interviews, improve your English, and build speaking confidence.",
      },
      { property: "og:title", content: "PrepPilot AI — Your AI Interview Coach" },
      {
        property: "og:description",
        content: "Practice mock interviews, improve communication, and ace your placements with AI feedback.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return <Landing />;
}
