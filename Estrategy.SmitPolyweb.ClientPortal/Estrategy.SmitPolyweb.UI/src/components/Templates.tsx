import React from "react";
import { CertificateDto, Status } from "../dto/CertificateDto";
import styles from '../css/Template.module.css';
import global from "../css/global.module.css";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { ProgressSpinner } from "primereact/progressspinner";

// Define the props for the Edit Button component
type BtnTemplateProps<T> = {
    item: T; // Accept any type of item
    onClick: (item: T) => void; // onClick now works with the generic type
    icon: string;
    alt: string;
};

// The Edit Button Template Component
export const BtnTemplate = <T,>({ item, onClick, icon, alt }: BtnTemplateProps<T>) => {
    return (
        <i
            onClick={() => onClick(item)}
            className={`${global.utilitybtn} ${icon}`}
            title={alt}
        />
    );
};

// Define the props for the Status Template component
type StatusTemplateProps = {
    rowData: CertificateDto;
};

// The Status Template Component
export const StatusTemplate: React.FC<StatusTemplateProps> = ({ rowData }) => {
    const { t } = useTranslation();
    if (rowData.status !== undefined && Status[rowData.status]) {
        const theDate = moment(rowData.dateOfInspection);
        let dateOfInspection = theDate.format("DD-MM-YYYY");
        if (dateOfInspection == 'Invalid date') {
            dateOfInspection = " ";
        }
        switch (rowData.status) {
            case Status.Disapproved:
                return (
                    <div className={`${global.holdtogether}`}>
                        <div title={t("certificates.dashboard.actions.filtering.rejected")} className={`${styles.badge} ${styles.blackbadge}`}></div>

                        <div className={"test"}>{dateOfInspection.toString()}</div>
                    </div>
                );
            case Status.Expired:
                return (
                    <div className={`${global.holdtogether}`}>
                        <div title={t("certificates.dashboard.actions.filtering.expired")}  className={`${styles.badge} ${styles.redbadge}`} />
                        <div className={"test"}>{dateOfInspection.toString()}</div>                    </div>
                );
            case Status.OutofOrder:
                return (
                    <div className={`${global.holdtogether}`}>
                        <div title={t("certificates.dashboard.actions.filtering.notInUse")}  className={`${styles.badge} ${styles.graybadge}`} />
                        <div className={"test"}>{dateOfInspection.toString()}</div>                    </div>
                );
            case Status.Valid: {
                if (rowData.expirationDate) {
                    const expirationDate = new Date(rowData.expirationDate);
                    const in2Months: Date = new Date();
                    in2Months.setMonth(in2Months.getMonth() + 2);
                    if (expirationDate < in2Months) {
                        return (
                            <div className={`${global.holdtogether}`}>
                                <div title={t("certificates.dashboard.actions.filtering.duringMonths")}  className={`${styles.badge} ${styles.orangebadge}`} />
                                <div className={"test"}>{dateOfInspection.toString()}</div>                            </div>
                        );
                    }
                }
                return (
                    <div className={`${global.holdtogether}`}>
                        <div title={t("certificates.dashboard.actions.filtering.afterMonths2")}  className={`${styles.badge} ${styles.greenbadge}`} />
                        <div className={"test"}>{dateOfInspection.toString()}</div>                    </div>
                );
            }
            default:
                return <></>;
        }
    }
    return <></>;
};

export const SpinnerTemplate = () => {
    return (
        <ProgressSpinner className={global.progressSpinner} strokeWidth="4" animationDuration="4s" />
    );
}