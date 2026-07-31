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

    const [isReady, setIsReady] = useState(false);

    useEffect(() => {

        if (!token) {

            setIsReady(true);

            return;
        }

        me()
            .then((user) => {

                console.log("ME:", user);

                setUser(user);

            })
            .catch((error) => {

                console.error(
                    "Error cargando el usuario:",
                    error
                );

            })
            .finally(() => {

                setIsReady(true);

            });

    }, [token, setUser]);

    return isReady;
}