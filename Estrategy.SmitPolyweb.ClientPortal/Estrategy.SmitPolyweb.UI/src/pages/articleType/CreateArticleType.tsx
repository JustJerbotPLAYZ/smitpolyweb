/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import global from "../../css/global.module.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AppHeader from "../../components/AppHeader";
import { CustomButton } from "../../components/CustomButton";
import MultipleActionButtonBase from "../../components/MultipleActionButtonBase";
import { useToast } from "../../components/ToastContext";
import { ArticleTypeDto } from "../../dto/ArticleTypeDto";
import ExceptionHandler from "../../exceptionHandler/ExceptionHandler";
import { CheckForMissingRequiredFields } from "../../helpers/MissingRequiredInputHelper";
import { CreateNewArticleType } from "../../services/ArticleTypeService";

export default function CreateArticleType() {
    const [articleTypeData, setArticleTypeData] = useState<ArticleTypeDto>();
    const [t] = useTranslation();
    const setToast = useToast();
    const navigate = useNavigate();

    const SubmitArticleType = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const requiredFields = [
            { name: "name", value: articleTypeData?.name },
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

        const newArticleType: ArticleTypeDto = {
            name: articleTypeData?.name,
            standardPrice: articleTypeData?.standardPrice,
        };

        CreateNewArticleType(newArticleType).then((response) => {
            if (response.status == 201) {
                // add toast
                setToast({
                    closable: true,
                    severity: 'success',
                    summary: t("userFeedback.success.articleTypes.articleTypeCreatedHeader"),
                    detail: t("userFeedback.success.articleTypes.articleTypeCreated", { articleTypeName: response.data.name }),
                    life: 4000
                });
                navigate(`/articleType/edit/${response.data.id}`);
            }
        }).catch((error) => {
            ExceptionHandler(error, t);
        });
    };

    function ClearArticleType() {
        setArticleTypeData(undefined);
    }

    function handleChange(e: any) {
        const value = e.target.value;
        setArticleTypeData({
            ...articleTypeData,
            [e.target.name]: value
        });
    }

    const cancelButton: CustomButton = {
        content: t("buttons.close"),
        type: "button",
        onClick: () => navigate("/articleType"),
    }

    const saveButton: CustomButton = {
        content: t("buttons.save"),
        type: "submit",
    }

    const clearButton: CustomButton = {
        content: t("buttons.clear"),
        type: "button",
        onClick: ClearArticleType
    }

    return (
        <AppHeader title={t("articleTypes.creation.header")}>
            <div className={global.gridContainer}>
                <div className={global.formContainer}>
                    <form onSubmit={SubmitArticleType}>
                        <p className={global.headerStyle}>
                            {t("articleTypes.creation.formHeader")}
                        </p>
                        <br />
                        <div className={global.fieldGroup}>
                            <label>{t("articleTypes.creation.name")}</label>
                            <input
                                id="name"
                                value={articleTypeData?.name}
                                name="name"
                                onChange={handleChange}
                                placeholder={t("articleTypes.creation.name")}
                            />
                        </div>

                        <div className={global.fieldGroup}>
                            <label>{t("articleTypes.creation.price")}</label>
                            <input
                                value={articleTypeData?.standardPrice ? articleTypeData?.standardPrice : ""}
                                type="number"
                                name="standardPrice"
                                onChange={handleChange}
                                placeholder={t("articleTypes.creation.priceExample")}
                            />
                        </div>
                        <MultipleActionButtonBase cancelButton={cancelButton} actionButton={clearButton} confirmationButton={saveButton} />
                    </form>
                </div>
            </div>
        </AppHeader>
    );
}
