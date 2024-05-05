export default function Children({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ backgroundColor: "green", display: "grid", justifyItems: "center" }}>
            <p>This element hold children</p>

            <p>Parent Element Above</p>

            {children}

            <p>Parent Element Below</p>
        </div>
    )
}
