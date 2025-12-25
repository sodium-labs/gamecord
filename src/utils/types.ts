import { APIEmbed } from "discord.js";

export type Awaitable<T> = T | Promise<T>;

export type GamecordAPIEmbed = APIEmbed & { color?: string | number };

export type Embed1<G> = GamecordAPIEmbed | ((game: G) => Awaitable<GamecordAPIEmbed>);

export type Embed2<G, R> = GamecordAPIEmbed | ((game: G, result: R) => Awaitable<GamecordAPIEmbed>);

export type GameMessage<G> = string | ((game: G) => string);
