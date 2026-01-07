import { Client, GatewayIntentBits, REST, Routes, EmbedBuilder } from 'discord.js';
import 'dotenv/config';
import express from 'express';
import Pokedex from 'pokedex-promise-v2';

const app = express();
const port = process.env.PORT || 3000;
const P = new Pokedex();

app.use('/assets', express.static('assets'));

app.get('/', (req, res) => {
  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PokéBot Discord</title>
    <link rel="icon" type="image/png" href="/assets/img/pokeball.png">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;700&display=swap');

        body, html {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            font-family: 'Poppins', sans-serif;
            overflow: hidden;
            background-color: #1a1a1a;
        }

        .container {
            position: relative;
            width: 100%;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            color: white;
            text-align: center;
        }

        .background-image {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url('/assets/img/Gemini_Generated_Image_z844hvz844hvz844.png');
            background-size: cover;
            background-position: center;
            z-index: 1;
        }

        .overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6); /* Oscurecido sutil */
            z-index: 2;
        }

        .content {
            position: relative;
            z-index: 3;
            animation: fadeIn 1.5s ease-out;
        }

        h1 {
            font-size: 3.5rem;
            margin-bottom: 0.5rem;
            text-shadow: 0 4px 10px rgba(0,0,0,0.5);
            letter-spacing: 2px;
        }

        p {
            font-size: 1.2rem;
            margin-bottom: 3rem;
            color: #ddd;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
            line-height: 1.6;
        }

        .pokeball-btn {
            position: relative;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            width: 80px;
            height: 80px;
            background: linear-gradient(to bottom, #ff0000 50%, #ffffff 50%);
            border-radius: 50%;
            border: 4px solid #333;
            box-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            cursor: pointer;
            text-decoration: none;
        }

        .pokeball-btn::before {
            content: '';
            position: absolute;
            width: 100%;
            height: 4px;
            background: #333;
            top: 50%;
            transform: translateY(-50%);
        }

        .pokeball-btn::after {
            content: '';
            position: absolute;
            width: 24px;
            height: 24px;
            background: #fff;
            border: 3px solid #333;
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 4;
        }

        .pokeball-btn:hover {
            transform: scale(1.2) rotate(360deg);
            box-shadow: 0 0 40px rgba(255, 255, 255, 0.6);
        }
        
        .btn-text {
            display: block;
            margin-top: 20px;
            font-weight: bold;
            font-size: 1.1rem;
            opacity: 0;
            transform: translateY(-10px);
            transition: all 0.3s ease;
        }

        .btn-wrapper:hover .btn-text {
            opacity: 1;
            transform: translateY(0);
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }

    </style>
</head>
<body>
    <div class="container">
        <div class="background-image"></div>
        <div class="overlay"></div>
        <div class="content">
            <h1>Bienvenido a PokéBot</h1>
            <p>Tu compañero definitivo para explorar el mundo Pokémon en Discord. Datos, estrategias y diversión en un solo lugar.</p>
            
            <div class="btn-wrapper">
                <a href="https://discord.com/oauth2/authorize?client_id=${process.env.ID}&permissions=8&scope=bot%20applications.commands" class="pokeball-btn" target="_blank" title="Invitar al Bot">
                </a>
                <span class="btn-text">¡Atrápalo ya!</span>
            </div>
        </div>
    </div>
</body>
</html>
  `;
  res.send(html);
});

app.listen(port, () => {
  console.log(`Servidor web escuchando en el puerto ${port}`);
});

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Language System
const userLanguages = new Map(); // Stores guildId -> language code
const defaultLanguage = 'en';

const translations = {
    en: {
        description: 'what pokemon are you looking for? :)',
        enterName: 'please, enter a pokemon name :)',
        notFound: ':( are you sure you typed it correctly? i couldn\'t find that pokemon',
        infoTitle: (name) => `${name}'s info`,
        type: 'Type',
        ability: 'Ability',
        height: 'Height',
        weight: 'Weight',
        langChanged: 'Language changed to English!',
        weaknessTitle: (name) => `Weaknesses of ${name}`,
        moveTitle: (name) => `Move info: ${name}`,
        abilityTitle: (name) => `Ability info: ${name}`,
        evolutionTitle: (name) => `Evolution chain for ${name}`,
        pokedexTitle: (name) => `Pokedex entry: ${name}`,
        shinyTitle: (name) => `Shiny ${name}`,
        randomTitle: 'Random Pokemon',
        teamTitle: 'Random Team',
        itemTitle: (name) => `Item info: ${name}`,
        helpTitle: 'Bot Help',
        helpDesc: 'Here are the available commands:',
    },
    es: {
        description: '¿qué pokémon estás buscando? :)',
        enterName: 'por favor, escribe el nombre de un pokémon :)',
        notFound: ':( ¿estás seguro de que lo escribiste bien? no pude encontrar ese pokémon',
        infoTitle: (name) => `Información de ${name}`,
        type: 'Tipo',
        ability: 'Habilidad',
        height: 'Altura',
        weight: 'Peso',
        langChanged: '¡Idioma cambiado a Español!',
        weaknessTitle: (name) => `Debilidades de ${name}`,
        moveTitle: (name) => `Información del movimiento: ${name}`,
        abilityTitle: (name) => `Información de la habilidad: ${name}`,
        evolutionTitle: (name) => `Cadena evolutiva de ${name}`,
        pokedexTitle: (name) => `Entrada de Pokédex: ${name}`,
        shinyTitle: (name) => `${name} Variocolor`,
        randomTitle: 'Pokémon Aleatorio',
        teamTitle: 'Equipo Aleatorio',
        itemTitle: (name) => `Información del objeto: ${name}`,
        helpTitle: 'Ayuda del Bot',
        helpDesc: 'Aquí están los comandos disponibles:',
    },
    it: {
        description: 'quale pokemon stai cercando? :)',
        enterName: 'per favore, inserisci il nome di un pokemon :)',
        notFound: ':( sei sicuro di averlo scritto correttamente? non riesco a trovare quel pokemon',
        infoTitle: (name) => `Info di ${name}`,
        type: 'Tipo',
        ability: 'Abilità',
        height: 'Altezza',
        weight: 'Peso',
        langChanged: 'Lingua cambiata in Italiano!',
        weaknessTitle: (name) => `Debolezze di ${name}`,
        moveTitle: (name) => `Info mossa: ${name}`,
        abilityTitle: (name) => `Info abilità: ${name}`,
        evolutionTitle: (name) => `Catena evolutiva di ${name}`,
        pokedexTitle: (name) => `Voce Pokédex: ${name}`,
        shinyTitle: (name) => `${name} Shiny`,
        randomTitle: 'Pokemon Casuale',
        teamTitle: 'Squadra Casuale',
        itemTitle: (name) => `Info strumento: ${name}`,
        helpTitle: 'Aiuto del Bot',
        helpDesc: 'Ecco i comandi disponibili:',
    },
    de: {
        description: 'welches pokemon suchst du? :)',
        enterName: 'bitte gib einen pokemon-namen ein :)',
        notFound: ':( bist du sicher, dass du es richtig geschrieben hast? ich konnte dieses pokemon nicht finden',
        infoTitle: (name) => `Infos zu ${name}`,
        type: 'Typ',
        ability: 'Fähigkeit',
        height: 'Größe',
        weight: 'Gewicht',
        langChanged: 'Sprache auf Deutsch geändert!',
        weaknessTitle: (name) => `Schwächen von ${name}`,
        moveTitle: (name) => `Attacken-Info: ${name}`,
        abilityTitle: (name) => `Fähigkeits-Info: ${name}`,
        evolutionTitle: (name) => `Entwicklungsreihe von ${name}`,
        pokedexTitle: (name) => `Pokedex-Eintrag: ${name}`,
        shinyTitle: (name) => `Shiny ${name}`,
        randomTitle: 'Zufälliges Pokemon',
        teamTitle: 'Zufälliges Team',
        itemTitle: (name) => `Item-Info: ${name}`,
        helpTitle: 'Bot Hilfe',
        helpDesc: 'Hier sind die verfügbaren Befehle:',
    }
};

function getMsg(guildId, key, ...args) {
    const lang = userLanguages.get(guildId) || defaultLanguage;
    const msg = translations[lang][key];
    return typeof msg === 'function' ? msg(...args) : msg;
}

function getLangCode(guildId) {
    return userLanguages.get(guildId) || defaultLanguage;
}

const commands = [
    {
        name: 'language',
        description: 'Change the bot language / Cambiar idioma',
        options: [
            {
                type: 3,
                name: 'lang',
                description: 'Select language',
                required: true,
                choices: [
                    { name: 'English', value: 'en' },
                    { name: 'Español', value: 'es' },
                    { name: 'Italiano', value: 'it' },
                    { name: 'Deutsch', value: 'de' }
                ]
            }
        ]
    },
    {
        name: 'pokemon',
        description: 'Get info about a pokemon',
        options: [
            {
                type: 3,
                name: 'name',
                description: 'Pokemon name',
                required: true,
            }
        ]
    },
    {
        name: 'weakness',
        description: 'Get weaknesses of a pokemon',
        options: [
            {
                type: 3,
                name: 'name',
                description: 'Pokemon name',
                required: true,
            }
        ]
    },
    {
        name: 'move',
        description: 'Get info about a move',
        options: [
            {
                type: 3,
                name: 'name',
                description: 'Move name',
                required: true,
            }
        ]
    },
    {
        name: 'ability',
        description: 'Get info about an ability',
        options: [
            {
                type: 3,
                name: 'name',
                description: 'Ability name',
                required: true,
            }
        ]
    },
    {
        name: 'evolution',
        description: 'Get evolution chain of a pokemon',
        options: [
            {
                type: 3,
                name: 'name',
                description: 'Pokemon name',
                required: true,
            }
        ]
    },
    {
        name: 'pokedex',
        description: 'Get pokedex entry of a pokemon',
        options: [
            {
                type: 3,
                name: 'name',
                description: 'Pokemon name',
                required: true,
            }
        ]
    },
    {
        name: 'shiny',
        description: 'Get shiny version of a pokemon',
        options: [
            {
                type: 3,
                name: 'name',
                description: 'Pokemon name',
                required: true,
            }
        ]
    },
    {
        name: 'random',
        description: 'Get a random pokemon',
    },
    {
        name: 'team',
        description: 'Get a random team of 6 pokemon',
    },
    {
        name: 'item',
        description: 'Get info about an item',
        options: [
            {
                type: 3,
                name: 'name',
                description: 'Item name',
                required: true,
            }
        ]
    },
    {
        name: 'help',
        description: 'Show all available commands',
    }
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Empezando a refrescar los comandos de aplicación (/)');
        await rest.put(
            Routes.applicationCommands(process.env.ID),
            { body: commands },
        );
        console.log('Comandos de aplicación (/) recargados correctamente.');
    } catch (error) {
        console.error(error);
    }
})();

client.on('ready', () => {
    console.log(`Logged as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.mentions.has(client.user)) {
        const guildId = message.guildId;
        const helpEmbed = new EmbedBuilder()
            .setTitle(getMsg(guildId, 'helpTitle'))
            .setDescription(getMsg(guildId, 'helpDesc'))
            .addFields(
                { name: '/pokemon [name]', value: 'Get info about a pokemon' },
                { name: '/weakness [name]', value: 'Get weaknesses of a pokemon' },
                { name: '/move [name]', value: 'Get info about a move' },
                { name: '/ability [name]', value: 'Get info about an ability' },
                { name: '/evolution [name]', value: 'Get evolution chain of a pokemon' },
                { name: '/pokedex [name]', value: 'Get pokedex entry of a pokemon' },
                { name: '/shiny [name]', value: 'Get shiny version of a pokemon' },
                { name: '/random', value: 'Get a random pokemon' },
                { name: '/team', value: 'Get a random team of 6 pokemon' },
                { name: '/item [name]', value: 'Get info about an item' },
                { name: '/language [lang]', value: 'Change bot language' },
                { name: '/help', value: 'Show this message' }
            )
            .setColor('#0099FF');

        await message.reply({ embeds: [helpEmbed] });
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName, guildId } = interaction;

    if (commandName === 'help') {
        const helpEmbed = new EmbedBuilder()
            .setTitle(getMsg(guildId, 'helpTitle'))
            .setDescription(getMsg(guildId, 'helpDesc'))
            .addFields(
                { name: '/pokemon [name]', value: 'Get info about a pokemon' },
                { name: '/weakness [name]', value: 'Get weaknesses of a pokemon' },
                { name: '/move [name]', value: 'Get info about a move' },
                { name: '/ability [name]', value: 'Get info about an ability' },
                { name: '/evolution [name]', value: 'Get evolution chain of a pokemon' },
                { name: '/pokedex [name]', value: 'Get pokedex entry of a pokemon' },
                { name: '/shiny [name]', value: 'Get shiny version of a pokemon' },
                { name: '/random', value: 'Get a random pokemon' },
                { name: '/team', value: 'Get a random team of 6 pokemon' },
                { name: '/item [name]', value: 'Get info about an item' },
                { name: '/language [lang]', value: 'Change bot language' },
                { name: '/help', value: 'Show this message' }
            )
            .setColor('#0099FF');

        await interaction.reply({ embeds: [helpEmbed] });
        return;
    }

    if (commandName === 'language') {
        const lang = interaction.options.getString('lang');
        userLanguages.set(guildId, lang);
        await interaction.reply(getMsg(guildId, 'langChanged'));
        return;
    }

    if (commandName === 'pokemon') {
        const pokemonName = interaction.options.getString('name');

        if (!pokemonName) {
            return interaction.reply(getMsg(guildId, 'enterName'));
        }

        try {
            // Using PokedexPromiseV2
            const pokemonData = await P.getPokemonByName(pokemonName.toLowerCase());
            const speciesData = await P.getPokemonSpeciesByName(pokemonData.species.name);
            const langCode = getLangCode(guildId);

            const entry = speciesData.flavor_text_entries.find(e => e.language.name === langCode)
                       || speciesData.flavor_text_entries.find(e => e.language.name === 'en');
            const bio = entry ? entry.flavor_text.replace(/[\n\f]/g, ' ') : 'No bio available.';

            const embed = new EmbedBuilder()
                .setTitle(getMsg(guildId, 'infoTitle', pokemonData.name))
                .setDescription(bio)
                .addFields(
                    { name: getMsg(guildId, 'type'), value: `${pokemonData.types.map(t => t.type.name).join(', ')}`, inline: true },
                    { name: getMsg(guildId, 'ability'), value: `${pokemonData.abilities.map(a => a.ability.name).join(', ')}`, inline: true },
                    { name: getMsg(guildId, 'height'), value: `${pokemonData.height / 10} m`, inline: true },
                    { name: getMsg(guildId, 'weight'), value: `${pokemonData.weight / 10} kg`, inline: true }
                )
                .setImage(pokemonData.sprites.front_default)
                .setColor('#000000');

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply(getMsg(guildId, 'notFound'));
        }
    }

    if (commandName === 'weakness') {
        const pokemonName = interaction.options.getString('name');

        if (!pokemonName) {
            return interaction.reply(getMsg(guildId, 'enterName'));
        }

        try {
            const pokemonData = await P.getPokemonByName(pokemonName.toLowerCase());
            const types = pokemonData.types.map(t => t.type.name);
            
            let doubleDamageFrom = new Set();
            let halfDamageFrom = new Set();
            let noDamageFrom = new Set();

            for (const type of types) {
                const typeData = await P.getTypeByName(type);
                typeData.damage_relations.double_damage_from.forEach(t => doubleDamageFrom.add(t.name));
                typeData.damage_relations.half_damage_from.forEach(t => halfDamageFrom.add(t.name));
                typeData.damage_relations.no_damage_from.forEach(t => noDamageFrom.add(t.name));
            }

            // Simple logic for now (doesn't calculate 4x or cancellations precisely but good enough for V1)
            // A more robust implementation would calculate multipliers.
            // Let's stick to listing "Weaknesses" (2x or more). 
            // Correct calculation:
            // 1. Initialize map of all types with 1x
            // 2. Iterate types of pokemon, multiply multipliers.
            // 3. Filter > 1

            const allTypes = [
                "normal", "fire", "water", "electric", "grass", "ice",
                "fighting", "poison", "ground", "flying", "psychic",
                "bug", "rock", "ghost", "dragon", "steel", "dark", "fairy"
            ];
            
            let multipliers = {};
            allTypes.forEach(t => multipliers[t] = 1);

            for (const type of types) {
                const typeData = await P.getTypeByName(type);
                typeData.damage_relations.double_damage_from.forEach(t => multipliers[t.name] *= 2);
                typeData.damage_relations.half_damage_from.forEach(t => multipliers[t.name] *= 0.5);
                typeData.damage_relations.no_damage_from.forEach(t => multipliers[t.name] *= 0);
            }

            const weaknesses = Object.keys(multipliers).filter(t => multipliers[t] > 1);
            
            const embed = new EmbedBuilder()
                .setTitle(getMsg(guildId, 'weaknessTitle', pokemonData.name))
                .setDescription(weaknesses.length > 0 ? weaknesses.join(', ') : 'None')
                .setImage(pokemonData.sprites.front_default)
                .setColor('#FF0000');

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await interaction.reply(getMsg(guildId, 'notFound'));
        }
    }

    if (commandName === 'move') {
        const moveName = interaction.options.getString('name');

        if (!moveName) {
            return interaction.reply(getMsg(guildId, 'enterName')); // Reuse enterName for now
        }

        try {
            // Replaces spaces with hyphens for API
            const fixedName = moveName.toLowerCase().replace(/ /g, '-');
            const moveData = await P.getMoveByName(fixedName);
            const langCode = getLangCode(guildId);

            const effectEntry = moveData.effect_entries.find(e => e.language.name === langCode) 
                             || moveData.effect_entries.find(e => e.language.name === 'en');

            const embed = new EmbedBuilder()
                .setTitle(getMsg(guildId, 'moveTitle', moveData.name))
                .addFields(
                    { name: 'Type', value: moveData.type.name, inline: true },
                    { name: 'Power', value: moveData.power ? moveData.power.toString() : '-', inline: true },
                    { name: 'Accuracy', value: moveData.accuracy ? moveData.accuracy.toString() : '-', inline: true },
                    { name: 'PP', value: moveData.pp ? moveData.pp.toString() : '-', inline: true },
                    { name: 'Effect', value: effectEntry ? effectEntry.short_effect || effectEntry.effect : 'No description' }
                )
                .setColor('#00FF00');

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
             console.error(error);
             await interaction.reply(':( could not find that move');
        }
    }

    if (commandName === 'ability') {
        const abilityName = interaction.options.getString('name');

        if (!abilityName) {
            return interaction.reply(getMsg(guildId, 'enterName'));
        }

        try {
            const fixedName = abilityName.toLowerCase().replace(/ /g, '-');
            const abilityData = await P.getAbilityByName(fixedName);
            const langCode = getLangCode(guildId);

            const effectEntry = abilityData.effect_entries.find(e => e.language.name === langCode)
                             || abilityData.effect_entries.find(e => e.language.name === 'en');

            const embed = new EmbedBuilder()
                .setTitle(getMsg(guildId, 'abilityTitle', abilityData.name))
                .setDescription(effectEntry ? effectEntry.effect : 'No description')
                .setColor('#0000FF');

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply(':( could not find that ability');
        }
    }

    if (commandName === 'evolution') {
        const pokemonName = interaction.options.getString('name');

        if (!pokemonName) {
            return interaction.reply(getMsg(guildId, 'enterName'));
        }

        try {
            await interaction.deferReply(); // Fetching multiple pokemon takes time
            const speciesData = await P.getPokemonSpeciesByName(pokemonName.toLowerCase());
            const evolutionChainUrl = speciesData.evolution_chain.url;
            const chainId = evolutionChainUrl.split('/').filter(Boolean).pop();
            const evolutionData = await P.getEvolutionChainById(chainId);

            let names = [];
            let current = evolutionData.chain;

            do {
                names.push(current.species.name);
                current = current.evolves_to[0];
            } while (current);

            // Fetch data for all pokemon in the chain to get images
            const pokemonDataList = await Promise.all(names.map(name => P.getPokemonByName(name)));

            const embeds = pokemonDataList.map((pokeData, index) => {
                return new EmbedBuilder()
                    .setTitle(index === 0 ? getMsg(guildId, 'evolutionTitle', pokemonName) : `Evolution: ${pokeData.name}`)
                    .setImage(pokeData.sprites.front_default)
                    .setColor(index === 0 ? '#FFFF00' : '#FFA500'); // Different shade for evos
            });

            await interaction.editReply({ embeds: embeds });
        } catch (error) {
            console.error(error);
            await interaction.editReply(getMsg(guildId, 'notFound'));
        }
    }

    if (commandName === 'pokedex') {
        const pokemonName = interaction.options.getString('name');

        if (!pokemonName) {
            return interaction.reply(getMsg(guildId, 'enterName'));
        }

        try {
            const speciesData = await P.getPokemonSpeciesByName(pokemonName.toLowerCase());
            const langCode = getLangCode(guildId);

            // Find flavor text in selected language, fallback to english
            const entry = speciesData.flavor_text_entries.find(e => e.language.name === langCode)
                       || speciesData.flavor_text_entries.find(e => e.language.name === 'en');
                       
            const cleanText = entry ? entry.flavor_text.replace(/[\n\f]/g, ' ') : 'No entry found.';
            
            // Get sprite for visual context
            const pokemonData = await P.getPokemonByName(pokemonName.toLowerCase());

            const embed = new EmbedBuilder()
                .setTitle(getMsg(guildId, 'pokedexTitle', speciesData.name))
                .setDescription(cleanText)
                .setImage(pokemonData.sprites.front_default)
                .setColor('#AA00AA');

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply(getMsg(guildId, 'notFound'));
        }
    }

    if (commandName === 'shiny') {
        const pokemonName = interaction.options.getString('name');

        if (!pokemonName) {
            return interaction.reply(getMsg(guildId, 'enterName'));
        }

        try {
            const pokemonData = await P.getPokemonByName(pokemonName.toLowerCase());

            const embed = new EmbedBuilder()
                .setTitle(getMsg(guildId, 'shinyTitle', pokemonData.name))
                .setImage(pokemonData.sprites.front_shiny)
                .setColor('#FFFF00');

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply(getMsg(guildId, 'notFound'));
        }
    }

    if (commandName === 'random') {
        try {
            const randomId = Math.floor(Math.random() * 1025) + 1;
            const pokemonData = await P.getPokemonByName(randomId);

            const embed = new EmbedBuilder()
                .setTitle(getMsg(guildId, 'randomTitle'))
                .setDescription(`It's **${pokemonData.name}**!`)
                .setImage(pokemonData.sprites.front_default)
                .setColor('#000000');

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply(':( error getting random pokemon');
        }
    }

    if (commandName === 'team') {
        try {
            await interaction.deferReply();
            const teamIds = Array.from({ length: 6 }, () => Math.floor(Math.random() * 1025) + 1);
            const teamData = await Promise.all(teamIds.map(id => P.getPokemonByName(id)));

            const embed = new EmbedBuilder()
                .setTitle(getMsg(guildId, 'teamTitle'))
                .setDescription(teamData.map(p => `• **${p.name.charAt(0).toUpperCase() + p.name.slice(1)}** (Type: ${p.types.map(t => t.type.name).join('/')})`).join('\n'))
                .setColor('#FF00FF');

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.editReply(':( error generating team');
        }
    }

    if (commandName === 'item') {
        const itemName = interaction.options.getString('name');

        if (!itemName) {
            return interaction.reply(getMsg(guildId, 'enterName'));
        }

        try {
            const fixedName = itemName.toLowerCase().replace(/ /g, '-');
            const itemData = await P.getItemByName(fixedName);
            const langCode = getLangCode(guildId);

            const effectEntry = itemData.effect_entries.find(e => e.language.name === langCode)
                             || itemData.effect_entries.find(e => e.language.name === 'en');

            const embed = new EmbedBuilder()
                .setTitle(getMsg(guildId, 'itemTitle', itemData.name))
                .setDescription(effectEntry ? effectEntry.effect : 'No description')
                .setThumbnail(itemData.sprites.default)
                .setColor('#A52A2A');

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply(':( could not find that item');
        }
    }
});

client.login(process.env.TOKEN);