/* eslint-disable @typescript-eslint/no-explicit-any */
import { Column } from "primereact/column";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { useEffect, useState } from "react";
import { FilterMatchMode } from "primereact/api";

import styles from "../../css/ArticleType.module.css"
import global from "../../css/global.module.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AppHeader from "../../components/AppHeader";
import { CustomButton } from "../../components/CustomButton";
import MultipleActionButtonBase from "../../components/MultipleActionButtonBase";
import { BtnTemplate, SpinnerTemplate } from "../../components/Templates";
import { ArticleTypeDto } from "../../dto/ArticleTypeDto";
import ExceptionHandler from "../../exceptionHandler/ExceptionHandler";
import { GetAllArticleTypes } from "../../services/ArticleTypeService";


function ArticleType() {
    const [t] = useTranslation();
    const navigate = useNavigate();
    const [articleTypes, setArticleTypes] = useState([]);
    const [filters] = useState<DataTableFilterMeta>({
        name: { value: null, matchMode: FilterMatchMode.CONTAINS },
        standardPrice: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        property: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    function handleClick(articleType: ArticleTypeDto | undefined) {
        if (articleType)
            navigate(`/articleType/edit/${articleType.id}`);
    };

    useEffect(() => {
        GetAllArticleTypes().then((response: any) => {
            setArticleTypes(response.data);
        }).catch((error) => {
            ExceptionHandler(error, t);
        });
    }, []);

    const changePrice = (value: number) => {
        if (value != 0) {
            return value.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR' });
        }
    }

    const priceTemplate = (articleType: any) => {
        return changePrice(articleType.standardPrice);
    }

    const addArticleTypeButton: CustomButton = {
        content: t("buttons.add"),
        type: "button",
        onClick: () => navigate("/articleType/create"),
    }

    const paginatorTemplate = () => {
        return (
            <div className={`${global.holdtogether} layout`}>
                <p>{t("paginator.rowsToDisplay")}</p>
            </div>
        );
    }

    return (
        <AppHeader title={t("articleTypes.dashboard.articleTypeHeader")}>
            {articleTypes.length == 0 && (
                <SpinnerTemplate />
            )}
            <DataTable
                value={articleTypes}
                size={"small"}
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
                emptyMessage={t("articleTypes.dashboard.table.noFoundArticleTypes")}
                resizableColumns>
                <Column
                    field="name"
                    header={t("articleTypes.dashboard.table.nameHeader")}
                    filter
                />
                <Column
                    field="standardPrice"
                    header={t("articleTypes.dashboard.table.priceHeader")}
                    body={priceTemplate}
                    filter
                />
                <Column
                    field=""
                    header=""
                    className={global.utilitybtn}
                    body={(certificate: ArticleTypeDto) => (
                        <BtnTemplate
                            item={certificate}
                            onClick={handleClick}
                            icon="fa-solid fa-pen-to-square"
                            alt="edit"
                        />
                    )}
                />
            </DataTable>
            <div className={styles.addButtonPosition}>
                <MultipleActionButtonBase confirmationButton={addArticleTypeButton} />
            </div>
        </AppHeader>
    );

}

export default ArticleType;