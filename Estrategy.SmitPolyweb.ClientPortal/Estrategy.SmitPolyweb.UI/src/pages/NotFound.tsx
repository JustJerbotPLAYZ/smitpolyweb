import { useTranslation } from "react-i18next";
import AppHeader from "../components/AppHeader";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../css/NotFound.module.css";

const NotFound = () => {
    const [t] = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            const userRole = localStorage.getItem("roleName");
            switch (userRole) {
            case "customer":
              navigate("/certificate");
              break;
            case "mechanic":
              navigate("/ticket");
              break;
            case "admin":
              navigate("/certificate");
              break;
            default:
              navigate("/certificate");
          }
        }, 5000);
    }, []);

    return (
        <AppHeader title={t("errors.pageNotFound")}>
            <div className={styles.textPosition}>
                <p className={styles.errorStyle}>404</p>
                <p className={styles.notFoundMsg}>{t("errors.pageNotFoundMsg")}</p>
                <p className={styles.redirectMsg}>{t("errors.pageNotFoundRedirect")}</p>
            </div>
        </AppHeader>
    );
};

export default NotFound;
