"use client";
import React from "react";
import crypto from 'crypto';

const defaultiv = 'awedswscwsadwsad';

export function useEncryption(rawkey, iv = defaultiv) {
    const key = React.useMemo(() => crypto.createHash('sha256').update(rawkey).digest(), [rawkey]);

    return (data) => {
        let cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let encryptedData = cipher.update(data, 'utf8', 'hex');
        encryptedData += cipher.final('hex');
        return encryptedData;
    };
}
export function useDecryption(rawkey, iv = defaultiv) {
    const key = React.useMemo(() => crypto.createHash('sha256').update(rawkey).digest(), [rawkey]);

    return (data) => {
        let decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decryptedData = decipher.update(data, 'hex', 'utf8');
        decryptedData += decipher.final('utf8');
        return decryptedData;
    };
}
