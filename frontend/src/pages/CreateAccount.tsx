import { Lock, Mail, Store } from "lucide-react";
import { Link } from "react-router-dom";

import Button from "../components/ui/Button";
import TextField from "../components/ui/TextField";

export default function CreateAccount() {
    return (
        <main className="auth-page">
            <section className="auth-card">
                <div className="auth-media" aria-hidden="true">
                    <img src="/auth/login-office.jpeg" alt="" />
                    <div className="auth-media-overlay">
                        <div className="auth-logo large">
                            <Store size={26} />
                        </div>
                        <p>New store</p>
                        <h1>Start with a clean admin foundation.</h1>
                        <span>Registration will plug into the backend once tenant onboarding is implemented.</span>
                    </div>
                </div>

                <div className="auth-form-panel">
                    <div className="auth-copy">
                        <p className="eyebrow">Get started</p>
                        <h2>Create account</h2>
                        <p>Reserve this screen for store onboarding and owner account creation.</p>
                    </div>

                    <form className="auth-form">
                        <TextField label="Store name" placeholder="Commerzia Store" />
                        <TextField
                            icon={<Mail size={17} />}
                            label="Email"
                            placeholder="owner@store.com"
                            type="email"
                        />
                        <TextField
                            icon={<Lock size={17} />}
                            label="Password"
                            placeholder="********"
                            type="password"
                        />

                        <label className="check-row">
                            <input type="checkbox" />
                            <span>I agree to the privacy policy</span>
                        </label>

                        <Button fullWidth type="button">
                            Create account
                        </Button>
                    </form>

                    <p className="auth-footer-text">
                        Already have an account? <Link to="/login">Log in</Link>
                    </p>
                </div>
            </section>
        </main>
    );
}
