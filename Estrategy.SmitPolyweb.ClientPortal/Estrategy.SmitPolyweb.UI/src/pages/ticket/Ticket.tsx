/* eslint-disable @typescript-eslint/no-explicit-any */
import { Column } from "primereact/column";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { useEffect, useState } from "react";

import { useNavigate } from "react-router";
import { FilterMatchMode } from "primereact/api";

import styles from "../../css/Ticket.module.css";
import global from "../../css/global.module.css";
import { useTranslation } from "react-i18next";

import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import AppHeader from "../../components/AppHeader";
import { CustomButton } from "../../components/CustomButton";
import MultipleActionButtonBase from "../../components/MultipleActionButtonBase";
import { BtnTemplate, SpinnerTemplate } from "../../components/Templates";
import { TicketDto } from "../../dto/TicketDto";
import ExceptionHandler from "../../exceptionHandler/ExceptionHandler";
import { GetAllTickets } from "../../services/TicketService";
import ColumnMeta from "../../types/ColumnMeta.interface";

function Ticket() {
    const [t] = useTranslation();
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [rowClick] = useState<boolean>(true);
    const [selectedTickets, setSelectedTickets] = useState<TicketDto[]>([]);

    const [filters] = useState<DataTableFilterMeta>({
        id: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        customerSearchName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        scheduled: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        description: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        userID: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });

    const columns: ColumnMeta[] = [
        { field: "ticketNumber", header: t("tickets.table.ticketNumber"), editorEnabled: false },
        { field: "customerSearchName", header: t("tickets.table.customerSearchName"), editorEnabled: false },
        { field: "scheduled", header: t("tickets.table.date"), editorEnabled: false },
        { field: "description", header: t("tickets.table.description"), editorEnabled: false },
        { field: "userFirstName", header: t("tickets.table.assignedTo"), editorEnabled: false }
    ]

    const [visibleColumns, setVisibleColumns] = useState<ColumnMeta[]>(columns);

    function GoToAdd() {
        navigate("/ticket/create/addCustomer");
    }

    function edit(ticket: TicketDto) {
        if (ticket)
            navigate(`/ticket/edit/${ticket.id}`);
    }

    useEffect(() => {
        GetAllTickets().then((response: any) => {
            setTickets(response.data);
        }).catch((error) => {
            ExceptionHandler(error, t);
        });
    }, []);

    const onColumnToggle = (event: MultiSelectChangeEvent) => {
        const selectedColumns = event.value;
        const orderedSelectedColumns = columns.filter((col) => selectedColumns.some((sCol: any) => sCol.field === col.field));

        setVisibleColumns(orderedSelectedColumns);
    };

    const notImplemented = () => {
        alert(t("errors.notImplemented"));
    }

    const paginatorTemplate = () => {
        return (
            <div className={`${global.holdtogether} layout`}>
                <p>{t("paginator.rowsToDisplay")}</p>
                <MultiSelect
                    value={visibleColumns}
                    options={columns}
                    optionLabel="header"
                    onChange={onColumnToggle}
                    className="w-full sm:w-20rem"
                    display="comma"
                    selectedItemsLabel={t("paginator.rowsSelectedMsg")}
                    placeholder={t("paginator.noRowsSelected")} 
                    maxSelectedLabels={0} />
            </div>
        );
    }

    const scheduleButton: CustomButton = {
        type: "button",
        content: t("buttons.schedule")
    }

    const printButton: CustomButton = {
        type: "button",
        content: t("buttons.print")
    }

    const editButton: CustomButton = {
        type: "button",
        onClick: () => edit(selectedTickets[0]),
        content: t("buttons.editTicket")
    }

    const createButton: CustomButton = {
        type: "button",
        onClick: GoToAdd,
        content: t("buttons.add")
    }

    return (
        <AppHeader title={t("tickets.ticketsHeader")}>
            <DataTable
                value={tickets}
                size={"small"}
                className={`${global.orangestripe} ${styles.ticketTable}`}
                selectionMode={rowClick ? null : 'multiple'}
                selection={selectedTickets!}
                onSelectionChange={(e: { value: React.SetStateAction<TicketDto[]>; }) => setSelectedTickets(e.value)}
                paginator
                rows={25}
                rowsPerPageOptions={[25, 50, 100]}
                paginatorPosition="both"
                paginatorTemplate={{ layout: 'RowsPerPageDropdown PrevPageLink PageLinks NextPageLink' }}
                paginatorLeft={paginatorTemplate()}
                paginatorRight={paginatorTemplate()} filters={filters}
                filterDisplay="row"
                emptyMessage={t("tickets.noTicketsFound")}
                resizableColumns >
                <Column selectionMode="multiple" />

                {visibleColumns.map((col) => (
                    <Column key={col.field} field={col.field} header={col.header} filter />
                ))}

                <Column field="" header="" className={global.utilitybtn} body={(ticket: TicketDto) => (<BtnTemplate item={ticket} onClick={edit} icon="fa-solid fa-pen-to-square" alt={t("certificates.dashboard.table.buttons.edit")} />)} />
                <Column field="" header="" className={global.utilitybtn} body={(ticket: TicketDto) => (<BtnTemplate item={ticket} onClick={notImplemented} icon="fa-solid fa-print" alt={t("certificates.dashboard.table.buttons.print")} />)} />
                <Column field="" header="" className={global.utilitybtn} body={(ticket: TicketDto) => (<BtnTemplate item={ticket} onClick={notImplemented} icon="fa-solid fa-envelopes" alt={t("certificates.dashboard.table.buttons.email")} />)} />
            </DataTable>
            {tickets.length == 0 && (
                <SpinnerTemplate />
            )}
            <div>
                <div className={styles.alignButtons}>
                    <MultipleActionButtonBase actionButton={scheduleButton} />
                    <MultipleActionButtonBase actionButton={printButton} />
                    <MultipleActionButtonBase actionButton={editButton} />
                    <MultipleActionButtonBase confirmationButton={createButton} />
                </div>
            </div>
        </AppHeader>
    );
}

export default Ticket;
