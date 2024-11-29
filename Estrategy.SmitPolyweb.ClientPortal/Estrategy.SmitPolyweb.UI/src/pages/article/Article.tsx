

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Column } from "primereact/column";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { useEffect, useState } from "react";

import { FilterMatchMode } from "primereact/api";

import styles from "../../css/Article.module.css";
import global from "../../css/global.module.css";
import { MultiSelectChangeEvent, MultiSelect } from "primereact/multiselect";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AppHeader from "../../components/AppHeader";
import { CustomButton } from "../../components/CustomButton";
import MultipleActionButtonBase from "../../components/MultipleActionButtonBase";
import { BtnTemplate, SpinnerTemplate } from "../../components/Templates";
import { ArticleDto } from "../../dto/ArticleDto";
import { ArticleTypeDto } from "../../dto/ArticleTypeDto";
import ExceptionHandler from "../../exceptionHandler/ExceptionHandler";
import { GetAllArticles } from "../../services/ArticleService";
import ColumnMeta from "../../types/ColumnMeta.interface";

function Article() {
    const [t] = useTranslation();
    const [articles, setArticles] = useState([]);
    const [selectedArticles, setSelectedArticles] = useState<ArticleDto[]>([]);
    const columns: ColumnMeta[] = [
        { field: "articleNumber", header: t("article.dashboard.table.articleNumber"), editorEnabled: false },
        { field: "name", header: t("article.dashboard.table.nameHeader"), editorEnabled: false },
        { field: "description", header: t("article.dashboard.table.description"), editorEnabled: false }
    ];

    const [visibleColumns, setVisibleColumns] = useState<ColumnMeta[]>(columns);

    const [filters] = useState<DataTableFilterMeta>({
        name: { value: null, matchMode: FilterMatchMode.CONTAINS },
        property: { value: null, matchMode: FilterMatchMode.CONTAINS },

    });
    const navigate = useNavigate();
    function handleClick(article: ArticleDto | undefined) {
        if (article)
            navigate(`/article/edit/${article.id}`);
    };

    function navigateCreateArticle() {
        navigate("/article/create");
    }

    useEffect(() => {
        GetAllArticles().then((response: any) => {
            setArticles(response.data);
        }).catch((error) => {
            ExceptionHandler(error, t);
        });
    }, []);

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

    const createButton: CustomButton = {
        type: "button",
        onClick: navigateCreateArticle,
        content: t("buttons.add"),
    }

    return (
        <AppHeader title={t("article.dashboard.articleHeader")}>
            {articles.length == 0 && (
                <SpinnerTemplate />
            )}
            <DataTable
                value={articles}
                size={"small"}
                selectionMode="multiple"
                selection={selectedArticles!}
                onSelectionChange={(e: { value: React.SetStateAction<ArticleDto[]>; }) => setSelectedArticles(e.value)}
                paginator
                rows={25}
                rowsPerPageOptions={[25, 50, 100]}
                paginatorPosition="both"
                paginatorTemplate={{ layout: 'RowsPerPageDropdown PrevPageLink PageLinks NextPageLink' }}
                paginatorLeft={paginatorTemplate()}
                paginatorRight={paginatorTemplate()}
                className={`${global.orangestripe}`}
                filters={filters}
                filterDisplay="row"
                emptyMessage={t("article.dashboard.table.noFoundArticles")}
                resizableColumns>
                <Column selectionMode="single" />
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
                    body={(article: ArticleTypeDto) => (
                        <BtnTemplate
                            item={article}
                            onClick={handleClick}
                            icon="fa-solid fa-pen-to-square"
                            alt={t("article.dashboard.table.buttons.edit")} />)}
                />
            </DataTable>
            <div className={styles.buttonContainer}>
                <MultipleActionButtonBase confirmationButton={createButton} />
            </div>
        </AppHeader>
    );
}

export default Article;