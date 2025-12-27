import assert from "node:assert";
import { ButtonBuilder } from "discord.js";
import { Position } from "./types";

const numberEmojis = ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];

export const getNumberEmoji = (number: number): string => {
    assert(number >= 0 && number <= 9);
    return numberEmojis[number];
};

export const removeEmoji = (button: ButtonBuilder): ButtonBuilder => {
    if ("emoji" in button.data) {
        button.data.emoji = undefined;
    }

    return button;
};

export const moveInDirection = (pos: Position, direction: string): Position => {
    if (direction === "up") return { x: pos.x, y: pos.y - 1 };
    if (direction === "down") return { x: pos.x, y: pos.y + 1 };
    if (direction === "left") return { x: pos.x - 1, y: pos.y };
    if (direction === "right") return { x: pos.x + 1, y: pos.y };
    return pos;
};

export const getOppositeDirection = (direction: string): string => {
    if (direction === "up") return "down";
    if (direction === "down") return "up";
    if (direction === "left") return "right";
    return "left";
};
