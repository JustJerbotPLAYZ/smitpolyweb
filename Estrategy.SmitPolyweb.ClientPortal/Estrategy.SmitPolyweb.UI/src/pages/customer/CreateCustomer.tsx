
/* eslint-disable @typescript-eslint/no-explicit-any */
import global from "../../css/global.module.css";
import styles from "../../css/AddCustomer.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { CreateNewCustomer } from "../../services/Customerservices";
import { AddressDto } from "../../dto/AddressDto";
import { CustomerDto, ExpirationReminderSetting } from "../../dto/CustomerDto";
import { CreateAddress } from "../../services/AddressService";
import { useTranslation } from "react-i18next";
import { useToast } from "../../components/ToastContext";
import { InputSwitch, InputSwitchChangeEvent } from "primereact/inputswitch";
import ExceptionHandler from "../../exceptionHandler/ExceptionHandler";
import { Dropdown } from "primereact/dropdown";
import AppHeader from "../../components/AppHeader";
import { CustomButton } from "../../components/CustomButton";
import MultipleActionButtonBase from "../../components/MultipleActionButtonBase";

export default function CreateCustomer() {
    const [t] = useTranslation();
    const navigate = useNavigate();
    const [selectedAddress, setSelectedAddress] = useState<AddressDto | undefined>({});
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerDto | undefined>({});
    const setToast = useToast();
    const [wantNotifications, setWantNotifications] = useState<boolean>(true);
    const [selectedNotificationSettings, setSelectedNotificationSettings] = useState<{ name: string; enum: ExpirationReminderSetting } | null>(null);

    const notificationOptions = [
        {
            name: t("customer.creation.reminders.singleEmail"),
            enum: ExpirationReminderSetting.singleEmail,
        },
        {
            name: t("customer.creation.reminders.individualEmails"),
            enum: ExpirationReminderSetting.individualEmails,
        },
    ];

    const requiredFields = [
        { name: "customerName", value: selectedCustomer?.customerName },
        { name: "debtorNumber", value: selectedCustomer?.debtorNumber },
        { name: "phoneNumber", value: selectedCustomer?.phoneNumber },
        { name: "searchName", value: selectedCustomer?.searchName },
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

    function CreateCustomerFunction(e: any) {
        e.preventDefault();

        // Check if required fields are filled in, if not => return
        if (!CheckRequiredFields()) return;

        const formDataAddress = {
            streetName: selectedAddress?.streetName,
            houseNumber: selectedAddress?.houseNumber,
            addition: selectedAddress?.addition,
            postalCode: selectedAddress?.postalCode,
            city: selectedAddress?.city,
            country: selectedAddress?.country,
        };


        CreateAddress(formDataAddress)
            .then((response: any) => {
                const formData = {
                    email: selectedCustomer?.email,
                    debtorNumber: selectedCustomer?.debtorNumber,
                    searchName: selectedCustomer?.searchName,
                    customerName: selectedCustomer?.customerName,
                    phoneNumber: selectedCustomer?.phoneNumber,
                    faxNumber: selectedCustomer?.faxNumber,
                    certificateEmailSettings: wantNotifications
                        ? selectedNotificationSettings?.enum
                        : 0,
                    certificateExpirationReminder: wantNotifications
                        ? selectedCustomer?.certificateExpirationReminder
                        : 0,
                    logoID: selectedCustomer?.logoID,
                    addressID: response.data.id,
                };

                CreateNewCustomer(formData)
                    .then((response: any) => {
                        setToast({
                            closable: true,
                            severity: 'success',
                            summary: t("userFeedback.success.customers.customerCreatedHeader"),
                            detail: t("userFeedback.success.customers.customerCreated", { customerName: response.data.customerName }),
                            life: 4000
                        });
                        navigate(`/user/create`, { state: { selectedUserId: response.data.id }});
                    })
                    .catch((error) => {
                        ExceptionHandler(error, t);
                    });
            })
            .catch((error) => {
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


    function Clear() {
        setSelectedCustomer(undefined);
        setSelectedAddress(undefined);
    }

    const handleChange = (e: any) => {
        const value = e.target.value;
        setSelectedCustomer({
            ...selectedCustomer,
            [e.target.name]: value,
        });
    };

    const handleChangeAddress = (e: any) => {
        const value = e.target.value;
        setSelectedAddress({
            ...selectedAddress,
            [e.target.name]: value,
        });
    };

    function navigateCustomer() {
        navigate("/customer");
    }

    const createButton: CustomButton = {
        type: "submit",
        content: t("buttons.create2")
    }

    const clearButton: CustomButton = {
        type: "reset",
        onClick: Clear,
        content: t("buttons.clear")
    }
    const closeButton: CustomButton = {
        type: "button",
        onClick: navigateCustomer,
        content: t("buttons.close")
    }

    return (
        <AppHeader title={t("customer.creation.createCustomerHeader")}>
            <form name="myForm" onSubmit={CreateCustomerFunction}>
                <div className={`${global.gridContainer} ${styles.customerForm}`}>
                    <div className={global.formContainer}>
                        <div className={styles.subcontainer}>
                            <p className={global.headerStyle}>
                                {t("customer.creation.customerDetails")}
                            </p>

                            <div className={global.fieldGroup}>
                                <label>{t("customer.creation.customerName")}</label>
                                <input
                                    id="customerName"
                                    type="text"
                                    value={selectedCustomer?.customerName}
                                    onChange={handleChange}
                                    name="customerName"
                                    placeholder={t("customer.creation.customerName")}
                                />
                            </div>
                            <div className={global.fieldGroup}>
                                <label>{t("customer.creation.customerSearchName")}</label>
                                <input
                                    id="searchName"
                                    type="text"
                                    value={selectedCustomer?.searchName}
                                    onChange={handleChange}
                                    name="searchName"
                                    placeholder={t("customer.creation.customerSearchName")}
                                />
                            </div>
                            <div className={global.fieldGroup}>
                                <label>{t("customer.creation.debtorNumber")}</label>
                                <input
                                    id="debtorNumber"
                                    type="text"
                                    value={selectedCustomer?.debtorNumber}
                                    onChange={handleChange}
                                    name="debtorNumber"
                                    placeholder={t("customer.creation.debtorNumber")}
                                />
                            </div>
                            <div className={global.fieldGroup}>
                                <label>{t("contactInformation.phone")}</label>
                                <input
                                    id="phoneNumber"
                                    value={selectedCustomer?.phoneNumber}
                                    onChange={handleChange}
                                    name="phoneNumber"
                                    placeholder="31 6 12345678"
                                />
                            </div>
                            <div className={global.fieldGroup}>
                                <label>{t("contactInformation.fax")}</label>
                                <input
                                    id="faxNumber"
                                    value={selectedCustomer?.faxNumber}
                                    onChange={handleChange}
                                    name="faxNumber"
                                    placeholder="31 6 12345678"
                                />
                            </div>
                        </div>
                    </div>

                    <div className={global.formContainer}>
                        <div className={styles.subcontainer}>
                            <p className={global.headerStyle}>
                                {t("contactInformation.address")}
                            </p>

                            <div className={global.fieldGroup}>
                                <label>{t("contactInformation.streetName")}</label>
                                <input
                                    id="streetName"
                                    type="text"
                                    value={selectedAddress?.streetName}
                                    onChange={handleChangeAddress}
                                    name="streetName"
                                    placeholder={t("contactInformation.streetName")}
                                />
                            </div>
                            <div className={global.fieldGroup}>
                                <label>{t("contactInformation.houseNumber")}</label>
                                <input
                                    id="houseNumber"
                                    type="number"
                                    value={selectedAddress?.houseNumber}
                                    onChange={handleChangeAddress}
                                    name="houseNumber"
                                    placeholder={t("contactInformation.houseNumber")}
                                />
                            </div>
                            <div className={global.fieldGroup}>
                                <label>{t("contactInformation.affix")}</label>
                                <input
                                    id="addition"
                                    type="text"
                                    value={selectedAddress?.addition}
                                    onChange={handleChangeAddress}
                                    name="addition"
                                    placeholder={t("contactInformation.affix")}
                                />
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
                                    maxLength={6}
                                />
                            </div>
                            <div className={global.fieldGroup}>
                                <label>{t("contactInformation.city")}</label>
                                <input
                                    id="city"
                                    type="text"
                                    value={selectedAddress?.city}
                                    onChange={handleChangeAddress}
                                    name="city"
                                    placeholder={t("contactInformation.city")}
                                />
                            </div>
                            <div className={global.fieldGroup}>
                                <label>{t("contactInformation.country")}</label>
                                <input
                                    id="country"
                                    type="text"
                                    value={selectedAddress?.country}
                                    onChange={handleChangeAddress}
                                    name="country"
                                    placeholder={t("contactInformation.country")}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={global.formContainer}>
                        <div className={styles.subcontainerReminder}>
                            <p className={global.headerStyle}>
                                {t("customer.creation.reminders.remindersHeader")}
                            </p>
                            <div className={global.fieldGroup}>
                                <label>{t("contactInformation.email")}</label>
                                <input
                                    id="email"
                                    type="email"
                                    value={selectedCustomer?.email}
                                    onChange={handleChange}
                                    name="email"
                                    placeholder={"user@example.com"}
                                />
                            </div>

                            <div className={global.fieldGroup}>
                                <label>
                                    {t("customer.creation.reminders.wantsNotifications")}
                                </label>
                                <div className={global.fieldItem}>
                                    <InputSwitch
                                        checked={wantNotifications}
                                        onChange={(e: InputSwitchChangeEvent) =>
                                            setWantNotifications(e.value)
                                        }
                                    />
                                </div>
                            </div>
                            {wantNotifications && (
                                <>
                                    <div className={global.fieldGroup}>
                                        <label>
                                            {t("customer.creation.reminders.methodology")}
                                        </label>
                                        <Dropdown
                                            placeholder={t("customer.creation.reminders.methodology")}
                                            value={selectedNotificationSettings}
                                            onChange={(e) => setSelectedNotificationSettings(e.value)}
                                            className={global.dropdownStyle}
                                            options={notificationOptions}
                                            optionLabel="name"
                                            name="certificateEmailSettings"
                                            id="certificateEmailSettings"
                                        />
                                    </div>
                                    <div className={global.fieldGroup}>
                                        <label>{t("customer.creation.reminders.term.label")}</label>
                                        <input
                                            id="certificateExpirationReminder"
                                            value={selectedCustomer?.certificateExpirationReminder}
                                            onChange={handleChange}
                                            name="certificateExpirationReminder"
                                            placeholder={t("customer.creation.reminders.term.placeholder")}
                                            type={"number"}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.buttonContainer}>
                    <MultipleActionButtonBase cancelButton={closeButton} actionButton={clearButton} confirmationButton={createButton} />
                </div>
            </form>
        </AppHeader>
    );
}
