import { ButtonInteraction, APIEmbed as DiscordAPIEmbed } from "discord.js";

export type Awaitable<T> = T | Promise<T>;

export type APIEmbed = DiscordAPIEmbed & { color?: string | number };

/**
 * An embed, or a function to create one using the game.
 */
export type GameEmbed<G> = APIEmbed | ((game: G) => Awaitable<APIEmbed>);

/**
 * An embed, or a function to create one using the game and its result.
 */
export type GameEndEmbed<G, R> = APIEmbed | ((game: G, result: R) => Awaitable<APIEmbed>);

/**
 * A string, or a function to create one using the game.
 */
export type GameMessage<G> = string | ((game: G) => string);

/**
 * A string, or a function to create one using the game.
 */
export type GameInteractionMessage<G, I = ButtonInteraction> = string | ((game: G, i: I) => string);

/**
 * A string, or a function to create one using the turn data.
 */
export type GameTurnMessage<G, D> = string | ((turn: D, game: G) => string);

/**
 * A string, or a function to create one using the game and its result.
 */
export type GameEndMessage<G, R> = string | ((result: R, game: G) => string);

/**
 * Recursive version of TypeScript `Required` type.
 */
export type DeepRequired<T> = Required<{
    [K in keyof T]: T[K] extends Required<T[K]> ? T[K] : DeepRequired<T[K]>;
}>;

/**
 * Represents a 2D position.
 */
export interface Position {
    x: number;
    y: number;
}
