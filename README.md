# ESP32 MCP Frontend

A modern React-based web interface for connecting to an ESP32 microcontroller running a [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server. This frontend enables you to interact with your ESP32 through an AI-powered chat interface using Anthropic's Claude LLM.

## ✨ Features

- **Real-time Chat Interface**: Communicate with Claude LLM while controlling your ESP32
- **MCP Tool Integration**: Automatically discover and execute tools available on your MCP server
- **Resource Access**: Read resources exposed by your MCP server directly through the chat
- **Live Connection Status**: Monitor both LLM and MCP server connection states
- **Connection Management**: Easy setup and management of both Anthropic API key and ESP32 device
- **Responsive Design**: Beautiful, modern UI built with React and Tailwind CSS
- **Type-Safe**: Full TypeScript support throughout the codebase

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- An Anthropic API key
- An ESP32 device running an MCP server (see [ESP32 MCP Server](https://github.com/dylan-mccormick/esp-mcp-server))

### Installation

1. Clone the repository:

```bash
git clone https://github.com/dylan-mccormick/esp-mcp-frontend.git
cd esp-mcp-frontend
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
pnpm run build
```

Preview the production build:

```bash
pnpm run preview
```

## 📋 Project Structure

```
esp-mcp-frontend/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── AIConnectivityCard.tsx    # LLM connection settings
│   │   ├── MicrocontrollerCard.tsx   # ESP32 connection settings
│   │   ├── ChatComposer.tsx          # Message input component
│   │   ├── UserMessage.tsx           # User message display
│   │   ├── AssistantMessage.tsx      # AI response display
│   │   └── ...other UI components
│   ├── pages/               # Page-level components
│   │   ├── Chat.tsx         # Main chat page
│   │   └── ConnectionManager.tsx     # Device/LLM setup page
│   ├── context/             # React Context providers
│   │   ├── ChatContext.tsx
│   │   ├── LLMContext.tsx
│   │   ├── MCPServerContext.tsx
│   │   └── NotificationContext.tsx
│   ├── providers/           # Context provider implementations
│   ├── hooks/               # Custom React hooks
│   │   ├── useSendMessage.tsx        # LLM message handling
│   │   └── useMCPFetch.tsx           # MCP server HTTP client
│   ├── tools/               # Tool definitions
│   │   └── FrontendTools.ts          # Frontend-specific MCP tools
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── package.json             # Dependencies and scripts
```

## 🔧 Configuration

### Environment Variables

Create a `.env.example` for reference. Key variables:

- `BASE_URL`: Optional base URL for production builds (used with Vite)

**Note**: API keys are NOT stored in environment files. The Anthropic API key is provided at runtime through the UI.

### Connection Settings

**LLM (Anthropic) Connection**:

- Navigate to the Connection Manager page
- Enter your Anthropic API key
- Select the model (default: `claude-haiku-4-5`)
- Set max tokens (default: 1024, max: 64000)

**MCP Server (ESP32) Connection**:

- Enter the ESP32's IP address or hostname
- The system will automatically discover available tools and resources

## 🔐 Security Considerations

### ⚠️ Important Security Notes

This is a browser-based application that runs entirely on the client side. **Your API key is exposed in the browser memory** and is **NOT sent through a backend**.

**For production or sensitive use cases:**

1. **Use a backend proxy** to handle API authentication instead of exposing keys in the browser
2. **Implement CORS policies** to restrict which domains can access your MCP server
3. **Use temporary credentials** (e.g., short-lived tokens from your backend)
4. **Enable HTTPS** for all connections to your MCP server
5. **Never commit API keys** to version control

### Network Security

- **Current Implementation**: Connections to the MCP server use HTTP
- **Recommendation**: Use HTTPS in production environments for encrypted communication
- **ESP32 Considerations**: If running on a local network, ensure proper firewall rules

### Data Privacy

- Chat messages and MCP tool outputs are processed by Anthropic's API
- Review [Anthropic's Privacy Policy](https://www.anthropic.com/privacy) for details
- Local chat history is stored in the browser (not persisted across sessions)

## 🛠️ Development

### Available Scripts

- `pnpm run dev` - Start development server with HMR
- `pnpm run build` - Build for production (includes linting)
- `pnpm run lint` - Run oxlint code analysis
- `pnpm run format` - Auto-format code with oxfmt
- `pnpm run preview` - Preview production build locally

### Code Quality

This project uses:

- **oxlint**: Fast JavaScript/TypeScript linter
- **oxfmt**: Code formatter
- **TypeScript**: Full type safety
- **ESLint React Plugin**: Best practices enforcement

### Adding Custom Tools

To add frontend-only tools that don't require the MCP server:

1. Edit `src/tools/FrontendTools.ts`
2. Add your tool to the `createFrontendTools()` function
3. Implement the `execute()` method
4. Export as a `FrontendTool`

## 📝 ESP32 MCP Server

This frontend connects to an ESP32 running an MCP server. For the MCP server implementation, see:

**[ESP32 MCP Server Repository](https://github.com/yourusername/esp-mcp-server)**

The MCP server handles:

- Exposing tools for the LLM to control the ESP32
- Providing resources (files, data) accessible through the frontend
- Managing device communication and state

## 📄 License

This project is licensed under the MIT License. See [LICENSE.md](LICENSE.md) for details.

## 🎓 Learn More

- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [Anthropic API Documentation](https://docs.anthropic.com/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

**Note**: This is an open-source project. Use at your own risk, especially in production environments. Always follow security best practices when handling API keys and sensitive data.
