/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { GetCustomerByID } from "../../services/Customerservices";
import { Button } from "primereact/button";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../css/AddTicketLocation.module.css";
import global from "../../css/global.module.css";

import { TicketDto } from "../../dto/TicketDto";
import { CreateAddress, GetAddressByID } from "../../services/AddressService";
import { AddressDto } from "../../dto/AddressDto";
import { useTranslation } from "react-i18next";
import AppHeader from "../../components/AppHeader";
import ExceptionHandler from "../../exceptionHandler/ExceptionHandler";
import { useToast } from "../../components/ToastContext";
import { SpinnerTemplate } from "../../components/Templates";

export default function AddTicketFirst() {
    const [t] = useTranslation();
    const [creatingTicket, setCreatingTicket] = useState<TicketDto | null>(null);
    const navigate = useNavigate();
    const [selectedAddressCustomer, setSelectedAddressCustomer] = useState<AddressDto | null>(null);
    const location = useLocation();
    const [selectedCompanyAddress, setSelectedCompanyAddress] = useState<AddressDto | null>(null);
    const [newAddress, setNewAddress] = useState<AddressDto | null>(null);
    const addressIDCompany = 5;
    const setToast = useToast();
    const [checks, setChecks] = useState({
        companyCheck: false,
        customerCheck: false,
        newCheck: false,
    });

    function navigateBack() {
        navigate("/ticket/create/addCustomer", { state: creatingTicket });
    }

    useEffect(() => {
        if (location.state.addressID != null && location.state.addressID != undefined) {
            GetCustomerByID(location.state.customerID).then((response: any) => {
                if (location.state.addressID == addressIDCompany) {
                    setChecks({
                        ...checks,
                        companyCheck: true,
                        customerCheck: false,
                        newCheck: false,
                    });
                }
                else if (location.state.addressID == response.data.addressID) {
                    setChecks({
                        ...checks,
                        companyCheck: false,
                        customerCheck: true,
                        newCheck: false,
                    });
                } else {
                    GetAddressByID(location.state.addressID).then((response: any) => {
                        setChecks({
                            ...checks,
                            companyCheck: false,
                            customerCheck: false,
                            newCheck: true,
                        });
                        setNewAddress(response.data);
                    }).catch((error) => {
                        ExceptionHandler(error, t);
                    });
                }
            }).catch((error) => {
                ExceptionHandler(error, t);
            });
        }

        setCreatingTicket(location.state[0]);
        if (location.state[0] == null) {
            setCreatingTicket(location.state);
        };
        GetCustomerByID(location.state.customerID).then((response: any) => {
            GetAddressByID(response.data.addressID).then((response: any) => {
                setSelectedAddressCustomer(response.data);
            }).catch((error) => {
                ExceptionHandler(error, t);
            });
            //TODO: change 5 to id of the smitpolyweb addressID
            GetAddressByID(addressIDCompany).then((response: any) => {
                setSelectedCompanyAddress(response.data);
            }).catch((error) => {
                ExceptionHandler(error, t);
            });
        }).catch((error) => {
            ExceptionHandler(error, t);
        });
    }, []);

    function handleSubmit() {
        if (creatingTicket != null) {
            if (checks.companyCheck) {
                creatingTicket.addressID = selectedCompanyAddress?.id;
                navigate("/ticket/create/addCertificates", { state: creatingTicket });
            }
            else if (checks.customerCheck) {
                creatingTicket.addressID = selectedAddressCustomer?.id;
                navigate("/ticket/create/addCertificates", { state: creatingTicket });
            }
            else if (checks.newCheck) {
                const formData = {
                    streetName: newAddress?.streetName,
                    houseNumber: newAddress?.houseNumber,
                    addition: newAddress?.addition,
                    postalCode: newAddress?.postalCode,
                    city: newAddress?.city,
                    country: newAddress?.country,
                }

                CreateAddress(formData).then((response: any) => {
                    creatingTicket.addressID = response.data.id;
                    navigate("/ticket/create/addCertificates", { state: creatingTicket });
                }).catch((error) => {
                    ExceptionHandler(error, t);
                });
            } else {
                setToast({
                    closable: true,
                    severity: 'error',
                    summary: t("tickets.noAddressSelected"),
                    detail: t("tickets.noAddressSelectedMsg"),
                    life: 4000
                });

            }
        }
    };

    function handleSubmitNext() {
        if (creatingTicket != null) {
            if (checks.companyCheck) {
                creatingTicket.addressID = selectedCompanyAddress?.id;
                navigate("/ticket/create/scheduleTicket", { state: creatingTicket });
            }
            else if (checks.customerCheck) {
                creatingTicket.addressID = selectedAddressCustomer?.id;
                navigate("/ticket/create/scheduleTicket", { state: creatingTicket });
            }
            else if (checks.newCheck) {
                const formData = {
                    streetName: newAddress?.streetName,
                    houseNumber: newAddress?.houseNumber,
                    addition: newAddress?.addition,
                    postalCode: newAddress?.postalCode,
                    city: newAddress?.city,
                    country: newAddress?.country,
                }

                CreateAddress(formData).then((response: any) => {
                    creatingTicket.addressID = response.data.id;
                    navigate("/ticket/create/scheduleTicket", { state: creatingTicket });
                }).catch((error) => {
                    ExceptionHandler(error, t);
                });
            } else {
                setToast({
                    closable: true,
                    severity: 'error',
                    summary: t("tickets.noAddressSelected"),
                    detail: t("tickets.noAddressSelectedMsg"),
                    life: 4000
                });

            }
        }
    };

    function handleChange(e: any) {
        const value = e.target.value;
        setNewAddress({
            ...newAddress,
            [e.target.name]: value
        });
        setChecks({
            ...checks,
            newCheck: true,
            companyCheck: false,
            customerCheck: false,
        });
    };

    function handleCheckChange(e: any) {
        const { name, checked } = e.target;
        if (name == "companyCheck") {
            setChecks({
                ...checks,
                [name]: checked,
                customerCheck: false,
                newCheck: false,
            });
        }
        else if (name == "customerCheck") {
            setChecks({
                ...checks,
                [name]: checked,
                companyCheck: false,
                newCheck: false,
            });
        } else if (name == "newCheck") {
            setChecks({
                ...checks,
                [name]: checked,
                companyCheck: false,
                customerCheck: false,
            });
        }
    };

    function navigateLast() {
        navigate("/ticket/create/addCustomer", { state: creatingTicket });
    }

    return (
        <AppHeader
            actionTitle={t("tickets.addTicketLocation.steps.stepHeader")}
            actionComponent={
                <ul className={`${"dotstyle dotstyle-fillup"}`}>
                    <li>
                        <a className={`${styles.link}`} onClick={navigateLast}>
                            {t("tickets.addTicketLocation.steps.customerSelect")}
                        </a>
                    </li>
                    <li>
                        <a
                            className={`${styles.link} ${styles.current}`}
                            href="/ticket/create/addLocation"
                        >
                            {t("tickets.addTicketLocation.steps.location")}
                        </a>
                    </li>
                    <li>
                        <a className={`${styles.link}`} onClick={handleSubmit}>
                            {t("tickets.addTicketLocation.steps.selectCertificate")}
                        </a>
                    </li>
                    <li>
                        <a className={`${styles.link}`} onClick={handleSubmitNext}>
                            {t("tickets.addTicketLocation.steps.schedule")}
                        </a>
                    </li>
                </ul>
            }
            title={t("tickets.addTicketLocation.locationHeader")}
        >
            {selectedCompanyAddress == undefined && (
                <SpinnerTemplate />
            )}
            <div className={styles.locationContainer}>
                <div className={global.formContainer}>
                    <div className={styles.locationField}>
                        <h2 className={global.headerStyle}>{t("tickets.addTicketLocation.inspectionLocation")}</h2>
                        <input className={styles.checkBoxStyle} type="checkbox" name="companyCheck" checked={checks.companyCheck} onChange={handleCheckChange} /><p className={styles.textStyle}>{t("tickets.addTicketLocation.ownLocation")} {selectedCompanyAddress?.streetName} {selectedCompanyAddress?.houseNumber} {selectedCompanyAddress?.city}</p>
                        <input className={styles.checkBoxStyle} type="checkbox" name="customerCheck" checked={checks.customerCheck} onChange={handleCheckChange} /><p className={styles.textStyle}>{t("tickets.addTicketLocation.customerLocation")} {selectedAddressCustomer?.streetName} {selectedAddressCustomer?.houseNumber} {selectedAddressCustomer?.city}</p>
                        <input className={styles.checkBoxStyle} type="checkbox" name="newCheck" checked={checks.newCheck} onChange={handleCheckChange} /><p className={styles.textStyle}>{t("tickets.addTicketLocation.otherLocation")}</p>
                    </div>
                </div>


                <div className={styles.row}>
                    <div className={styles.fieldStyle}>
                        <label>{t("contactInformation.streetName")}</label>
                        <br />
                        <input value={newAddress?.streetName} name="streetName" onChange={handleChange} />
                    </div>

                    <div className={styles.fieldStyle}>
                        <label>{t("contactInformation.houseNumber")}</label>
                        <br />
                        <input value={newAddress?.houseNumber} name="houseNumber" onChange={handleChange} />
                    </div>

                    <div className={styles.fieldStyle}>
                        <label>{t("contactInformation.affix")}</label>
                        <br />
                        <input value={newAddress?.addition} name="addition" onChange={handleChange} />
                    </div>
                </div>


                <div className={styles.row}>
                    <div className={styles.fieldStyle}>
                        <label>{t("contactInformation.zipCode")}</label>
                        <br />
                        <input value={newAddress?.postalCode} name="postalCode" onChange={handleChange} />
                    </div>

                    <div className={styles.fieldStyle}>
                        <label>{t("contactInformation.city")}</label>
                        <br />
                        <input value={newAddress?.city} name="city" onChange={handleChange} />
                    </div>

                    <div className={styles.fieldStyle}>
                        <label>{t("contactInformation.country")}</label>
                        <br />
                        <input value={newAddress?.country} name="country" onChange={handleChange} />
                    </div>

                </div>
            </div>

            <div className={styles.buttonContainer}>
                <Button onClick={navigateBack} className={global.lastButton}> &#9664; {t("buttons.previous")}</Button>
                <Button onClick={handleSubmit} className={global.nextButton}>{t("buttons.next")} &#9655;</Button>
            </div>
        </AppHeader>
    );
}