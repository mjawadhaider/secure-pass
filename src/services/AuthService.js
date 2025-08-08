class AuthService {
  // Check if biometric authentication is available
  static async isBiometricAvailable() {
    if (!window.PublicKeyCredential) {
      return false;
    }

    try {
      return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    } catch (error) {
      console.error("Error checking biometric availability:", error);
      return false;
    }
  }

  // Authenticate with biometrics
  static async authenticateWithBiometric() {
    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      const publicKeyCredentialRequestOptions = {
        challenge,
        timeout: 60000,
        userVerification: 'required'
      };

      const credential = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions
      });

      return !!credential;
    } catch (error) {
      console.error("Biometric authentication error:", error);
      return false;
    }
  }

  // Save PIN to localStorage (encrypted in production)
  static savePin(pin) {
    localStorage.setItem('securepass_pin', pin);
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

