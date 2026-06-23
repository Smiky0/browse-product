type CursorPayload = {
    updatedAt: string;
    id: string;
};

export function encodeCursor(payload: CursorPayload): string {
    return Buffer.from(JSON.stringify(payload)).toString("base64");
}

export function decodeCursor(cursor: string): CursorPayload {
    return JSON.parse(Buffer.from(cursor, "base64").toString());
}
