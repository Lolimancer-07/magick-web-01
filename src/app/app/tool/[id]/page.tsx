import { TOOLS } from "@/tools/toolRegistry";
import ToolScreenDispatcher from "@/components/mobile/ToolScreenDispatcher";

export function generateStaticParams() {
  return TOOLS.map((tool) => ({
    id: tool.id,
  }));
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolved = await params;
  return <ToolScreenDispatcher toolId={resolved.id} />;
}
