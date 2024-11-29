import { CertificateTicketDto, CertificateTicketUpdateDto } from "../dto/CertificateTicketDto";
import baseService from "./Baseservice";

export const GetAllCertificateTickets = () => new Promise((resolve, reject) => {
    baseService.get("CertificateTicket").then((response) => {
        resolve(response);
    }).catch((error) => reject(error))
});

export const GetCertificateTicketByID = (id: number) => new Promise((resolve, reject) => {
    baseService.get(`CertificateTicket/${id}`).then((response) => {
        resolve(response);
    }).catch((error) => reject(error))
});

export const CreateCertificateTicket = (formData: CertificateTicketDto) => new Promise((resolve, reject) => {
    baseService.post("CertificateTicket", {
        certificateID: formData.certificateID,
        ticketID: formData.ticketID,
    }).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});

export const UpdateCertificateTicketByID = (id: number | undefined, formData: CertificateTicketDto) => new Promise((resolve, reject) => {
    baseService.patch(`CertificateTicket/${id}`, {
        certificateID: formData.certificateID,
        ticketID: formData.ticketID,
    }).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});

export const DeleteCertificateTicketByID = (id: number | undefined) => new Promise((resolve, reject) => {
    baseService.delete(`CertificateTicket/${id}`).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});

export const GetCertificatesByTicketID = (id: number | undefined) => new Promise((resolve, reject) => {
    baseService.get(`CertificateTicket/GetCertificatesByTicketID/${id}`).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});

export const UpdateCertificateTicketByIDs = (certificateTicketData: CertificateTicketUpdateDto) => new Promise((resolve, reject) => {
    baseService.patch("CertificateTicket/UpdateCertificateTicketByIDs", {
        oldCertificateID: certificateTicketData.oldCertificateID,
        newCertificateID: certificateTicketData.newCertificateID,
        oldTicketID: certificateTicketData.oldTicketID,
        newTicketID: certificateTicketData.newTicketID,
    }).then((response) => {
        resolve(response)
    }).catch((error) => {
        reject(error)
    })
})