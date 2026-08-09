import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

import type { BaseChatMessage } from "../context/ChatContext";

export interface UserMessageProps extends BaseChatMessage {
    role: "user";
    timeRef?: Date;
}

const UserMessage = ({ content, timeRef = new Date() }: UserMessageProps) => {
    const hasVisibleContent = content.some(v => v.type == "text");
    if (!hasVisibleContent) return; // if this is a tool result

    return (
        <div className="flex justify-end py-2">
            <div className="max-w-[min(100%,42rem)] rounded-[1.75rem] border border-white/70 bg-[#241b25] px-5 py-4 text-left text-white shadow-[0_18px_50px_rgba(36,27,37,0.16)]">
                <div className="mb-2 flex items-center justify-end gap-2 text-[0.68rem] font-medium uppercase tracking-[0.28em] text-white/48">
                    <span>{timeRef.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    <span className="h-1 w-1 rounded-full bg-white/30" />
                    <span>You</span>
                </div>
                <div className="prose prose-sm prose-invert max-w-none">
                    {content[0].type === "text" && (
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeHighlight]}>
                            {content[0].text}
                        </ReactMarkdown>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserMessage;
