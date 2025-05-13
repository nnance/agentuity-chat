import type { AgentRequest, AgentResponse, AgentContext } from "@agentuity/sdk";
import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

export default async function Agent(
	req: AgentRequest,
	resp: AgentResponse,
	ctx: AgentContext,
) {
	const { textStream } = streamText({
		model: anthropic("claude-3-5-sonnet-latest"),
		system: "You are a friendly assistant!",
		prompt: (await req.data.text()) ?? "Why is the sky blue?",
	});
	return resp.stream(textStream);
}
