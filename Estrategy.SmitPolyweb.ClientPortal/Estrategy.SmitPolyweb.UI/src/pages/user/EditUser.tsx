/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { DeleteUser, GetUserByID, UpdateUser } from "../../services/Userservice";
import { GetAllRoles, GetRoleByID } from "../../services/RoleService";
import styles from "../../css/User.module.css";
import "../../css/overrideCss.css";
import { RoleDto } from "../../dto/RoleDto";
import { PasswordHashType, UserDto } from "../../dto/UserDto";
import { useTranslation } from "react-i18next";
import AppHeader from "../../components/AppHeader";
import global from "../../css/global.module.css";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { RadioButton } from "primereact/radiobutton";
import { CustomButton } from "../../components/CustomButton";
import MultipleActionButtonBase from "../../components/MultipleActionButtonBase";
import { useNavigate } from "react-router-dom";
import { CustomerDto } from "../../dto/CustomerDto";
import ExceptionHandler from "../../exceptionHandler/ExceptionHandler";
import { GetAllCustomers, GetCustomerByID } from "../../services/Customerservices";
import GetUserFullName from "../../helpers/UserFullNameHelper";
import { useToast } from "../../components/ToastContext";
import { CheckForMissingRequiredFields } from "../../helpers/MissingRequiredInputHelper";
import { Tooltip } from "primereact/tooltip";
import { SpinnerTemplate } from "../../components/Templates";

function EditUser() {
    const [t] = useTranslation();
    const navigate = useNavigate();
    const setToast = useToast();
    const [userToEdit, setUserToEdit] = useState<UserDto>();
    const [roles, setRoles] = useState<RoleDto[]>([]);
    const [selectedRole, setSelectedRole] = useState<RoleDto>();
    const [newPassword, setNewPassword] = useState<string>("");
    const [newPasswordCheck, setNewPasswordCheck] = useState<string>("");
    const [customers, setCustomers] = useState<CustomerDto[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerDto>();
    const [requiredFields, setRequiredFields] = useState<{ name: string; value: unknown }[]>([]);

    useEffect(() => {
        const url = window.location.pathname.split("/");
        const id = parseInt(url.pop()!);
        GetUserByID(id)
            .then((response: any) => {
                setUserToEdit(response.data);
                GetAllCustomers().then((response: any) => {
                    setCustomers(response.data);
                });
                GetRoleByID(response.data.roleID)
                    .then((response: any) => {
                        setSelectedRole(response.data);
                    })
                    .catch((error) => {
                        ExceptionHandler(error, t);
                    });
                if (response.data.customerID != undefined)
                    GetCustomerByID(response.data.customerID).then((response: any) => {
                        setSelectedCustomer(response.data);
                    });
            })
            .catch((error) => {
                ExceptionHandler(error, t);
            });
    }, []);

    useEffect(() => {
        setRequiredFields([
            { name: "firstName", value: userToEdit?.firstName },
            { name: "lastName", value: userToEdit?.lastName },
            { name: "email", value: userToEdit?.email },
            { name: "role", value: selectedRole },
        ]);
    }, [userToEdit, selectedRole]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setUserToEdit(
            (prevUser) =>
            ({
                ...prevUser,
                [name]: value,
            } as UserDto)
        );
    };

    const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const updatedPassword = e.target.value;
        setNewPassword(updatedPassword);

        setRequiredFields((prevFields) => {
            const updatedFields = prevFields.map((field) => {
                if (field.name === "password") {
                    return { name: "password", value: updatedPassword };
                }
                return field;
            });

            const passwordExists = updatedFields.some(
                (field) => field.name === "password"
            );

            if (!passwordExists) {
                updatedFields.push({ name: "password", value: updatedPassword });
            }
            return updatedFields;
        });
    };

    const handleNewPasswordCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPasswordCheck(e.target.value);

        // Update or insert password fields in requiredFields array
        setRequiredFields((prevFields) => {
            const updatedFields = prevFields.map((field) => {
                if (field.name === "confirmPassword") {
                    return { name: "confirmPassword", value: e.target.value };
                }
                return field;
            });

            // If password fields are not found, add them
            const confirmPasswordExists = updatedFields.some(
                (field) => field.name === "confirmPassword"
            );

            if (!confirmPasswordExists) {
                updatedFields.push({
                    name: "confirmPassword",
                    value: newPasswordCheck,
                });
            }

            return updatedFields;
        });
    };

    useEffect(() => {
        GetAllRoles()
            .then((response: any) => {
                setRoles(response.data);
            })
            .catch((error) => {
                ExceptionHandler(error, t);
            });
    }, []);

    function deleteUserFunction() {
        if (userToEdit != null) {
            DeleteUser(userToEdit.id);
            const fullName = GetUserFullName(userToEdit);
            setToast({
                closable: true,
                severity: "success",
                summary: t("userFeedback.success.users.userDeletedHeader"),
                detail: t("userFeedback.success.users.userDeleted", { userFullName: fullName }),
                life: 4000,
            });

            navigate("/user");
        }
    }

    const SubmitUpdatedUser = async () => {
        if (userToEdit) {
            if (CheckForMissingRequiredFields(requiredFields)) {
                setToast({ severity: "error", summary: t("userFeedback.errors.missingRequiredFieldsHeader"), detail: t("userFeedback.errors.missingRequiredFields"), life: 4000 });
                return;
            }

            userToEdit.customerID = selectedCustomer?.id;
            if (newPassword !== newPasswordCheck) {
                setToast({ severity: "error", summary: t("userFeedback.errors.passwordError"), detail: t("userFeedback.errors.passwordMismatch"), life: 4000 });
                return;
            }

            if (newPassword != "") {
                const passwordRegex = /^(?=.*[!@#$%^&*()\-_=+`~,./<>?:;|])(?=.*\d)(?=.*[A-Za-z]).{8,32}$/;
                if (!passwordRegex.test(newPassword)) {
                    setToast({ severity: "error", summary: t("userFeedback.errors.passwordError"), detail: t("userFeedback.errors.wrongPasswordFormat", { userFullName: GetUserFullName(userToEdit) }), life: 4000 });
                    return;
                }

                userToEdit.passwordHashType = PasswordHashType.NotSet;
                userToEdit.password = newPassword;
        } else {
            userToEdit.passwordHashType = PasswordHashType.Salted;
            userToEdit.password = "null";
        }
            try {
                await UpdateUser(userToEdit);
                setToast({ severity: "success", summary: t("userFeedback.success.users.userEditedHeader"), detail: t("userFeedback.success.users.userEdited", { userFullName: GetUserFullName(userToEdit) }), life: 4000 });
                navigate("/user");
            } catch (error) {
                ExceptionHandler(error, t);
            }
        }
    };

    const toggleAccountStatus = (statusKey: "accountActive" | "accountBlocked") => {
        setUserToEdit((prevUser) =>
            prevUser
                ? {
                    ...prevUser,
                    [statusKey]: !prevUser[statusKey],
                    accountActive:
                        statusKey === "accountActive" ? !prevUser[statusKey] : false,
                    accountBlocked:
                        statusKey === "accountBlocked" ? !prevUser[statusKey] : false,
                }
                : prevUser
        );
    };

    const cancelButton: CustomButton = {
        type: "button",
        onClick: () => navigate("/user"),
        content: t("buttons.back"),
    };

    const actionButton: CustomButton = {
        type: "button",
        onClick: () => deleteUserFunction(),
        content: t("buttons.delete"),
    };

    const confirmationButton: CustomButton = {
        type: "button",
        onClick: SubmitUpdatedUser,
        content: t("buttons.save"),
    };

    function roleTemplate(role: RoleDto) {
        if (role != undefined) {
            return t(`user.roles.${role.name}`);
        } else {
            return t("user.roleSelectorPlaceholder");
        }
    }

    return (
        <AppHeader title={t("user.editUserHeader")}>
            {selectedCustomer == undefined && (
                <SpinnerTemplate />
            )}
            <div className={global.formContainer}>
                <p className={global.headerStyle}>{t("user.form.userDetailsHeader")}</p>
                <form id="userForm" autoComplete="new-password">
                    <div className={global.fieldGroup}>
                        <label>{t("user.form.name")}</label>
                        <input
                            id="firstName"
                            name="firstName"
                            value={userToEdit?.firstName}
                            onChange={handleChange}
                            placeholder={t("user.form.name")}
                        />
                    </div>

                    <div className={global.fieldGroup}>
                        <label>{t("user.form.infix")}</label>
                        <input
                            name="infix"
                            value={userToEdit?.infix}
                            onChange={handleChange}
                            placeholder={t("user.form.infix")}
                        />
                    </div>

                    <div className={global.fieldGroup}>
                        <label>{t("user.form.lastName")}</label>
                        <input
                            id="lastName"
                            name="lastName"
                            value={userToEdit?.lastName}
                            onChange={handleChange}
                            placeholder={t("user.form.lastName")}
                        />
                    </div>

                    <div className={global.fieldGroup}>
                        <label>{t("user.form.email")}</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={userToEdit?.email}
                            onChange={handleChange}
                            placeholder={t("user.form.emailExample")}
                        />
                    </div>
                    <div className={global.fieldGroup}>
                        <Tooltip target="#passwordIcon" />
                        <label>
                            {t("user.form.newPassword")}{" "}
                            <i
                                className="fa-sharp fa-regular fa-circle-info"
                                data-pr-tooltip={t("user.form.passwordRequirements")}
                                data-pr-classname={global.test}
                                data-pr-my="left center-2"
                                style={{ cursor: "pointer" }}
                                id="passwordIcon"
                            />
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            value={newPassword}
                            onChange={handleNewPasswordChange}
                            onInput={handleNewPasswordChange}
                            placeholder={t("user.form.newPassword")}
                        />
                    </div>
                    <div className={global.fieldGroup}>
                        <label>{t("user.form.newPasswordRepeat")}</label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={newPasswordCheck}
                            onChange={handleNewPasswordCheckChange}
                            onInput={handleNewPasswordCheckChange}
                            placeholder={t("user.form.newPasswordRepeat")}
                        />
                    </div>
                    <div className={global.fieldGroup}>
                        <label>{t("user.form.accountStatus")}</label>
                        <div className={styles.radioButtonsWrapper}>
                            <p>
                                <RadioButton
                                    inputId="active"
                                    name="accountStatus"
                                    checked={userToEdit?.accountActive || false}
                                    onChange={() => toggleAccountStatus("accountActive")}
                                />
                                {t("user.active")}
                            </p>
                            <p>
                                <RadioButton
                                    inputId="blocked"
                                    name="accountStatus"
                                    checked={userToEdit?.accountBlocked || false}
                                    onChange={() => toggleAccountStatus("accountBlocked")}
                                />
                                {t("user.blocked")}
                            </p>
                        </div>
                    </div>
                    <div className={global.fieldGroup}>
                        <label>{t("user.userRole")}</label>
                        <Dropdown
                            id="role"
                            value={selectedRole}
                            onChange={(e: DropdownChangeEvent) => setSelectedRole(e.value)}
                            options={roles}
                            optionLabel="name"
                            itemTemplate={roleTemplate}
                            valueTemplate={roleTemplate}
                            placeholder={t("user.roleSelectorPlaceholder")}
                            className={global.dropdownStyle}
                        />
                    </div>

                    <div className={global.fieldGroup}>
                        <label>{t("user.customer")}</label>
                        <Dropdown
                            id="customer"
                            name="customer"
                            value={selectedCustomer}
                            onChange={(e: DropdownChangeEvent) => setSelectedCustomer(e.value)}
                            options={customers}
                            optionLabel="customerName"
                            placeholder={t("user.customerPlaceholder")}
                            className={global.dropdownStyle}
                        />
                    </div>
                    <div className={styles.buttonGroup}>
                        <MultipleActionButtonBase cancelButton={cancelButton} actionButton={actionButton} confirmationButton={confirmationButton} />
                    </div>
                </form>
            </div>
        </AppHeader>
    );
}

export default EditUser;
