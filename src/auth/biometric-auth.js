export async function registerBiometric() {
    const publicKeyCredentialCreationOptions = {
        challenge: crypto.getRandomValues(new Uint8Array(32)),
        rp: { name: "SecurePass" },
        user: {
            id: new Uint8Array(16),
            name: "user@example.com",
            displayName: "SecurePass User"
        },
        pubKeyCredParams: [{ type: "public-key", alg: -7 }],
        authenticatorSelection: { userVerification: "required" },
        timeout: 60000,
        attestation: "direct"
    };

    return navigator.credentials.create({ publicKey: publicKeyCredentialCreationOptions });
}
