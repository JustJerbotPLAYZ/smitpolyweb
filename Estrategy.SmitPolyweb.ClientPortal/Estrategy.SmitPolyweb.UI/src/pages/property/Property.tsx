/* eslint-disable @typescript-eslint/no-explicit-any */
import global from '../../css/Global.module.css';
import styles from '../../css/Property.module.css';
import { useState } from 'react';
import { PropertyDto } from '../../dto/PropertyDto';
import { useEffect } from 'react';
import { GetAllProperties, } from '../../services/PropertyService';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { FilterMatchMode } from 'primereact/api';
import { useTranslation } from 'react-i18next';
import { BtnTemplate, SpinnerTemplate } from '../../components/Templates';
import { useNavigate } from 'react-router-dom';
import { CustomButton } from '../../components/CustomButton';
import MultipleActionButtonBase from '../../components/MultipleActionButtonBase';
import ExceptionHandler from '../../exceptionHandler/ExceptionHandler';
import AppHeader from '../../components/AppHeader';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import ColumnMeta from '../../types/ColumnMeta.interface';

export default function Property() {
    const [t] = useTranslation();
    const navigate = useNavigate();
    const [properties, setProperties] = useState<PropertyDto[]>([]);
    const [selectedProperties, setSelectedProperties] = useState<PropertyDto[]>([]);

    const columns: ColumnMeta[] = [
        { field: "name", header: t("property.dashboard.table.name"), editorEnabled: false },
        { field: "propertyName", header: t("property.dashboard.table.propertyName"), editorEnabled: false },
        { field: "englishName", header: t("property.dashboard.table.englishName"), editorEnabled: false }
    ]

    const [visibleColumns, setVisibleColumns] = useState<ColumnMeta[]>(columns);

    const createButton: CustomButton = {
        content: t("buttons.add"),
        type: "submit",
        onClick: navigateAddProperty
    };

    const filters = {
        name: { value: null, matchMode: FilterMatchMode.CONTAINS },
        propertyName: { value: null, matchMode: FilterMatchMode.CONTAINS },
        englishName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    };

    useEffect(() => {
        GetAllProperties().then((response: any) => {
            setProperties(response.data);
        }).catch((error) => {
            ExceptionHandler(error, t);
        });
    }, []);

    function edit(property: PropertyDto | undefined) {
        if (property)
            navigate(`/property/edit/${property.id}`);
    };

    function navigateAddProperty() {
        navigate("/property/create");
    }

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

    return (
        <AppHeader title={t("property.dashboard.header")}>
            {properties.length == 0 && (
                <SpinnerTemplate />
            )}
            <DataTable
                value={properties}
                size={"small"}
                className={`${global.orangestripe} ${global.table}`}
                selectionMode="multiple"
                selection={selectedProperties!}
                onSelectionChange={(e: { value: React.SetStateAction<PropertyDto[]>; }) => setSelectedProperties(e.value)}
                paginator
                rows={25}
                rowsPerPageOptions={[25, 50, 100]}
                paginatorPosition="both"
                paginatorTemplate={{ layout: 'RowsPerPageDropdown PrevPageLink PageLinks NextPageLink' }}
                paginatorLeft={paginatorTemplate()}
                paginatorRight={paginatorTemplate()}
                filters={filters}
                filterDisplay="row"
                emptyMessage={t("property.dashboard.table.noCustomersFound")}
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
                    className={global.utilitybtn}
                    body={(property: PropertyDto) => (
                        <BtnTemplate
                            item={property}
                            onClick={edit}
                            icon="fa-solid fa-pen-to-square"
                            alt="edit" />)} />
            </DataTable>
            <div className={styles.buttonStyling}>
                <MultipleActionButtonBase confirmationButton={createButton} />
            </div>
        </AppHeader>
    );
}