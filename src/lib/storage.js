import {openDB} from 'idb';

const DB_NAME = 'securepass';
const STORE_NAME = 'passwords';

export async function initDB() {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            db.createObjectStore(STORE_NAME, {keyPath: 'id', autoIncrement: true});
        },
    });
}

export async function savePassword(title, username, password) {
    const db = await initDB();
    const encrypted = await encryptData(password);
    await db.add(STORE_NAME, {title, username, password: encrypted});
}

export async function getPasswords() {
    const db = await initDB();
    const all = await db.getAll(STORE_NAME);
    return all.map(p => ({
        ...p,
        password: '🔒 Locked' // decrypted later after auth
    }));
}

async function encryptData(data) {
    const enc = new TextEncoder().encode(data);
    const key = await getKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt({name: 'AES-GCM', iv}, key, enc);
    return JSON.stringify({iv: Array.from(iv), data: Array.from(new Uint8Array(encrypted))});
}

async function getKey() {
    return await crypto.subtle.generateKey(
        {name: 'AES-GCM', length: 256},
        true,
        ['encrypt', 'decrypt']
    );
}
