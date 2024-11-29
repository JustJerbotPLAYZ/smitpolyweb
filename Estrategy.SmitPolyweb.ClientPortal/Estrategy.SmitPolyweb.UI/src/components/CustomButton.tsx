import { ReactNode } from "react";
export interface CustomButton {
    onClick?: VoidFunction;
    type?: "submit" | "button" | "reset" | undefined;
    disabled?: boolean;
    content: ReactNode;
}