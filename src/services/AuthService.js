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
        return false;
      }

      // Create a simple credential request
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      const publicKeyCredentialRequestOptions = {
        challenge,
        timeout: 60000,
        userVerification: 'required' // Force user verification (biometric or PIN)
      };

      // This will trigger the device's authentication prompt
      const credential = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions
      });

      return !!credential;
    } catch (error) {
      console.error("Authentication error:", error);
      return false;
    }
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
