import { Moment } from "moment";

export interface TicketDto {
    id?: number;
    ticketNumber?: number;
    description?: string;
    scheduled?: Moment;
    status?: number;
    articleID?: number;
    certificates?: number[];
    customerID?: number;
    userID?: number;
    addressID?: number;
    customerSearchName?: string;
    userFirstName?: string;
}