import Image from 'next/image'

export default function MakeLogo({ size, fontSize = ".5rem" }: { size: number, fontSize?: string }) {
    return (
        <div style={{ aspectRatio: "1/1", width: `${size}px`, backgroundColor: "#000", color: "#fff", display: "grid", justifyItems: "center", alignItems: "center", fontSize: fontSize }}>WB</div>
    )
}
