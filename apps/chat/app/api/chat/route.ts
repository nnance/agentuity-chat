// import { openai } from '@ai-sdk/openai';

import { createDataStreamResponse } from "ai";

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages, id } = await req.json();

  console.log("chat id", id); // can be used for persisting the chat

  try {
    return createDataStreamResponse({
      status: 200,
      statusText: "OK",
      async execute(dataStream) {
        // Make a POST request to the external API
        const response = await fetch(
          "http://127.0.0.1:3500/agent_f1fe183d28ced8903776011734f76c12",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // Add any other required headers here
            },
            body: JSON.stringify({ messages, id }),
          }
        );

        // Create a new ReadableStream to handle the response body
        const stream = new ReadableStream({
          start(controller) {
            const reader = response.body?.getReader();
            const decoder = new TextDecoder("utf-8");
            async function read() {
              if (reader) {
                const { done, value } = await reader.read();
                if (done) {
                  controller.close();
                  return { done };
                }
                // Decode the chunk and enqueue it to the stream
                const decodedValue = decoder.decode(value, { stream: true });
                controller.enqueue(decodedValue);
                return read();
              }
            }
            return read();
          },
        });
        // Read the stream and process the data
        dataStream.merge(stream);
      },
    });
  } catch (error) {
    console.error("Error forwarding stream:", error);
    return new Response(JSON.stringify({ error: "Failed to process stream" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
