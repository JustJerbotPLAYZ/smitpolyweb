import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import "uikit/dist/css/uikit.min.css";
import { PrimeReactProvider } from 'primereact/api';
import { ToastProvider } from './components/ToastContext';
import i18n from './@types/i18n'
import { I18nextProvider } from 'react-i18next'
import { AuthProvider } from './context/AuthContext'

const inactivityTime = function () {
    let time: NodeJS.Timeout;
    // DOM Events
    document.onmousemove = resetTimer;
    document.onkeydown = resetTimer;
    document.onmousedown = resetTimer;
    document.ontouchstart = resetTimer;
    document.onclick = resetTimer;

    function logout() {
        if (window.location.pathname !== "/") {
            window.location.href = "/";
        }
    }

    function resetTimer() {
        const minutes = 10;
        // convert minutes to miliseconds
        const miliseconds = minutes * 60 * 1000;
        clearTimeout(time);
        time = setTimeout(logout, miliseconds)

    }
};

window.onload = function () {
    inactivityTime();
}

createRoot(document.getElementById('root')!).render(
    <PrimeReactProvider>
        <BrowserRouter>
            <StrictMode>
                <ToastProvider>
                    <I18nextProvider i18n={i18n}>
                        <AuthProvider>
                            <App />
                        </AuthProvider>
                    </I18nextProvider>
                </ToastProvider>
            </StrictMode>
        </BrowserRouter>
    </PrimeReactProvider>,
)
