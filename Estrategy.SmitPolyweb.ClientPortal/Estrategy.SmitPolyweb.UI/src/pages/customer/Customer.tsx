/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

import { FilterMatchMode } from "primereact/api";
import { GetAllCustomers } from "../../services/Customerservices";

import global from "../../css/global.module.css";
import "../../css/overrideCss.css";
import { useNavigate } from "react-router";
import { CustomerDto } from "../../dto/CustomerDto";
import { BtnTemplate, SpinnerTemplate } from "../../components/Templates";
import { useTranslation } from "react-i18next";
import ExceptionHandler from "../../exceptionHandler/ExceptionHandler";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import ColumnMeta from "../../types/ColumnMeta.interface";
import AppHeader from "../../components/AppHeader";
import MultipleActionButtonBase from "../../components/MultipleActionButtonBase";
import { CustomButton } from "../../components/CustomButton";

export default function Customer() {
    const [t] = useTranslation();
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState<boolean>(true);
    const filters = {
        email: { value: null, matchMode: FilterMatchMode.CONTAINS },
        debtorNumber: { value: null, matchMode: FilterMatchMode.CONTAINS },
        searchName: { value: null, matchMode: FilterMatchMode.CONTAINS },
        customerName: { value: null, matchMode: FilterMatchMode.CONTAINS },
        phoneNumber: { value: null, matchMode: FilterMatchMode.CONTAINS },
        faxNumber: { value: null, matchMode: FilterMatchMode.CONTAINS },
    };

    const columns: ColumnMeta[] = [
        { field: "email", header: t("contactInformation.email"), editorEnabled: false },
        { field: "debtorNumber", header: t("customer.dashboard.table.debtorNumber"), editorEnabled: false },
        { field: "searchName", header: t("customer.dashboard.table.searchName"), editorEnabled: false },
        { field: "customerName", header: t("customer.dashboard.table.customerName"), editorEnabled: false },
        { field: "phoneNumber", header: t("contactInformation.phone"), editorEnabled: false },
        { field: "faxNumber", header: t("contactInformation.fax"), editorEnabled: false }
    ]

    const [visibleColumns, setVisibleColumns] = useState<ColumnMeta[]>(columns);


    useEffect(() => {
        GetAllCustomers().then((response: any) => {
            if (response)
                setCustomers(response.data);
            setLoading(false);
        }).catch((error) => {
            ExceptionHandler(error, t);
        });
    }, []);

    function handleClick(customer: CustomerDto) {
        if (customer)
            navigate(`/customer/edit/${customer.id}`);
    };

    const onColumnToggle = (event: MultiSelectChangeEvent) => {
        const selectedColumns = event.value;
        const orderedSelectedColumns = columns.filter((col) => selectedColumns.some((sCol: any) => sCol.field === col.field));

        setVisibleColumns(orderedSelectedColumns);
    };

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

    const addCustomerTypeButton: CustomButton = {
        content: t("buttons.add"),
        type: "button",
        onClick: () => navigate("/customer/create"),
    }

    return (
        <AppHeader title={t("customer.dashboard.table.customerTableHeader")}>
            {customers.length == 0 && (
                <SpinnerTemplate />
            )}
            <DataTable
                value={customers}
                size={"small"}
                className={`${global.orangestripe} ${global.table}`}
                paginator
                rows={25}
                rowsPerPageOptions={[25, 50, 100]}
                paginatorPosition="both"
                paginatorTemplate={{ layout: 'RowsPerPageDropdown PrevPageLink PageLinks NextPageLink' }}
                paginatorLeft={paginatorTemplate()}
                paginatorRight={paginatorTemplate()}
                filters={filters}
                filterDisplay="row"
                loading={loading}
                emptyMessage={t("customer.dashboard.table.noCustomersFound")}
                resizableColumns >
                {visibleColumns.map((col) => (
                    <Column
                        key={col.field}
                        field={col.field}
                        header={col.header}
                        filter />
                ))}

                <Column
                    field=""
                    header=""
                    body={(customer: CustomerDto) => <BtnTemplate
                        item={customer}
                        onClick={handleClick}
                        alt="edit"
                        icon="fa-solid fa-pen-to-square" />} />
            </DataTable>
            <div className={global.createButton}>
                <MultipleActionButtonBase confirmationButton={addCustomerTypeButton} />
            </div>
        </AppHeader>
    );
}
