import {
  createDataStreamResponse,
  formatDataStreamPart,
  type UIMessage,
} from "ai";

interface ChatAgentParameters {
  url: string;
  data: {
    id: string;
    messages: Array<UIMessage>;
  };
}

function dataStreamPassthrough(dataStream: ReadableStream<Uint8Array>) {
  return new ReadableStream({
    start(controller) {
      const reader = dataStream.getReader();
      const decoder = new TextDecoder("utf-8");
      async function read() {
        if (reader) {
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
            return { done };
          }
          const decodedValue = decoder.decode(value, { stream: true });
          // const dataStreamPart = formatDataStreamPart(
          //   "text",
          //   decodedValue
          // );
          controller.enqueue(decodedValue);
          return read();
        }
      }
      return read();
    },
  });
}

function testStreamToDataStream(dataStream: ReadableStream<Uint8Array>) {
  return new ReadableStream({
    start(controller) {
      const reader = dataStream.getReader();
      const decoder = new TextDecoder("utf-8");
      async function read() {
        if (reader) {
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
            return { done };
          }
          const decodedValue = decoder.decode(value, { stream: true });
          const dataStreamPart = formatDataStreamPart("text", decodedValue);
          controller.enqueue(dataStreamPart);
          return read();
        }
      }
      return read();
    },
  });
}

async function streamChatAgent({ url, data }: ChatAgentParameters) {
  // Make a POST request to the external API
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.body) {
    return dataStreamPassthrough(response.body);
  }

  // Create a new ReadableStream to handle the response body
  return new ReadableStream({
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
          const decodedValue = decoder.decode(value, { stream: true });
          // const dataStreamPart = formatDataStreamPart(
          //   "text",
          //   decodedValue
          // );
          controller.enqueue(decodedValue);
          return read();
        }
      }
      return read();
    },
  });
}

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages, id } = await req.json();

  console.log("chat id", id); // can be used for persisting the chat

  try {
    return createDataStreamResponse({
      status: 200,
      statusText: "OK",
      async execute(dataStream) {
        const url =
          "http://127.0.0.1:3500/agent_f1fe183d28ced8903776011734f76c12";
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messages, id }),
        });

        if (response.body) {
          const stream = dataStreamPassthrough(response.body);
          dataStream.merge(stream);
        }
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
