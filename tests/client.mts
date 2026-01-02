import {
    ApplicationCommandData,
    ApplicationCommandOptionType,
    ApplicationCommandType,
    Client,
    Events,
    GatewayIntentBits,
    InteractionContextType,
    Routes,
} from "discord.js";
import {
    Minesweeper,
    Flood,
    FastType,
    Memory,
    Trivia,
    Wordle,
    RockPaperScissors,
    TicTacToe,
    Connect4,
    Game2048,
} from "../dist/index";

if (!process.env.DISCORD_ID) {
    throw new Error("Missing env.DISCORD_ID");
}
if (!process.env.DISCORD_TOKEN) {
    throw new Error("Missing env.DISCORD_TOKEN");
}

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.on(Events.ClientReady, () => {
    console.log("Client ready");
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const opponent = interaction.options.getUser("user");
    let game;

    switch (interaction.commandName) {
        case "2048": {
            game = new Game2048(interaction, {});
            game.on("gameOver", res => console.log(`[${interaction.commandName} gameOver] res:`, res));
            break;
        }
        case "connect4": {
            game = new Connect4(interaction, { versus: { opponent: opponent! } });
            game.on("gameOver", res => console.log(`[${interaction.commandName} gameOver] res:`, res));
            break;
        }
        case "fasttype": {
            game = new FastType(interaction, {});
            game.on("gameOver", res => console.log(`[${interaction.commandName} gameOver] res:`, res));
            break;
        }
        case "flood": {
            game = new Flood(interaction, {});
            game.on("gameOver", res => console.log(`[${interaction.commandName} gameOver] res:`, res));
            break;
        }
        case "memory": {
            game = new Memory(interaction, {});
            game.on("gameOver", res => console.log(`[${interaction.commandName} gameOver] res:`, res));
            break;
        }
        case "minesweeper": {
            game = new Minesweeper(interaction, {});
            game.on("gameOver", res => console.log(`[${interaction.commandName} gameOver] res:`, res));
            break;
        }
        case "rockpaperscissors": {
            game = new RockPaperScissors(interaction, { versus: { opponent: opponent! } });
            game.on("gameOver", res => console.log(`[${interaction.commandName} gameOver] res:`, res));
            break;
        }
        case "tictactoe": {
            game = new TicTacToe(interaction, { versus: { opponent: opponent! } });
            game.on("gameOver", res => console.log(`[${interaction.commandName} gameOver] res:`, res));
            break;
        }
        case "trivia": {
            game = new Trivia(interaction, { mode: "boolean" });
            game.on("gameOver", res => console.log(`[${interaction.commandName} gameOver] res:`, res));
            break;
        }
        case "wordle": {
            game = new Wordle(interaction, {});
            game.on("gameOver", res => console.log(`[${interaction.commandName} gameOver] res:`, res));
            break;
        }
    }

    if (!game) {
        console.log(`Unknown command: ${interaction.commandName}`);
        return;
    }

    game.on("error", err => console.error(`[${interaction.commandName}:error]`, err));
    game.on("fatalError", err => console.error(`[${interaction.commandName}:fatalError]`, err));
    game.on("versusReject", reason => console.log(`[${interaction.commandName}:versusReject] reason: ${reason}`));
    game.on("end", () => console.log(`[${interaction.commandName}:end]`));

    await game.start();
});

await client.login(process.env.DISCORD_TOKEN);

if (process.argv.includes("--deploy")) {
    const base = {
        type: ApplicationCommandType.ChatInput,
        contexts: [InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel],
        description: "Test",
    } as const;
    const versus = {
        options: [{ type: ApplicationCommandOptionType.User, name: "user", description: "Test", required: true }],
    } as const;

    await client.rest.put(Routes.applicationCommands(process.env.DISCORD_ID), {
        body: [
            { ...base, name: "2048" },
            { ...base, ...versus, name: "connect4" },
            { ...base, name: "fasttype" },
            { ...base, name: "flood" },
            { ...base, name: "memory" },
            { ...base, name: "minesweeper" },
            {
                ...base,
                ...versus,
                name: "rockpaperscissors",
            },
            { ...base, ...versus, name: "tictactoe" },
            { ...base, name: "trivia" },
            { ...base, name: "wordle" },
        ] satisfies ApplicationCommandData[],
    });

    console.log("Commands deployed");
} else {
    console.log("Use --deploy to deploy the commands");
}
