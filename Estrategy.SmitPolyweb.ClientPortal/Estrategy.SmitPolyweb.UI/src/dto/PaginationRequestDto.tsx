export interface PaginationRequestDto {
    entities: object[],
    page: number,
    totalRecords: number,
    totalPages: number
}