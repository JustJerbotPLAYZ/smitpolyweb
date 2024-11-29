export interface CertificateTicketDto {
    certificateID?: number | undefined;
    ticketID?: number | undefined;
}

export interface CertificateTicketUpdateDto {
    oldCertificateID?: number | undefined;
    newCertificateID?: number | undefined;
    oldTicketID?: number | undefined;
    newTicketID?: number | undefined;
}