import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import * as translationNL from "../locales/nl/nl.json";

export const resources = {
    "nl-NL": {
        translation: translationNL,
    },
};

i18n
    .use(initReactI18next)
    .use(Backend)
    .init({
        resources: resources,

        fallbackLng: "nl-NL",

        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
    });

export default i18n;
