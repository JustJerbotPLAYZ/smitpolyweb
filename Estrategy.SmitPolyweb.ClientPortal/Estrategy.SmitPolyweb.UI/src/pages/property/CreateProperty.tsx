/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";

import styles from "../../css/AddProperty.module.css";
import global from "../../css/global.module.css";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import AppHeader from "../../components/AppHeader";
import { CustomButton } from "../../components/CustomButton";
import MultipleActionButtonBase from "../../components/MultipleActionButtonBase";
import { useToast } from "../../components/ToastContext";
import { PropertyDtoWithExtra } from "../../dto/PropertyDto";
import ExceptionHandler from "../../exceptionHandler/ExceptionHandler";
import { CreatePropertyChoise } from "../../services/PropertyChoiseService";
import { CheckForMissingRequiredFields } from "../../helpers/MissingRequiredInputHelper";
import { CreateNewProperty } from "../../services/PropertyService";


function CreateProperty() {
    const [t] = useTranslation();
    const navigate = useNavigate();
    const setToast = useToast();
    const [propertyData, setPropertyData] = useState<PropertyDtoWithExtra>();
    const [selectedFieldType, setSelectedFieldType] = useState();

    const requiredFields = [
        { name: "name", value: propertyData?.name },
        { name: "propertyName", value: propertyData?.propertyName },
        { name: "englishName", value: propertyData?.englishName },
        { name: "fieldType", value: selectedFieldType },
        
    ];

    const fieldTypesList = [
        { name: t("property.fieldTypes.textField"), value: 1 },
        { name: t("property.fieldTypes.numberField"), value: 2 },
        { name: t("property.fieldTypes.selectionField"), value: 3 },
    ];

    const [inputs, setInputs] = useState([{ inputValue: "" }]);

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

    const handleChange = (e: any) => {
        const value = e.target.value;
        setPropertyData({
            ...propertyData,
            [e.target.name]: value,
        });
    };

    function CreatePropertyFunction(e: any) {

        e.preventDefault();

        // Define required fields for validation


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
        };
        if (selectedFieldType == 3 && inputs[0].inputValue == "") {
            setToast({
                closable: true,
                severity: 'error',
                summary: t("userFeedback.errors.missingRequiredFieldsHeader"),
                detail: t("userFeedback.errors.missingRequiredFields"),
                life: 4000
            });
        } else {
            CreateNewProperty(formData).then((response: any) => {

                if (response.data.fieldType == 3 && inputs != null) {
                    for (let i: number = inputs.length - 1; i >= 0; i--) {
                        const formPropertyChoise = {
                            propertyID: response.data.id,
                            value: inputs[i].inputValue,
                        }

                        if (formPropertyChoise.value) {
                            CreatePropertyChoise(formPropertyChoise).catch((error) => {
                                ExceptionHandler(error, t);
                            });
                        }
                    }
                }

                setToast({
                    closable: true,
                    severity: 'success',
                    summary: t("userFeedback.success.properties.propertyCreatedHeader"),
                    detail: t("userFeedback.success.properties.propertyCreated", { name: response.data.name }),
                    life: 4000
                });

                navigate(`/property/edit/${response.data.id}`);

            }).catch((error) => {
                ExceptionHandler(error, t);
            });
        }


    }

    function ClearForm() {
        setPropertyData(undefined);
        setSelectedFieldType(undefined);
    }

    function navigateProperty() {
        navigate("/property");
    }

    const closeButton: CustomButton = {
        type: "button",
        onClick: navigateProperty,
        content: t("buttons.close")
    }

    const clearButton: CustomButton = {
        type: "reset",
        onClick: ClearForm,
        content: t("buttons.clear")
    }

    const createButton: CustomButton = {
        type: "submit",
        content: t("buttons.create")
    }

    return (
        <AppHeader
            title={t("characteristics.creation.createCharacteristicsHeader")}
        >
            <form onSubmit={CreatePropertyFunction}>
                <div className={`${global.gridContainer} ${styles.articleForm}`}>
                    <div className={global.formContainer}>
                        <p className={global.headerStyle}>
                            {t("property.creation.details")}
                        </p>
                        <div className={global.fieldGroup}>
                            <label>{t("property.creation.labels.name")}</label>
                            <input
                                id="name"
                                value={propertyData?.name}
                                onChange={handleChange}
                                name="name"
                                placeholder={t("property.creation.labels.name")}
                            />
                        </div>

                        <div className={global.fieldGroup}>
                            <label>{t("property.creation.labels.propertyName")}</label>
                            <input
                                id="propertyName"
                                value={propertyData?.propertyName}
                                onChange={handleChange}
                                name="propertyName"
                                placeholder={t("property.creation.labels.propertyName")}
                            />
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

                        {selectedFieldType == 3 && (
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
                                                <button
                                                    className={styles.deleteButton}
                                                    type="button"
                                                    onClick={() => handleDeleteInput(index)}
                                                >
                                                    <i className="fa-solid fa-trash-can" />
                                                </button>
                                            )}
                                            {index === inputs.length - 1 && (
                                                <button className={styles.addInputButton} onClick={() => handleAddInput()}>
                                                    {t("buttons.add")}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className={styles.buttonsContainer}>
                    <MultipleActionButtonBase cancelButton={closeButton} actionButton={clearButton} confirmationButton={createButton} />
                </div>
            </form>
        </AppHeader>
    );
}
export default CreateProperty;


