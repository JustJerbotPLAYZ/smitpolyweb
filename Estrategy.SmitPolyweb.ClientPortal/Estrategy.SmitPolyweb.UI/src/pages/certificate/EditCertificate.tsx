/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import moment from "moment";
import { useTranslation } from "react-i18next";
import AppHeader from "../../components/AppHeader";
import { CustomButton } from "../../components/CustomButton";
import MultipleActionButtonBase from "../../components/MultipleActionButtonBase";
import { CertificateDto, Status } from "../../dto/CertificateDto";
import { SupplierDto } from "../../dto/SupplierDto";
import ExceptionHandler from "../../exceptionHandler/ExceptionHandler";
import { GetCertificateByID, UpdateCertificateByID, DeleteCertificateByID } from "../../services/CertificateService";
import global from "../../css/global.module.css";
import styles from "../../css/EditCertificate.module.css";
import { GetAllCustomers } from "../../services/Customerservices";
import { GetAllArticles } from "../../services/ArticleService";
import { GetAllCertificateTypes } from "../../services/CertificateTypeService";
import { CheckForMissingRequiredFields } from "../../helpers/MissingRequiredInputHelper";
import { useToast } from "../../components/ToastContext";
import { GetAllArticleTypes } from "../../services/ArticleTypeService";
import { GetAllSuppliers } from "../../services/SupplierService";
import { CreateCertificateProperty, UpdateCertificatePropertyByID } from "../../services/CertificatePropertyService";
import { ArticleDto } from "../../dto/ArticleDto";
import { CustomerDto } from "../../dto/CustomerDto";
import { ArticleTypeDto } from "../../dto/ArticleTypeDto";

function EditCertificate() {
    const [t] = useTranslation();
    const navigate = useNavigate();
    const setToast = useToast();
    const [certificate, setCertificate] = useState<CertificateDto>();

    const workTypes = [t("workTypes.newlyDelivered"), t("workTypes.inspect"), t("workTypes.inspectAndTest"),
    t("workTypes.rejected"), t("workTypes.outOfOrder"), t("workTypes.reUse")];
    const [articles, setArticles] = useState<ArticleDto[]>([]);
    const [customers, setCustomers] = useState<CustomerDto[]>([]);
    const [suppliers, setSuppliers] = useState<SupplierDto[]>([]);
    const [articleTypes, setArticleTypes] = useState<ArticleTypeDto[]>([]);
    const [certificateTypes, setCertificateTypes] = useState();
    const [loading, setLoading] = useState<boolean>(true);


    const [inputs, setInputs] = useState([{ propertyID: 0, inputValue: "", labelValue: "", fieldType: 0, required: false, visable: false }]);
    const statusList = [
        { name: t("certificates.status.Expired"), value: Status.Expired },
        { name: t("certificates.status.Disapproved"), value: Status.Disapproved },
        { name: t("certificates.status.OutofOrder"), value: Status.OutofOrder },
        { name: t("certificates.status.Valid"), value: Status.Valid }
    ];

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
        { name: "debtorNumber", value: certificate?.customer?.debtorNumber },
        { name: "selectedSupplier", value: certificate?.supplier },
    ];

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const url = window.location.pathname.split("/");
                const entityID = parseInt(url.pop()!);

                // Fetch all data concurrently
                const [
                    certificateTypesResponse,
                    articlesResponse,
                    customersResponse,
                    articleTypesResponse,
                    suppliersResponse,
                    certificateResponse,
                ]: any = await Promise.all([
                    GetAllCertificateTypes(),
                    GetAllArticles(),
                    GetAllCustomers(),
                    GetAllArticleTypes(),
                    GetAllSuppliers(),
                    GetCertificateByID(entityID),
                ]);
                certificateResponse.data.article = articlesResponse.data.find((x: ArticleDto) => x.id === certificateResponse.data.article.id);

                // Set everything for dropdowns
                setCertificateTypes(certificateTypesResponse.data);
                setArticles(articlesResponse.data);
                setCustomers(customersResponse.data);
                setArticleTypes(articleTypesResponse.data);
                setSuppliers(suppliersResponse.data);

                // Set selected certificate
                {
                    const certificate: CertificateDto = certificateResponse.data;
                    setCertificate(certificate);
                }
                console.log(certificate)


                // Set loading state to false since all the information is already loaded (except for properties that doesn't use the loading state)
                setLoading(false);
            } catch (error) {
                setLoading(false);
                ExceptionHandler(error, t);
            }
        };

        fetchData();
    }, []);

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

    useEffect(() => {
        console.log(certificate)
    }, [certificate])

    // Set the right address, it's ID and the supplier's ID when the supplier changes
    useEffect(() => {
        setCertificate({
            ...certificate,
            supplierAddress: certificate?.supplier?.address,
            supplierAddressID: certificate?.supplier?.address?.id,
            supplierID: certificate?.supplier?.id
        })
    }, [certificate?.supplier])

    useEffect(() => {
        setCertificate({
            ...certificate,
            articleID: certificate?.article?.id
        })
    }, [certificate?.article])

    useEffect(() => {
        // Update the articleTypeID when article updates
        setCertificate({
            ...certificate,
            articleTypeID: certificate?.articleType?.id
        });
    }, [certificate?.articleType]);

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

    const handleChangeInput = (event: any, index: any) => {
        const { name, value } = event.target;
        const onChangeValue: any = [...inputs];
        onChangeValue[index][name] = value;
        setInputs(onChangeValue);
    };

    const navCert = () => {
        navigate("/certificate");
    }

    const emailCurrentPage = () => {
        if (!loading) {
            //    window.location.href = "mailto:?subject=" + document.title + "&body=" + encodeURI(document.location);
        }
    }

    const UpdateCert = (e: any) => {
        e.preventDefault();

        if (!loading) {
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

            UpdateCertificateByID(certificate?.id, certificate!)
                .then(() => {
                    inputs.forEach((input) => {
                        if (input.inputValue) {
                            UpdateCertificatePropertyByID(input.propertyID, {
                                propertyID: input.propertyID,
                                value: input.inputValue
                            }).catch((error: any) => {
                                ExceptionHandler(error, t);
                            });
                        } else {
                            const formData = {
                                propertyID: input.propertyID,
                                certificateID: certificate?.id,
                                value: input.inputValue
                            }
                            CreateCertificateProperty(formData).catch((error) => {
                                ExceptionHandler(error, t);
                            });
                        }
                    })

                    navigate("/certificate")
                })
                .catch((exception) => {
                    ExceptionHandler(exception, t)
                });
        }
    }


    function SetStatus() {
        if (!loading) {
            if (certificate != null)
                certificate.status = 2;
            UpdateCert(certificate?.id);
        }
    };

    function Print() {
        if (!loading) {
            window.print();
        }
    }

    function Copy() {
        if (!loading) {
            if (certificate) {
                navigate(`/certificate/create`, { state: { duplicatedCertificate: certificate } });
            }
        }
    }

    function DeleteCert() {
        if (!loading) {
            const id = certificate?.id;
            DeleteCertificateByID(id).then(() => {
                navigate("/certificate");
            }).catch((error) => {
                ExceptionHandler(error, t);
            });
        }
    };

    const saveButton: CustomButton = {
        type: "submit",
        content: t("buttons.save")
    }

    const deleteButton: CustomButton = {
        onClick: DeleteCert,
        type: "button",
        content: t("buttons.delete")
    }

    const statusButton: CustomButton = {
        onClick: SetStatus,
        type: "button",
        content: t("buttons.outOfOrder")
    }

    const printButton: CustomButton = {
        onClick: Print,
        type: "button",
        content: t("buttons.print")
    }

    const copyButton: CustomButton = {
        onClick: Copy,
        type: "button",
        content: t("buttons.duplicate")
    }

    const emailButton: CustomButton = {
        onClick: emailCurrentPage,
        type: "button",
        content: t("buttons.send")
    }

    const closeButton: CustomButton = {
        onClick: navCert,
        type: "button",
        content: t("buttons.close")
    }

    return (
        <AppHeader title={t("certificates.edit.editCertificateHeader")}>
            <form onSubmit={UpdateCert}>
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
                        3              <div className={global.fieldGroup}>
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
                        <div className={styles.articleFormContainer}>
                            <p className={global.headerStyle}>{t("certificates.creation.articleSelectHeader")}</p>
                            <div className={global.fieldGroup}>
                                <label>{t("certificates.creation.articleNumber")}</label>
                                <Dropdown
                                    id="articleNumber"
                                    name="article"
                                    value={articles.find(article => article.id === certificate?.article?.id)}
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
                                    value={articles.find(article => article.id === certificate?.article?.id)}
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
                                    value={articles.find(article => article.id === certificate?.article?.id)}
                                    onChange={handleChange}
                                    options={articles}
                                    optionLabel="description"
                                    placeholder={t("certificates.creation.articleDescription")}
                                    loading={loading}
                                    className={global.dropdownStyle}
                                />
                            </div>
                            <div className={global.formContainer}>
                                <div className={styles.makingGridTop}>
                                    {certificate?.article?.articleType?.properties && certificate?.article?.articleType?.properties?.length > 0 &&
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
                                                                                        options={certificate?.properties.filter((x) => x.propertyID == item.propertyID)}
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
                            </div>


                        </div>
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
                        {JSON.stringify(certificate?.article?.articleType)}
                        <div className={global.fieldGroup}>
                            <label>{t("certificates.creation.certificateCategory")}</label>
                            <Dropdown
                                id="articleType"
                                name="article.articleType"
                                value={certificate?.article?.articleType}
                                onChange={handleChange}
                                options={articleTypes}
                                optionLabel="name"
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
                                value={moment(certificate?.supplyDate).format('YYYY-MM-DD').toString()}
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

                        <div className={global.fieldGroup}>
                            <label>{t("certificates.creation.status")}</label>
                            <Dropdown
                                id="status"
                                name="status"
                                value={certificate?.status}
                                onChange={handleChange}
                                options={statusList}
                                optionLabel="name"
                                placeholder={t("certificates.creation.status")}
                                loading={loading}
                                className={global.dropdownStyle}
                                filter
                            />
                        </div>

                        <div className={styles.buttonContainer}>
                            <div className={styles.alignButtons2}>
                                <MultipleActionButtonBase actionButton={copyButton} />
                                <MultipleActionButtonBase actionButton={deleteButton} confirmationButton={saveButton} />
                            </div>
                            <div className={styles.alignButtons}>
                                <MultipleActionButtonBase actionButton={statusButton} />
                                <MultipleActionButtonBase actionButton={emailButton} />
                                <MultipleActionButtonBase actionButton={printButton} />
                            </div>
                            <div className={styles.lastButton}>
                                <MultipleActionButtonBase cancelButton={closeButton} />
                            </div>

                        </div>
                    </div>


                </div>
            </form>
        </AppHeader>
    )
};

export default EditCertificate;