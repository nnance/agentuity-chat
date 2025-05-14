import type { AgentRequest } from "@agentuity/sdk";
import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

export default async function Agent(req: AgentRequest) {
	const result = streamText({
		model: anthropic("claude-3-5-sonnet-latest"),
		prompt: "Why is the sky blue?",
	});

	return result.toDataStreamResponse();
}
