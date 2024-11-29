import { ToastMessage } from "primereact/toast";
import { getGlobalSetToast } from "../components/ToastContext";
import AuthService from "../services/AuthService";
import baseService from "../services/Baseservice";
/* eslint-disable @typescript-eslint/no-explicit-any */

export default function ExceptionHandler(error: any, translation: any) {
    const setToast = getGlobalSetToast();
    const notFoundMsg: ToastMessage = { closable: true, severity: 'error', summary: translation("errors.notFound"), detail: translation("errors.notFoundMsg"), life: 10000 };
    const invalidDataMsg: ToastMessage = { closable: true, severity: 'error', summary: translation("errors.invalidData"), detail: translation("errors.invalidDataMsg"), life: 10000 }

    const somethingWrong: ToastMessage = { closable: true, severity: 'error', summary: translation("errors.somethingWrong"), detail: translation("errors.somethingWrongMsg"), life: 10000 }

    const unknownException: ToastMessage = { closable: true, severity: 'error', summary: translation("errors.unknownException"), detail: translation("errors.unknownExceptionMsg"), life: 10000 }

    const duplicateEntry: ToastMessage = { closable: true, severity: 'error', summary: translation("errors.duplicateEntry"), detail: translation("errors.duplicateEntryMsg"), life: 10000 }

    const duplicateArticleNumber: ToastMessage = { closable: true, severity: 'error', summary: translation("errors.duplicateArticleNumber"), detail: translation("errors.duplicateArticleNumberMsg"), life: 10000 }

    const duplicateCertificateNumber: ToastMessage = { closable: true, severity: 'error', summary: translation("errors.dulicatieCertificateNumber"), detail: translation("errors.dulicatieCertificateNumberMsg"), life: 10000 }

    const duplicateTicketNumber: ToastMessage = { closable: true, severity: 'error', summary: translation("errors.duplicateTicketNumber"), detail: translation("errors.duplicateTicketNumberMsg"), life: 10000 }

    const duplicateUserEmail: ToastMessage = { closable: true, severity: 'error', summary: translation("errors.duplicateUserEmail"), detail: translation("errors.duplicateUserEmailMsg"), life: 10000 }

    const previouslyUsedPassword: ToastMessage = { closable: true, severity: 'error', summary: translation("errors.previouslyUsedPassword"), detail: translation("errors.previouslyUsedPasswordMsg"), life: 10000 }

    const originalConfig = error?.config;


    switch (error.response?.status) {

        case error.response.status === 400 && error.response?.data?.errorMessage == "refresh token has expired" ||
            error.response?.data?.errorMessage == "Your token wasn't found! Please try logging in again":
            window.location.href = "/";
            return Promise.resolve();

        case 400:
            setToast(invalidDataMsg);
            return;

        case error.response.status === 401 && originalConfig.retry === undefined:
            try {
                baseService.post("Auth/Refresh", {
                    refreshTokenValue: AuthService.getLocalRefreshToken()
                }).then((response: any) => {
                    AuthService.updateNewAccessToken(response.data.accessTokenValue);
                    originalConfig.headers.Authorization = `Bearer ${response.data.accessTokenValue}`;
                    originalConfig.retry = true;
                    return baseService(originalConfig);
                });
            } catch (_error) {
                originalConfig.retry = false;
                return Promise.reject(_error);
            }
            break;

        case error.response.status === 401 && (originalConfig.retry || error.response?.data?.errorMessage?.match("Your token wasn't found! Please try logging in again")):
            return Promise.resolve();

        case 404:
            setToast(notFoundMsg);
            window.location.href = "/NotFound";
            return;

        case 409:
            switch (error.response.config.url) {
                case 'Article':
                    setToast(duplicateArticleNumber);
                    return;
                case 'Certificate':
                    setToast(duplicateCertificateNumber);
                    return;
                case 'Ticket':
                    setToast(duplicateTicketNumber);
                    return;
                case 'User':
                    setToast(duplicateUserEmail);
                    return;
                case 'Customer':
                    setToast(duplicateUserEmail);
                    return;
                default:
                    setToast(duplicateEntry);
                    return;
            }
            return;

        case 500:
            setToast(somethingWrong);
            return;

        default:
            setToast(unknownException);
            return;
    }
    if (error.response?.data == "Previously used password") {
        setToast(previouslyUsedPassword);
        return;
    }
}


