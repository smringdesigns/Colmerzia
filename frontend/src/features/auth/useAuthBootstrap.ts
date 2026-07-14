import { useEffect, useState } from "react";

import { me } from "./authApi";
import { useAuthStore } from "../../store/authStore";

export function useAuthBootstrap() {

    const token = useAuthStore((state) => state.token);
    const setUser = useAuthStore((state) => state.setUser);

    const [isReady, setIsReady] = useState(false);

    useEffect(() => {

        if (!token) {
            setIsReady(true);
            return;
        }

        me()
            .then((res) => {

                console.log("ME:", res);

                setUser(res.data);

            })
            .catch((err) => {

                console.log(err);

            })
            .finally(() => {

                setIsReady(true);

            });

    }, [token, setUser]);

    return isReady;
}