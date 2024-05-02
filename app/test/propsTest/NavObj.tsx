import Link from "next/link"
import styles from "./navObj.module.css"

type navObj = {
    logo: JSX.Element,
    navButton: JSX.Element,
    menuGraphic: JSX.Element,
    menuItems: menuItem[]
}

type menuItem = {
    title: string,
    link: string
    subMenu?: subMenuItem[]
}

type subMenuItem = {
    title: string,
    link: string,
    subSubMenu?: subSubMenuItem[]
}

type subSubMenuItem = {
    title: string,
    link: string
}

const navObjExample: navObj = {
    logo: <></>,
    menuGraphic: <></>, //chevrons
    navButton: <></>,
    menuItems: [
        {
            title: "home",
            link: "/",
            subMenu: [
                {
                    title: "about me",
                    link: "/aboutMe",
                    subSubMenu: [
                        {
                            title: "education",
                            link: "/education"
                        },
                    ]
                },
            ]
        }
    ]
}

export default function NavObj({ navObj }: { navObj: navObj }) {
    return (
        <nav>
            {navObj.logo}

            <ul className={styles.menu}>
                {navObj.menuItems.map((eachMenuItem, eachMenuItemIndex) => {
                    return (
                        <li key={eachMenuItemIndex}>
                            <Link href={eachMenuItem.link}>{eachMenuItem.title}</Link> {navObj.menuGraphic}

                            <ul className={styles.subMenu}>
                                {eachMenuItem.subMenu?.map((eachSubmenuItem, eachSubmenuItemIndex) => {
                                    return (
                                        <li key={eachSubmenuItemIndex}>
                                            <Link href={eachSubmenuItem.link}>{eachSubmenuItem.title}</Link> {navObj.menuGraphic}

                                            <ul className={styles.subSubMenu}>
                                                {eachSubmenuItem.subSubMenu?.map((eachSubSubMenuItem, eachSubSubMenuItemIndex) => {
                                                    return (
                                                        <li key={eachSubSubMenuItemIndex}>
                                                            <Link href={eachSubSubMenuItem.link}>{eachSubSubMenuItem.title}</Link> {navObj.menuGraphic}
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        </li>
                                    )
                                })}
                            </ul>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}
