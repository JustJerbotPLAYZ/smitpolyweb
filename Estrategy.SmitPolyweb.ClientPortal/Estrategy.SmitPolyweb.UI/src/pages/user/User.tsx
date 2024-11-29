/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useNavigate } from "react-router-dom";
import GetAllUsers from "../../services/Userservice";
import styles from "../../css/User.module.css";
import "../../css/overrideCss.css";
import { UserDto } from "../../dto/UserDto";
import { FilterMatchMode } from "primereact/api";
import { useTranslation } from "react-i18next";
import ExceptionHandler from "../../exceptionHandler/ExceptionHandler";
import AppHeader from "../../components/AppHeader";
import global from "../../css/global.module.css";
import { BtnTemplate, SpinnerTemplate } from "../../components/Templates";
import { CustomButton } from "../../components/CustomButton";
import MultipleActionButtonBase from "../../components/MultipleActionButtonBase";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import ColumnMeta from "../../types/ColumnMeta.interface";

export default function User() {
    const [t] = useTranslation();
    const navigate = useNavigate();
    const [users, setUsers] = useState<UserDto[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const filters = {
        firstName: { value: null, matchMode: FilterMatchMode.CONTAINS },
        infix: { value: null, matchMode: FilterMatchMode.CONTAINS },
        lastName: { value: null, matchMode: FilterMatchMode.CONTAINS },
    };

    const columns: ColumnMeta[] = [
        { field: "firstName", header: t("user.table.name"), editorEnabled: false },
        { field: "infix", header: t("contactInformation.affix"), editorEnabled: false },
        { field: "lastName", header: t("user.table.lastName"), editorEnabled: false },
        { field: "email", header: t("user.table.email"), editorEnabled: false },
    ]

    const [visibleColumns, setVisibleColumns] = useState<ColumnMeta[]>(columns);

    useEffect(() => {
        GetAllUsers()
            .then((response: any) => {
                setUsers(response.data);
                setLoading(false);
            })
            .catch((error) => {
                ExceptionHandler(error, t);
            });
    }, []);

    function edit(user: UserDto) {
        if (user)
            navigate(`/user/edit/${user.id}`);
    }

    const createNewUserButton: CustomButton = {
        content: t("buttons.add"),
        type: "button",
        onClick: () => navigate("/user/create"),
    }

    const onColumnToggle = (event: MultiSelectChangeEvent) => {
        const selectedColumns = event.value;
        const orderedSelectedColumns = columns.filter((col) => selectedColumns.some((sCol: any) => sCol.field === col.field));

        setVisibleColumns(orderedSelectedColumns);
    };

    function userBlockedAccountTemplate(e: UserDto) {
        if (e.accountBlocked) {
            return (
                <label>{t("user.accountBlocked")}</label>
            )
        } else {
            return (
                <label>{t("user.notBlocked")}</label>
            )
        }
      
    }

    function userActiveAccountTemplate(e:UserDto) {
        if (e.accountActive) {
            return (
                <label>{t("user.accountActive")}</label>
            );
        } else {
            return (
                <label>{t("user.accountNotActive")}</label>
            );
        }
    }

    const paginatorTemplate = () => {
        return (
            <div className={`${global.holdtogether} layout`}>
                <p>{t("paginator.rowsToDisplay")}</p>
                <MultiSelect value={visibleColumns} options={columns} optionLabel="header" onChange={onColumnToggle} className="w-full sm:w-20rem"
                    display="comma" selectedItemsLabel={t("paginator.rowsSelectedMsg")} placeholder={t("paginator.noRowsSelected")} maxSelectedLabels={0} />
            </div>
        );
    }

    return (
        <AppHeader title={t("user.usersHeader")}>
            {users.length == 0 && (
                <SpinnerTemplate />
            )}
            <DataTable
                value={users}
                size={"small"}
                className={`${global.orangestripe} ${global.table}`}
                paginator rows={25}
                rowsPerPageOptions={[25, 50, 100]}
                paginatorPosition="both"
                paginatorTemplate={{ layout: 'RowsPerPageDropdown PrevPageLink PageLinks NextPageLink' }}
                paginatorLeft={paginatorTemplate()} paginatorRight={paginatorTemplate()}
                filters={filters} loading={loading}
                filterDisplay="row"
                emptyMessage={t("user.table.noUsersFound")}
                resizableColumns >

                {visibleColumns.map((col) => (
                    <Column
                        key={col.field}
                        field={col.field}
                        header={col.header}
                        filter />
                ))}
                <Column
                    field="accountActive"
                    header={t("user.table.activeAccount")}
                    body={(user:UserDto) => userActiveAccountTemplate(user)}
                    filter
                />
                <Column
                    field="accountBlocked"
                    header={t("user.table.blockedAccount")}
                    body={(user:UserDto)=> userBlockedAccountTemplate(user)}
                    filter
                />
                <Column
                    field=""
                    header=""
                    className={global.utilitybtn}
                    body={(user: UserDto) => (
                        <BtnTemplate
                            item={user}
                            onClick={edit}
                            icon="fa-solid fa-pen-to-square"
                            alt={t("user.table.editButton")}
                        />
                    )} />
            </DataTable>
            <div className={styles.buttonWrapper}>
                <MultipleActionButtonBase confirmationButton={createNewUserButton} />
            </div>
        </AppHeader>
    );
}
