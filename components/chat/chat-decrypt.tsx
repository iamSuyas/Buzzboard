export const decryptMessage = async (ciphertext:any, key:any, iv:any) => {
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      ciphertext
    );
  
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  };
  