import { ArticleDto } from "./ArticleDto";
import { ArticleTypeDto } from "./ArticleTypeDto";

export interface PropertyDtoWithExtra {
    id?: number;
    name?: string;
    propertyName?: string;
    englishName?: string;
    fieldType?: number;
    required?: boolean;
    visable?: boolean;
}

export interface PropertyDto {
    id?: number;
    name?: string;
    propertyName?: string;
    englishName?: string;
    fieldType?: number;
    propertyChoises?: PropertyChoiseDto[];
    articleTypeID?: number;
    articleType?: ArticleTypeDto;
}

export interface ArticleTypePropertyDto {
    id?: number;
    propertyID?: number;
    property?: PropertyDto;
    articleTypeID?: number;
    article: ArticleDto;
    required?: boolean;
    visable?: boolean;
}

export interface PropertyChoiseDto {
    id?: number;
    propertyID?: number;
    value?: string;
}

export interface PropertyBooleanDto {
    required?: boolean;
    visable?: boolean;
}

export interface ArticletypePropertyFilterDto {
    propertyID?: number | undefined;
    articleTypeID?: number | undefined;
}

export interface PropertyDataDto {
    certificateID?: number | undefined;
    articleTypeID?: number | undefined;

}