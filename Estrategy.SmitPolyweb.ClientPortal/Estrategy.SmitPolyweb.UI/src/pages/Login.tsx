/* eslint-disable @typescript-eslint/no-explicit-any */
import { Authorize, GetUserByEmail } from "../services/Loginservice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ToastContext";
import { useTranslation } from "react-i18next";
import styles from "../css/Login.module.css";
import global from "../css/Global.module.css";
import UpdatePasswordDialog from "../components/UpdatePasswordDialog";
import { UserDto } from "../dto/UserDto";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const [showUpdatePasswordDialog, setShowUpdatePasswordDialog] = useState<boolean>(false)
    const [expiredPasswordUser, setExpiredPasswordUser] = useState<UserDto>({});
    const navigate = useNavigate();
    const setToast = useToast();
    const { t } = useTranslation();
    const { login } = useAuth();

    const [data, setData] = useState({
        email: "",
        password: "",
    });

    function handleChange(e: any) {
        const value = e.target.value;

        setData({
            ...data,
            [e.target.name]: value,
        });
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();

        const userData = {
            email: data.email,
            password: data.password,
        };

        const formData = {
            email: data.email,
        };

        Authorize(userData)
            .then((response: any) => {

                if (response.status == 200 && response.data.error == "Password expired") {
                    setExpiredPasswordUser(response.data.user)
                    setShowUpdatePasswordDialog(true);
                    return;
                }
                
                login(); // NOTE: user is logged in and routes are now available

                GetUserByEmail(formData).then((response: any) => {
                    localStorage.setItem("roleName", response.data.userRole.name);
                    localStorage.setItem("userMail", response.data.newUser.email);
                    switch (response.data.userRole.name.toLowerCase()) {
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
                });
            })
            .catch((error) => {
                if (error.code?.includes("ERR_NETWORK")) {
                    setToast({
                        closable: false,
                        severity: "error",
                        summary: t("serverResponses.errors.connectionError"),
                        detail: t("serverResponses.tryAgainLater"),
                        life: 5000,
                    });
                }

                if (error.response?.data) {
                    if (error.response?.data?.includes("Username or password incorrect")) {
                        setToast({
                            closable: false,
                            severity: "warn",
                            summary: error.response.data,
                            life: 5000,
                        });
                    }
                }

                if (error.status == 403) {
                    setToast({
                        closable: false,
                        severity: "warn",
                        summary: t("userFeedback.errors.accountBlockedHeader"),
                        detail: t("userFeedback.errors.accountBlocked")
                    })
                }

                const inputs = document.querySelectorAll("input"); // Selects all input fields
                inputs.forEach((input, index) => {
                    if (index < 2) {
                        // Add class to the first two inputs
                        input.classList.add(styles.wronglogin);
                    }
                });
            });
    };

    return (
        <div className={`${styles.wrapper} ${styles.background}`}>
            <form id="login" onSubmit={handleSubmit}>
                <div className={`${global.container} ${styles.logincontainer}`}>
                    <div className={`${global.body} ${global.centercontenthorizontal}`}>
                        <div className={`${global.formgroup}`}>
                            <h1 className={`${global.title} ${styles.logintitle}`}>
                                {t("login.loginCertificates")}
                            </h1>
                            <label
                                htmlFor={t("contactInformation.email")}
                                className={`${styles.loginlabel}`}
                            >
                                {t("login.entryCode")}
                            </label>
                            <input
                                type="email"
                                name="email"
                                autoComplete="username"
                                value={data.email}
                                onChange={handleChange}
                                required
                                className={`${global.searchfield} ${global.searchfield_XXL} ${styles.loginfield}`}
                            />
                            <label htmlFor="password" className={`${styles.loginlabel}`}>
                                {t("login.password")}
                            </label>
                            <input
                                type="password"
                                name="password"
                                autoComplete="current-password"
                                value={data.password}
                                onChange={handleChange}
                                required
                                className={`${global.searchfield} ${global.searchfield_XXL} ${styles.loginfield}`}
                            />
                        </div>
                    </div>

                    <div className={`${global.footer} ${global.centercontenthorizontal}`}>
                        <div className={`${global.formgroup}`}>
                            <button
                                type="submit"
                                className={`${global.btn} ${global.btnprimary}`}
                            >
                                {t("buttons.login")} &#128898;
                            </button>
                            <a className={`${styles.passwordreset} ${global.disabled} ${styles.loginbtnhelper}`}>
                                {t("buttons.forgotPassword")} &#128898;
                            </a>
                        </div>
                    </div>
                </div>
            </form>
            <UpdatePasswordDialog show={showUpdatePasswordDialog} setShow={setShowUpdatePasswordDialog} user={expiredPasswordUser}/>
        </div>

    );
}
