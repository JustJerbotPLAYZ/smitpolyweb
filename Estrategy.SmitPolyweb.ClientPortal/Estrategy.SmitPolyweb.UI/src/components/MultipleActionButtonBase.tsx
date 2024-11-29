import global from "../css/global.module.css";
import { ButtonBase } from "./ButtonBase";

const MultipleActionButtonBase = function ({ cancelButton, actionButton, confirmationButton }: ButtonBase){

    return (
        <div className={global.buttonWrapper}>
            {cancelButton && (
                <button
                    className={global.cancelButton}
                    onClick={cancelButton.onClick}
                    type={cancelButton.type}
                    disabled={cancelButton.disabled}
                >
                    {cancelButton.content}
                </button>
            )}

            {actionButton && (

                <button
                    className={global.actionButton}
                    onClick={actionButton.onClick}
                    type={actionButton.type}
                    disabled={actionButton.disabled}
                >
                    {actionButton.content}
                </button>
            )}

            {confirmationButton && (

                <button
                    className={global.confirmationButton}
                    onClick={confirmationButton.onClick}
                    type={confirmationButton.type}
                    disabled={confirmationButton.disabled}
                >
                    {confirmationButton.content}
                </button>
            )}

        </div>
    );
};



export default MultipleActionButtonBase;