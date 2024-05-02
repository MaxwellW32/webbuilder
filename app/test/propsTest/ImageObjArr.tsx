import Image from "next/image";

export default function ImageObjArr({ imageObjArr }: { imageObjArr: { alt: string, src: string, width: number, height: number }[] }) {
    return (
        <div>
            {imageObjArr.map((eachImage, eachImageIndex) => {
                return (
                    <Image key={eachImageIndex} alt={eachImage.alt} src={eachImage.src} width={eachImage.width} height={eachImage.height} />
                )
            })}
        </div>
    )
}
