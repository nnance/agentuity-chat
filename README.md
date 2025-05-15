# Agentuity Chat

## Overview

Agentuity Chat is a web application that allows users to interact with an AI agent. The application is built using Next.js, TypeScript, and Tailwind CSS, and it provides a user-friendly interface for chatting with the AI.

It uses the Vercel AI SDK to generate responses from the AI agent, and it includes features such as:

- Message history
- Easily swap AI models and providers with a single line of code
- Lightweight and extensible UI

## Features

The project is a monorepo that includes a Next.js app that serves as the frontend for the Agentuity Chat agent.

The app is built with the following technologies:

- **Next.js**: A React framework for building server-rendered applications.
- **TypeScript**: A superset of JavaScript that adds static typing to the language.
- **Tailwind CSS**: A utility-first CSS framework for building custom designs.
- **Vercel AI SDK**: A library for interacting with AI models and generating responses.
- **Agentuity**: A platform for creating and managing AI agents.

The web application was bootstrapped with `create-next-app` and includes a custom server setup for handling Chat requests. The agent project was created using the Agentuity cli `agentuity create`.

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository to your local machine.
2. Install the dependencies using your package manager of choice (npm, yarn, pnpm, or bun).

### Configuration

Each application has its own `.env` file for configuration. The `.env` file should contain the following environment variables:

#### Agentuity Chat: `apps/chat-agents`

- `AGENTUITY_API_KEY`: Your Vercel AI API key.

#### Chat Web App: `apps/chat-web`

- `AGENTUITY_URL`: The URL for the Agentuity Agent API.

### Running the Application

1. Navigate to the `apps/chat-web` directory.

```bash
# For npm
npm run dev
```

2. In a separate tab Navigate to the `apps/chat-agents` directory.

```bash
agentuity dev
```

4. Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to see the application in action.

## Contributing

If you would like to contribute to the project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with a descriptive message.

## Learn More

To learn more about Agentuity, check out the following resources:

- [Agentuity](https://agentuity.com) - the official website for Agentuity.
- [Agentuity Introduction](https://docs.agentuity.com/introduction) - learn about Agentuity and how it works.

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Agentuity

To deploy your Agentuity Chat agent, you can use the Agentuity CLI. Follow these steps:

1. Install the Agentuity CLI globally if you haven't already:

```bash
npm install -g agentuity
```

2. Navigate to the `apps/chat-agents` directory.

```bash
cd apps/chat-agents
```

3. Run the following command to deploy your agent:

```bash
agentuity deploy
```

4. Follow the prompts to configure your deployment settings.
5. Once the deployment is complete, you will receive a URL for your deployed agent.
6. You can now use this URL to access your deployed agent.
7. To update your agent, make changes to the code and run the `agentuity deploy` command again.
8. To view the logs of your deployed agent, run the following command:

```bash
agentuity logs
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
