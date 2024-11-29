/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "../../css/EditTicket.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { useTranslation } from "react-i18next";
import AppHeader from "../../components/AppHeader";
import { CustomButton } from "../../components/CustomButton";
import MultipleActionButtonBase from "../../components/MultipleActionButtonBase";
import { AddressDto } from "../../dto/AddressDto";
import { ArticleDto } from "../../dto/ArticleDto";
import { CertificateDto } from "../../dto/CertificateDto";
import { CustomerDto } from "../../dto/CustomerDto";
import { TicketDto } from "../../dto/TicketDto";
import { UserDto } from "../../dto/UserDto";
import { GetAddressByID, UpdateAddressByID } from "../../services/AddressService";
import { GetAllArticles, GetArticleByID } from "../../services/ArticleService";
import { GetAllCertificates } from "../../services/CertificateService";
import { GetAllCustomers, GetCustomerByID } from "../../services/Customerservices";
import { UpdateTicketByID, DeleteTicketByID, GetTicketByID } from "../../services/TicketService";
import GetAllUsers, { GetUserByID } from "../../services/Userservice";
import { useToast } from "../../components/ToastContext";
import ExceptionHandler from "../../exceptionHandler/ExceptionHandler";
import { CreateCertificateTicket, GetCertificatesByTicketID, UpdateCertificateTicketByIDs } from "../../services/CertificateTicketService";
import global from "../../css/global.module.css";
import moment from "moment";
import { CertificateTicketDto, CertificateTicketUpdateDto } from "../../dto/CertificateTicketDto";

function EditTicket() {
    const [t] = useTranslation();
    const setToast = useToast();
    const [selectedTicket, setSelectedTicket] = useState<TicketDto | null>(null);
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerDto | null>(null);
    const [selectedCertificates, setSelectedCertificates] = useState<CertificateDto[]>([]);
    const [selectedCertificatesStart, setSelectedCertificatesStart] = useState<CertificateDto[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
    const [selectedAddress, setSelectedAddress] = useState<AddressDto | null>(null);
    const [selectedArticle, setSelectedArticle] = useState<ArticleDto | null>(null);
    const [selectedStatus, setSelectedStatus] = useState({ name: "", value: 0 });
    const [customers, setCustomers] = useState<CustomerDto[]>([]);
    const [articles, setArticles] = useState<ArticleDto[]>([]);
    const [certificates, setCertificates] = useState<CertificateDto[]>([]);
    const [users, setUsers] = useState<UserDto[]>([]);
    //const [status, setStatus] = useState<number>();
    //const [displayStatus, setDisplayStatus] = useState<number>();
    const navigate = useNavigate();

    const statusOptions = [
        { name: t("tickets.status.New"), value: 0 },
        { name: t("tickets.status.Scheduled"), value: 1 },
        { name: t("tickets.status.Completed"), value: 2 },
    ];

    useEffect(() => {
        const url = window.location.pathname.split("/");
        const id = parseInt(url.pop()!);

        GetTicketByID(id).then((response: any) => {
            const ticket = response.data;

            const newDate = moment(ticket.scheduled, 'YYYY-MM-DDTHH:mm:ss.fff Z');
            ticket.scheduled = newDate.format('YYYY-MM-DD');

            setSelectedTicket(response.data);
            setSelectedStatus(response.data.status);

            GetCertificatesByTicketID(response.data.id).then((response: any) => {
                setSelectedCertificates(response.data);
                setSelectedCertificatesStart(response.data);
            }).catch((error) => {
                ExceptionHandler(error, t);
            });

            GetUserByID(ticket.userID).then((response: any) => {
                setSelectedUser(response.data);
            }).catch((error) => {
                ExceptionHandler(error, t);
            });
            GetArticleByID(ticket.articleID).then((response: any) => {
                setSelectedArticle(response.data);
            }).catch((error) => {
                ExceptionHandler(error, t);
            });
            GetAddressByID(ticket.addressID).then((response: any) => {
                setSelectedAddress(response.data);
            }).catch((error) => {
                ExceptionHandler(error, t);
            });
            GetCustomerByID(ticket.customerID).then((response: any) => {
                setSelectedCustomer(response.data);
            }).catch((error) => {
                ExceptionHandler(error, t);
            });

        }).catch((error) => {
            ExceptionHandler(error, t);
        });

        GetAllCustomers().then((response: any) => {
            setCustomers(response.data)
        }).catch((error) => {
            ExceptionHandler(error, t);
        });

        GetAllArticles().then((response: any) => {
            setArticles(response.data);
        }).catch((error) => {
            ExceptionHandler(error, t);
        });

        GetAllCertificates().then((response: any) => {
            setCertificates(response.data);
        }).catch((error) => {
            ExceptionHandler(error, t);
        });

        GetAllUsers().then((response: any) => {
            setUsers(response.data);
        }).catch((error) => {
            ExceptionHandler(error, t);
        });
    }, []);

    function UpdateTicket(e: any) {

        e.preventDefault();

        const formDataAddress = {
            streetName: selectedAddress?.streetName,
            houseNumber: selectedAddress?.houseNumber,
            addition: selectedAddress?.addition,
            postalCode: selectedAddress?.postalCode,
            city: selectedAddress?.city,
            country: selectedAddress?.country,
        };

        UpdateAddressByID(selectedAddress?.id, formDataAddress).catch((error) => {
            ExceptionHandler(error, t);
        });

        const tempCertList: CertificateDto[] = selectedCertificates;
        //Updates CertificateTickets

        if (selectedCertificates != selectedCertificatesStart) {
            if (selectedCertificates.length == selectedCertificatesStart.length || selectedCertificates.length <= selectedCertificatesStart.length) {
                for (let i: number = selectedCertificates.length - 1; i >= 0; i--) {
                    const formData: CertificateTicketUpdateDto = {
                        newCertificateID: selectedCertificates[i].id,
                        newTicketID: selectedTicket?.id,
                        oldCertificateID: selectedCertificatesStart[i].id,
                        oldTicketID: selectedTicket?.id
                    }

                    UpdateCertificateTicketByIDs(formData).catch((error: any) => {
                        ExceptionHandler(error, t);
                    });
                }
            } else if (selectedCertificates.length >= selectedCertificatesStart.length) {
                for (let i: number = selectedCertificatesStart.length - 1; i >= 0; i--) {

                    const formData: CertificateTicketUpdateDto = {
                        newCertificateID: selectedCertificates[i].id,
                        newTicketID: selectedTicket?.id,
                        oldCertificateID: selectedCertificatesStart[i].id,
                        oldTicketID: selectedTicket?.id
                    }

                    const index = tempCertList.indexOf(selectedCertificatesStart[i]);
                    if (index > -1) { 
                        tempCertList.splice(index, 1); 
                    }

                    UpdateCertificateTicketByIDs(formData).catch((error: any) => {
                        ExceptionHandler(error, t);
                    });
                }
                for (let i: number = tempCertList.length - 1; i >= 0; i--) {
                    const formData = {
                        certificateID: tempCertList[i].id,
                        ticketID: selectedTicket?.id
                    }
                    CreateCertificateTicket(formData).catch((error: any) => {
                        ExceptionHandler(error, t);
                    });
                }
            }
        }


        const formData = {
            ticketNumber: selectedTicket?.ticketNumber,
            description: selectedTicket?.description,
            scheduled: selectedTicket?.scheduled,
            status: selectedStatus,
            customerSearchName: selectedCustomer?.searchName,
            userFirstName: selectedUser?.firstName,
            customerID: selectedCustomer?.id,
            userID: selectedUser?.id,
            articleID: selectedArticle?.id,
            addressID: selectedAddress?.id,
        };

        //Updates Ticket
        UpdateTicketByID(selectedTicket?.id, formData).then((response: any) => {
            setToast({
                closable: true,
                severity: 'success',
                summary: t("userFeedback.success.tickets.ticketEditedHeader"),
                detail: t("userFeedback.success.tickets.ticketEdited", { ticketNumber: response.data.ticketNumber }),
                life: 4000
            });

            navigate("/ticket");

        }).catch((error) => {
            ExceptionHandler(error, t);
        });
    }

    const handleChange = (e: any) => {
        const value = e.target.value;
        setSelectedTicket({
            ...selectedTicket,
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

    function NavigateFunction() {
        navigate("/ticket");
    };
    function DeleteTicket() {
        DeleteTicketByID(selectedTicket?.id).then((response: any) => {
            setToast({
                closable: true,
                severity: 'success',
                summary: t("userFeedback.success.tickets.ticketDeletedHeader"),
                detail: t("userFeedback.success.tickets.ticketDeleted", { ticketNumber: response.data.ticketNumber }),
                life: 4000
            });

            navigate("/ticket");
        })
            .catch((error) => {
                ExceptionHandler(error, t);
            });
    }

    const closeButton: CustomButton = {
        type: "button",
        onClick: NavigateFunction,
        content: t("buttons.close")
    }

    const deleteButton: CustomButton = {
        type: "button",
        onClick: DeleteTicket,
        content: t("buttons.delete")
    }

    const saveButton: CustomButton = {
        type: "submit",
        content: t("buttons.save")
    }

    return (
        <AppHeader title={t("tickets.edit.editHeader")}>
            <form name="myForm" onSubmit={UpdateTicket}>
                <div className={global.gridContainer}>

                    <div className={global.formContainer}>
                        <p className={global.headerStyle}>{t("tickets.edit.form.ticketHeader")}</p>

                        <div className={global.fieldGroup}>
                            <label>{t("tickets.edit.form.ticketNumber")}</label>
                            <input value={selectedTicket?.ticketNumber} onChange={handleChange} name="ticketNumber" />
                        </div>

                        <div className={global.fieldGroup}>
                            <label>{t("tickets.edit.form.description")}</label>
                            <input value={selectedTicket?.description} onChange={handleChange} name="description" />
                        </div>

                        <div className={global.fieldGroup}>
                            <label>{t("tickets.edit.form.planned")}</label>
                            <input max={moment().format('YYYY-MM-DD')} value={selectedTicket?.scheduled?.toString()} type="date" onChange={handleChange} name="scheduled" required />
                        </div>

                        <div className={global.fieldGroup}>
                            <label>{t("tickets.edit.form.status")}</label>
                            <Dropdown value={selectedStatus} onChange={(e) => setSelectedStatus(e.value)} options={statusOptions} optionLabel="name" placeholder=""
                                filter className={`${global.dropdownStyle} ${styles.firstInput}`} required />
                        </div>

                        <div className={global.fieldGroup}>
                            <label>{t("tickets.edit.form.customer")}</label>
                            <Dropdown value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.value)} options={customers} optionLabel="customerName" placeholder=""
                                filter className={global.dropdownStyle} required />
                        </div>

                        <div className={global.fieldGroup}>
                            <label>{t("tickets.edit.form.certificates")}</label>
                            <MultiSelect value={selectedCertificates} onChange={(e) => setSelectedCertificates(e.value)} options={certificates} optionLabel="registrationNumber" className={global.dropdownStyle} />
                        </div>

                        <div className={global.fieldGroup}>
                            <label>{t("tickets.edit.form.user")}</label>
                            <Dropdown value={users.find((user) => user.id === selectedUser?.id)} onChange={(e) => setSelectedUser(e.value)} options={users} optionLabel="email" placeholder={t("contactInformation.email")}
                                filter className={global.dropdownStyle} required />
                        </div>

                        <div className={global.fieldGroup}>
                            <label>{t("tickets.edit.form.article")}</label>
                            <Dropdown value={selectedArticle} onChange={(e) => setSelectedArticle(e.value)} options={articles} optionLabel="name" placeholder=""
                                filter className={global.dropdownStyle} required />
                        </div>

                    </div>

                    <div className={global.formContainer}>
                        <p className={global.headerStyle}>{t("contactInformation.address")}</p>

                        <div className={global.fieldGroup}>
                            <label>{t("contactInformation.streetName")}</label>
                            <input value={selectedAddress?.streetName} name="streetname" onChange={handleChangeAddress} />
                        </div>

                        <div className={global.fieldGroup}>
                            <label>{t("contactInformation.zipCode")}</label>
                            <input value={selectedAddress?.houseNumber} name="houseNumber" onChange={handleChangeAddress} />
                        </div>

                        <div className={global.fieldGroup}>
                            <label>{t("contactInformation.affix")}</label>
                            <input value={selectedAddress?.addition} name="addition" onChange={handleChangeAddress} />
                        </div>

                        <div className={global.fieldGroup}>
                            <label>{t("contactInformation.zipCode")}</label>
                            <input value={selectedAddress?.postalCode} name="postalCode" onChange={handleChangeAddress} />
                        </div>

                        <div className={global.fieldGroup}>
                            <label>{t("contactInformation.city")}</label>
                            <input value={selectedAddress?.city} name="city" onChange={handleChangeAddress} />
                        </div>

                        <div className={global.fieldGroup}>
                            <label>{t("contactInformation.country")}</label>
                            <input value={selectedAddress?.country} name="country" onChange={handleChangeAddress} />
                        </div>
                    </div>
                </div>
                <div className={styles.buttonContainer}>
                    <MultipleActionButtonBase cancelButton={closeButton} actionButton={deleteButton} confirmationButton={saveButton} />
                </div>
            </form>
        </AppHeader >
    );
};

export default EditTicket;