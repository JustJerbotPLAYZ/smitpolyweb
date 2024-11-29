export interface Customer {
    ID: number;
    Email: string;
    DebtorNumber: string;
    SearchName: string;
    CustomerName: string;
    PhoneNumber: string;
    FaxNumber: string;
    CertificateEmailSettings: number;
    CertificateExpirationReminder: number;
    SalePercentage: number;
    LogoID: number;
    UserIDs: number[];
    AddressID: number;
}