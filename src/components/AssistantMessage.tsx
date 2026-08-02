import { Cpu } from "lucide-react";
import { type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

export type AssistantMessageProps = {
    message?: string;
    sender: "assistant";
    sentBy?: string;
    children?: ReactNode;
};

const AssistantMessage = ({ message, sentBy = "LLM", children }: AssistantMessageProps) => {

    return (
        <div className="flex justify-start py-2">
            <div className="max-w-[min(100%,48rem)] rounded-[1.75rem] border border-[#d9d0d1] bg-[rgba(255,255,255,0.76)] px-5 py-4 shadow-[0_18px_50px_rgba(36,27,37,0.08)] backdrop-blur-md">
                <div className="mb-3 flex items-center gap-3 text-[0.68rem] font-medium uppercase tracking-[0.28em] text-[#786773]">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#d6cbcd] bg-white text-[0.62rem] font-semibold tracking-[0.24em] text-[#241b25]">
                        <Cpu className="h-4 w-4" />
                    </span>
                    <span>{sentBy}</span>
                </div>

                {message ? <div className="prose prose-sm max-w-none"><ReactMarkdown remarkPlugins={[ remarkGfm ]} rehypePlugins={[ rehypeHighlight ]} >{message}</ReactMarkdown></div> : null}

                {children ? <div className="mt-4 space-y-4">{children}</div> : null}
            </div>
        </div>
    );
};

export default AssistantMessage;
