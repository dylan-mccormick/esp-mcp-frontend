import React, { useRef } from "react";

const UnfocusOnEnterInput = (
    props: React.JSX.IntrinsicAttributes &
        React.ClassAttributes<HTMLInputElement> &
        React.InputHTMLAttributes<HTMLInputElement> & {
            onEnterPressed?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
        }
) => {
    const inputRef = useRef(null);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key == "Enter" && !e.shiftKey) {
            (e.target as HTMLInputElement).blur();
            if (!props.onEnterPressed) return;
            props.onEnterPressed(e);
        }
    };

    return (
        <input
            ref={inputRef}
            onKeyDown={handleKeyDown}
            {...props}
        />
    );
};

export default UnfocusOnEnterInput;
