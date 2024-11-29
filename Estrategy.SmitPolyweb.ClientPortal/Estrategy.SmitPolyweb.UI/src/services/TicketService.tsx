import { TicketDto } from "../dto/TicketDto";
import baseService from "./Baseservice"

export const GetAllTickets = () => new Promise((resolve, reject) => {
    baseService.get("Ticket").then((response) => {
        resolve(response);
    }).catch((error) => reject(error))
});

export const GetTicketByID = (id: number | undefined) => new Promise((resolve, reject) => {
    baseService.get(`Ticket/${id}`).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});

export const UpdateTicketByID = (id: number | undefined, formData: TicketDto) => new Promise((resolve, reject) => {
    baseService.patch(`Ticket/${id}`, {
        ticketNumber: formData.ticketNumber,
        description: formData.description,
        scheduled: formData.scheduled,
        customerSearchName: formData.customerSearchName,
        userFirstName: formData.userFirstName,
        status: formData.status,
        customerID: formData.customerID,
        userID: formData.userID,
        articleID: formData.articleID,
        addressID: formData.addressID,

    }).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});

export const DeleteTicketByID = (id: number | undefined) => new Promise((resolve, reject) => {
    baseService.delete(`Ticket/${id}`).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
})

export const CreateTicket = (formData: TicketDto) => new Promise((resolve, reject) => {
    console.log(JSON.stringify(formData));
    baseService.post("Ticket/", {
        ticketNumber: formData.ticketNumber,
        description: formData.description,
        scheduled: formData.scheduled,
        status: formData.status,
        customerID: formData.customerID,
        customerSearchName: formData.customerSearchName,
        userID: formData.userID,
        userFirstName: formData.userFirstName,
        articleID: formData.articleID,
        addressID: formData.addressID,
    }).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});