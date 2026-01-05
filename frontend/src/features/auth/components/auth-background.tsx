export function AuthBackground() {
    return (
        <div className="pointer-events-none absolute inset-0 -z-10 bg-background">
            <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_10%,hsl(var(--primary)/0.1),transparent)] opacity-30" />
            <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_15%_75%,hsl(var(--secondary)/0.1),transparent)] opacity-50" />
            <div className="absolute inset-0 bg-[radial-gradient(55%_45%_at_85%_80%,hsl(var(--primary)/0.1),transparent)] opacity-40" />
        </div>
    )
}
