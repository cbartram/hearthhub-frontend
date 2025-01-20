import { createContext, useContext, useState } from 'react';
const AuthContext = createContext(null);

// AuthProvider is used in main.tsx and provides the login, logout, and user props to any component
// in the Tree. AuthProvider wraps all components (currently) so that any component can get information about
// the currently authenticated user.
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = async () => {
        if(localStorage.getItem("accessToken") == null) {
            console.error("User must login with discord first as the access token is null.")
            return false;
        }

        try {
            const response = await fetch(`https://discord.com/api/users/@me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
                }
            });

            const data = await response.json();
            if (response.status !== 200) {
                console.error(`Unexpected response code while getting user from Discord: ${response.status}`)
                console.error(data)
                return
            }

            console.log('setting user data: ', data)
            setUser(data);
            return true;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('accessToken');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};