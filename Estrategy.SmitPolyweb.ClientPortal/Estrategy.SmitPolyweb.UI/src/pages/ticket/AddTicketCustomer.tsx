/* eslint-disable @typescript-eslint/no-explicit-any */
import { Column } from "primereact/column";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { useEffect, useState } from "react";
import { GetAllCustomersWithAddress, GetCustomerByID } from "../../services/Customerservices";
import { Button } from "primereact/button";
import { useLocation, useNavigate } from "react-router-dom";
import { FilterMatchMode } from "primereact/api";
import styles from "../../css/AddTicketCustomer.module.css";
import { TicketDto } from "../../dto/TicketDto";
import { CustomerWithAddressDto } from "../../dto/CustomerDto";
import { useTranslation } from "react-i18next";
import ExceptionHandler from "../../exceptionHandler/ExceptionHandler";
import AppHeader from "../../components/AppHeader";
import global from "../../css/global.module.css";
import { SpinnerTemplate } from "../../components/Templates";


export default function AddTicketFirst() {
    const [t] = useTranslation();
    const [creatingTicket, setCreatingTicket] = useState<TicketDto>({});
    const [customersWithAddress, setCustomersWithAddress] = useState<CustomerWithAddressDto[]>([]);
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerWithAddressDto | null>(null);
    const [filters] = useState<DataTableFilterMeta>({
        customerName: { value: null, matchMode: FilterMatchMode.CONTAINS },
        addressID: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [loading] = useState<boolean>(false);

    function navigateBack() {
        navigate("/ticket");
    }

    function navigateNext() {
        if (creatingTicket != null && selectedCustomer != null) {
            if (selectedCustomer.id != null) {
                creatingTicket.customerID = selectedCustomer.id;
                creatingTicket.customerSearchName = selectedCustomer.searchName;
            }
            navigate("/ticket/create/addLocation", { state: creatingTicket });
        }
    }

    useEffect(() => {
        if (location.state?.customerID != null && location.state?.customerID != undefined) {
            setCreatingTicket(location.state);
            GetCustomerByID(location.state?.customerID).then((response: any) => {
                setSelectedCustomer(response.data);
            }).catch((error) => {
                ExceptionHandler(error, t);
            });
        }
        GetAllCustomersWithAddress().then((response: any) => {
            setCustomersWithAddress(response.data);
        }).catch((error) => {
            ExceptionHandler(error, t);
        });
    }, []);

    const handleChange = (e: any) => {
        const value = e.target.value;
        setCreatingTicket({
            ...creatingTicket,
            [e.target.name]: value
        });
    };

    return (
        <AppHeader
            title={t("tickets.addTicketCustomer.selectCustomer")}
            actionTitle={t("tickets.addTicketCustomer.createTicketHeader")}
            actionComponent={
                <ul className={`${"dotstyle dotstyle-fillup"}`}>
                    <li>
                        <a
                            className={`${styles.link} ${styles.current}`}
                            href="/ticket/create/addCustomer"
                        >
                            {t("tickets.navigation.selectCustomer")}
                        </a>
                    </li>
                    <li>
                        <a className={`${styles.link}`} onClick={navigateNext}>
                            {t("tickets.navigation.location")}
                        </a>
                    </li>
                    <li>
                        <a className={`${styles.link}`} href="">
                            {t("tickets.navigation.selectCertificates")}
                        </a>
                    </li>
                    <li>
                        <a className={`${styles.link}`} href="">
                            {t("tickets.navigation.schedule")}
                        </a>
                    </li>
                </ul>
            }
        >
            <DataTable
                className={styles.customerTable}
                value={customersWithAddress}
                selectionMode="single"
                selection={selectedCustomer}
                onSelectionChange={(e: any) => setSelectedCustomer(e.value)}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10]}
                paginatorPosition="bottom"
                filters={filters}
                filterDisplay="row"
                loading={loading}
                emptyMessage={t("tickets.addTicketCustomer.noCustomersFound")}
                resizableColumns>
                <Column selectionMode="single" />
                <Column field="customerName" header={t("tickets.addTicketCustomer.table.customerName")} filter />
                <Column field="city" header={t("tickets.addTicketCustomer.table.location")} filter />
            </DataTable>
            {customersWithAddress.length == 0 && (
                <SpinnerTemplate />
            )}
            <p className={styles.descriptionText}>{t("tickets.addTicketCustomer.addOptionalDescription")}</p>
            <textarea
                value={creatingTicket?.description}
                name="description"
                onChange={handleChange}
                className={styles.inputStyle} />
            <br />

            <div className={styles.buttonContainer}>
            <Button onClick={navigateBack} className={global.lastButton}> &#9664; {t("buttons.previous")}</Button>
                <Button onClick={navigateNext} className={global.nextButton}>{t("buttons.next")} &#9655;</Button>
            </div>
        </AppHeader>

    );
}