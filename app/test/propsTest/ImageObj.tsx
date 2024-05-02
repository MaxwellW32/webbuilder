import Image from "next/image";

export default function ImageObj({ imageObj }: { imageObj: { alt: string, src: string, width: number, height: number } }) {
    return (
        <div>
            <Image alt={imageObj.alt} src={imageObj.src} width={imageObj.width} height={imageObj.height} />
        </div>
    )
}
