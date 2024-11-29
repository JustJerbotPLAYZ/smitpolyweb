import { Navigate } from 'react-router-dom';
import { ReactNode, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface AuthProps {
    children: ReactNode;
}

export function PrivateRoute({ children }: AuthProps) {
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        console.log("privateRoute is authenticated:", isAuthenticated);
    }, [isAuthenticated]);
    
    return isAuthenticated ? children : <Navigate to="/" />;
}
