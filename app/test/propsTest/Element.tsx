import Image from "next/image";

export default function Element({ element }: { element: JSX.Element }) {
    return (
        <div>
            {element}
        </div>
    )
}
