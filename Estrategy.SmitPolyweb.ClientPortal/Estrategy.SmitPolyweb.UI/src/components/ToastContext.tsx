/* eslint-disable @typescript-eslint/no-explicit-any */
// ToastContext.tsx
import { createContext, useRef, useContext } from 'react';
import { Toast } from 'primereact/toast';
import { ToastMessage } from 'primereact/toast';

// Global variable to store the setToast function
let globalSetToast: (msg: ToastMessage) => void;

// Define types for the context
type ToastContextType = (msg: ToastMessage) => void;

// Create the context with a default value of null
const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider = ({ children }:any) => {
    const toast = useRef<Toast>(null);

    const setToast = (msg: ToastMessage) => {
        toast.current?.show(msg);
    };

    // Set the global function here
    globalSetToast = setToast;

    return (
        <ToastContext.Provider value={setToast}>
            {children}
            <Toast ref={toast} position={"bottom-center"} />
        </ToastContext.Provider>
    );
};

// This allows you to use the globally stored setToast function outside of React components
export const getGlobalSetToast = () => {
    if (!globalSetToast) {
        throw new Error('ToastProvider is not initialized');
    }
    return globalSetToast;
};

// Custom hook for use inside React components
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
