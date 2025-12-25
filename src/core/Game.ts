import { EventEmitter } from "node:events";
import {
    APIEmbed,
    Awaitable,
    InteractionEditReplyOptions,
    InteractionReplyOptions,
    Message,
    MessageCreateOptions,
    MessageEditOptions,
    RepliableInteraction,
    SendableChannels,
    User,
} from "discord.js";

export type GameContext = RepliableInteraction | Message;

export interface GameResult {
    /**
     * The player who started the game.
     */
    player: User;
    /**
     * The timestamp at which the game started.
     */
    gameStartedAt: number;
    /**
     * The duration of the game in milliseconds.
     */
    gameDuration: number;
}

// oxlint-disable-next-line no-unused-vars
export declare interface Game<Res, Ctx extends GameContext = GameContext> {
    /**
     * Emitted when an error occurred.
     */
    on(event: "error", listener: (err: unknown) => Awaitable<void>): this;
    /**
     * Emitted when a fatal error occurred. The "end" event will be emitted at the same time.
     * For example, this let you tell the players that the game stopped.
     *
     * This can only happens in some games, see their docs to know more.
     */
    on(event: "fatalError", listener: (err: unknown) => Awaitable<void>): this;
    /**
     * Only emitted on instances of {@link VersusGame}.
     *
     * Emitted if the versus is rejected, either manually by the opponent or because
     * he took too long to respond. In that case, the `gameOver` event
     * is not emitted.
     */
    on(event: "versusReject", listener: (reason: "user" | "time") => Awaitable<void>): this;
    /**
     * Emitted with the result when the game finishes.
     */
    on(event: "gameOver", listener: (result: Res) => Awaitable<void>): this;
    /**
     * Emitted when the game ends. Not necessarily emitted last (e.g. can be emitted just before `gameOver`).
     *
     * This event is guaranteed to be emitted after {@link Game#start} was successfully called, even after errors (fatal or not).
     */
    on(event: "end", listener: () => Awaitable<void>): this;
}

/**
 * The base class of a game.
 */
// oxlint-disable-next-line no-unused-vars
export abstract class Game<Res extends GameResult, Ctx extends GameContext = GameContext> extends EventEmitter {
    /**
     * The initial context that started this game, either an interaction or a message.
     */
    readonly context: Ctx;
    /**
     * If the {@link Game#context} is a `Message` or not.
     */
    readonly isMessage: boolean;
    /**
     * The player that started the game.
     */
    readonly player: User;

    /**
     * The timestamp at which the class was instantiated. Not when {@link Game#start} was called.
     */
    readonly gameStartedAt: number;

    constructor(context: Ctx) {
        super();

        this.context = context;
        const isMessage = context instanceof Message;
        this.isMessage = isMessage;
        this.player = isMessage ? context.author : context.user;
        this.gameStartedAt = Date.now();

        if (isMessage && !context.channel.isSendable()) {
            throw new Error("The context channel must be a sendable channel");
        }
    }

    /**
     * Returns the current duration of the game.
     */
    public getGameDuration() {
        return Date.now() - this.gameStartedAt;
    }

    /**
     * Start the game.
     */
    public abstract start(): Promise<void>;

    protected async sendMessage(options: MessageCreateOptions | InteractionEditReplyOptions): Promise<Message> {
        if (this.isMessage) {
            // The cast is valid since isMessage is a runtime check in the constructor.
            const message = this.context as Message;
            // The cast is valid since the channel is checked in the constructor.
            const channel = message.channel as SendableChannels;

            return await channel.send(options as MessageCreateOptions);
        } else {
            // The cast is valid since isMessage is a runtime check in the constructor.
            const interaction = this.context as RepliableInteraction;

            if (interaction.deferred || interaction.replied) {
                return await interaction.editReply(options as InteractionEditReplyOptions);
            } else {
                const result = await interaction.reply({ ...(options as InteractionReplyOptions), withResponse: true });
                return result.resource!.message!;
            }
        }
    }

    /**
     * Edit the context message if it was an interaction,
     * or edit the given message.
     *
     * Since the original context is only valid 15 minutes,
     * we need the message reference if the interaction died.
     */
    protected async editContextOrMessage(message: Message, options: MessageEditOptions): Promise<Message> {
        if (!this.isMessage) {
            const interaction = this.context as RepliableInteraction;
            if (Date.now() - interaction.createdTimestamp < 60000 * 15) {
                return await interaction.editReply(options);
            }
        }

        return await message.edit(options);
    }

    /**
     * Utility to build an embed from the options.
     */
    protected async buildEmbed(
        embed: APIEmbed | ((game: this) => Awaitable<APIEmbed>),
        props?: APIEmbed,
    ): Promise<APIEmbed> {
        return typeof embed === "function"
            ? await embed(this)
            : {
                  author: {
                      name: this.player.displayName,
                      icon_url: this.player.displayAvatarURL(),
                  },
                  ...props,
                  ...embed,
              };
    }

    /**
     * Utility to build an end embed from the options.
     */
    protected async buildEndEmbed(
        embed: APIEmbed | ((game: this) => Awaitable<APIEmbed>),
        endEmbed: APIEmbed | ((game: this, result: Res) => Awaitable<APIEmbed>) | undefined,
        result: Res,
        props?: APIEmbed,
    ): Promise<APIEmbed> {
        let built;
        if (endEmbed) {
            built = typeof endEmbed === "function" ? await endEmbed(this, result) : endEmbed;
        } else {
            built =
                typeof embed === "function"
                    ? await embed(this)
                    : {
                          author: {
                              name: this.player.displayName,
                              icon_url: this.player.displayAvatarURL(),
                          },
                          ...embed,
                          ...props,
                      };
        }
        return built;
    }

    /**
     * Utility to build the result of a game.
     */
    protected result(data: Omit<Res, keyof GameResult>): Res {
        return {
            player: this.player,
            gameStartedAt: this.gameStartedAt,
            gameDuration: this.getGameDuration(),
            ...data,
        } as Res;
    }
}
