import { ArticleTypeDto } from "./ArticleTypeDto";

export interface ArticleDto {
    id?: number;
    name?: string;
    articleNumber?: string;
    description?: string;
    articleTypeID?: number;
    articleType?: ArticleTypeDto;
}