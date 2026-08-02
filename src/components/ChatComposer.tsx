import { useCallback, useState } from "react";

import UnfocusOnEnterTextArea from "./UnfocusOnEnterTextArea";

interface ChatComposerProps {
    onSendMessage: (s: string) => void;
    sending: boolean;
}

const ChatComposer = ({ onSendMessage, sending }: ChatComposerProps) => {
    const [inputLine, setInputLine] = useState<string>("");

    const sendMessage = useCallback(() => {
        onSendMessage(inputLine);
        setInputLine("");
    }, [inputLine]);

    return (
        <div className="rounded-[1.75rem] border border-white/70 bg-[rgba(255,255,255,0.72)] p-3 shadow-[0_18px_50px_rgba(36,27,37,0.1)] backdrop-blur-md">
            <div className="flex items-end gap-3">
                <UnfocusOnEnterTextArea
                    onEnterPressed={sendMessage}
                    value={inputLine}
                    disabled={sending}
                    onChange={e => setInputLine(e.target.value)}
                    placeholder="Type here to send a message."
                    rows={1}
                    className="min-h-12 max-h-40 flex-1 resize-none overflow-y-auto rounded-[1.2rem] border border-[#ded5d6] bg-white px-4 py-3 text-sm text-[#8a7c84] shadow-inner hover:cursor-text active:cursor-text focus:border-[#241b25] focus:outline-none focus:ring-1 focus:ring-[#241b25] focus:ring-offset-1"
                />

                <button
                    type="button"
                    className="ui-button ui-button-primary ui-button-rect h-12 px-5"
                    disabled={sending}
                    onClick={sendMessage}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatComposer;
