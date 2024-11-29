/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import "../../css/overrideCss.css";
import global from "../../css/global.module.css";
import { Dropdown } from "primereact/dropdown";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import AppHeader from "../../components/AppHeader";
import { CustomButton } from "../../components/CustomButton";
import MultipleActionButtonBase from "../../components/MultipleActionButtonBase";
import { CustomerDto } from "../../dto/CustomerDto";
import { RoleDto } from "../../dto/RoleDto";
import { PasswordHashType, UserDto } from "../../dto/UserDto";
import ExceptionHandler from "../../exceptionHandler/ExceptionHandler";
import { GetAllCustomers, GetCustomerByID } from "../../services/Customerservices";
import { GetAllRoles } from "../../services/RoleService";
import { CreateNewUser } from "../../services/Userservice";
import { useToast } from "../../components/ToastContext";
import { CheckForMissingRequiredFields } from "../../helpers/MissingRequiredInputHelper";
import { Tooltip } from "primereact/tooltip";
import GetUserFullName from "../../helpers/UserFullNameHelper";

function CreateUser() {
    const [t] = useTranslation();
    const navigate = useNavigate();
    const customerId = useLocation();
    const setToast = useToast();
    const [roles, setRoles] = useState<RoleDto[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerDto>();
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [customers, setCustomers] = useState<CustomerDto[]>([]);
    const [selectedRole, setSelectedRole] = useState<RoleDto>();
    const roleName = localStorage.getItem("roleName");
    const [newUser, setNewUser] = useState<UserDto>({
        firstName: "",
        infix: "",
        lastName: "",
        passwordHashType: 0,
    });

    const requiredFields = [
        { name: "firstName", value: newUser.firstName },
        { name: "lastName", value: newUser.lastName },
        { name: "email", value: newUser.email },
        { name: "password", value: newUser.password },
        { name: "confirmPassword", value: confirmPassword },
        { name: "role", value: selectedRole }
    ];
    //TODO: remove this whole useEffect and change the url thing in the other useEffect to this
    useEffect(() => {
        if (customerId.state) {
            GetCustomerByID(customerId.state.selectedUserId).then((response: any) => {
                setSelectedCustomer(response.data);
            }).catch((error) => {
                ExceptionHandler(error, t);
            });

        GetAllCustomers().then((response: any) => {
            setCustomers(response.data);
        }).catch((error) => {
            ExceptionHandler(error,t);
        })

        GetAllRoles()
            .then((response: any) => {
                setRoles(response.data);
            })
            .catch((error) => {
                ExceptionHandler(error, t);
            });
        }
        }, [customerId]);

    useEffect(() => {
        const url = window.location.pathname.split("/");
        const id = parseInt(url.pop()!);
        if (!isNaN(id)) {
            GetCustomerByID(id).then((response: any) => {
                setSelectedCustomer(response.data);
            }).catch((error) => {
                ExceptionHandler(error, t);
            });
        }

        GetAllCustomers().then((response: any) => {
            setCustomers(response.data);
            if (roleName?.toLowerCase() == "customer" || roleName?.toLowerCase() == "customeread") {
                setSelectedCustomer(response.data[0]);
            }
        }).catch((error) => {
            ExceptionHandler(error,t);
        })

        GetAllRoles()
            .then((response: any) => {
                setRoles(response.data);
            })
            .catch((error) => {
                ExceptionHandler(error, t);
            });
    }, []);

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewUser((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    function handleSubmit(e: any) {
        e.preventDefault();

        if (newUser) {
            if (CheckForMissingRequiredFields(requiredFields)) {
                setToast({
                    closable: true,
                    severity: 'error',
                    summary: t("userFeedback.errors.missingRequiredFieldsHeader"),
                    detail: t("userFeedback.errors.missingRequiredFields"),
                    life: 4000
                });
                return;
            }

            // Only proceed if password and confirmPassword match
            if (newUser.password !== confirmPassword) {
                setToast({
                    closable: true,
                    severity: 'error',
                    summary: t("userFeedback.errors.passwordError"),
                    detail: t("userFeedback.errors.wrongPasswordFormat"),
                    life: 4000
                });
                return;
            }

            const regex = /^(?=.*[!@#$%^&*()\-_=+`~,./<>?:;|])(?=.*\d)(?=.*[A-Za-z]).{8,32}$/;

            // INFO: roleId holds the entire role object, instead of the id, thus error is misleading
            newUser.customerID = selectedCustomer?.id;
            newUser.roleID = selectedRole?.id;

            if(selectedRole)
            if (selectedRole.name?.toLowerCase() == "admin" || selectedRole.name?.toLowerCase() == "mechanic") {
                newUser.customerID = undefined;
            }

            if (regex.test(newUser.password)) {
                // Make sure that on creation the password will get hashed (0 = PasswordHashType.unhashed)
                newUser.passwordHashType = PasswordHashType.NotSet;
                CreateNewUser(newUser).then((response: any) => {
                    setToast({
                        closable: true,
                        severity: 'success',
                        summary: t("userFeedback.success.users.userCreatedHeader"),
                        detail: t("userFeedback.success.users.userCreated", { userFullName: GetUserFullName(newUser) }),
                        life: 4000
                    });

                    navigate(`/user/edit/${response.data.id}`);
                }).catch((error) => {
                    ExceptionHandler(error, t);
                });
            } else {
                setToast({
                    closable: true,
                    severity: 'error',
                    summary: t("userFeedback.errors.passwordError"),
                    detail: t("userFeedback.errors.wrongPasswordFormat"),
                    life: 4000
                });
            }
        }
    };

    const cancelButton: CustomButton = {
        type: "button",
        onClick: () => navigate("/user"),
        content: t("buttons.cancel"),
    };

    const confirmationButton: CustomButton = {
        type: "submit",
        content: t("buttons.save"),
    };

    const resetButton: CustomButton = {
        onClick: ClearForm,
        type: "reset",
        content: t("buttons.clear")
    }

    function ClearForm() {
        setNewUser({
            firstName: "",
            infix: "",
            lastName: "",
            passwordHashType: 0,
        });

        setSelectedCustomer(undefined);
        setConfirmPassword("");
    }

    function roleTemplate(role: RoleDto) {
        if (role != undefined) {
        return t(`user.roles.${role.name}`);
        } else {
            return t("user.roleSelectorPlaceholder");
        }
    }

    function selectCustomerFunction() {
        if (roleName?.toLowerCase() != "customer") {
if (selectedRole)
            if (selectedRole.name?.toLowerCase() == "customer" || selectedRole.name?.toLowerCase() == "customerread") {
                return (
                    <div className={global.fieldGroup}>
                        <label>{t("user.customer")}</label>
                        <Dropdown
                            id="customer"
                            name="customer"
                            value={selectedCustomer}
                            onChange={(e) => setSelectedCustomer(e.value)}
                            options={customers}
                            optionLabel="customerName"
                            placeholder={t("user.customerPlaceholder")}
                            className={global.dropdownStyle}
                        />
                    </div>
                );
            } else {
                return;
            }
        }
        
    }

    return (
        <AppHeader title={t("user.addUserHeader")}>
            <div className={global.formContainer}>
                <form id="userForm" onSubmit={handleSubmit}>
                    <div className={global.fieldGroup}>
                        <label>{t("user.form.name")}</label>
                        <input
                            id="firstName"
                            name="firstName"
                            value={newUser?.firstName}
                            onChange={handleChange}
                            placeholder={t("user.form.name")}
                        />
                    </div>

                    <div className={global.fieldGroup}>
                        <label>{t("user.form.infix")}</label>
                        <input
                            name="infix"
                            value={newUser?.infix}
                            onChange={handleChange}
                            placeholder={t("user.form.infix")}
                        />
                    </div>

                    <div className={global.fieldGroup}>
                        <label>{t("user.form.lastName")}</label>
                        <input
                            id="lastName"
                            name="lastName"
                            value={newUser?.lastName}
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
                            value={newUser?.email}
                            onChange={handleChange}
                            placeholder={t("user.form.emailExample")}
                        />
                    </div>
                    <div className={global.fieldGroup}>
                        <Tooltip target="#passwordIcon" />
                        <label>
                            {t("user.form.password")}
                            {" "}
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
                            value={newUser?.password}
                            onChange={handleChange}
                            placeholder={t("user.form.password")}

                        />
                    </div>
                    <div className={global.fieldGroup}>
                        <label>{t("user.form.confirmPassword")}</label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <div className={global.fieldGroup}>
                        <label>{t("user.userRole")}</label>
                        <Dropdown
                            id="role"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.value)}
                            options={roles}
                            optionLabel="name"
                            itemTemplate={roleTemplate}
                            valueTemplate={roleTemplate}
                            placeholder={t("user.roleSelectorPlaceholder")}
                            className={global.dropdownStyle}
                        />
                    </div>

                    {selectCustomerFunction()}
            
                    <br />
                    <MultipleActionButtonBase
                        cancelButton={cancelButton}
                        actionButton={resetButton}
                        confirmationButton={confirmationButton}
                    />
                </form>
            </div>
        </AppHeader>
    );
}

export default CreateUser;
