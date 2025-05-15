import { createDataStreamResponse, formatDataStreamPart } from "ai";

type dataStreamDecoder = (value: Uint8Array<ArrayBufferLike>) => string;

function dataStreamPassthrough(
  dataStream: ReadableStream<Uint8Array>,
  decoder: dataStreamDecoder
) {
  return new ReadableStream({
    start(controller) {
      const reader = dataStream.getReader();
      async function read() {
        if (reader) {
          const { done, value } = await reader.read();
          if (done) {
            controller.close();
            return { done };
          }
          const decodedValue = decoder(value);
          controller.enqueue(decodedValue);
          return read();
        }
      }
      return read();
    },
  });
}

function dataStreamDecoder() {
  const decoder = new TextDecoder("utf-8");
  return (value: Uint8Array<ArrayBufferLike>) =>
    decoder.decode(value, { stream: true });
}

function textStreamDecoder() {
  const decoder = new TextDecoder("utf-8");
  return (value: Uint8Array<ArrayBufferLike>) => {
    const decodedValue = decoder.decode(value, { stream: true });
    return formatDataStreamPart("text", decodedValue);
  };
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
        const url = process.env.AGENTUITY_URL;
        if (!url) {
          throw new Error("AGENTUITY_URL is not defined");
        }
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messages, id }),
        });

        if (response.body) {
          const stream = dataStreamPassthrough(
            response.body,
            dataStreamDecoder()
          );
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
