/* eslint-disable @typescript-eslint/no-explicit-any */
import { Column } from "primereact/column"
import { DataTable, DataTableFilterMeta } from "primereact/datatable"
import { useEffect, useState } from "react";
import { GetAllCertificates, GetCertificateByID } from "../../services/CertificateService";
import { Button } from "primereact/button";
import { useLocation, useNavigate } from "react-router";
import { FilterMatchMode } from "primereact/api";
import styles from "../../css/AddTicketCertificate.module.css";
import { CertificateDto, Status } from "../../dto/CertificateDto";
import { useTranslation } from "react-i18next";
import { TicketDto } from "../../dto/TicketDto";
import ExceptionHandler from "../../exceptionHandler/ExceptionHandler";
import AppHeader from "../../components/AppHeader";
import global from "../../css/global.module.css";
import { SpinnerTemplate } from "../../components/Templates";

export default function AddTicketCertificate() {
    let temp = 1;
    const [t] = useTranslation();
    const [creatingTicket, setCreatingTicket] = useState<TicketDto | null>(null);
    const [certificates, setCertificates] = useState([]);
    const [selectedCertificates, setSelectedCertificates] = useState<CertificateDto[]>([]);
    const navigate = useNavigate();
    const location = useLocation();
    const [loading] = useState<boolean>(false);

    const [filters] = useState<DataTableFilterMeta>({
        id: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        certificateType: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        debtorNumber: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        customerID: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        extraInfo: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        description: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });

    function navigateBack() {
        if (creatingTicket != null) {
            navigate("/ticket/create/addLocation", { state: creatingTicket });
        }
    }

    function navigateNext() {
        navigate("/ticket/create/scheduleTicket", { state: creatingTicket });
    }

    function handleSubmit() {
        const tempList: number[] = [];
        if (selectedCertificates != null) {
            for (let i: number = selectedCertificates.length - 1; i >= 0; i--) {
                const id: number | undefined = selectedCertificates[i].id;
                if (id)
                    tempList.push(id);
            }
            if (creatingTicket != null) {
                creatingTicket.certificates = tempList;
                navigate("/ticket/create/scheduleTicket", { state: creatingTicket });
            }
        }
        navigate("/ticket/create/scheduleTicket", { state: creatingTicket });
    };

    function selectCerts() {
        const tempList: CertificateDto[] = [];
        if (location.state.certificates != null && location.state.certificates != undefined) {
            location.state.certificates.forEach((id: number) =>
                GetCertificateByID(id).then((response: any) => {
                    tempList.push(response.data);
                }).catch((error) => {
                    ExceptionHandler(error, t);
                }));
        }
        setSelectedCertificates(tempList);
    }

    useEffect(() => {
        if (temp == 1) {
            temp++;
            selectCerts();
        }

        setCreatingTicket(location.state);
        GetAllCertificates().then((response: any) => {
            setCertificates(response.data);
        }).catch((error) => {
            ExceptionHandler(error, t);
        });
    }, []);

    const statusTemplate = (rowData: CertificateDto) => {
        if (rowData.status !== undefined && Status[rowData.status]) {
            switch (rowData.status) {
                case 0: {
                    return (
                        <div className={`${styles.holdtogether}`}>
                            <div className={`${styles.badge} ${styles.redbadge}`} /><div>{t(`certificates.status.${Status[rowData.status]}`)}</div>
                        </div>
                    );
                }
                case 1: {
                    return (
                        <div className={`${styles.holdtogether}`}>
                            <div className={`${styles.badge} ${styles.blackbadge}`} /><div>{t(`certificates.status.${Status[rowData.status]}`)}</div>
                        </div>
                    );
                }
                case 2: {
                    return (
                        <div className={`${styles.holdtogether}`}>
                            <div className={`${styles.badge} ${styles.graybadge}`} /><div>{t(`certificates.status.${Status[rowData.status]}`)}</div>
                        </div>
                    );
                }
                case 3: {
                    if (rowData.expirationDate) {
                        const expirationDate = new Date(rowData.expirationDate);
                        const in2Months: Date = new Date();
                        in2Months.setMonth(in2Months.getMonth() + 2);
                        if (expirationDate < in2Months) {
                            return (
                                <div className={`${styles.holdtogether}`}>
                                    <div className={`${styles.badge} ${styles.orangebadge}`} />
                                    <div>Due soon</div>
                                </div>
                            );
                        }
                    }
                    return (
                        <div className={`${styles.holdtogether}`}>
                            <div className={`${styles.badge} ${styles.greenbadge}`} />
                            <div>{t(`certificates.status.${Status[rowData.status]}`)}</div>
                        </div>
                    );
                }
            }
        }
        return `${"Unknown"}`;
    };

    return (
        <AppHeader
            title={t("tickets.addTicketCertificates.selectCertificatesHeader")}
            actionTitle={t("tickets.navigation.createTicketHeader")}
            actionComponent={
                <ul className={`${"dotstyle dotstyle-fillup"}`}>
                    <li>
                        <a className={`${styles.link}`} href="/ticket/create/addCustomer">
                            {t("tickets.navigation.selectCustomer")}
                        </a>
                    </li>
                    <li>
                        <a
                            className={`${styles.link} ${styles.current}`}
                            href="/ticket/create/addLocation"
                        >
                            {t("tickets.navigation.location")}
                        </a>
                    </li>
                    <li>
                        <a className={`${styles.link}`} href="/ticket/create/addCertificates">
                            {t("tickets.navigation.selectCertificates")}
                        </a>
                    </li>
                    <li>
                        <a className={`${styles.link}`} href="/ticket/create/scheduleTicket">
                            {t("tickets.navigation.schedule")}
                        </a>
                    </li>
                </ul>
            }
        >
            {certificates.length == 0 && (
                <SpinnerTemplate />
            )}
            <DataTable
                className={styles.certificateTable}
                value={certificates}
                selectionMode={'multiple'}
                selection={selectedCertificates!}
                onSelectionChange={(e: any) => setSelectedCertificates(e.value)}
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10]}
                paginatorPosition="bottom"
                tableStyle={{ minWidth: '50rem' }}
                filters={filters}
                filterDisplay="row"
                loading={loading}
                emptyMessage={t("tickets.addTicketCertificates.noCertificatesFound")}
                resizableColumns>
                <Column selectionMode="multiple" />
                <Column field="registrationNumber" header={t("tickets.addTicketCertificates.certificate")} filter />
                <Column field="status" header={t("tickets.addTicketCertificates.certificateType")} body={statusTemplate} filter />
                <Column field="debtorNumber" header={t("tickets.addTicketCertificates.debtor")} filter />
                <Column field="customerReferenceNumber" header={t("tickets.addTicketCertificates.customerReferenceNumber")} filter />
                <Column field="extraInfo" header={t("tickets.addTicketCertificates.extraInfo")} filter />
                <Column field="description" header={t("tickets.addTicketCertificates.description")} filter />
            </DataTable>

            <div className={styles.buttonContainer}>
            <Button onClick={navigateBack} className={global.lastButton}> &#9664; {t("buttons.previous")}</Button>
                <Button onClick={navigateNext} className={global.nextButton}>{t("buttons.skip")} &#9655;</Button>
                <Button onClick={handleSubmit} className={global.nextButton}>{t("buttons.next")} &#9655;</Button>
            </div>
        </AppHeader>
    );
}