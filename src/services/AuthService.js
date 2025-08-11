class AuthService {
    // Check if biometric authentication is available
    static async isBiometricAvailable() {
        // Simplified check that works more reliably
        if (typeof window !== "undefined") {
            // For WebAuthn on supported browsers
            if (window.PublicKeyCredential) {
                try {
                    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
                } catch (error) {
                    console.error("Error checking biometric availability:", error);
                }
            }
        }

        // Default to false if checks fail
        return false;
    }

    // Authenticate with biometrics
    static async authenticateWithBiometric() {
        try {
            if (!window.PublicKeyCredential) {
                return {msg: 'window.PublicKeyCredential is false', success: false};
            }

            // Create a simple credential request
            const challenge = new Uint8Array(32);
            window.crypto.getRandomValues(challenge);

            const publicKeyCredentialRequestOptions = {
                challenge: new Uint8Array(32),
                allowCredentials: [], // previously registered credentials
                timeout: 60000,
                userVerification: 'required' // Force user verification (biometric or PIN)
            };

            // This will trigger the device's authentication prompt
            const credential = await navigator.credentials.get({
                publicKey: publicKeyCredentialRequestOptions
            });

            console.log("Authenticated!", credential);

            if (!credential) {
                const isAuthCreated = AuthService.registerLocalCredential();
                if (isAuthCreated) {
                    return {
                        msg: typeof isAuthCreated === 'string' ? isAuthCreated : JSON.stringify(isAuthCreated),
                        success: false
                    };
                }
                return {
                    msg: 'AuthService.createAuthentication() has returned undefined. window.PublicKeyCredential is null or undefined',
                    success: false
                };
            }

            return {msg: credential, success: true};
        } catch (error) {
            console.error("Authentication error:", error);
            return {msg: error.message || error, success: false};
        }
    }

    static async authenticateLocal() {
        const logs = [];
        const credId = localStorage.getItem("securepass_credId");
        if (!credId) {
            await AuthService.registerLocalCredential();
            logs.push("No local credential found, registered a new one.");
        }

        const publicKey = {
            challenge: new Uint8Array(32), // Dummy challenge
            allowCredentials: [{
                id: Uint8Array.from(atob(credId), c => c.charCodeAt(0)),
                type: "public-key",
                transports: ["internal"]
            }],
            userVerification: "required",
            timeout: 60000
        };

        const assertion = await navigator.credentials.get({ publicKey });
        logs.push(`Assertion received: ${JSON.stringify(assertion)}`);

        return {logs, success: true};
    }

    static async registerLocalCredential() {
        const publicKey = {
            challenge: new Uint8Array(32), // Dummy challenge
            rp: {name: "SecurePass"},
            user: {
                id: new Uint8Array(16), // Random user ID
                name: "localuser",
                displayName: "Local User"
            },
            pubKeyCredParams: [{type: "public-key", alg: -7}],
            authenticatorSelection: {
                authenticatorAttachment: "platform", // Use device biometrics
                userVerification: "required"
            },
            timeout: 60000,
            attestation: "none"
        };

        const credential = await navigator.credentials.create({publicKey});

        // Store the credential ID locally for future authentication
        const credId = btoa(
            String.fromCharCode(...new Uint8Array(credential.rawId))
        );
        localStorage.setItem("securepass_credId", credId);

        console.log("Credential registered:", credId);
    }

    // Save PIN to localStorage (encrypted in production)
    static savePin(pin) {
        localStorage.setItem('securepass_pin', pin);
        return true;
    }

    // Check if PIN exists
    static hasPin() {
        return !!localStorage.getItem('securepass_pin');
    }

    // Verify PIN
    static verifyPin(pin) {
        const savedPin = localStorage.getItem('securepass_pin');
        return savedPin === pin;
    }
}

export default AuthService;
