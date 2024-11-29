/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode, useEffect, useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { PanelMenu } from "primereact/panelmenu";
import "primeicons/primeicons.css";
import styles from "../css/AppHeader.module.css";
import "../css/overrideCss.css";
import { NavLink } from "react-router-dom";
import SmitPolywebLogo from "../assets/SmitPolywebLogo.png";

import global from "../css/Global.module.css";
import { useAuth } from "../context/AuthContext";

let items: any = [];

const tempList = [
    {
        label: "Certificaten",
        icon: "pi pi-file",
        key: "Certificaten",
        items: [
            {
                label: "Beheren",
                command: () => (window.location.href = "/certificate"),
                key: "Certificates_Manage"
            },
            {
                label: "Nieuw",
                command: () => (window.location.href = "/certificate/create"),
                key: "Certificates_Create"
            },
        ],
    },
    {
        label: "Werkbonnen",
        icon: "pi pi-receipt",
        key: "Werkbonnen",
        items: [
            {
                label: "Beheren",
                command: () => (window.location.href = "/ticket"),
                key: "Tickets_Manage"
            },
            {
                label: "Nieuw",
                command: () => (window.location.href = "/ticket/create/addCustomer"),
                key: "Tickets_Create"
            },
        ],
    },
    {
        label: "Herinneringen",
        icon: "pi pi-history",
        key: "Herinneringen",
        items: [
            {
                label: "Herinneringen",
                command: () => (window.location.href = "/reminder"),
                key: "Reminder"
            },
        ],
    },

    {
        label: "Klanten",
        icon: "pi pi-address-book",
        key: "Klanten",
        items: [
            {
                label: "Klanten",
                command: () => (window.location.href = "/customer"),
                key: "Customer"
            },
            {
                label: "Nieuw",
                command: () => (window.location.href = "/customer/create"),
                key: "Customer_Creation"
            },
        ],
    },
    {
        label: "Onderhoud",
        icon: "pi pi-cog",
        key: "Onderhoud",
        items: [
            {
                label: "Gebruikers",
                command: () => (window.location.href = "/user"),
                key: "Users"
            },
            {
                label: "Eigenschappen",
                command: () => (window.location.href = "/property"),
                key: "Property"
            },
            {
                label: "Artikel",
                command: () => (window.location.href = "/article"),
                key: "Article"
            },
            {
                label: "Artikel type",
                command: () => (window.location.href = "/articleType"),
                key: "ArticleType"
            },
        ],
    },
];

interface AppHeaderProps {
    children: ReactNode;
    title: string;
    actionComponent?: ReactNode;
    actionTitle?: string;
}

export default function AppHeader({ children, title, actionComponent, actionTitle }: AppHeaderProps) {
    const [visible, setVisible] = useState<boolean>(false);
    const userEmail: string | null = localStorage.getItem("userMail");;
    const [expandedKeys, setExpandedKeys] = useState<{ [key: string]: boolean }>(
        {}
    );
    let tempInt = 1;
    const { logout } = useAuth();

    const [navbarHeight, setNavbarHeight] = useState<number>();


    useEffect(() => {
        if (tempInt == 1) {
            items = tempList.map((x, index) => ({
                label: x.label,
                icon: x.icon,
                key: `${x.key}-${index}`, // Combine the parent key and index for uniqueness
                items: x.items.map((subItem, subIndex) => ({
                    ...subItem,
                    key: `${subItem.key}-${index}-${subIndex}`, // Unique key for sub-items
                })),
            }));

            tempInt++;
            const selectedRole = localStorage.getItem("roleName");
            if (selectedRole != undefined && selectedRole != null)
                switch (selectedRole.toLowerCase()) {
                    case "customer":
                        items.splice(1, 3);
                        items[1].items.splice(1, 3);
                        items[0].items.splice(1, 1);
                        break;
                    case "customerread":
                        items.splice(1, 4);
                        items[0].items.splice(1, 1);
                        break;
                    case "mechanic":
                        items.splice(2, 3);
                        break;
                }
        }

        setAllOpened();
    }, []);

    const setAllOpened = () => {
        const allKeysExpanded = items.reduce((acc: any, item: any) => {
            acc[item.key] = true;
            return acc;
        }, {} as { [key: string]: boolean });

        setExpandedKeys(allKeysExpanded);
    };

    function addItems() {
        const selectedRole = localStorage.getItem("roleName");

        const tempList = [];
        if (selectedRole != null)
            tempList.push(setImage(selectedRole.toLowerCase()));
        return tempList;
    }

    function setImage(name: string | null) {
        if (name == "customer") {
            return (
                <div
                    className={`${styles.sidebar2}`}
                    onClick={() => {
                        setVisible(true);
                    }} key="sidenavicons"
                >
                    <i key="pi_pi-file" className={`${"pi pi-file"} ${styles.icon}`} />
                    <i key="pi_pi-cog" className={`${"pi pi-cog"} ${styles.icon}`} />
                </div>
            );
        } else if (name == "customerread") {
            return (
                <div
                    className={`${styles.sidebar2}`}
                    onClick={() => {
                        setVisible(true);
                    }} key="sidenavicons"
                >
                    <i key="pi_pi-file" className={`${"pi pi-file"} ${styles.icon}`} />
                </div>
            );
        } else if (name == "mechanic") {
            return (
                <div
                    className={`${styles.sidebar2}`}
                    onClick={() => {
                        setVisible(true);
                    }} key="sidenavicons"
                >
                    <i key="pi_pi-file" className={`${"pi pi-file"} ${styles.icon}`} />
                    <i key="pi_pi-receipt" className={`${"pi pi-receipt"} ${styles.icon}`} />
                </div>
            );
        } else {
            return (
                <div
                    className={`${styles.sidebar2}`}
                    onClick={() => {
                        setVisible(true);
                    }} key="sidenavicons"
                >
                    <i key="pi_pi-file" className={`${"pi pi-file"} ${styles.icon}`} />
                    <i key="pi_pi-receipt" className={`${"pi pi-receipt"} ${styles.icon}`} />
                    <i key="pi_pi-history" className={`${"pi pi-history"} ${styles.icon}`} />
                    <i key="pi_pi-book" className={`${"pi pi-address-book"} ${styles.icon}`} />
                    <i key="pi_pi-cog" className={`${"pi pi-cog"} ${styles.icon}`} />
                </div>
            );
        }
    }

    useEffect(() => {
        const navbarElement = document.getElementById("navbar");

        if (navbarElement) {
            setNavbarHeight(navbarElement.clientHeight);
        }
    }, []);

    return (
        <>
            {/* Navbar */}
            <div id="navbar" className={styles.navbar}>
                <img className={styles.logo} src={SmitPolywebLogo} />
                <div className={styles.navbarRight}>
                    <p className={`${styles.email}`}>{userEmail}</p>
                    <NavLink to="/">
                        <button onClick={() => logout()} className={`${global.btn} ${global.btnprimary}`}>
                            Log uit &#128898;
                        </button>
                    </NavLink>
                </div>
            </div>

            {/* Sidebar */}
            <div className={styles.sidebar} style={{ height: `${navbarHeight}!important` }}>
                {addItems()}
                <Sidebar
                    visible={visible}
                    className={styles.sideBarRoot}
                    position="left"
                    color="#00ff00"
                    onHide={() => setVisible(false)}
                >
                    <PanelMenu
                        model={items}
                        expandedKeys={expandedKeys}
                        onExpandedKeysChange={setExpandedKeys}
                        onClose={() => setAllOpened()}
                        multiple
                    />
                </Sidebar>
            </div>

            {/* Content */}
            <div className={styles.content}>
                {actionComponent && (
                    <div className={`${global.container} ${global.containersecondary}`}>
                        <div className={`${global.header} ${global.headersecondary}`}>
                            <h2 className={global.title}>{actionTitle}</h2>
                        </div>
                        <div className={`${global.body}`}>{actionComponent}</div>
                    </div>
                )}

                <div className={`${global.container} ${global.containerprimary}`}>
                    <div className={`${global.header} ${global.headerprimary}`}>
                        <h2 className={global.title}>{title}</h2>
                    </div>

                    <div className={`${global.body}`}>{children}</div>
                </div>
            </div>
        </>
    );
}
