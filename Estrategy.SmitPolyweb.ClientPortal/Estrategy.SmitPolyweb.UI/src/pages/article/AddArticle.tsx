/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dropdown } from "primereact/dropdown";
import { useState, useEffect } from "react";
import { ArticleDto } from "../../dto/ArticleDto";
import { GetAllArticleTypes } from "../../services/ArticleTypeService";
import { ArticleTypeDto } from "../../dto/ArticleTypeDto";
import styles from "../../css/AddArticle.module.css";
import global from "../../css/global.module.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useToast } from "../../components/ToastContext";
import { CreateArticle } from "../../services/ArticleService";
import MultipleActionButtonBase from "../../components/MultipleActionButtonBase";
import { CustomButton } from "../../components/CustomButton";
import AppHeader from "../../components/AppHeader";
import ExceptionHandler from "../../exceptionHandler/ExceptionHandler";
import { CheckForMissingRequiredFields } from "../../helpers/MissingRequiredInputHelper";
import ArticleType from "../articleType/ArticleType";

function AddArticle() {
    const [t] = useTranslation();
    const navigate = useNavigate();
    const setToast = useToast();
    const [articleData, setArticleData] = useState<ArticleDto>({
        articleNumber: "",
        name: "",
        description: "",
    });
    const [selectedArticleType, setSelectedArticleType] = useState<ArticleTypeDto>();
    const [articleTypes, setArticleTypes] = useState<ArticleTypeDto[]>([]);


    useEffect(() => {
        GetAllArticleTypes().then((response: any) => {
            setArticleTypes(response.data);
        }).catch((error) => {
            ExceptionHandler(error, t);
        });
    }, []);


    const handleChange = (e: any) => {
        const value = e.target.value;
        setArticleData({
            ...articleData,
            [e.target.name]: value
        });
    };

    function CreateArticleFunction(e: any) {
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
            articleTypeID: selectedArticleType?.id,
            ArticleType: selectedArticleType
        }

        CreateArticle(formData).then((response: any) => {
            setToast({
                closable: true,
                severity: 'success',
                summary: t("userFeedback.success.articles.articleCreatedHeader"),
                detail: t("userFeedback.success.articles.articleCreated", { articleName: response.data.name }),
                life: 4000
            });

            navigate("/article");

        }).catch((error) => {
            ExceptionHandler(error, t);
        });
    };

    function ClearForm() {
        setArticleData({
            articleNumber: "",
            name: "",
            description: "",
        });
        setSelectedArticleType(undefined);
    };

    function navigateArticle() {
        navigate("/article");
    }

    const cancelButton: CustomButton = {
        type: "button",
        onClick: navigateArticle,
        content: t("buttons.close"),
    };
    const actionButton: CustomButton = {
        type: "reset",
        onClick: ClearForm,
        content: t("buttons.clear"),
    };
    const confirmationButton: CustomButton = {
        type: "submit",
        content: t("buttons.create"),
    };

    return (
        <AppHeader title={t("article.creation.articleHeader")}>
            <form onSubmit={CreateArticleFunction}>
                <div className={`${global.gridContainer} ${styles.articleForm}`}>
                    <div className={global.formContainer}>
                        <p className={global.headerStyle}>{t("article.creation.createHeader")}</p>
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
                    <br />

                    <div className={styles.buttonsContainer}>
                        <MultipleActionButtonBase cancelButton={cancelButton} actionButton={actionButton} confirmationButton={confirmationButton} />
                    </div>
                </div>
            </form>
        </AppHeader >
    );
}
export default AddArticle;