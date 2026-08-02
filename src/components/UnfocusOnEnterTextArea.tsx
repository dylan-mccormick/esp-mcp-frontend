import React, { useEffect, useRef } from "react";

const UnfocusOnEnterTextArea = (
    props: React.JSX.IntrinsicAttributes &
        React.ClassAttributes<HTMLTextAreaElement> &
        React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
            onEnterPressed?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
        }
) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            (e.target as HTMLTextAreaElement).blur();
            if (!props.onEnterPressed) return;
            props.onEnterPressed(e);
        }
    };

    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
    }, [props.value]);

    return <textarea ref={textareaRef} onKeyDown={handleKeyDown} {...props} />;
};

export default UnfocusOnEnterTextArea;