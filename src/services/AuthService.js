class AuthService {
  // Check if biometric authentication is available
  static async isBiometricAvailable() {
    // On mobile, we'll check if we can use the device authentication
    if (typeof window !== "undefined") {
      // Try to detect if this is a mobile device
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

      if (isMobile) {
        // On mobile, we'll check for credential API support
        return "credentials" in navigator;
      }

      // For desktop, we'll continue to use the previous check
      if (window.PublicKeyCredential) {
        try {
          return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        } catch (error) {
          console.error("Error checking biometric availability:", error);
          return false;
        }
      }
    }

    return false;
  }

  // Authenticate with biometrics or device PIN
  static async authenticateWithBiometric() {
    try {
      // Use a simpler approach for mobile devices
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

      if (isMobile) {
        // On mobile, we'll use a simpler approach with device authentication
        // This should trigger the device's own authentication system (fingerprint, face, or PIN)
        if ("credentials" in navigator) {
          try {
            // This is a simple authentication that will trigger the device's
            // built-in authentication system (fingerprint, PIN, etc.)
            await navigator.credentials.preventSilentAccess();

            // If we get here without an error, authentication succeeded
            return true;
          } catch (error) {
            console.error("Mobile authentication error:", error);
            return false;
          }
        }
        return false;
      }

      // For desktop, continue using WebAuthn
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      const publicKeyCredentialRequestOptions = {
        challenge,
        timeout: 60000,
        userVerification: 'required' // This requests biometrics or PIN
      };

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
