/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import styles from "../css/Login.module.css";
import { CustomButton } from "./CustomButton";
import MultipleActionButtonBase from "./MultipleActionButtonBase";
import { UpdateUser, UpdateUserPassword } from "../services/Userservice";
import { PasswordHashType, UserDto } from "../dto/UserDto";
import { useNavigate } from "react-router-dom";
import ExceptionHandler from "../exceptionHandler/ExceptionHandler";
import { useTranslation } from "react-i18next";
import { useToast } from "./ToastContext";
import global from "../css/Global.module.css";

interface UpdatePasswordDialogProps {
    show: boolean;
    setShow: (show: boolean) => void;
    user: UserDto;
}

const UpdatePasswordDialog: React.FC<UpdatePasswordDialogProps> = ({ show, setShow, user }) => {
    const [t] = useTranslation();
    const navigate = useNavigate();
    const setToast = useToast();
    const [userWithExpiredPassword, setUserWithExpiredPassword] = useState<UserDto>(user);
    const [visible, setVisible] = useState<boolean>(show);

    const [newPassword, setNewPassword] = useState<string>("");
    const [newPasswordCheck, setNewPasswordCheck] = useState<string>("");

    const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(e.target.value);
    };

    const handleNewPasswordCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPasswordCheck(e.target.value);
    };

    useEffect(() => {
        setVisible(show);
    }, [show]);

    useEffect(() => {
        setUserWithExpiredPassword(user);
    }, [user]);

    useEffect(() => {
        if (visible) {
            setTimeout(() => {
                const modalElement = document.getElementById("modal")?.parentElement;
                if (modalElement) {
                    modalElement.classList.add(styles.modal);
                }
            }, 10);
        }

        // Cleanup on hide (remove styling when modal is hidden)
        return () => {
            const modalElement = document.getElementById("modal")?.parentElement;
            if (modalElement) {
                modalElement.classList.remove(styles.modal);
            }
        };
    }, [visible]);

    const handleSubmit = () => {
        // Only proceed if password and confirmPassword match
        if (newPassword !== newPasswordCheck) {
            setToast({
                closable: true,
                severity: "error",
                summary: t("userFeedback.errors.passwordError"),
                detail: t("userFeedback.errors.wrongPasswordFormat"),
                life: 4000,
            });
            return;
        }

        const regex = /^(?=.*[!@#$%^&*()\-_=+`~,./<>?:;|])(?=.*\d)(?=.*[A-Za-z]).{9,32}$/;

        userWithExpiredPassword.password = newPassword;
        userWithExpiredPassword.passwordHashType = PasswordHashType.NotSet;
        if (regex.test(userWithExpiredPassword.password)) {
            UpdateUserPassword(userWithExpiredPassword.id, userWithExpiredPassword)
                .then((response: any) => {
                    if (response.status == 200) {
                        setVisible(!visible);
                        navigate("/");
                    }
                })
                .catch((e: any) => {
                    ExceptionHandler(e, t);
                });
        }
    };


    const confirmationButton: CustomButton = {
        content: "Aanpassen",
        onClick: handleSubmit,
        type: "button",
    };

    const cancelButton: CustomButton = {
        content: "sluiten",
        onClick: () => { setVisible(!visible); setShow(false); }, // TODO: manage state in parent component for retriggers modal
        type: "button",
    };

    return (
        <Dialog
            id="modal"
            visible={visible}
            modal
            closable={false}
            style={{
                borderRadius: "12px",
                backgroundColor: "white",
                border: "2px solid rgba(0, 0, 0, 0.1)",
                boxShadow: "24",
                height: "26vw",
                width: "35vw",
            }}
            onHide={() => setVisible(false)}
        >
            <form>
                <div className={styles.modalContentContainer}>
                    <h1 className={`${global.title} ${styles.logintitle2}`}>Wachtwoord updaten</h1>
                    <br />

                    <div className={styles.formgroup}>
                        <label htmlFor="newPassword" className={`${styles.loginlabel}`}>Nieuw wachtwoord</label>
                        <input
                            name="newPassword"
                            value={newPassword}
                            onChange={handleNewPasswordChange}
                            id="newPassword"
                            type="password"
                            className={styles.inputField}
                        />
                    </div>
                   
                    <div className={styles.formgroup}>
                        <label htmlFor="repeatNewPassword" className={`${styles.loginlabel}`}>Herhaal wachtwoord</label>
                        <input
                            name="repeatNewPassword"
                            value={newPasswordCheck}
                            onChange={handleNewPasswordCheckChange}
                            id="repeatNewPassword"
                            type="password"
                            className={styles.inputField}
                        />
                    </div>
                    <div className={styles.buttonWrapper}>
                        <MultipleActionButtonBase
                            cancelButton={cancelButton}
                            confirmationButton={confirmationButton}
                        />
                    </div>
                </div>
            </form>
        </Dialog>
    );
};

export default UpdatePasswordDialog;
