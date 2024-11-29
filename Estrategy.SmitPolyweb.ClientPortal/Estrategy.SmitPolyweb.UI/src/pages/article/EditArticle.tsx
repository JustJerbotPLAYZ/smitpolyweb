/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dropdown } from "primereact/dropdown";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AppHeader from "../../components/AppHeader";
import { CustomButton } from "../../components/CustomButton";
import MultipleActionButtonBase from "../../components/MultipleActionButtonBase";
import { useToast } from "../../components/ToastContext";
import styles from "../../css/EditArticle.module.css";
import global from "../../css/global.module.css";
import { ArticleDto } from "../../dto/ArticleDto";
import { ArticleTypeDto } from "../../dto/ArticleTypeDto";
import ExceptionHandler from "../../exceptionHandler/ExceptionHandler";
import { CheckForMissingRequiredFields } from "../../helpers/MissingRequiredInputHelper";
import { GetArticleByID, UpdateArticleByID, DeleteArticleByID } from "../../services/ArticleService";
import { GetArticleTypeByID, GetAllArticleTypes } from "../../services/ArticleTypeService";
import { SpinnerTemplate } from "../../components/Templates";

function EditArticle() {
    const [t] = useTranslation();
    const navigate = useNavigate();
    const setToast = useToast();
    const [articleData, setArticleData] = useState<ArticleDto>();
    const [selectedArticleType, setSelectedArticleType] = useState<ArticleTypeDto>();
    const [articleTypes, setArticleTypes] = useState<ArticleTypeDto[]>();

    useEffect(() => {
        const test = window.location.pathname.split("/");
        const ID = parseInt(test.pop()!);

        GetArticleByID(ID).then((response: any) => {
            if (response.data != null)
                setArticleData(response.data);
            GetArticleTypeByID(response.data.articleTypeID).then((response: any) => {
                setSelectedArticleType(response.data);
            }).catch((error) => {
                ExceptionHandler(error, t);
            });
        }).catch((error) => {
            ExceptionHandler(error, t);
        });

        GetAllArticleTypes().then((response: any) => {
            setArticleTypes(response.data);
        }).catch((error) => {
            ExceptionHandler(error, t);
        });
    },
        []);

    const handleChange = (e: any) => {
        const value = e.target.value;
        setArticleData({
            ...articleData,
            [e.target.name]: value
        });
    };

    function EditArticleFunction(e: any) {
        e.preventDefault();

        // Define required fields for validation
        const requiredFields = [
            { name: "articleNumber", value: articleData?.articleNumber },
            { name: "name", value: articleData?.name },
            { name: "articleTypeID", value: selectedArticleType }
        ];

        if (CheckForMissingRequiredFields(requiredFields)) {
            setToast({
                closable: true,
                severity: 'error',
                summary: t("userFeedback.errors.missingRequiredFieldsHeader"),
                detail: t("userFeedback.errors.missingRequiredFields"),
                life: 4000
            });
            return;
        }

        const formData = {
            articleNumber: articleData?.articleNumber,
            name: articleData?.name,
            description: articleData?.description,
            articleTypeID: selectedArticleType?.id
        }

        UpdateArticleByID(articleData?.id, formData).then((response: any) => {
            setToast({
                closable: true,
                severity: 'success',
                summary: t("userFeedback.success.articles.articleEditedHeader"),
                detail: t("userFeedback.success.articles.articleEdited", { articleName: response.data.name }),
                life: 4000
            });
            navigate("/article");
        }).catch((error) => {
            ExceptionHandler(error, t);
        });
    };

    function DeleteArticle() {
        DeleteArticleByID(articleData?.id).then((response: any) => {
            setToast({
                closable: true,
                severity: 'success',
                summary: t("userFeedback.success.articles.articleDeletedHeader"),
                detail: t("userFeedback.success.articles.articleDeleted", { articleName: response.data.name }),
                life: 4000
            });
            navigate("/article");
        }).catch((error) => {
            ExceptionHandler(error, t);
        });
    }

    function navigateArticle() {
        navigate("/article");
    }

    const closeButton: CustomButton = {
        type: "button",
        onClick: navigateArticle,
        content: t("buttons.close")
    }

    const deleteButton: CustomButton = {
        type: "button",
        onClick: DeleteArticle,
        content: t("buttons.delete")
    }

    const createButton: CustomButton = {
        type: "submit",
        content: t("buttons.save")
    }

    return (
        <AppHeader title={t("article.edit.articleHeader")}>
            {selectedArticleType == undefined && (
                <SpinnerTemplate />
            )}
            <form onSubmit={EditArticleFunction}>
                <div className={`${global.gridContainer} ${styles.articleForm}`}>
                    <div className={global.formContainer}>
                        <p className={global.headerStyle}>{t("article.creation.editHeader")}</p>
                        <div className={global.fieldGroup}>
                            <label>{t("article.creation.articleNumber")}</label>
                            <input
                                id="articleNumber"
                                value={articleData?.articleNumber}
                                onChange={handleChange}
                                name="articleNumber"
                                type="text"
                                placeholder={t("article.creation.articleNumber")} />
                        </div>

                        <div className={global.fieldGroup}>
                            <label>{t("article.creation.name")}</label>
                            <input
                                id="name"
                                value={articleData?.name}
                                onChange={handleChange}
                                name="name"
                                placeholder={t("article.creation.name")} />
                        </div>
                    </div>
                    <div className={global.formContainer}>
                        <div className={styles.containerPosition}>
                            <div className={global.fieldGroup}>
                                <label>{t("article.creation.description")}</label>
                                <input
                                    id="description"
                                    value={articleData?.description}
                                    onChange={handleChange}
                                    name="description"
                                    placeholder={t("article.creation.description")} />
                            </div>
                        </div>

                        <div className={global.fieldGroup}>
                            <label>{t("article.creation.articleType")}</label>
                            <Dropdown
                                id="articleTypeID"
                                value={selectedArticleType}
                                onChange={(e) => setSelectedArticleType(e.value)}
                                options={articleTypes}
                                optionLabel="name"
                                filter
                                placeholder={t("article.creation.articleType")}
                                className={global.dropdownStyle} />
                        </div>
                    </div>
                </div>
                <div className={styles.buttonContainer}>
                    <MultipleActionButtonBase cancelButton={closeButton} actionButton={deleteButton} confirmationButton={createButton} />
                </div>
            </form>
        </AppHeader>
    );
}
export default EditArticle;