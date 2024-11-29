/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    GetFilteredCertificates,
    UpdateCertificateByID,
} from "../../services/CertificateService";
import React, { FormEvent, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Column, ColumnEditorOptions, ColumnEvent } from "primereact/column";
import { DataTable, DataTableFilterMeta, DataTableStateEvent } from "primereact/datatable";
import { FilterMatchMode } from "primereact/api";
import {
    CertificateDto,
    FilteredCertificateDto,
    Status,
} from "../../dto/CertificateDto";
import { BtnTemplate, SpinnerTemplate, StatusTemplate } from "../../components/Templates";

import ColumnMeta from "../../types/ColumnMeta.interface";

import styles from "../../css/Certificate.module.css";
import global from "../../css/global.module.css";
import { useTranslation } from "react-i18next";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { InputText } from "primereact/inputtext";
import { OverlayPanel } from "primereact/overlaypanel";
import { useToast } from "../../components/ToastContext";
import ExceptionHandler from "../../exceptionHandler/ExceptionHandler";
import AppHeader from "../../components/AppHeader";
import MultipleActionButtonBase from "../../components/MultipleActionButtonBase";
import { CustomButton } from "../../components/CustomButton";



export default function Certificate() {
    const [t] = useTranslation();
    const setToast = useToast();
    const op = useRef<OverlayPanel>(null); // Overlay Panel referentoggle
    const navigate = useNavigate();
    const [certificates, setCertificates] = useState<CertificateDto[]>([]);
    const [selectedCertificates, setSelectedCertificates] = useState<CertificateDto[]>([]);
    const [backupCertificates, setBackupCertificates] = useState<CertificateDto[]>([]);
    const [rowClick] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(true);
    const [rows, setRows] = useState<number>(25);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [first, setFirst] = useState<number>(0);
    const [lastPage, setLastPage] = useState<number>(1);
    const roleName = localStorage.getItem("roleName")?.toLowerCase();
    const debtorNumberRef = useRef<HTMLInputElement>(null);
    const customerReferenceNumberRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLInputElement>(null);
    const customerSearchNameRef = useRef<HTMLInputElement>(null);
    const registrationNumberRef = useRef<HTMLInputElement>(null);
    const searchDateRef = useRef<HTMLInputElement>(null);

    const statusTranslations: string[] = [
        t("certificates.dashboard.actions.filtering.expired"),
        t("certificates.dashboard.actions.filtering.rejected"),
        t("certificates.dashboard.actions.filtering.notInUse"),
        t("certificates.dashboard.actions.filtering.duringMonths"),
        t("certificates.dashboard.actions.filtering.afterMonths2")
    ]

    const [filters, setFilters] = useState<DataTableFilterMeta>({
        registrationNumber: { value: null, matchMode: FilterMatchMode.CONTAINS },
        status: { value: null, matchMode: FilterMatchMode.CONTAINS },
        debtorNumber: { value: null, matchMode: FilterMatchMode.CONTAINS },
        customerSearchName: { value: null, matchMode: FilterMatchMode.CONTAINS },
        customerReferenceNumber: { value: null, matchMode: FilterMatchMode.CONTAINS },
        extraInfo: { value: null, matchMode: FilterMatchMode.CONTAINS },
        description: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const [data, setData] = useState<FilteredCertificateDto>({
        amount: rows,
        toskip: first,
        allCertificates: true,
        debtorNumber: "",
        customerReferenceNumber: "",
        description: "",
        customerSearchName: "",
        extraInfo: "",
        registrationNumber: 0,
    });


    const columns: ColumnMeta[] = [
        {
            field: "debtorNumber",
            header: t("certificates.dashboard.table.debtorNumber"),
            editorEnabled: false,
        },
        {
            field: "customerSearchName",
            header: t("certificates.dashboard.table.customerSearchName"),
            editorEnabled: false,
        },
        {
            field: "customerReferenceNumber",
            header: t("certificates.dashboard.table.customerReferenceNumber"),
            editorEnabled: true,
        },
        {
            field: "extraInfo",
            header: t("certificates.dashboard.table.extraInfo"),
            editorEnabled: false,
        },
        {
            field: "description",
            header: t("certificates.dashboard.table.description"),
            editorEnabled: false,
        },
    ];

    const [visibleColumns, setVisibleColumns] = useState<ColumnMeta[]>(columns);

    useEffect(() => {
        updateCertificates(data);
        setLoading(false);
    }, []);

    const updateCertificates = (formData: FilteredCertificateDto) => {
        setLoading(true);
        GetFilteredCertificates(formData)
            .then((response?: any) => {
                if (response) {
                    setCertificates(response.data.entities);
                    setBackupCertificates(response.data.entities);
                    setTotalRecords(response.data.totalRecords);
                }
                setLoading(false);
            })
            .catch((error) => {
                ExceptionHandler(error, t);
                setLoading(false);
            });
    };

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        const formData = {
            amount: rows,
            toskip: first,

            registrationNumber: Number(registrationNumberRef.current?.value) || undefined,
            debtorNumber: debtorNumberRef.current?.value || undefined,
            customerSearchName: customerSearchNameRef.current?.value || undefined,
            customerReferenceNumber: customerReferenceNumberRef.current?.value || undefined,
            description: descriptionRef.current?.value || undefined,
            searchDate: searchDateRef.current?.value || undefined,
            allCertificates: data?.allCertificates,
            afterMonth: data?.afterMonth,
            duringMonth: data?.duringMonth,
            expired: data?.expired,
            disapproved: data?.disapproved,
            outofOrder: data?.outofOrder,
        };
        updateCertificates(formData);
    }

    function handleCheckChange(e: any) {
        const { name, checked } = e.target;
        let formData: FilteredCertificateDto = {
            amount: rows,
            toskip: first,

            registrationNumber: Number(registrationNumberRef.current?.value) || undefined,
            debtorNumber: debtorNumberRef.current?.value || undefined,
            customerSearchName: customerSearchNameRef.current?.value || undefined,
            customerReferenceNumber: customerReferenceNumberRef.current?.value || undefined,
            description: descriptionRef.current?.value || undefined,
            searchDate: searchDateRef.current?.value || undefined
        }
        if (name == "allCertificates" && checked === true) {
            formData = {
                ...formData,
                allCertificates: true,
                afterMonth: false,
                duringMonth: false,
                expired: false,
                disapproved: false,
                outofOrder: false,
            };
        } else if (checked === true) {
            formData = {
                ...formData,
                [name]: checked,
                allCertificates: false,
            };


        } else {
            formData = {
                ...formData,
                [name]: checked,
            };
        }
        setData(formData);
        updateCertificates(formData);
    }

    const clearForm = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (registrationNumberRef.current) registrationNumberRef.current.value = '';
        if (debtorNumberRef.current) debtorNumberRef.current.value = '';
        if (customerSearchNameRef.current) customerSearchNameRef.current.value = '';
        if (customerReferenceNumberRef.current) customerReferenceNumberRef.current.value = '';
        if (descriptionRef.current) descriptionRef.current.value = '';
        if (searchDateRef.current) searchDateRef.current.value = '';

        const formData: FilteredCertificateDto = {
            amount: rows,
            toskip: first,

            registrationNumber: undefined,
            debtorNumber: undefined,
            customerSearchName: undefined,
            customerReferenceNumber: undefined,
            description: undefined,
            searchDate: undefined,
            allCertificates: true,
            afterMonth: false,
            duringMonth: false,
            expired: false,
            disapproved: false,
            outofOrder: false,
        };

        setData(formData);
        updateCertificates(formData);
    }

    function MarkOutOfOrder() {
        if (selectedCertificates && certificates) {
            let amount = 0;
            const updatedCertificates = certificates.map((cert: CertificateDto) => {
                if (
                    selectedCertificates.some(
                        (selectedCert: CertificateDto) =>
                            selectedCert.id === cert.id && cert.status !== Status.OutofOrder
                    )
                ) {
                    const updatedCert = { ...cert, status: Status.OutofOrder };

                    UpdateCertificateByID(updatedCert.id, updatedCert)
                        .catch((error) => {
                            ExceptionHandler(error, t);
                        });
                    amount++;
                    return updatedCert;
                }
                return cert;
            });
            if (amount > 0) {
                setCertificates(updatedCertificates);
                setToast({
                    closable: true,
                    severity: "success",
                    summary: t("certificates.dashboard.markOutOfOrder.toast", { amount: amount }),
                    life: 4000
                });

                setSelectedCertificates([]);
            }
        }
    }

    function handleClick(certificate: CertificateDto) {
        const roleName = localStorage.getItem("roleName")?.toLowerCase();
        if (certificate)
            if (roleName == "admin" || roleName == "mechanic")
                navigate(`/certificate/edit/${certificate.id}`);
    }

    const onColumnToggle = (event: MultiSelectChangeEvent) => {
        const selectedColumns = event.value;
        const orderedSelectedColumns = columns.filter((col) =>
            selectedColumns.some((sCol: any) => sCol.field === col.field)
        );

        setVisibleColumns(orderedSelectedColumns);
    };

    const updateReferenceNumbers = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newRefNum = (e.currentTarget[0] as HTMLInputElement).value;

        if (selectedCertificates && certificates) {
            let amount = 0;
            const updatedCertificates = certificates.map((cert: CertificateDto) => {
                if (selectedCertificates.some((selectedCert) => selectedCert.id === cert.id && selectedCert.customerReferenceNumber !== newRefNum)) {
                    const updatedCert = { ...cert, customerReferenceNumber: newRefNum };

                    UpdateCertificateByID(updatedCert.id, updatedCert)
                        .catch((error) => {
                            ExceptionHandler(error, t);
                        });
                    amount++;
                    return updatedCert;
                }
                return cert;
            });
            if (amount > 0) {
                setCertificates(updatedCertificates);
                setToast({
                    closable: true,
                    severity: "success",
                    summary: t("certificates.dashboard.updateReferenceNumber.toast", { amount: amount }),
                    life: 4000
                });

                setSelectedCertificates([]);
            }
        }
    };

    function getTemplateOnRole(rolename: string | undefined) {
        if (rolename == "admin" || rolename == "mechanic") {
            return (
                <div>
                    <i className={`${global.utilitybtn} fa-solid fa-pen-to-square`} title={t("paginator.icons.editSelection")} onClick={() => { if (selectedCertificates) handleClick(selectedCertificates[0]); }} />
                    <i className={`${global.utilitybtn} fa-solid fa-ban`} title={t("certificates.dashboard.paginator.icons.markOutOfOrder")} onClick={() => MarkOutOfOrder()} />
                    <i className={`${global.utilitybtn} fa-solid fa-link`} title={t("certificates.dashboard.paginator.icons.updateReferenceNumber")} onClick={(e) => op.current?.toggle(e)} />
                    <i className={`${global.utilitybtn} ${global.disabled} fa-solid fa-magnifying-glass`} title={t("paginator.icons.showSelection")} onClick={notImplemented} />
                    <i className={`${global.utilitybtn} ${global.disabled} fa-solid fa-print`} title={t("paginator.icons.printSelection")} onClick={notImplemented} />
                    <i className={`${global.utilitybtn} ${global.disabled} fa-solid fa-envelopes`} title={t("paginator.icons.sendSelection")} onClick={notImplemented} />
                    <i className={`${global.utilitybtn} ${global.disabled} fa-solid fa-list`} title={t("paginator.icons.printList")} onClick={notImplemented} />
                </div>
            );
        } else if (rolename == "customer") {
            return (
                <div>
                    <i className={`${global.utilitybtn} fa-solid fa-ban`} title={t("certificates.dashboard.paginator.icons.markOutOfOrder")} onClick={() => MarkOutOfOrder()} />
                    <i className={`${global.utilitybtn} fa-solid fa-link`} title={t("certificates.dashboard.paginator.icons.updateReferenceNumber")} onClick={(e) => op.current?.toggle(e)} />
                    <i className={`${global.utilitybtn} ${global.disabled} fa-solid fa-magnifying-glass`} title={t("paginator.icons.showSelection")} onClick={notImplemented} />
                    <i className={`${global.utilitybtn} ${global.disabled} fa-solid fa-print`} title={t("paginator.icons.printSelection")} onClick={notImplemented} />
                    <i className={`${global.utilitybtn} ${global.disabled} fa-solid fa-envelopes`} title={t("paginator.icons.sendSelection")} onClick={notImplemented} />
                    <i className={`${global.utilitybtn} ${global.disabled} fa-solid fa-list`} title={t("paginator.icons.printList")} onClick={notImplemented} />
                </div>
            );
        } else if (rolename == "customerread") {
            return (
                <div>
                    <i className={`${global.utilitybtn} ${global.disabled} fa-solid fa-magnifying-glass`} title={t("paginator.icons.showSelection")} onClick={notImplemented} />
                    <i className={`${global.utilitybtn} ${global.disabled} fa-solid fa-print`} title={t("paginator.icons.printSelection")} onClick={notImplemented} />
                    <i className={`${global.utilitybtn} ${global.disabled} fa-solid fa-envelopes`} title={t("paginator.icons.sendSelection")} onClick={notImplemented} />
                    <i className={`${global.utilitybtn} ${global.disabled} fa-solid fa-list`} title={t("paginator.icons.printList")} onClick={notImplemented} />
                </div>
            );
        }
    }

    const paginatorTemplate = () => {
        const rolename = localStorage.getItem("roleName")?.toLowerCase();
        return (
            <>
                <div className={"utilities"}>

                    {getTemplateOnRole(rolename)}

                    <OverlayPanel ref={op} closeOnEscape dismissable={true}>
                        <form className={`${styles.editRefNum} ${global.centercontentvertical}`} onSubmit={(e) => updateReferenceNumbers(e)}>
                            <label>
                                {t("certificates.dashboard.updateReferenceNumber.title")}
                            </label>
                            <div>
                                <input type={"text"} className={`p-inputtext`} name="referenceNumber" />
                                <button type="submit" className={`${global.utilitybtn}`}>
                                    <i className={`${global.utilitybtn} pi pi-save`} title={t("certificates.dashboard.updateReferenceNumber.saveIcon")} />
                                </button>
                            </div>
                        </form>
                    </OverlayPanel>
                </div>
                <div className={`${global.holdtogether} layout`}>
                    <p>{t("paginator.rowsToDisplay")}</p>
                    <MultiSelect value={visibleColumns} options={columns} optionLabel="header" onChange={onColumnToggle}
                        className="w-full sm:w-20rem" display="comma" selectedItemsLabel={t("paginator.rowsSelectedMsg")} placeholder={t("paginator.noRowsSelected")} maxSelectedLabels={0} />
                </div>
            </>
        );
    };

    const onCellEditComplete = (e: ColumnEvent) => {
        const newCert: CertificateDto = e.rowData;
        newCert.customerReferenceNumber = e.newValue;
        UpdateCertificateByID(newCert.id, newCert).then((response: any) => {
            setToast({
                closable: true,
                severity: 'success',
                summary: t("userFeedback.success.certificates.certificateEditedHeader"),
                detail: t("userFeedback.success.certificates.certificateEdited", { registrationNumber: response.data.registrationNumber }),
                life: 4000
            });

        })
            .catch((error) => {
                ExceptionHandler(error, t);
            });
    };

    function notImplemented() {
        return alert(t("errors.notImplemented"));
    }

    const cellEditor = (options: ColumnEditorOptions) => {
        return numberEditor(options);
    };

    const numberEditor = (options: ColumnEditorOptions) => {
        return (
            <InputText type={"text"} value={options.value} onKeyDown={(e) => e.stopPropagation()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (options.editorCallback) options.editorCallback(e.target.value);
                }}
            />
        );
    };

    const handleFilters = (e: any) => {
        let tempCertificates = [...backupCertificates];

        // Check customerReferenceNumber filter
        if (e.filters.customerReferenceNumber?.value) {
            tempCertificates = tempCertificates.filter((cert) =>
                cert.customerReferenceNumber?.includes(e.filters.customerReferenceNumber.value)
            );
        }

        // Check customerSearchName filter
        if (e.filters.customerSearchName?.value) {
            tempCertificates = tempCertificates.filter((cert) =>
                cert.customerSearchName?.includes(e.filters.customerSearchName.value)
            );
        }

        // Check debtorNumber filter
        if (e.filters.debtorNumber?.value) {
            tempCertificates = tempCertificates.filter((cert) =>
                cert.debtorNumber?.includes(e.filters.debtorNumber.value)
            );
        }

        // Check description filter
        if (e.filters.description?.value) {
            tempCertificates = tempCertificates.filter((cert) =>
                cert.description?.includes(e.filters.description.value)
            );
        }

        // Check extraInfo filter
        if (e.filters.extraInfo?.value) {
            tempCertificates = tempCertificates.filter((cert) =>
                cert.extraInfo?.includes(e.filters.extraInfo.value)
            );
        }

        // Check registrationNumber filter
        if (e.filters.registrationNumber?.value) {
            tempCertificates = tempCertificates.filter((cert) =>
                cert.registrationNumber?.toString().includes(e.filters.registrationNumber.value?.toString())
            );
        }

        // Check status filter
        if (e.filters.status?.value) {
            const searchStatus = e.filters.status.value.toLowerCase();

            tempCertificates = tempCertificates.filter((cert) => {
                const certStatusTranslation = cert.status ? statusTranslations[cert.status]?.toLowerCase() : "";
                return certStatusTranslation?.includes(searchStatus);
            });
        }

        // Set the filtered certificates
        setCertificates(tempCertificates);
        setFilters(e.filters);
    };

    const handlePagination = (e: DataTableStateEvent) => {
        let updatedData = { ...data };
        let dataChanged = false;

        if (e.rows !== rows) {
            setRows(e.rows);
            updatedData = {
                ...updatedData,
                amount: e.rows,
            };
            dataChanged = true;
        }

        if (e.first !== first) {
            setFirst(e.first);
            updatedData = {
                ...updatedData,
                toskip: e.first,
            };
            dataChanged = true;
        }

        if (e.page !== lastPage) {
            setLastPage(e.page!);
            dataChanged = true;
        }

        if (dataChanged) {
            updateCertificates(updatedData);
            setData(updatedData);
        }
    };

    function navigateCreateCertificate() {
        navigate("/certificate/create");
    }

    const createButton: CustomButton = {
        type: "button",
        onClick: navigateCreateCertificate,
        content: t("buttons.add"),
    }

    function addButtonFunction() {
        if (roleName == "admin" || roleName == "mechanic") {
            return (
                <div className={styles.buttonContainer}>
                    <MultipleActionButtonBase confirmationButton={createButton} />
                </div>
            );
        }

    }
    //if (certificates.length == 0) {
    //    return (

    //    <AppHeader
    //        title={t("certificates.dashboard.table.certificatesHeader")}
    //        actionTitle={t("certificates.dashboard.actions.searching.actionHeader")}
    //        actionComponent={
    //            <div className={styles.actionField}>
    //                <p className={styles.searchTitle}>
    //                    {t("certificates.dashboard.actions.searching.search")}
    //                </p>
    //                <form id="customForm" onSubmit={handleSubmit} className={global.formgroup} >
    //                    <label>
    //                        {t("certificates.dashboard.actions.searching.certificate")}
    //                    </label>

    //                    <input
    //                        name="registrationNumber"
    //                        ref={registrationNumberRef}
    //                        type="number"
    //                        className={`${styles.inputFields} ${global.searchicon}`}
    //                    />
    //                    <label>{t("certificates.dashboard.actions.searching.debtor")}</label>
    //                    <input
    //                        name="debtorNumber"
    //                        ref={debtorNumberRef}
    //                        type="text"
    //                        className={`${styles.inputFields} ${global.searchicon}`}
    //                    />
    //                    <label>
    //                        {t("certificates.dashboard.actions.searching.customer")}
    //                    </label>
    //                    <input
    //                        name="customerSearchName"
    //                        ref={customerSearchNameRef}
    //                        type="text"
    //                        className={`${styles.inputFields} ${global.searchicon}`}
    //                    />
    //                    <label>
    //                        {t("certificates.dashboard.actions.searching.reference")}
    //                    </label>
    //                    <input
    //                        name="customerReferenceNumber"
    //                        ref={customerReferenceNumberRef}
    //                        type="text"
    //                        className={`${styles.inputFields} ${global.searchicon}`}
    //                    />
    //                    <label>
    //                        {t("certificates.dashboard.actions.searching.description")}
    //                    </label>
    //                    <input
    //                        name="description"
    //                        ref={descriptionRef}
    //                        type="text"
    //                        className={`${styles.inputFields} ${global.searchicon}`}
    //                    />
    //                    <label>{t("certificates.dashboard.actions.searching.from")}</label>
    //                    <input
    //                        name="searchDate"
    //                        ref={searchDateRef}
    //                        type="date"
    //                        className={`${styles.dateInput}`}
    //                    />
    //                    <button
    //                        type="submit"
    //                        className={`${global.btn} 
    //                        ${styles.searchButton}`}>
    //                        {t("buttons.searchAction")} &#128898;
    //                    </button>
    //                    <button
    //                        type="reset"
    //                        onClick={clearForm}
    //                        className={`${global.btn} ${styles.resetButton}`} >
    //                        {t("buttons.clear")} &#8634;
    //                    </button>
    //                </form>
    //                <p className={global.title}>
    //                    {t("certificates.dashboard.actions.filtering.filter")}
    //                </p>
    //                <div className={styles.formgroup}>
    //                    <div>
    //                        <input checked={!!data?.allCertificates} name="allCertificates" id="allCertificates" onChange={handleCheckChange}
    //                            type="checkbox" className={global.checkboxblue} />
    //                        <label htmlFor={"allCertificates"} className={global.clickable}>
    //                            {" "} {t("certificates.dashboard.actions.filtering.allCertificates")}
    //                        </label>
    //                    </div>
    //                    <div>
    //                        <input
    //                            checked={!!data?.afterMonth}
    //                            name="afterMonth"
    //                            id="valid"
    //                            onChange={handleCheckChange}
    //                            type="checkbox"
    //                            className={global.checkboxblue}
    //                        />
    //                        <label htmlFor="valid" className={global.clickable}>
    //                            <div className={`${global.badge} ${global.greenbadge}`} />{" "}
    //                            {t("certificates.dashboard.actions.filtering.afterMonths")}
    //                        </label>
    //                    </div>
    //                    <div>
    //                        <input
    //                            checked={!!data?.duringMonth}
    //                            name="duringMonth"
    //                            id="duringMonth"
    //                            onChange={handleCheckChange}
    //                            type="checkbox"
    //                            className={global.checkboxblue}
    //                        />
    //                        <label htmlFor="duringMonth" className={global.clickable}>
    //                            <div className={`${global.badge} ${global.orangebadge}`} />{" "}
    //                            {t("certificates.dashboard.actions.filtering.duringMonths")}
    //                        </label>
    //                    </div>
    //                    <div>
    //                        <input
    //                            checked={!!data?.expired}
    //                            name="expired"
    //                            id="expired"
    //                            onChange={handleCheckChange}
    //                            type="checkbox"
    //                            className={global.checkboxblue}
    //                        />
    //                        <label htmlFor="expired" className={global.clickable}>
    //                            <div className={`${global.badge} ${global.redbadge}`} />{" "}
    //                            {t("certificates.dashboard.actions.filtering.expired")}
    //                        </label>
    //                    </div>
    //                    <div>
    //                        <input
    //                            checked={!!data?.disapproved}
    //                            name="disapproved"
    //                            id="disaproved"
    //                            onChange={handleCheckChange}
    //                            type="checkbox"
    //                            className={global.checkboxblue}
    //                        />
    //                        <label htmlFor="disaproved" className={global.clickable}>
    //                            <div className={`${global.badge} ${global.blackbadge}`} />{" "}
    //                            {t("certificates.dashboard.actions.filtering.rejected")}
    //                        </label>
    //                    </div>
    //                    <div>
    //                        <input
    //                            checked={!!data?.outofOrder}
    //                            name="outofOrder"
    //                            id="outofOrder"
    //                            onChange={handleCheckChange}
    //                            type="checkbox"
    //                            className={global.checkboxblue}
    //                        />
    //                        <label htmlFor="outofOrder" className={global.clickable}>
    //                            <div className={`${global.badge} ${global.graybadge}`} />{" "}
    //                            {t("certificates.dashboard.actions.filtering.notInUse")}
    //                        </label>
    //                    </div>
    //                </div>
    //            </div>}
    //        key="test"
    //    >
    //        </AppHeader>
    //    );
    //}

    return (
        <AppHeader
            title={t("certificates.dashboard.table.certificatesHeader")}
            actionTitle={t("certificates.dashboard.actions.searching.actionHeader")}
            actionComponent={
                <div className={styles.actionField}>
                    <p className={styles.searchTitle}>
                        {t("certificates.dashboard.actions.searching.search")}
                    </p>
                    <form id="customForm" onSubmit={handleSubmit} className={global.formgroup} >
                        <label>
                            {t("certificates.dashboard.actions.searching.certificate")}
                        </label>

                        <input
                            name="registrationNumber"
                            ref={registrationNumberRef}
                            type="number"
                            className={`${styles.inputFields} ${global.searchicon}`}
                        />
                        <label>{t("certificates.dashboard.actions.searching.debtor")}</label>
                        <input
                            name="debtorNumber"
                            ref={debtorNumberRef}
                            type="text"
                            className={`${styles.inputFields} ${global.searchicon}`}
                        />
                        <label>
                            {t("certificates.dashboard.actions.searching.customer")}
                        </label>
                        <input
                            name="customerSearchName"
                            ref={customerSearchNameRef}
                            type="text"
                            className={`${styles.inputFields} ${global.searchicon}`}
                        />
                        <label>
                            {t("certificates.dashboard.actions.searching.reference")}
                        </label>
                        <input
                            name="customerReferenceNumber"
                            ref={customerReferenceNumberRef}
                            type="text"
                            className={`${styles.inputFields} ${global.searchicon}`}
                        />
                        <label>
                            {t("certificates.dashboard.actions.searching.description")}
                        </label>
                        <input
                            name="description"
                            ref={descriptionRef}
                            type="text"
                            className={`${styles.inputFields} ${global.searchicon}`}
                        />
                        <label>{t("certificates.dashboard.actions.searching.from")}</label>
                        <input
                            name="searchDate"
                            ref={searchDateRef}
                            type="date"
                            className={`${styles.dateInput}`}
                        />
                        <button
                            type="submit"
                            className={`${global.btn} 
                            ${styles.searchButton}`}>
                            {t("buttons.searchAction")} &#128898;
                        </button>
                        <button
                            type="reset"
                            onClick={clearForm}
                            className={`${global.btn} ${styles.resetButton}`} >
                            {t("buttons.clear")} &#8634;
                        </button>
                    </form>
                    <p className={global.title}>
                        {t("certificates.dashboard.actions.filtering.filter")}
                    </p>
                    <div className={styles.formgroup}>
                        <div>
                            <input checked={!!data?.allCertificates} name="allCertificates" id="allCertificates" onChange={handleCheckChange}
                                type="checkbox" className={global.checkboxblue} />
                            <label htmlFor={"allCertificates"} className={global.clickable}>
                                {" "} {t("certificates.dashboard.actions.filtering.allCertificates")}
                            </label>
                        </div>
                        <div>
                            <input
                                checked={!!data?.afterMonth}
                                name="afterMonth"
                                id="valid"
                                onChange={handleCheckChange}
                                type="checkbox"
                                className={global.checkboxblue}
                            />
                            <label htmlFor="valid" className={global.clickable}>
                                <div className={`${global.badge} ${global.greenbadge}`} />{" "}
                                {t("certificates.dashboard.actions.filtering.afterMonths")}
                            </label>
                        </div>
                        <div>
                            <input
                                checked={!!data?.duringMonth}
                                name="duringMonth"
                                id="duringMonth"
                                onChange={handleCheckChange}
                                type="checkbox"
                                className={global.checkboxblue}
                            />
                            <label htmlFor="duringMonth" className={global.clickable}>
                                <div className={`${global.badge} ${global.orangebadge}`} />{" "}
                                {t("certificates.dashboard.actions.filtering.duringMonths")}
                            </label>
                        </div>
                        <div>
                            <input
                                checked={!!data?.expired}
                                name="expired"
                                id="expired"
                                onChange={handleCheckChange}
                                type="checkbox"
                                className={global.checkboxblue}
                            />
                            <label htmlFor="expired" className={global.clickable}>
                                <div className={`${global.badge} ${global.redbadge}`} />{" "}
                                {t("certificates.dashboard.actions.filtering.expired")}
                            </label>
                        </div>
                        <div>
                            <input
                                checked={!!data?.disapproved}
                                name="disapproved"
                                id="disaproved"
                                onChange={handleCheckChange}
                                type="checkbox"
                                className={global.checkboxblue}
                            />
                            <label htmlFor="disaproved" className={global.clickable}>
                                <div className={`${global.badge} ${global.blackbadge}`} />{" "}
                                {t("certificates.dashboard.actions.filtering.rejected")}
                            </label>
                        </div>
                        <div>
                            <input
                                checked={!!data?.outofOrder}
                                name="outofOrder"
                                id="outofOrder"
                                onChange={handleCheckChange}
                                type="checkbox"
                                className={global.checkboxblue}
                            />
                            <label htmlFor="outofOrder" className={global.clickable}>
                                <div className={`${global.badge} ${global.graybadge}`} />{" "}
                                {t("certificates.dashboard.actions.filtering.notInUse")}
                            </label>
                        </div>
                    </div>
                </div>}
            key="test"
        >
            <div className={global.displayondesktop}>
              

                <DataTable
                    className={`${global.orangestripe} ${styles.certificateTable}`}
                    value={certificates}
                    selection={selectedCertificates!}
                    onSelectionChange={(e: { value: React.SetStateAction<CertificateDto[]>; }) => setSelectedCertificates(e.value)}
                    paginator
                    rows={rows}
                    rowsPerPageOptions={[25, 50, 100]}
                    first={first}
                    paginatorPosition="both"
                    paginatorTemplate={{ layout: 'RowsPerPageDropdown PrevPageLink PageLinks NextPageLink' }}
                    filters={filters}
                    filterDisplay="row"
                    loading={loading}
                    emptyMessage={t("certificates.dashboard.table.noCertificatesFound")}
                    resizableColumns
                    editMode={"cell"}
                    size={"small"}
                    lazy
                    totalRecords={totalRecords}
                    onPage={handlePagination}
                    onFilter={handleFilters}
                    paginatorLeft={paginatorTemplate()}
                    paginatorRight={paginatorTemplate()}
                    selectionMode={rowClick ? null : 'multiple'}
                >
                    <Column selectionMode="multiple" />
                    <Column
                        field="registrationNumber"
                        header={t("certificates.dashboard.table.registrationNumber")}
                        filter
                    />
                    <Column
                        className={"test2"}
                        field="status"
                        header={t("certificates.dashboard.table.status")}
                        body={(certificate: CertificateDto) => (<StatusTemplate rowData={certificate} />)}
                        filter
                    />

                    {visibleColumns.map((col) => (
                        <Column
                            key={col.field}
                            field={col.field}
                            header={col.header}
                            {...(col.editorEnabled ? {
                                editor: (options) => cellEditor(options), onCellEditComplete: onCellEditComplete
                            } : {})}
                            filter
                        />
                    ))}

                    {(localStorage.getItem("roleName")?.toLowerCase() === "admin" || localStorage.getItem("roleName")?.toLowerCase() === "mechanic") &&
                        <Column field="" header="" className={`${global.utilitybtn}`} body={(certificate: CertificateDto) => (<BtnTemplate item={certificate} onClick={handleClick} icon="fa-solid fa-pen-to-square" alt={t("certificates.dashboard.table.buttons.edit")} />)} />
                    }
                    <Column field="" header="" className={`${global.utilitybtn}`} body={(certificate: CertificateDto) => (<BtnTemplate item={certificate} onClick={notImplemented} icon={`fa-solid fa-print ${global.disabled}`} alt={t("certificates.dashboard.table.buttons.print")} />)} />
                    <Column field="" header="" className={`${global.utilitybtn}`} body={(certificate: CertificateDto) => (<BtnTemplate item={certificate} onClick={notImplemented} icon={`fa-solid fa-envelopes ${global.disabled}`} alt={t("certificates.dashboard.table.buttons.email")} />)} />
                </DataTable>
                {certificates.length == 0 && (
                    <SpinnerTemplate/>
                )}
                {addButtonFunction()}
            </div>
        </AppHeader >
    );
}
