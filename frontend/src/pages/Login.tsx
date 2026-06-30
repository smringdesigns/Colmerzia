import { useState } from "react";
import { login } from "../features/auth/authApi";
import { useAuthStore } from "../store/authStore";

export default function Login() {

    const setUser = useAuthStore(
        state => state.setUser
    );

    const setToken = useAuthStore(
        state => state.setToken
    );

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    async function handleSubmit(
        e: React.FormEvent
    ) {
        e.preventDefault();

        try {

            const data =
                await login(
                    email,
                    password
                );

            setUser(data.user);

            setToken(data.token);

            console.log(data);

        } catch (error) {

            console.error(error);

            alert(
                "Credenciales inválidas"
            );
        }
    }

    return (
        <div className="p-10">

            <h1>
                Login
            </h1>

            <form
                onSubmit={handleSubmit}
            >

                <input
                    value={email}
                    onChange={e =>
                        setEmail(
                            e.target.value
                        )
                    }
                    placeholder="Email"
                />

                <br />

                <input
                    type="password"
                    value={password}
                    onChange={e =>
                        setPassword(
                            e.target.value
                        )
                    }
                    placeholder="Password"
                />

                <br />

                <button
                    type="submit"
                >
                    Entrar
                </button>

            </form>

        </div>
    );
}