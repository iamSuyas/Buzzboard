
interface encryptMessageProps{
  plaintext:string,
  secretkey:any,
}

export const encryptMessage = async ({plaintext, secretkey}:encryptMessageProps) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);
    const iv = window.crypto.getRandomValues(new Uint8Array(12)); // Initialization vector
  
    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      secretkey,
      data
    );
  
    return {
      ciphertext: encrypted,
      iv: iv,
    };
  };
  