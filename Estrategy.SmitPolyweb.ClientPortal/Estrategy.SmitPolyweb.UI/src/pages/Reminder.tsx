/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetAllCertificates, GetReminders } from "../services/CertificateService";
import { useState, useEffect } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { FilterMatchMode } from "primereact/api";
import "../css/overrideCss.css";
import styles from "../css/Reminder.module.css";
import global from "../css/global.module.css";
import { Dropdown } from "primereact/dropdown";
import { CertificateDto, ReminderDto } from "../dto/CertificateDto";
import { SpinnerTemplate, StatusTemplate } from "../components/Templates";
import { useTranslation } from "react-i18next";
import ExceptionHandler from "../exceptionHandler/ExceptionHandler";
import AppHeader from "../components/AppHeader";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import ColumnMeta from "../types/ColumnMeta.interface";

export default function Certificate() {
    const [t] = useTranslation();
    const [selectedCertificates, setSelectedCertificates] = useState<CertificateDto[] | undefined>(undefined);
    const [certificates, setCertificates] = useState([]);
    const [rowClick] = useState<boolean>(true);
    const [selectedMonth, setSelectedMonth] = useState({});
    const [data, setData] = useState<ReminderDto | null>(null);

    const filters = {
        registrationNumber: { value: null, matchMode: FilterMatchMode.CONTAINS },
        status: { value: null, matchMode: FilterMatchMode.CONTAINS },
        debtorNumber: { value: null, matchMode: FilterMatchMode.CONTAINS },
        customerSearchName: { value: null, matchMode: FilterMatchMode.CONTAINS },
        customerReferenceNumber: {
            value: null,
            matchMode: FilterMatchMode.CONTAINS,
        },
        extraInfo: { value: null, matchMode: FilterMatchMode.CONTAINS },
        description: { value: null, matchMode: FilterMatchMode.CONTAINS },
    };

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

    const monthOptions = ["thisMonth", "nextMonth", "lastMonth", "clear"];

    useEffect(() => {
        GetAllCertificates().then((response: any) => {
            setCertificates(response.data);
        }).catch((error) => {
            ExceptionHandler(error, t);
        });
    }, [])

    useEffect(() => {
        if (selectedMonth == "thisMonth") {
            setData({
                ...data,
                thisMonth: true,
                nextMonth: false,
                lastMonth: false,
            });
        }
        if (selectedMonth == "nextMonth") {
            setData({
                ...data,
                nextMonth: true,
                thisMonth: false,
                lastMonth: false,
            });
        }
        if (selectedMonth == "lastMonth") {
            setData({
                ...data,
                lastMonth: true,
                thisMonth: false,
                nextMonth: false,
            });
        }
        if (selectedMonth == "clear") {
            setData({
                ...data,
                lastMonth: false,
                thisMonth: false,
                nextMonth: false,
            });
        }
    }, [selectedMonth, data]);

    const handleChange = (e: any) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    };

    const updateReminders = (formData: ReminderDto) => {
        GetReminders(formData).then((response: any) => {
            if (response) {
                // TODO: when reminders are property setup, add user feedback
                setCertificates(response.data);
            }
        }).catch((error) => {
            ExceptionHandler(error, t);
        });
    }
    function clearFilter() {
        const formData: ReminderDto = {
            debtorNumber: undefined,
            endSearchDate: undefined,
            startSearchDate: undefined,
            lastMonth: false,
            nextMonth: false,
            thisMonth: false
        };

        setData(formData);
        setSelectedMonth("clear");
        updateReminders(formData);
    }

    function handleSubmit(e: any) {
        if (data?.debtorNumber == "") {
            data.debtorNumber = undefined;
        }

        if (data?.startSearchDate == "") {
            data.startSearchDate = undefined;
        }

        if (data?.endSearchDate == "") {
            data.endSearchDate = undefined;
        }

        e.preventDefault();

        const formData = {
            debtorNumber: data?.debtorNumber,
            startSearchDate: data?.startSearchDate,
            endSearchDate: data?.endSearchDate,
            thisMonth: data?.thisMonth,
            nextMonth: data?.nextMonth,
            lastMonth: data?.lastMonth,
        };
        updateReminders(formData);
    }

    const onColumnToggle = (event: MultiSelectChangeEvent) => {
        const selectedColumns = event.value;
        const orderedSelectedColumns = columns.filter((col) =>
            selectedColumns.some((sCol: any) => sCol.field === col.field)
        );

        setVisibleColumns(orderedSelectedColumns);
    };

    function ActionComponent() {
        return (
            <>
                <p className={global.title}>{t("reminders.actions.searching")}</p>
                <form id="customForm" onSubmit={handleSubmit} className={`${global.formgroup}`}>
                    <label>{t("reminders.actions.from")}</label>
                    <input
                        className={`${global.searchfield}`}
                        value={data?.startSearchDate}
                        onChange={handleChange}
                        type="date"
                        name="startSearchDate"
                    />
                    <label>{t("reminders.actions.until")}</label>
                    <input
                        className={`${global.searchfield}`}
                        value={data?.endSearchDate}
                        onChange={handleChange}
                        type="date"
                        name="endSearchDate"
                    />
                    <label>{t("reminders.actions.fastChoice")}</label>
                    <Dropdown
                        className={`${global.dropdownStyle} ${styles.actiondropdown}`}
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.value)}
                        options={monthOptions}
                    />
                    <label>{t("reminders.actions.debtor")}</label>
                    <input
                        className={`${global.searchfield} ${global.searchicon}`}
                        value={data?.debtorNumber}
                        name="debtorNumber"
                        onChange={handleChange}
                        type="text"
                    />

                    <button
                        className={`${global.btn} ${global.btnprimary} ${styles.btnhelper}`}
                        type="submit"
                    >
                        {t("buttons.searchAction")} &#128898;
                    </button>
                    <button
                        className={`${global.btn} ${global.btnsecondary} ${styles.btnhelper}`}
                        type="reset"
                        onClick={() => clearFilter()}
                    >
                        {t("buttons.clear")} &#8634;
                    </button>
                </form>
            </>
        )
    }

    const paginatorTemplate = () => {
        return (
            <>
                <div className={`${global.holdtogether} layout`}>
                    <p>{t("paginator.rowsToDisplay")}</p>
                    <MultiSelect value={visibleColumns} options={columns} optionLabel="header" onChange={onColumnToggle}
                        className="w-full sm:w-20rem" display="comma" maxSelectedLabels={0} />
                </div>
            </>
        );
    };

    return (
        <AppHeader title={t("reminders.remindersHeader")} actionTitle={t("reminders.actions.actionsHeader")} actionComponent={<ActionComponent />}>
            {certificates.length == 0 && (
                <SpinnerTemplate />
            )}
            <DataTable value={certificates} size={"small"} selectionMode={rowClick ? null : 'multiple'} selection={selectedCertificates!}
                onSelectionChange={(e: { value: React.SetStateAction<CertificateDto[] | undefined>; }) => setSelectedCertificates(e.value)}
                paginator rows={25} rowsPerPageOptions={[25, 50, 100]} paginatorPosition="both" paginatorTemplate={{ layout: 'RowsPerPageDropdown PrevPageLink PageLinks NextPageLink' }}
                paginatorLeft={paginatorTemplate()} paginatorRight={paginatorTemplate()} className={`${global.orangestripe} ${styles.reminderTable}`} filters={filters}
                filterDisplay="row" emptyMessage={t("certificates.dashboard.table.noCertificatesFound")} resizableColumns editMode={"cell"}>
                <Column selectionMode="multiple" />
                <Column field="registrationNumber" header={t("certificates.dashboard.table.registrationNumber")} filter />
                <Column className={"test2"} field="status" header={t("certificates.dashboard.table.status")} body={(certificate: CertificateDto) => (<StatusTemplate rowData={certificate} />)} filter />

                {visibleColumns.map((col) => (
                    <Column key={col.field} field={col.field} header={col.header} filter />
                ))}
            </DataTable>
        </AppHeader>
    );
}
