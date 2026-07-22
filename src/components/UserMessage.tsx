type UserMessageProps = {
    message: string;
    timeLabel?: string;
};

const UserMessage = ({ message, timeLabel = "Now" }: UserMessageProps) => {
    return (
        <div className="flex justify-end">
            <div className="max-w-[min(100%,42rem)] rounded-[1.75rem] border border-white/70 bg-[#241b25] px-5 py-4 text-left text-white shadow-[0_18px_50px_rgba(36,27,37,0.16)]">
                <div className="mb-2 flex items-center justify-end gap-2 text-[0.68rem] font-medium uppercase tracking-[0.28em] text-white/48">
                    <span>{timeLabel}</span>
                    <span className="h-1 w-1 rounded-full bg-white/30" />
                    <span>You</span>
                </div>
                <p className="text-[0.98rem] leading-7 text-white/92">{message}</p>
            </div>
        </div>
    );
};

export default UserMessage;
