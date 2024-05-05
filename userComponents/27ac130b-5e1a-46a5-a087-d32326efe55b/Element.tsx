import styles from "./element.module.css"

export default function Element({ element }: { element: JSX.Element }) {
    return (
        <div className={styles.mainDiv}>
            <h1>This is an element</h1>

            {element}

            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente repellat possimus quam nihil consequatur fugit soluta tempora, in minima nobis aspernatur expedita recusandae voluptates dolores harum commodi quos ullam eligendi!</p>
        </div>
    )
}
