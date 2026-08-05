const STORAGE_KEY = "colmerzia_guest_token";

export function getGuestToken(): string | null {
    return localStorage.getItem(STORAGE_KEY);
}

export function setGuestToken(token: string): void {
    localStorage.setItem(STORAGE_KEY, token);
}

export function clearGuestToken(): void {
    localStorage.removeItem(STORAGE_KEY);
}
