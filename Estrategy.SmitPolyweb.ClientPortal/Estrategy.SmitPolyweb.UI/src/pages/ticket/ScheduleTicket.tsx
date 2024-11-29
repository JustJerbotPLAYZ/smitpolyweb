/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "../../css/AddTicketAgenda.module.css";
import { useLocation, useNavigate } from "react-router";
import { TicketDto } from "../../dto/TicketDto";
import { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { UserDto } from "../../dto/UserDto";
import GetAllUsers, { GetUserByID } from "../../services/Userservice";
import { CreateTicket } from "../../services/TicketService";
import { Button } from "primereact/button";
import AppHeader from "../../components/AppHeader";
import ExceptionHandler from "../../exceptionHandler/ExceptionHandler";
import { CreateCertificateTicket } from "../../services/CertificateTicketService";
import moment from "moment";

export default function ScheduleTicket() {
    const [t] = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [creatingTicket, setCreatingTicket] = useState<TicketDto | null>(null);
    const [users, setUsers] = useState<UserDto[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);

    useEffect(() => {
        GetAllUsers().then((response: any) => {
            setUsers(response.data);
        }).catch((error) => {
            ExceptionHandler(error, t);
        });

        setCreatingTicket(location.state);
        if (location.state.userID != null) {
            GetUserByID(location.state.userID).then((response: any) => {
                setSelectedUser(response.data);
            }).catch((error) => {
                ExceptionHandler(error, t);
            });
        }
    }, []);

    const handleChange = (e: any) => {
        const value = e.target.value;
        setCreatingTicket({
            ...creatingTicket,
            [e.target.name]: value
        });
    };

    function CreateTicketFunction() {
       
        const formData = {
            status: 0,
            articleID: 1,
            ticketNumber: creatingTicket?.ticketNumber,
            description: creatingTicket?.description,
            scheduled: creatingTicket?.scheduled,
            customerID: creatingTicket?.customerID,
            customerSearchName: creatingTicket?.customerSearchName,
            userID: selectedUser?.id,
            userFirstName: selectedUser?.firstName,
            addressID: creatingTicket?.addressID,
        };

        CreateTicket(formData).then((response: any) => {
            if (creatingTicket?.certificates?.length != 0 && creatingTicket != undefined && creatingTicket.certificates != undefined)
                for (let i: number = creatingTicket.certificates.length - 1; i >= 0; i--) {
                    const formData = {
                        certificateID: creatingTicket.certificates[i],
                        ticketID: response.data.id
                    }
                    CreateCertificateTicket(formData).catch((error) => {
                        ExceptionHandler(error, t);
                    });
                }
            navigate("/ticket");
        }).catch((error) => {
            ExceptionHandler(error, t);
        });
    };

    function navigateCustomer() {
        navigate("/ticket/create/addCustomer", { state: creatingTicket });
    }

    function navigateBack() {
        if (creatingTicket != null && selectedUser != null)
            creatingTicket.userID = selectedUser.id;
        navigate("/ticket/create/addCertificates", { state: creatingTicket })
    }

    function navigateToLocation() {
        if (creatingTicket != null && selectedUser != null)
            creatingTicket.userID = selectedUser.id;
        navigate("/ticket/create/addLocation", { state: creatingTicket })
    }

    return (
        <AppHeader
            title="Agenda"
            actionComponent={
                <ul className={`${"dotstyle dotstyle-fillup"}`}>
                    <li>
                        <a className={`${styles.link}`} onClick={navigateCustomer}>
                            {t("tickets.navigation.selectCustomer")}
                        </a>
                    </li>
                    <li>
                        <a className={`${styles.link}`} onClick={navigateToLocation}>
                            {t("tickets.navigation.location")}
                        </a>
                    </li>
                    <li>
                        <a className={`${styles.link}`} onClick={navigateBack}>
                            {t("tickets.navigation.selectCertificates")}
                        </a>
                    </li>
                    <li>
                        <a
                            className={`${styles.link} ${styles.current}`}
                            href="/ticket/create/scheduleTicket"
                        >
                            {t("tickets.navigation.schedule")}
                        </a>
                    </li>
                </ul>
            }
            actionTitle={t("tickets.navigation.createTicketHeader")}
        >
            <h4>moet nog worden aangepast naar agenda waar deze fields in worden verwerkt, vertalingen moeten hierna hier ook nog bijkomen</h4>
            <label>Gebruiker </label>
            <Dropdown className={styles.dropdownStyle} value={selectedUser} onChange={(e) => setSelectedUser(e.value)} options={users} optionLabel="email"
                filter placeholder={t("contactInformation.email")} required />
            <br />

            <label>Ingepland voor</label>
            <input max={moment().format('YYYY-MM-DD')}  value={creatingTicket?.scheduled?.toString()} name="scheduled" type="date" onChange={handleChange}></input>
            <br />

            <label>Ticketnummer</label>
            <input value={creatingTicket?.ticketNumber} type="number" name="ticketNumber" onChange={handleChange}></input>
            <br />
            <button onClick={CreateTicketFunction}>opslaan</button>
            <Button onClick={navigateBack} className={styles.lastButton}> &#9664; Vorige</Button>
        </AppHeader>
    );
};