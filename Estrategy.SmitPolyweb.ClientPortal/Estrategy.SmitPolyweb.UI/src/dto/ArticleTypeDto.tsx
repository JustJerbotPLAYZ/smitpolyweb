import { ArticleTypePropertyDto } from "./PropertyDto";

export interface ArticleTypeDto {
    id?: number;
    name?: string;
    standardPrice?: number | null;
    properties?: ArticleTypePropertyDto[];
}