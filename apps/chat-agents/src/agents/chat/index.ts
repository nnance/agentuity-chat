import type { AgentRequest } from "@agentuity/sdk";
import { streamText, type UIMessage } from "ai";
import { anthropic } from "@ai-sdk/anthropic";

export default async function Agent(req: AgentRequest) {
	const {
		messages,
	}: {
		id: string;
		messages: Array<UIMessage>;
	} = await req.data.object();

	const result = streamText({
		model: anthropic("claude-3-5-sonnet-latest"),
		system: "you are a helpful assistant",
		messages,
	});

	return result.toDataStreamResponse();
}
