/* eslint-disable @typescript-eslint/no-explicit-any */

import global from "../../css/global.module.css";
import styles from "../../css/EditArticleType.module.css";
import { useRef, useState } from "react";
import { useEffect } from "react";
import { ArticleTypePropertyDto, PropertyDto, PropertyDtoWithExtra } from "../../dto/PropertyDto";
import { GetAvailableProperties, GetPropertyByID } from "../../services/PropertyService";
import { useTranslation } from "react-i18next";
import { DeleteArticleTypeByID, GetArticleTypeByID, GetArticleTypePropertyByArticleTypeID, UpdateArticleTypeByID } from "../../services/ArticleTypeService";
import { ArticleTypeDto } from "../../dto/ArticleTypeDto";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import AppHeader from "../../components/AppHeader";
import { useNavigate } from "react-router-dom";
import { CustomButton } from "../../components/CustomButton";
import MultipleActionButtonBase from "../../components/MultipleActionButtonBase";
import ExceptionHandler from "../../exceptionHandler/ExceptionHandler";
import { BtnTemplate, SpinnerTemplate } from "../../components/Templates";
import { CreateArticleTypeProperty, DeleteArticleTypePropertyByID, GetArticleTypePropertyByIDs, UpdateArticleTypePropertyByID } from "../../services/ArticleTypePropertyService";
import { OverlayPanel } from "primereact/overlaypanel";
import { useToast } from "../../components/ToastContext";
import { CheckForMissingRequiredFields } from "../../helpers/MissingRequiredInputHelper";

function EditArticleType() {
    const [t] = useTranslation();
    const navigate = useNavigate();
    const setToast = useToast();
    const op = useRef<OverlayPanel>(null); // Overlay Panel toggle
    const [selectedArticleType, setSelectedArticleType] = useState<ArticleTypeDto>();
    const [properties, setProperties] = useState<PropertyDtoWithExtra[]>([]);
    const [availableProperties, setAvailableProperties] = useState<PropertyDto[]>([]);
    const [articleTypeProperty, setArticleTypeProperty] = useState<ArticleTypePropertyDto>({});

    const requiredFields = [
        { name: "name", value: selectedArticleType?.name },
        { name: "standardPrice", value: selectedArticleType?.standardPrice }
    ];

    useEffect(() => {
        const test = window.location.pathname.split("/");
        const ID = parseInt(test.pop()!);

        refreshProperties(ID);


    }, []);

    function refreshProperties(ID: number | undefined) {
        const tempListProp: PropertyDto[] = [];
        let tempValue: number = 0;


        GetAvailableProperties(ID).then((response: any) => {
            setAvailableProperties(response.data);
        });

        GetArticleTypeByID(ID).then((response: any) => {
            if (response.data != null || response.data != undefined) {
                setSelectedArticleType(response.data);
                GetArticleTypePropertyByArticleTypeID(ID).then((response: any) => {
                    tempValue = response.data.length;


                    for (let i: number = response.data.length - 1; i >= 0; i--) {

                        let prop: PropertyDtoWithExtra = {};
                        prop.required = response.data[i].required;
                        prop.visable = response.data[i].visable;
                        GetPropertyByID(response.data[i].propertyID).then((response: any) => {
                            prop.id = response.data.id;
                            prop.name = response.data.name;
                            prop.propertyName = response.data.propertyName;
                            prop.englishName = response.data.englishName;
                            tempListProp.push(prop);
                            prop = {};
                            if (tempValue == tempListProp.length) {
                                tempListProp.sort((a, b) => a.id! - b.id!);
                                setProperties(tempListProp);
                            }
                        }).catch((error) => {
                            ExceptionHandler(error, t);
                        });
                    }
                }).catch((error) => {
                    ExceptionHandler(error, t);
                });

            }
        }).catch((error) => {
            ExceptionHandler(error, t);
        });
    }

    const handleChange = (e: any) => {
        const value = e.target.value;
        setSelectedArticleType({
            ...selectedArticleType,
            [e.target.name]: value,
        });
    };

    function DeleteArticleType() {
        DeleteArticleTypeByID(selectedArticleType?.id).then((response: any) => {
            setToast({
                closable: true,
                severity: 'success',
                summary: t("userFeedback.success.articleTypes.articleTypeDeletedHeader"),
                detail: t("userFeedback.success.articleTypes.articleTypeDeleted", { articleTypeName: response.data.name }),
                life: 4000
            });
            navigate("/articleType");
        })
    }

    function SubmitEditedArticleType(e: any) {

        e.preventDefault();

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

        for (let i: number = properties.length - 1; i >= 0; i--) {
            const formData = {
                propertyID: properties[i].id,
                articleTypeID: selectedArticleType?.id
            }
            GetArticleTypePropertyByIDs(formData).then((response: any) => {
                const formDataNew = {
                    propertyID: response.data.propertyID,
                    articleTypeID: response.data.articleTypeID,
                    required: properties[i].required,
                    visable: properties[i].visable
                }
                UpdateArticleTypePropertyByID(response.data.id, formDataNew).catch((error) => {
                    ExceptionHandler(error, t);
                });
            }).catch((error) => {
                ExceptionHandler(error, t);
            });
        }

        if (selectedArticleType != undefined) {
            UpdateArticleTypeByID(selectedArticleType?.id, selectedArticleType).then((response: any) => {
                setToast({
                    closable: true,
                    severity: 'success',
                    summary: t("userFeedback.success.articleTypes.articleTypeEditedHeader"),
                    detail: t("userFeedback.success.articleTypes.articleTypeEdited", { articleTypeName: response.data.name }),
                    life: 4000
                });
                navigate("/articleType");
            });
        }
    }

    function removeProperty(property: PropertyDto) {
        const formData = {
            propertyID: property.id,
            articleTypeID: selectedArticleType?.id
        }

        GetArticleTypePropertyByIDs(formData).then((response: any) => {
            DeleteArticleTypePropertyByID(response.data.id).then(() => {
                refreshProperties(selectedArticleType?.id);
            }).catch((error) => {
                ExceptionHandler(error, t);
            })
        }).catch((error: any) => {
            ExceptionHandler(error, t);
        })
    }

    function AddPropertyToArticleType(e: any,currentProperty:PropertyDto) {
        if (articleTypeProperty.required == undefined) {
            articleTypeProperty.required = false;
        }
        if (articleTypeProperty.visable == undefined) {
            articleTypeProperty.visable = false;
        }
        const formData = {
            propertyID: currentProperty?.id,
            articleTypeID: selectedArticleType?.id,
            required: articleTypeProperty.required,
            visable: articleTypeProperty.visable,
        }

        CreateArticleTypeProperty(formData).then(() => {
            op.current?.toggle(e);

            setArticleTypeProperty({
                ...articleTypeProperty,
                required: false,
                visable: false
            });

            refreshProperties(selectedArticleType?.id);

        }).catch((error) => {
            ExceptionHandler(error, t);
        })
    }

    function handleCheckChange(e: any, property: PropertyDtoWithExtra) {
        console.log(JSON.stringify(property));
        const { name, checked } = e.target;
        const updatedProperties = [...properties];
        const index = updatedProperties.indexOf(property);

        updatedProperties[index] = {
            ...property,
            [name]: checked
        };

        setProperties(updatedProperties);
    }

    const closeButton: CustomButton = {
        onClick: () => navigate("/articleType"),
        type: "button",
        content: t("buttons.close")
    };

    const deleteButton: CustomButton = {
        onClick: DeleteArticleType,
        type: "button",
        content: t("buttons.delete")
    };

    const createButton: CustomButton = {
        type: "submit",
        content: t("buttons.save"),
    }

    function checkRequiredTemplate(property: any) {
        return (
            <input name="required" type="checkbox" checked={property.required} onChange={(e) => handleCheckChange(e, property)} />
        );
    }

    function checkVisableTemplate(property: any) {
        return (
            <input name="visable" type="checkbox" checked={property.visable} onChange={(e) => handleCheckChange(e, property)} />
        );
    }

    return (
        <AppHeader title={t("articleTypes.edit.header")}>
            {selectedArticleType == undefined && (
                <SpinnerTemplate />
            )}
            <form name="myForm" onSubmit={SubmitEditedArticleType}>
                <div className={global.gridContainer}>
                    <div className={styles.formContainer}>
                        <div className={styles.propertyContainer}>
                            <p className={global.headerStyle}>{t("articleTypes.edit.articleTypeDetails")}</p>
                            <div className={styles.articleTypeData}></div>
                            <div className={global.fieldGroup}>
                                <label>{t("articleTypes.dashboard.table.nameHeader")}</label>
                                <input value={selectedArticleType?.name} name="name" onChange={handleChange} />
                            </div>

                            <div className={global.fieldGroup}>
                                <label>{t("articleTypes.dashboard.table.priceHeader")}</label>
                                <input
                                    value={selectedArticleType?.standardPrice?.toString()}
                                    name="standardPrice"
                                    type="number"
                                    onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <div className={styles.formContainer}>
                        <div className={styles.propertyContainer}>
                            <p className={global.headerStyle}>{t("articleTypes.edit.allPropertiesHeader")}</p>
                            <DataTable
                                className={`${styles.propertyTable2} ${global.orangestripe}`}
                                scrollable
                                scrollHeight="470px"
                                value={availableProperties}
                                emptyMessage={t("articleTypes.edit.noAvailableProperties")}
                                resizableColumns
                            >
                                <Column field="name" header={t("property.dashboard.table.name")} filter />
                                <Column field="propertyName" header={t("property.dashboard.table.propertyName")} filter />
                                <Column field="englishName" header={t("property.dashboard.table.englishName")} filter />
                                <Column
                                    field=""
                                    header=""
                                    className={global.utilitybtn}
                                    body={(property: PropertyDto) => (
                                        <i className="fa-solid fa-plus" onClick={(e) =>  AddPropertyToArticleType(e,property)} />
                                    )}
                                />
                            </DataTable>
                        </div>
                    </div>

                    <div className={styles.formContainer}>
                        <div className={styles.articleTypeContainer}>
                            <p className={global.headerStyle}>{t("articleTypes.edit.linkedPropertiesHeader")}</p>
                            <DataTable
                                className={`${styles.propertyTable} ${global.orangestripe}`}
                                scrollable
                                scrollHeight="250px"
                                value={properties}
                                emptyMessage={t("articleTypes.edit.noPropertiesFound")}
                                resizableColumns
                            >
                                <Column field="name" header={t("property.dashboard.table.name")} />
                                <Column field="propertyName" header={t("property.dashboard.table.propertyName")} />
                                <Column field="englishName" header={t("property.dashboard.table.englishName")} />
                                <Column field="required" header={t("property.dashboard.table.required")} body={checkRequiredTemplate} />
                                <Column field="visable" header={t("property.dashboard.table.visable")} body={checkVisableTemplate} />
                                <Column
                                    field=""
                                    header=""
                                    className={global.utilitybtn}
                                    body={(property: PropertyDto) => (
                                        <BtnTemplate
                                            item={property}
                                            onClick={(e) => removeProperty(e)}
                                            icon="fa-solid fa-trash-can"
                                            alt={t("user.table.editButton")}
                                        />
                                    )}
                                />
                            </DataTable>
                        </div>
                    </div>

                    <div className={styles.buttonContainer}>
                        <MultipleActionButtonBase cancelButton={closeButton} actionButton={deleteButton} confirmationButton={createButton} />
                    </div>
                </div>
            </form>
        </AppHeader>
    );
};

export default EditArticleType;

