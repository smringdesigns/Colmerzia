import { Mail, Store } from "lucide-react";
import { Link } from "react-router-dom";

import Button from "../components/ui/Button";
import TextField from "../components/ui/TextField";

export default function ForgotPassword() {
    return (
        <main className="auth-page">
            <section className="auth-card auth-card-compact">
                <div className="auth-media" aria-hidden="true">
                    <img src="/auth/login-office.jpeg" alt="" />
                    <div className="auth-media-overlay">
                        <div className="auth-logo large">
                            <Store size={26} />
                        </div>
                        <p>Account recovery</p>
                        <h1>Get back into your commerce workspace.</h1>
                        <span>We will connect this flow to email delivery when auth recovery is ready.</span>
                    </div>
                </div>

                <div className="auth-form-panel">
                    <div className="auth-copy">
                        <p className="eyebrow">Password help</p>
                        <h2>Forgot password</h2>
                        <p>Enter your email and we will prepare the recovery flow for your account.</p>
                    </div>

                    <form className="auth-form">
                        <TextField
                            icon={<Mail size={17} />}
                            label="Email"
                            placeholder="admin@commerzia.com"
                            type="email"
                        />

                        <Button fullWidth type="button">
                            Send recovery link
                        </Button>
                    </form>

                    <p className="auth-footer-text">
                        Remembered it? <Link to="/login">Back to login</Link>
                    </p>
                </div>
            </section>
        </main>
    );
}
