/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dropdown } from "primereact/dropdown";
import { useState, useEffect } from "react";
import { GetArticleTypeByID } from "../../services/ArticleTypeService";
import styles from "../../css/EditProperty.module.css";
import global from "../../css/global.module.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useToast } from "../../components/ToastContext";
import { DeleteProperty, GetArticleTypePropertyByPropertyID, GetPropertyByID, UpdatePropertyByID } from "../../services/PropertyService";
import { PropertyBooleanDto, PropertyChoiseDto, PropertyDto } from "../../dto/PropertyDto";
import { ArticleTypeDto } from "../../dto/ArticleTypeDto";
import { CreatePropertyChoise, DeletePropertyChoiseByID, GetPropertyChoisesByPropertyID } from "../../services/PropertyChoiseService";
import { CreateArticleTypeProperty, DeleteArticleTypePropertyByID } from "../../services/ArticleTypePropertyService";
import { CustomButton } from "../../components/CustomButton";
import MultipleActionButtonBase from "../../components/MultipleActionButtonBase";
import ExceptionHandler from "../../exceptionHandler/ExceptionHandler";
import AppHeader from "../../components/AppHeader";
import { CheckForMissingRequiredFields } from "../../helpers/MissingRequiredInputHelper";
import { SpinnerTemplate } from "../../components/Templates";

function EditProperty() {
    let tempNumber = 1;
    const [t] = useTranslation();
    const navigate = useNavigate();
    const setToast = useToast();
    const [propertyData, setPropertyData] = useState<PropertyDto>({});
    const [selectedFieldType, setSelectedFieldType] = useState();
    const [selectedArticleTypes, setSelectedArticleTypes] = useState<ArticleTypeDto[]>([]);
    const [propertyChoises, setPropertyChoises] = useState<PropertyChoiseDto[]>([]);
    const [propertyBoolean, setPropertyBoolean] = useState<PropertyBooleanDto>();
    const [inputs, setInputs] = useState([{ inputValue: "" }]);

    // Define required fields for validation
    const requiredFields = [
        { name: "name", value: propertyData?.name },
        { name: "propertyName", value: propertyData?.propertyName },
        { name: "englishName", value: propertyData?.englishName },
        { name: "fieldType", value: selectedFieldType }
    ];

    const fieldTypesList = [
        { name: t("property.fieldTypes.textField"), value: 1 },
        { name: t("property.fieldTypes.numberField"), value: 2 },
        { name: t("property.fieldTypes.selectionField"), value: 3 }
    ];

    const deleteButton: CustomButton = {
        onClick: deleteProperty,
        type: "button",
        content: t("buttons.delete")
    }

    const closeButton: CustomButton = {
        onClick: navigateProperty,
        type: "button",
        content: t("buttons.close")
    }

    const createButton: CustomButton = {
        type: "submit",
        content: t("buttons.save")
    }

    const handleAddInput = () => {
        setInputs([...inputs, { inputValue: "" }]);
    };

    const handleChangeInput = (event: any, index: any) => {
        const { name, value } = event.target;
        const onChangeValue: any = [...inputs];

        onChangeValue[index][name] = value;
        setInputs(onChangeValue);
    };

    const handleDeleteInput = (index: any) => {
        if (index > 0) {
            const newArray = [...inputs];
            newArray.splice(index, 1);
            setInputs(newArray);
        }
    };

    useEffect(() => {
        const url = window.location.pathname.split("/");
        const ID = parseInt(url.pop()!);
        const tempListInput: any = []
        const tempListPropertyChoises: PropertyChoiseDto[] = [];

        if (ID != null)
            //Get the property to edit
            GetPropertyByID(ID).then((response: any) => {
                setPropertyData(response.data);
                setSelectedFieldType(response.data.fieldType);

                //Get the choises if a property has fieldType 3
                if (response.data.fieldType == 3) {
                    GetPropertyChoisesByPropertyID(ID).then((response: any) => {
                        for (let i: number = response.data.length - 1; i >= 0; i--) {
                            const tempObj = { inputValue: "" }
                            tempObj.inputValue = response.data[i].value;
                            tempListInput.push(tempObj);
                            tempListPropertyChoises.push(response.data[i]);
                        }
                        setPropertyChoises(tempListPropertyChoises);
                        setInputs(tempListInput);
                    }).catch((error) => {
                        ExceptionHandler(error, t);
                    });
                }
            }).catch((error) => {
                ExceptionHandler(error, t);
            });

        //Get the articleTypes of articleTypeProperties
        GetArticleTypePropertyByPropertyID(ID).then((response: any) => {
            //Getting all the articleTypes from the articleProperty
            if (tempNumber == 1) {
                tempNumber++;
                for (let i: number = response.data.length - 1; i >= 0; i--) {
                    GetArticleTypeByID(response.data[i].articleTypeID).then((response: any) => {
                        if (!selectedArticleTypes.includes(response.data)) {
                            setSelectedArticleTypes(selectedArticleTypes => [...selectedArticleTypes, response.data]);
                        }

                    }).catch((error) => {
                        ExceptionHandler(error, t);
                    });
                }
            }

            //Setting the checkboxes to the currentData
            setPropertyBoolean({
                ...propertyBoolean,
                required: response.data[0]?.required,
                visable: response.data[0]?.visable
            });

        }).catch((error) => {
            ExceptionHandler(error, t);
        });
    },
        []);

    const handleChange = (e: any) => {
        const value = e.target.value;
        setPropertyData({
            ...propertyData,
            [e.target.name]: value
        });
    };

    function UpdatePropertyFunction(e: any) {
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

        const formData = {
            name: propertyData?.name,
            propertyName: propertyData?.propertyName,
            englishName: propertyData?.englishName,
            fieldType: selectedFieldType,
        }

        if (propertyData.fieldType == 3 && selectedFieldType != 3) {
            GetPropertyChoisesByPropertyID(propertyData.id).then((response: any) => {
                for (let i: number = response.data.length - 1; i >= 0; i--) {
                    DeletePropertyChoiseByID(response.data[i].id).catch((error) => {
                        ExceptionHandler(error, t);
                    });
                }
            }).catch((error) => {
                ExceptionHandler(error, t);
            });
        }

        //Update the articleTypeProperties
        GetArticleTypePropertyByPropertyID(propertyData?.id).then((response: any) => {
            for (let i: number = response.data.length - 1; i >= 0; i--) {
                DeleteArticleTypePropertyByID(response.data[i].id).catch((error) => {
                    ExceptionHandler(error, t);
                });
            }

            for (let i: number = selectedArticleTypes.length - 1; i >= 0; i--) {
                const formDataArt = {
                    propertyID: propertyData?.id,
                    articleTypeID: selectedArticleTypes[i].id,
                    required: propertyBoolean?.required,
                    visable: propertyBoolean?.visable
                }
                CreateArticleTypeProperty(formDataArt).catch((error) => {
                    ExceptionHandler(error, t);
                });
            }
        }).catch((error) => {
            ExceptionHandler(error, t);
        });

        //Update the property
        UpdatePropertyByID(propertyData?.id, formData).then((response: any) => {

            //Update the choiseFields if needed
            if (formData.fieldType == 3) {
                for (let i: number = propertyChoises.length - 1; i >= 0; i--) {
                    DeletePropertyChoiseByID(propertyChoises[i].id).catch((error) => {
                        ExceptionHandler(error, t);
                    });
                }
                for (let i: number = inputs.length - 1; i >= 0; i--) {
                    const formDataProp = {
                        propertyID: response.data.id,
                        value: inputs[i].inputValue,

                    }
                    CreatePropertyChoise(formDataProp).catch((error) => {
                        ExceptionHandler(error, t);
                    });
                }
            }
            setToast({
                closable: true,
                severity: 'success',
                summary: t("userFeedback.success.properties.propertyEditedHeader"),
                detail: t("userFeedback.success.properties.propertyEdited", { name: propertyData.name }),
                life: 4000
            });
            navigate(`/property`);
        }).catch((error) => {
            ExceptionHandler(error, t);
        });
    };


    function deleteProperty() {
        DeleteProperty(propertyData?.id).then((response: any) => {
            setToast({
                closable: true,
                severity: 'success',
                summary: t("userFeedback.success.properties.propertyDeletedHeader"),
                detail: t("userFeedback.success.properties.propertyDeleted", { name: response.data.name }),
                life: 4000
            });
            navigateProperty();
        }).catch((error) => {
            ExceptionHandler(error, t);
        });
    }

    function navigateProperty() {
        navigate("/property");
    }

    return (
        <AppHeader title={t("property.edit.header")}>
            {propertyData == undefined && (
                <SpinnerTemplate />
            )}
            <form onSubmit={UpdatePropertyFunction}>
                <div className={`${global.gridContainer} ${styles.articleForm}`}>
                    <div className={global.formContainer}>
                        <p className={global.headerStyle}>{t("property.creation.details")}</p>
                        <div className={global.fieldGroup}>
                            <label>{t("property.creation.labels.name")}</label>
                            <input id="name" value={propertyData?.name} onChange={handleChange} name="name" placeholder={t("property.creation.labels.name")} />
                        </div>

                        <div className={global.fieldGroup}>
                            <label>{t("property.creation.labels.propertyName")}</label>
                            <input id="propertyName" value={propertyData?.propertyName} onChange={handleChange} name="propertyName" placeholder={t("property.creation.labels.propertyName")} />
                        </div>

                        <div className={global.fieldGroup}>
                            <label>{t("property.creation.labels.englishName")}</label>
                            <input id="englishName" value={propertyData?.englishName} onChange={handleChange} name="englishName" placeholder={t("property.creation.labels.englishName")} />
                        </div>

                        <div className={global.fieldGroup}>
                            <label>{t("property.creation.labels.fieldType")}</label>
                            <Dropdown
                                id="fieldType"
                                value={selectedFieldType}
                                onChange={(e) => setSelectedFieldType(e.value)}
                                options={fieldTypesList}
                                placeholder={t("property.creation.labels.fieldType")}
                                optionLabel="name"
                                className={global.dropdownStyle} />
                        </div>

                        {(selectedFieldType == 3) && (
                            <div>
                                {inputs.map((item, index) => (
                                    <div className="input_container" key={index}>
                                        <div className={styles.choiseContainer}>
                                            <input
                                                name="inputValue"
                                                type="text"
                                                value={item.inputValue}
                                                className={styles.inputChoise}
                                                onChange={(event) => handleChangeInput(event, index)}
                                                placeholder={t("property.creation.customField")}
                                            />

                                            {inputs.length > 0 && (
                                                <button className={styles.deleteButton} type="button" onClick={() => handleDeleteInput(index)}><i className="fa-solid fa-trash-can" /></button>
                                            )}
                                            {index === inputs.length - 1 && (
                                                <button className={styles.addInputButton} onClick={() => handleAddInput()}>{t("buttons.add")}</button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className={styles.buttonsContainer}>
                    <MultipleActionButtonBase confirmationButton={createButton} actionButton={deleteButton} cancelButton={closeButton} />
                </div>
            </form>
        </AppHeader>
    );
}
export default EditProperty;