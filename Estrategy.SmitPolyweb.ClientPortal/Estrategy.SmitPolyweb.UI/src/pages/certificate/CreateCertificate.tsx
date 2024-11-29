/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { useState, useEffect } from "react";

import styles from "../../css/AddCertificate.module.css";

import global from "../../css/global.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { Accordion, AccordionTab } from "primereact/accordion";
import { useTranslation } from "react-i18next";
import AppHeader from "../../components/AppHeader";
import { CustomButton } from "../../components/CustomButton";
import MultipleActionButtonBase from "../../components/MultipleActionButtonBase";
import { useToast } from "../../components/ToastContext";
import { ArticleDto } from "../../dto/ArticleDto";
import { CertificateDto, Status } from "../../dto/CertificateDto";
import { CustomerDto } from "../../dto/CustomerDto";
import { SupplierDto } from "../../dto/SupplierDto";
import ExceptionHandler from "../../exceptionHandler/ExceptionHandler";
import { GetAllArticleTypes } from "../../services/ArticleTypeService";
import { GetAllCertificateTypes } from "../../services/CertificateTypeService";
import { GetAllCustomers } from "../../services/Customerservices";
import { GetAllSuppliers } from "../../services/SupplierService";
import { GetAllArticles } from "../../services/ArticleService";
import { CheckForMissingRequiredFields } from "../../helpers/MissingRequiredInputHelper";
import { CreateNewCertificate } from "../../services/CertificateService";
import { ArticleTypePropertyDto, PropertyDto } from "../../dto/PropertyDto";
import { GetAllProperties } from "../../services/PropertyService";
import { ArticleTypeDto } from "../../dto/ArticleTypeDto";

function CreateCertificate() {
    const [t] = useTranslation();
    const navigate = useNavigate();
    const setToast = useToast();
    const duplicatedCertificate = useLocation();

    const [certificate, setCertificate] = useState<CertificateDto>(duplicatedCertificate.state?.duplicatedCertificate || {});

    const workTypes = [t("workTypes.newlyDelivered"), t("workTypes.inspect"), t("workTypes.inspectAndTest"),
    t("workTypes.rejected"), t("workTypes.outOfOrder"), t("workTypes.reUse")];
    const [articles, setArticles] = useState<ArticleDto[]>([]);
    const [articleTypes, setArticleTypes] = useState<ArticleTypeDto[]>([]);
    const [customers, setCustomers] = useState<CustomerDto[]>([]);
    const [suppliers, setSuppliers] = useState<SupplierDto[]>([]);
    const [certificateTypes, setCertificateTypes] = useState([]);
    const [properties, setProperties] = useState<PropertyDto[]>([]); // Meant for the loading of properties with all their children
    const [inputs, setInputs] = useState([{ propertyID: 0, inputValue: "", labelValue: "", fieldType: 0, required: false, visable: false }]);
    const [loading, setLoading] = useState<boolean>(true);


    const requiredFields = [
        { name: "supplier", value: certificate?.supplier },
        { name: "customer", value: certificate?.customer },
        { name: "certificateType", value: certificate?.certificateType },
        { name: "articleType", value: certificate?.articleType },
        { name: "registrationNumber", value: certificate?.registrationNumber },
        { name: "customerReferenceNumber", value: certificate?.customerReferenceNumber },
        { name: "workType", value: certificate?.workType },
        { name: "articleType", value: certificate?.articleType },
        { name: "supplyDate", value: certificate?.supplyDate },
        { name: "customerName", value: certificate?.customer?.customerName },
        { name: "debtorNumber", value: certificate?.debtorNumber }
    ];

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                // Fetch all data concurrently
                const [
                    certificateTypesResponse,
                    customersResponse,
                    articleTypesResponse,
                    suppliersResponse,
                    articlesResponse,
                    propertiesResponse
                ]: any = await Promise.all([
                    GetAllCertificateTypes(),
                    GetAllCustomers(),
                    GetAllArticleTypes(),
                    GetAllSuppliers(),
                    GetAllArticles(),
                    GetAllProperties()
                ]);

                // Set everything for dropdowns
                setCertificateTypes(certificateTypesResponse.data);
                setCustomers(customersResponse.data);
                setArticleTypes(articleTypesResponse.data);
                setSuppliers(suppliersResponse.data);
                setArticles(articlesResponse.data);
                setProperties(propertiesResponse.data);

                // Set loading to false since we finished loading all the data
                setLoading(false);

            } catch (error) {
                setLoading(false);
                ExceptionHandler(error, t);
            }
        };
        fetchData();
    }, [])

    useEffect(() => {
        console.log("loopies")
        articles.forEach((article) => {
            const property = properties.find((x) => x.articleTypeID === article.articleTypeID);
            const temp2: ArticleTypePropertyDto = {article: article, property: property};
            article.articleType?.properties?.push(temp2);
        })
    }, [properties])

    // Update the ID of customerAddress when the address changes
    useEffect(() => {
        setCertificate({
            ...certificate,
            customerAddressID: certificate?.customerAddress?.id
        })
    }, [certificate?.customerAddress])

    // Get the properties for ArticleType when it changes
    useEffect(() => {
        if (certificate && certificate?.article && certificate?.article?.articleTypeID) {
            setCertificate({
                ...certificate,
                articleID: certificate.article?.id
            })

            let tempInput = { propertyID: 0, inputValue: "", labelValue: "", fieldType: 0, required: false, visable: false };

            const tempInputList: any = [];

            if (certificate.articleType?.properties) {
                certificate.articleType?.properties.forEach((prop) => {
                    const tempProp = properties.find((p) => p.id === prop.propertyID);
                    tempInput.required = prop.required!;
                    tempInput.visable = prop.visable!;
                    tempInput.labelValue = tempProp?.name || ""
                    tempInput.fieldType = tempProp?.fieldType || 0;
                    tempInput.propertyID = tempProp?.id || 0;
                    if (tempInput.visable) {
                        tempInputList.push(tempInput);
                    }
                    tempInput = { propertyID: 0, inputValue: "", labelValue: "", fieldType: 0, required: false, visable: false };
                })
            }
            setInputs(tempInputList);
        }
    }, [certificate?.article]);

    // Set the debtor number, address, customer name and the ID when the customer changes
    useEffect(() => {
        setCertificate({
            ...certificate,
            customerID: certificate?.customer?.id,
            debtorNumber: certificate?.customer?.debtorNumber,
            customerSearchName: certificate?.customer?.searchName,
            customerAddress: certificate?.customer?.address,
        })
    }, [certificate?.customer])

    // Set the right address, it's ID and the supplier's ID when the supplier changes
    useEffect(() => {
        setCertificate({
            ...certificate,
            supplierAddress: certificate?.supplier?.address,
            supplierAddressID: certificate?.supplier?.address?.id,
            supplierID: certificate?.supplier?.id
        })
    }, [certificate?.supplier])

    // Set the right expiration date when you change the supply date
    useEffect(() => {
        const supplyDate = certificate?.supplyDate;
        setCertificate({
            ...certificate,
            expirationDate: moment(supplyDate).add(1, 'year').format("YYYY-MM-DD")
        })
    }, [certificate?.supplyDate])

    // Update the ID of certificateType when it changes
    useEffect(() => {
        setCertificate({
            ...certificate,
            certificateTypeID: certificate?.certificateType?.id
        })
    }, [certificate?.certificateType])

    const handleChangeInput = (event: any, index: any) => {
        const { name, value } = event.target;
        const onChangeValue: any = [...inputs];
        onChangeValue[index][name] = value;
        setInputs(onChangeValue);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | DropdownChangeEvent) => {
        const { value, name } = e.target;
        setCertificate((prevCertificate: CertificateDto) => {

            const keys = name.split('.'); // Split nested keys, e.g., "customerAddress.addition"
            const updatedCertificate = { ...prevCertificate }; // Clone the certificate object

            let current: any = updatedCertificate; // Use any for dynamic traversal
            keys.forEach((key: string, index: number) => {
                if (index === keys.length - 1) {
                    // If this is the last key, update the value
                    current[key] = value;
                } else {
                    // If the key doesn't exist, initialize it as an object
                    current[key] = current[key] || {};
                    current = current[key]; // Move deeper into the object
                }
            });

            return updatedCertificate;
        });
    };

    function CreateCertificateFunction(e: any) {

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

        const formData: CertificateDto = {
            ...certificate,
            status: Status.Valid
        }

        CreateNewCertificate(formData).then((response: any) => {
            setToast({
                closable: true,
                severity: 'success',
                summary: t("userFeedback.success.certificates.certificateCreatedHeader"),
                detail: t("userFeedback.success.certificates.certificateCreated", { registrationNumber: response.data.registrationNumber }),
                life: 4000
            });
            navigate(`/certificate/edit/${response.data.id}`);
        }).catch((error: any) => {
            ExceptionHandler(error, t);
        });
    };

    function ClearForm() {
        setCertificate({});
    }

    function CopyAddress() {
        if (certificate) {
            setCertificate({
                ...certificate,
                customerAddress: certificate?.supplierAddress,
                customerAddressID: certificate?.supplierAddressID
            })
        }
    }

    const copyButton: CustomButton = {
        type: "button",
        onClick: CopyAddress,
        content: t("buttons.copyAddress")
    }

    const saveButton: CustomButton = {
        type: "submit",
        content: t("buttons.create")
    }

    const clearButton: CustomButton = {
        type: "reset",
        onClick: ClearForm,
        content: t("buttons.clear")
    }

    return (
        <AppHeader title={t("certificates.creation.createCertificateHeader")}>
            <form onSubmit={CreateCertificateFunction}>
                <div className={global.gridContainer}>
                    <div className={global.formContainer}>
                        <p className={global.headerStyle}>{t("certificates.creation.dataSupplierHeader")}</p>

                        <div className={global.fieldGroup}>
                            <label>{t("certificates.creation.supplier")}</label>
                            <Dropdown
                                id="suppliers"
                                name="supplier"
                                value={certificate?.supplier}
                                onChange={handleChange}
                                options={suppliers}
                                optionLabel="name"
                                placeholder={t("general.searchOnName")}
                                loading={loading}
                                className={global.dropdownStyle}
                                filter />
                        </div>

                        <div className={global.fieldGroup}>
                            <label>{t("contactInformation.streetName")}</label>
                            <input
                                value={certificate?.supplierAddress?.streetName}
                                name="supplierAddress.streetName"
                                onChange={handleChange}
                                placeholder={t("contactInformation.streetName")}
                            />
                        </div>

                        <div className={global.fieldGroup}>
                            <label>{t("contactInformation.houseNumber")}</label>
                            <input
                                value={certificate?.supplierAddress?.houseNumber}
                                name="supplierAddress.houseNumber"
                                onChange={handleChange}
                                placeholder={t("contactInformation.houseNumber")}
                            />
                        </div>

                        <div className={global.fieldGroup}>
                            <label>{t("contactInformation.affix")}</label>
                            <input
                                value={certificate?.supplierAddress?.addition}
                                name="supplierAddress.addition"
                                onChange={handleChange}
                                placeholder={t("contactInformation.affix")}
                            />
                        </div>

                        <div className={global.fieldGroup}>
                            <label>{t("contactInformation.zipCode")}</label>
                            <input
                                value={certificate?.supplierAddress?.postalCode}
                                name="supplierAddress.postalCode"
                                onChange={handleChange}
                                placeholder={t("certificates.creation.postalCodeExample")}
                            />
                        </div>

                        <div className={global.fieldGroup}>
                            <label>{t("contactInformation.city")}</label>
                            <input
                                value={certificate?.supplierAddress?.city}
                                name="supplierAddress.city"
                                onChange={handleChange}
                                placeholder={t("contactInformation.city")}
                            />
                        </div>

                        <div className={global.fieldGroup}>
                            <label>{t("contactInformation.country")}</label>
                            <input
                                value={certificate?.supplierAddress?.country}
                                name="supplierAddress.country"
                                onChange={handleChange}
                                placeholder={t("contactInformation.country")}
                            />
                        </div>

                        <div className={styles.copyButtonContainer}>
                            <div className={styles.copyButtonPos}>
                                <MultipleActionButtonBase actionButton={copyButton} />
                            </div>
                        </div>
                    </div>

                    <div className={global.formContainer}>
                        <p className={global.headerStyle}>{t("certificates.creation.customerDataHeader")}</p>

                        <div className={global.fieldGroup}>
                            <label>
                                {t("certificates.creation.debtorNumber")}
                            </label>
                            <Dropdown
                                id="customer"
                                name="customer"
                                value={certificate?.customer}
                                onChange={handleChange}
                                options={customers}
                                optionLabel="debtorNumber"
                                placeholder={t("certificates.creation.debtorNumber")}
                                loading={loading}
                                className={global.dropdownStyle}
                                filter
                            />
                        </div>

                        <div className={global.fieldGroup}>
                            <label>{t("certificates.creation.customerName")}</label>
                            <Dropdown
                                name="customer"
                                value={certificate?.customer}
                                onChange={handleChange}
                                options={customers}
                                optionLabel="customerName"
                                placeholder={t("certificates.creation.customerName")}
                                loading={loading}
                                className={global.dropdownStyle}
                                filter
                            />

                        </div>

                        <div className={global.fieldGroup}>
                            <label>{t("contactInformation.streetName")}</label>
                            <input
                                value={certificate?.customerAddress?.streetName}
                                name="customerAddress.streetName"
                                onChange={handleChange}
                                placeholder={t("contactInformation.streetName")}
                            />

                        </div>

                        <div className={global.fieldGroup}>
                            <label>{t("contactInformation.houseNumber")}</label>
                            <input
                                value={certificate?.customerAddress?.houseNumber}
                                name="customerAddress.houseNumber"
                                onChange={handleChange}
                                placeholder={t("contactInformation.houseNumber")}
                            />
                        </div>
                        <div className={global.fieldGroup}>
                            <label>{t("contactInformation.affix")}</label>
                            <input
                                value={certificate?.customerAddress?.addition}
                                name="customerAddress.addition"
                                onChange={handleChange}
                                placeholder={t("contactInformation.affix")}
                            />
                        </div>
                        <div className={global.fieldGroup}>
                            <label>{t("contactInformation.zipCode")}</label>
                            <input
                                value={certificate?.customerAddress?.postalCode}
                                name="customerAddress.postalCode"
                                onChange={handleChange}
                                placeholder={t("certificates.creation.postalCodeExample")}
                            />
                        </div>
                        <div className={global.fieldGroup}>
                            <label>{t("contactInformation.city")}</label>
                            <input
                                value={certificate?.customerAddress?.city}
                                name="customerAddress.city"
                                onChange={handleChange}
                                placeholder={t("contactInformation.city")}
                            />
                        </div>
                        <div className={global.fieldGroup}>
                            <label>{t("contactInformation.country")}</label>
                            <input
                                value={certificate?.customerAddress?.country}
                                name="customerAddress.country"
                                onChange={handleChange}
                                placeholder={t("contactInformation.country")}
                            />
                        </div>
                    </div>

                    <div className={global.formContainer}>
                        <p className={global.headerStyle}>{t("certificates.creation.articleSelectHeader")}</p>

                        <div className={global.fieldGroup}>
                            <label>{t("certificates.creation.articleNumber")}</label>
                            <Dropdown
                                id="articleNumber"
                                name="article"
                                value={certificate?.article}
                                onChange={handleChange}
                                options={articles}
                                optionLabel="id"
                                placeholder={t("certificates.creation.articleNumber")}
                                loading={loading}
                                className={global.dropdownStyle}
                                filter
                            />
                        </div>

                        <div className={global.fieldGroup}>
                            <label>{t("certificates.creation.articleName")}</label>
                            <Dropdown
                                id="articleName"
                                name="article"
                                value={certificate?.article}
                                onChange={handleChange}
                                options={articles}
                                optionLabel="name"
                                placeholder={t("certificates.creation.articleName")}
                                loading={loading}
                                className={global.dropdownStyle}
                                filter
                            />
                        </div>

                        <div className={global.fieldGroup}>
                            <label>{t("certificates.creation.articleDescription")}</label>
                            <Dropdown
                                id="articleDescription"
                                name="article"
                                value={certificate?.article}
                                onChange={handleChange}
                                options={articles}
                                optionLabel="description"
                                placeholder={t("certificates.creation.articleDescription")}
                                loading={loading}
                                className={global.dropdownStyle}
                            />
                        </div>
                        {JSON.stringify(certificate?.article?.articleType)}
                        {certificate?.article?.articleType?.properties && certificate?.article?.articleType?.properties.length > 0 &&
                            <>
                                <p className={global.headerStyle}>{t("certificates.edit.properties")}</p>
                                <div className={styles.detailsField}>
                                    <div className={styles.detailStyle}>
                                        <Accordion activeIndex={0}>
                                            <AccordionTab className={styles.propertyField} header={t("certificates.edit.detailsHeader")}>
                                            <div className={styles.propertyFieldDropwdown}>
                                                {(certificate?.article?.articleType?.properties[0] != undefined) && (
                                                        <div>
                                                            {inputs.map((item, index) =>
                                                            (<div className={styles.propertyContainer} key={index}>
                                                                {(item.fieldType == 1) && (
                                                                    <div className={styles.choiseContainer}>
                                                                        <label className={styles.labelStyle}>{item.labelValue} </label>
                                                                        <input
                                                                            name="inputValue"
                                                                            type="text"
                                                                            required={item.required}
                                                                            value={item.inputValue}
                                                                            className={styles.inputStyle}
                                                                            placeholder={item.labelValue}
                                                                            onChange={(event) => handleChangeInput(event, index)}
                                                                        />
                                                                    </div>
                                                                )}
                                                                {(item.fieldType == 2) && (
                                                                    <div className={styles.choiseContainer}>
                                                                        <label className={styles.labelStyle}>{item.labelValue} </label>
                                                                        <input
                                                                            name="inputValue"
                                                                            type="number"
                                                                            required={item.required}
                                                                            value={item.inputValue}
                                                                            className={styles.inputStyle}
                                                                            placeholder={item.labelValue}
                                                                            onChange={(event) => handleChangeInput(event, index)}
                                                                        />
                                                                    </div>
                                                                )}
                                                                {(item.fieldType == 3) && (
                                                                    <div className={styles.choiseContainer}>
                                                                        <label className={styles.labelStyle}>{item.labelValue} </label>
                                                                        <Dropdown
                                                                            name="inputValue"
                                                                            required={item.required}
                                                                            className={styles.dropdownStyles}
                                                                            value={item.inputValue}
                                                                            placeholder={item.labelValue}
                                                                            options={properties?.find((x) => x.id === item.propertyID)?.propertyChoises}
                                                                            optionLabel="value"
                                                                            onChange={(event) => handleChangeInput(event, index)}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </AccordionTab>
                                        </Accordion>
                                    </div>
                                </div>
                            </>
                        }
                    </div>

                    <div className={global.formContainer}>
                        <p className={global.headerStyle}>{t("certificates.creation.certificateTypeHeader")}</p>

                        <div className={global.fieldGroup}>
                            <label>{t("certificates.creation.certificateType")}</label>
                            <Dropdown
                                id="certificatetype"
                                name="certificateType"
                                value={certificate?.certificateType}
                                onChange={handleChange}
                                options={certificateTypes}
                                optionLabel="name"
                                placeholder={t("certificates.creation.certificateType")}
                                loading={loading}
                                className={global.dropdownStyle}
                                filter
                            />

                        </div>

                        <div className={global.fieldGroup}>
                            <label>{t("certificates.creation.certificateCategory")}</label>
                            <Dropdown
                                id="articleType"
                                name="article"
                                value={certificate?.article}
                                onChange={handleChange}
                                options={articles}
                                optionLabel="articleType.name"
                                placeholder={t("certificates.creation.certificateCategory")}
                                loading={loading}
                                className={global.dropdownStyle}
                                filter
                            />

                        </div>

                        <div className={global.fieldGroup}>
                            <label>{t("certificates.creation.certificateNumber")}</label>
                            <input
                                id="registrationNumber"
                                value={certificate?.registrationNumber}
                                onChange={handleChange}
                                name="registrationNumber"
                                type="number"
                                placeholder={t("certificates.creation.certificateNumber")}
                            />
                        </div>

                        <div className={global.fieldGroup}>
                            <label>{t("certificates.creation.customerReference")}</label>
                            <input
                                id="customerReferenceNumber"
                                value={certificate?.customerReferenceNumber}
                                onChange={handleChange}
                                name="customerReferenceNumber"
                                type="text"
                                placeholder={t("certificates.creation.customerReference")}
                            />
                        </div>

                        <div className={global.fieldGroup}>
                            <label>{t("certificates.creation.jobType")}</label>
                            <Dropdown
                                id="workType"
                                name="workType"
                                // If you don't use .find to find this it won't work for some reason, thanks prime react...
                                value={workTypes.find((workType) => certificate?.workType !== undefined && workType.includes(certificate?.workType))}
                                onChange={handleChange}
                                options={workTypes}
                                placeholder={t("certificates.creation.jobType")}
                                loading={loading}
                                className={global.dropdownStyle}
                                filter
                            />

                        </div>

                        <div className={global.fieldGroup}>
                            <label>{t("certificates.creation.certificateTypeHeader")}</label>
                            <input
                                value={certificate?.description}
                                onChange={handleChange}
                                name="description"
                                type="text"
                                placeholder={t("certificates.creation.certificateTypeHeader")}
                            />
                        </div>

                        <div className={global.fieldGroup}>
                            <label>{t("certificates.creation.deliveryDate")}</label>
                            <input
                                id="supplyDate"
                                name="supplyDate"
                                type="date"
                                max={moment().format('YYYY-MM-DD')}
                                value={certificate?.supplyDate ? moment(certificate?.supplyDate).format('YYYY-MM-DD').toString() : ""}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={global.fieldGroup}>
                            <label>{t("certificates.creation.additionalText")}</label>
                            <input
                                value={certificate?.extraInfo}
                                onChange={handleChange}
                                type="text"
                                name="extraInfo"
                                placeholder={t("certificates.creation.additionalText")} />
                        </div>
                        <div className={styles.buttonContainer}>
                            <MultipleActionButtonBase actionButton={clearButton} confirmationButton={saveButton} />
                        </div>
                    </div>
                </div>
            </form>
        </AppHeader >
    );
}
export default CreateCertificate;