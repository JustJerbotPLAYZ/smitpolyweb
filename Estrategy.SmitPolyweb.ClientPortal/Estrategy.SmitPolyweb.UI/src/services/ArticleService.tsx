import { ArticleDto } from "../dto/ArticleDto";
import baseService from "./Baseservice";

export const GetAllArticles = () => new Promise((resolve, reject) => {
    baseService.get("Article").then((response) => {
        resolve(response);
    }).catch((error) => reject(error))
});

export const GetArticleByID = (id: number | undefined) => new Promise((resolve, reject) => {
    baseService.get(`Article/${id}`).then((response) => {
        resolve(response);
    }).catch((error) => {
        reject(error)
    });
});

export const CreateArticle = (formData: ArticleDto) => new Promise((resolve, reject) => {
    baseService.post("Article", {
        ...formData
    }).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});

export const UpdateArticleByID = (id: number | undefined, formData: ArticleDto) => new Promise((resolve, reject) => {
    baseService.patch(`Article/${id}`, {
        name: formData.name,
        description: formData.description,
        articleTypeID: formData.articleTypeID,
        articleNumber: formData.articleNumber,
    }).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});

export const DeleteArticleByID = (id: number | undefined) => new Promise((resolve, reject) => {
    baseService.delete(`Article/${id}`).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});

export const GetArticleByNameFilter = (name: string) => new Promise((resolve, reject) => {
    baseService.get(`Article/GetByName/${name}`).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});

export const GetArticleByNumberFilter = (number: string) => new Promise((resolve, reject) => {
    baseService.get(`Article/GetByNumber/${number}`).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});



