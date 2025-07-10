
class EncryptionService {
  private static instance: EncryptionService;
  private keyPair: CryptoKeyPair | null = null;

  static getInstance(): EncryptionService {
    if (!EncryptionService.instance) {
      EncryptionService.instance = new EncryptionService();
    }
    return EncryptionService.instance;
  }

  async initialize(): Promise<void> {
    try {
      // Generate RSA key pair for E2E encryption
      this.keyPair = await window.crypto.subtle.generateKey(
        {
          name: "RSA-OAEP",
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"]
      );
      console.log('🔐 BuzzCall E2E encryption initialized');
    } catch (error) {
      console.error('❌ Encryption initialization failed:', error);
      throw error;
    }
  }

  async encryptMessage(message: string, recipientPublicKey?: CryptoKey): Promise<string> {
    if (!this.keyPair) {
      throw new Error('Encryption not initialized');
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    
    // Use recipient's public key or our own for demo
    const publicKey = recipientPublicKey || this.keyPair.publicKey;
    
    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP",
      },
      publicKey,
      data
    );

    return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
  }

  async decryptMessage(encryptedMessage: string): Promise<string> {
    if (!this.keyPair) {
      throw new Error('Encryption not initialized');
    }

    const encryptedData = Uint8Array.from(atob(encryptedMessage), c => c.charCodeAt(0));
    
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: "RSA-OAEP",
      },
      this.keyPair.privateKey,
      encryptedData
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  }

  async getPublicKeyString(): Promise<string> {
    if (!this.keyPair) {
      throw new Error('Encryption not initialized');
    }

    const exported = await window.crypto.subtle.exportKey(
      "spki",
      this.keyPair.publicKey
    );
    
    return btoa(String.fromCharCode(...new Uint8Array(exported)));
  }
}

export default EncryptionService.getInstance();
