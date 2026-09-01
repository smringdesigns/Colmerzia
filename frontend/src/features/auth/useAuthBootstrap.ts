import { useEffect, useState } from "react";

import { me } from "./authApi";
import { useAuthStore } from "../../store/authStore";

export function useAuthBootstrap() {

    const token = useAuthStore(
        (state) => state.token
    );

    const setUser = useAuthStore(
        (state) => state.setUser
    );

    const setToken = useAuthStore(
        (state) => state.setToken
    );

    const [isReady, setIsReady] = useState(false);

    useEffect(() => {

        if (!token) {

            setIsReady(true);

            return;
        }

        me()
            .then((user) => {

                setUser(user);

            })
            .catch((error) => {

                console.error(
                    "Error cargando el usuario:",
                    error
                );

                setUser(null);
                setToken(null);

            })
            .finally(() => {

                setIsReady(true);

            });

    }, [token, setToken, setUser]);

    return isReady;
}
