import { ArticleTypePropertyDto, ArticletypePropertyFilterDto } from "../dto/PropertyDto";
import baseService from "./Baseservice";

export const GetAllArticleTypeProperties = () => new Promise((resolve, reject) => {
    baseService.get("ArticleTypeProperty").then((response) => {
        resolve(response);
    }).catch((error) => reject(error))
});

export const GetArticleTypePropertyByID = (id: number | undefined) => new Promise((resolve, reject) => {
    baseService.get(`ArticleTypeProperty/${id}`).then((response) => {
        resolve(response);
    }).catch((error) => reject(error))
});

export const CreateArticleTypeProperty = (formData: ArticleTypePropertyDto) => new Promise((resolve, reject) => {
    baseService.post("ArticleTypeProperty", {
        propertyID: formData.propertyID,
        articleTypeID: formData.articleTypeID,
        required: formData.required,
        visable: formData.visable
    }).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});

export const UpdateArticleTypePropertyByID = (id: number | undefined, formData: ArticleTypePropertyDto) => new Promise((resolve, reject) => {
    baseService.patch(`ArticleTypeProperty/${id}`, {
        propertyID: formData.propertyID,
        articleTypeID: formData.articleTypeID,
        required: formData.required,
        visable: formData.visable
    }).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});

export const DeleteArticleTypePropertyByID = (id: number | undefined) => new Promise((resolve, reject) => {
    baseService.delete(`ArticleTypeProperty/${id}`).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});

export const GetArticleTypePropertyByIDs = (formData:ArticletypePropertyFilterDto) => new Promise((resolve, reject) => {
    baseService.post("ArticleTypeProperty/GetArticleTypePropertyByIDs", {
        propertyID: formData.propertyID,
        articleTypeID: formData.articleTypeID
    }).then((response) => {
        resolve(response);
    }).catch((error) => reject(error));
});
