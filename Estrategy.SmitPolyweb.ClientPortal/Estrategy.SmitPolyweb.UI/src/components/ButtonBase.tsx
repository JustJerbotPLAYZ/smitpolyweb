import { CustomButton } from "./CustomButton";

export interface ButtonBase {
    cancelButton?: CustomButton,
    actionButton?: CustomButton,
    confirmationButton?: CustomButton,
}