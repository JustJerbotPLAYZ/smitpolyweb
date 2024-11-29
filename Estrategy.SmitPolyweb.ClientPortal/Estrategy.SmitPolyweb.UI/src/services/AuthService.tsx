
const AuthDTO = "auth";
const getAuthStorage = () => sessionStorage.getItem(AuthDTO);
const getAuthenticationPreference = () => sessionStorage.getItem("authPref");

const setAuthenticationPreference = (pref: string) => {
    sessionStorage.setItem("authPref", pref);
};

//get the refresh token out of the session storage
const getLocalAccessToken = () => {
    const auth = JSON.parse(getAuthStorage() || '{}');
    return auth?.accessToken;
};

const getLocalRefreshToken = () => {
    const auth = JSON.parse(getAuthStorage() || '{}');
    return auth?.refreshToken;
};

const setAuth = (auth: string) => {
    sessionStorage.setItem(AuthDTO, JSON.stringify(auth));
};

const getAuth = () => {
    const auth = JSON.parse(getAuthStorage() || '{}');
    return auth;
};

const updateNewAccessToken = (token: string) => {
    const auth = getAuth();
    auth.accessToken = token;
    setAuth(auth);
};

const AuthService = {
    getAuthStorage,
    getAuthenticationPreference,
    setAuthenticationPreference,
    getLocalAccessToken,
    getLocalRefreshToken,
    setAuth,
    getAuth,
    updateNewAccessToken
};

export default AuthService;