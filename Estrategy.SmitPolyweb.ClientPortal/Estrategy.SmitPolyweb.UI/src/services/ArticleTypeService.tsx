import { ArticleTypeDto } from "../dto/ArticleTypeDto";
import baseService from "./Baseservice";

export const GetAllArticleTypes = () => new Promise((resolve, reject) => {
    baseService.get("ArticleType").then((response) => {
        resolve(response);
    }).catch((error) => reject(error))
});

export const GetArticleTypeByID = (id: number | undefined) => new Promise((resolve, reject) => {
    baseService.get(`ArticleType/${id}`).then((response) => {
        resolve(response);
    }).catch((error) => reject(error))
});

export const CreateNewArticleType = (formData: ArticleTypeDto): Promise<{ status: number; data: ArticleTypeDto }> => {
    return new Promise((resolve, reject) => {
        baseService
            .post("ArticleType", {
                name: formData.name,
                standardPrice: formData.standardPrice,
            })
            .then((response) => {
                resolve(response as { status: number; data: ArticleTypeDto });
            })
            .catch((error) => {
                console.error("Error creating article type:", error);
                reject(error);
            });
    });
};

export const UpdateArticleTypeByID = (id: number | undefined, formData: ArticleTypeDto) => new Promise((resolve, reject) => {
    baseService.patch(`Articletype/${id}`, {
        name: formData.name,
        standardPrice: formData.standardPrice,
    }).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});

export const DeleteArticleTypeByID = (id: number | undefined) => new Promise((resolve, reject) => {
    baseService.delete(`ArticleType/${id}`).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});

export const GetArticleTypePropertyByArticleTypeID = (id: number | undefined) => new Promise((resolve, reject) => {
    baseService.get(`ArticleType/GetArticleTypePropertyByArticleTypeID/${id}`).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});

export const GetAllArticleTypePropertyData = (id: number | undefined) => new Promise((resolve, reject) => {
    baseService.get(`ArticleType/GetAllArticleTypePropertyData/${id}`).then((response) => {
        resolve(response)
    }).catch((error) => reject(error));

})