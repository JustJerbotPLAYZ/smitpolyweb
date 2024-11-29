
/* eslint-disable @typescript-eslint/no-explicit-any */
import global from "../../css/global.module.css";
import styles from "../../css/EditCustomer.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { DeleteCustomerByID, GetAllUsersByCustomerID, GetCustomerByID, UpdateCustomerByID } from "../../services/Customerservices";
import { useEffect } from "react";
import { GetAddressByID } from "../../services/AddressService";
import { AddressDto } from "../../dto/AddressDto";
import { CustomerDto, ExpirationReminderSetting } from "../../dto/CustomerDto";
import { useTranslation } from "react-i18next";
import { useToast } from "../../components/ToastContext";
import { InputSwitch, InputSwitchChangeEvent } from "primereact/inputswitch";
import ExceptionHandler from "../../exceptionHandler/ExceptionHandler";
import { Dropdown } from "primereact/dropdown";
import AppHeader from "../../components/AppHeader";
import { DataTable } from "primereact/datatable";
import { UserDto } from "../../dto/UserDto";
import { Column } from "primereact/column";
import { BtnTemplate, SpinnerTemplate } from "../../components/Templates";
import { CustomButton } from "../../components/CustomButton";
import MultipleActionButtonBase from "../../components/MultipleActionButtonBase";
import { UpdateUser } from "../../services/Userservice";

export default function EditCustomer() {
    const [t] = useTranslation();
    const navigate = useNavigate();
    const setToast = useToast();
    const [selectedAddress, setSelectedAddress] = useState<AddressDto | null>(null);
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerDto | null>(null);
    const [wantNotifications, setWantNotifications] = useState<boolean>(true);
    const [selectedNotificationSettings, setSelectedNotificationSettings] = useState<{ name: string, enum: ExpirationReminderSetting } | null>(null);
    const [users, setUsers] = useState<UserDto[]>([]);

    const notificationOptions = [
        { name: t("customer.edit.reminders.singleEmail"), enum: ExpirationReminderSetting.singleEmail },
        { name: t("customer.edit.reminders.individualEmails"), enum: ExpirationReminderSetting.individualEmails }
    ]

    const requiredFields = [
        { name: "customerName", value: selectedCustomer?.customerName },
        { name: "searchName", value: selectedCustomer?.searchName },
        { name: "debtorNumber", value: selectedCustomer?.debtorNumber },
        { name: "phoneNumber", value: selectedCustomer?.phoneNumber },
        { name: "email", value: selectedCustomer?.email },
        { name: "streetName", value: selectedAddress?.streetName },
        { name: "houseNumber", value: selectedAddress?.houseNumber },
        { name: "postalCode", value: selectedAddress?.postalCode },
        { name: "city", value: selectedAddress?.city },
        { name: "country", value: selectedAddress?.country },
    ];

    const conditionallyRequired = [
        { name: "certificateEmailSettings", value: selectedNotificationSettings },
        { name: "certificateExpirationReminder", value: selectedCustomer?.certificateExpirationReminder },
    ];

    useEffect(() => {
        const customerID = parseInt(window.location.pathname.split("/").pop()!);

        GetAllUsersByCustomerID(customerID).then((response: any) => {
            setUsers(response.data);
        }).catch((error) => {
            ExceptionHandler(error, t);
        });

        GetCustomerByID(customerID).then((response: any) => {
            setSelectedCustomer(response.data);
            GetAddressByID(response.data.addressID).then((response: any) => {
                setSelectedAddress(response.data);
            }).catch((error) => {
                ExceptionHandler(error, t);
            });
            if (response.data.certificateExpirationReminder < 1) {
                setWantNotifications(false);
            }
            const currentNotificationSetting = notificationOptions.find(
                (setting) => setting.enum === response.data.certificateEmailSettings
            );

            if (currentNotificationSetting) {
                setSelectedNotificationSettings(currentNotificationSetting);
            }
        }).catch((error) => {
            ExceptionHandler(error, t);
        });

    }, []);

    function UpdateCustomer(e: any) {
        e.preventDefault();

        if (!CheckRequiredFields()) return;

        const formData = {
            email: selectedCustomer?.email,
            debtorNumber: selectedCustomer?.debtorNumber,
            searchName: selectedCustomer?.searchName,
            customerName: selectedCustomer?.customerName,
            phoneNumber: selectedCustomer?.phoneNumber,
            faxNumber: selectedCustomer?.faxNumber,
            certificateEmailSettings: wantNotifications // If wantNotifications is true, put in the 
                ? selectedNotificationSettings?.enum
                : 0,
            certificateExpirationReminder: wantNotifications
                ? selectedCustomer?.certificateExpirationReminder
                : 0,
            logoID: selectedCustomer?.logoID,
            addressID: selectedCustomer?.addressID,
        };

        UpdateCustomerByID(selectedCustomer?.id, formData).then((response: any) => {
            setToast({
                closable: true,
                severity: 'success',
                summary: t("userFeedback.success.customers.customerEditedHeader"),
                detail: t("userFeedback.success.customers.customerEdited", { customerName: response.data.customerName }),
                life: 4000
            });
            NavCustomer();
        }).catch((error) => {
            ExceptionHandler(error, t);
        });
    }

    function CheckRequiredFields() {
        requiredFields.forEach((field) => {
            const inputField = document.getElementById(field.name);
            inputField?.classList.remove(global.missingInput);
        });

        let missingFields = requiredFields
            .filter((field) => !field.value)
            .map((field) => field.name);

        if (wantNotifications) {
            conditionallyRequired.forEach((field) => {
                const inputField = document.getElementById(field.name);
                inputField?.classList.remove(global.missingInput);
            });

            const conditionallyMissing = conditionallyRequired
                .filter((field) => !field.value)
                .map((field) => field.name);

            missingFields = [...missingFields, ...conditionallyMissing];
        }

        if (missingFields.length > 0) {
            setToast({
                closable: true,
                severity: "error",
                summary: t("userFeedback.errors.missingRequiredFieldsHeader"),
                detail: t("userFeedback.errors.missingRequiredFields"),
                life: 4000,
            });
            missingFields.map((mf) => {
                const missingInputField = document.getElementById(mf);
                if (missingInputField)
                    missingInputField.classList.add(global.missingInput);
            });
            return false;
        }

        return true;
    }

    function NavCustomer() {
        navigate("/customer");
    }

    function DeleteCustomer() {
        DeleteCustomerByID(selectedCustomer?.id).then((response: any) => {
            setToast({
                closable: true,
                severity: 'success',
                summary: t("userFeedback.success.customers.customerDeletedHeader"),
                detail: t("userFeedback.success.customers.customerDeleted", { customerName: response.data.customerName }),
                life: 4000
            });
            navigate("/customer");
        }).catch((error) => {
            ExceptionHandler(error, t);
        });
    }

    const handleChange = (e: any) => {
        const value = e.target.value;
        setSelectedCustomer({
            ...selectedCustomer,
            [e.target.name]: value
        });
    };

    const handleChangeAddress = (e: any) => {
        const value = e.target.value;
        setSelectedAddress({
            ...selectedAddress,
            [e.target.name]: value
        });
    };

    function removeUser(user: UserDto) {
        user.customerID = undefined;
        user.passwordHashType = 1;
        UpdateUser(user).then(() => {
            setToast({
                closable: true,
                severity: 'success',
                summary: t("userFeedback.success.customers.customerEditedHeader"),
                detail: t("userFeedback.success.customers.customerEdited", { customerName: selectedCustomer?.customerName }),
                life: 4000
            });

            GetAllUsersByCustomerID(selectedCustomer?.id).then((response: any) => {
                setUsers(response.data);
            }).catch((error) => {
                ExceptionHandler(error, t);
            });
        }).catch((error) => {
            ExceptionHandler(error, t);
        });
    }


    const deleteButton: CustomButton = {
        onClick: DeleteCustomer,
        type: "button",
        content: t("buttons.delete")
    }
    const closeButton: CustomButton = {
        onClick: NavCustomer,
        type: "button",
        content: t("buttons.close")
    }
    const createButton: CustomButton = {
        type: "submit",
        content: t("buttons.save")
    }

    return (
        <AppHeader title={t("customer.edit.editCustomerHeader")}>
            {selectedAddress == undefined && (
                <SpinnerTemplate />
            )}
            <form onSubmit={UpdateCustomer}>
                <div className={`${global.gridContainer}`}>
                    <div className={global.formContainer}>
                        <div className={styles.subcontainer}>
                            <p className={global.headerStyle}>{t("customer.edit.customerDetails")}</p>
                            <div className={global.fieldGroup}><label>{t("customer.edit.customerName")}</label>
                                <input
                                    id="customerName"
                                    type="text"
                                    value={selectedCustomer?.customerName}
                                    onChange={handleChange}
                                    name="customerName"
                                    placeholder={t("customer.edit.customerName")} />
                            </div>
                            <div className={global.fieldGroup}><label>{t("customer.edit.customerSearchName")}</label>
                                <input
                                    id="searchName"
                                    type="text"
                                    value={selectedCustomer?.searchName}
                                    onChange={handleChange}
                                    name="searchName"
                                    placeholder={t("customer.edit.customerSearchName")} />
                            </div>
                            <div className={global.fieldGroup}><label>{t("customer.edit.debtorNumber")}</label>
                                <input
                                    id="debtorNumber"
                                    type="text"
                                    value={selectedCustomer?.debtorNumber}
                                    onChange={handleChange}
                                    name="debtorNumber"
                                    placeholder={t("customer.edit.debtorNumber")} />
                            </div>
                            <div className={global.fieldGroup}><label>{t("contactInformation.phone")}</label>
                                <input
                                    id="phoneNumber"
                                    value={selectedCustomer?.phoneNumber}
                                    onChange={handleChange}
                                    name="phoneNumber"
                                    placeholder="+31 06 12345678" />
                            </div>
                            <div className={global.fieldGroup}><label>{t("contactInformation.fax")}</label>
                                <input
                                    id="faxNumber"
                                    value={selectedCustomer?.faxNumber}
                                    onChange={handleChange}
                                    name="faxNumber" placeholder="+31 06 12345678" />
                            </div>
                        </div>
                    </div>

                    <div className={global.formContainer}>
                        <div className={styles.subcontainer}>
                            <p className={global.headerStyle}>{t("contactInformation.address")}</p>
                            <div className={global.fieldGroup}>
                                <label>{t("contactInformation.streetName")}</label>
                                <input
                                    id="streetName"
                                    type="text"
                                    value={selectedAddress?.streetName}
                                    onChange={handleChangeAddress}
                                    name="streetName"
                                    placeholder={t("contactInformation.streetName")} />
                            </div>
                            <div className={global.fieldGroup}>
                                <label>{t("contactInformation.houseNumber")}</label>
                                <input
                                    id="houseNumber"
                                    type="number"
                                    value={selectedAddress?.houseNumber}
                                    onChange={handleChangeAddress}
                                    name="houseNumber"
                                    placeholder={t("contactInformation.houseNumber")} />
                            </div>
                            <div className={global.fieldGroup}>
                                <label>{t("contactInformation.affix")}</label>
                                <input
                                    id="addition"
                                    type="text"
                                    value={selectedAddress?.addition}
                                    onChange={handleChangeAddress}
                                    name="addition"
                                    placeholder={t("contactInformation.affix")} />
                            </div>
                            <div className={global.fieldGroup}>
                                <label>{t("contactInformation.zipCode")}</label>
                                <input
                                    id="postalCode"
                                    type="text"
                                    value={selectedAddress?.postalCode}
                                    onChange={handleChangeAddress}
                                    name="postalCode"
                                    placeholder={t("contactInformation.zipCode")}
                                    maxLength={6} />
                            </div>
                            <div className={global.fieldGroup}>
                                <label>{t("contactInformation.city")}</label>
                                <input
                                    id="city"
                                    type="text"
                                    value={selectedAddress?.city}
                                    onChange={handleChangeAddress}
                                    name="city"
                                    placeholder={t("contactInformation.city")} />
                            </div>
                            <div className={global.fieldGroup}>
                                <label>{t("contactInformation.country")}</label>
                                <input
                                    id="country"
                                    type="text"
                                    value={selectedAddress?.country}
                                    onChange={handleChangeAddress}
                                    name="country"
                                    placeholder={t("contactInformation.country")} />
                            </div>
                        </div>
                    </div>

                    <div className={global.formContainer}>
                        <div className={styles.subcontainer}>
                            <p className={global.headerStyle}>{t("customer.edit.reminders.remindersHeader")}</p>
                            <div className={global.fieldGroup}>
                                <label>{t("contactInformation.email")}</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={selectedCustomer?.email}
                                    onChange={handleChange}
                                    name="email"
                                    placeholder={"user@example.com"} />
                            </div>

                            <div className={global.fieldGroup}>
                                <label>{t("customer.edit.reminders.wantsNotifications")}</label>
                                <div className={global.fieldItem}>
                                    <InputSwitch checked={wantNotifications} onChange={(e: InputSwitchChangeEvent) => setWantNotifications(e.value)} />
                                </div>
                            </div>

                            {wantNotifications &&
                                <>
                                    <div className={global.fieldGroup}>  <label>{t("customer.edit.reminders.methodology")}</label>
                                        <Dropdown
                                            value={selectedNotificationSettings}
                                            onChange={(e) => setSelectedNotificationSettings(e.value)}
                                            className={global.dropdownStyle}
                                            options={notificationOptions}
                                            optionLabel="name"
                                            name="certificateEmailSettings"
                                            id="certificateEmailSettings" />
                                    </div>
                                    <div className={global.fieldGroup}>
                                        <label>{t("customer.edit.reminders.term.label")}</label>
                                        <input
                                            id="certificateExpirationReminder"
                                            value={selectedCustomer?.certificateExpirationReminder}
                                            onChange={handleChange}
                                            name="certificateExpirationReminder"
                                            placeholder={t("customer.edit.reminders.term.placeholder")}
                                            type={"number"} />
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                    <div className={global.formContainer}>
                        <div className={styles.subcontainer}>
                            <p className={global.headerStyle}>{t("customer.edit.connectedUsers")}</p>
                            <div className={global.fieldGroup}>
                                <DataTable
                                    className={`${styles.userTable} ${global.orangestripe}`}
                                    scrollable
                                    scrollHeight="160px"
                                    value={users}
                                    emptyMessage={t("user.table.noUsersFound")}
                                    resizableColumns
                                >
                                    <Column field="firstName" header={t("user.table.name")} filter />
                                    <Column field="infix" header={t("contactInformation.affix")} filter />
                                    <Column field="lastName" header={t("user.table.lastName")} filter />
                                    <Column
                                        field=""
                                        header=""
                                        className={global.utilitybtn}
                                        body={(user: UserDto) => (
                                            <BtnTemplate
                                                item={user}
                                                onClick={(e) => navigate(`/user/edit/${e.id}`)}
                                                icon="fa-solid fa-pen-to-square"
                                                alt={t("customer.dashboard.icons.editUser")}
                                            />
                                        )}
                                    />
                                    <Column
                                        field=""
                                        header=""
                                        className={global.utilitybtn}
                                        body={(user: UserDto) => (
                                            <BtnTemplate
                                                item={user}
                                                onClick={(e) => removeUser(e)}
                                                icon="fa-solid fa-trash-can"
                                                alt={t("customer.dashboard.icons.uncoupleUser")}
                                            />
                                        )}
                                    />
                                </DataTable>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.buttonPositions}>
                    <div className={styles.buttonPos}>
                        <MultipleActionButtonBase actionButton={deleteButton} confirmationButton={createButton} />
                    </div>
                    <div className={styles.buttonPos2}>
                        <MultipleActionButtonBase cancelButton={closeButton} />
                    </div>
                </div>
            </form>
        </AppHeader>
    );
};

