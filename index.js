import { Client, GatewayIntentBits, REST, Routes, EmbedBuilder } from 'discord.js';
import axios from 'axios';
import 'dotenv/config';
import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('El bot está vivo y corriendo!');
});

app.listen(port, () => {
  console.log(`Servidor web escuchando en el puerto ${port}`);
});

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = [
    {
        name: 'pokemon',
        description: 'what pokemon are you looking for? :)',
        options: [
            {
                type: 3,
                name: 'name',
                description: 'Pokemon name',
                required: true,
            }
        ]
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

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'pokemon') {
        const pokemonName = interaction.options.getString('name');

        if (!pokemonName) {
            return interaction.reply('please, enter a pokemon name :)');
        }

        try {
            const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
            const pokemonData = response.data;

            const embed = new EmbedBuilder()
                .setTitle(`${pokemonData.name}'s info`)
                .addFields(
                    { name: 'Type', value: `${pokemonData.types[0].type.name}`, inline: true },
                    { name: 'Ability', value: `${pokemonData.abilities[0].ability.name}`, inline: true },
                    { name: 'Height', value: `${pokemonData.height / 10} m`, inline: true },
                    { name: 'Weight', value: `${pokemonData.weight / 10} kg`, inline: true }
                )
                .setImage(pokemonData.sprites.front_default)
                .setColor('#000000');

            await interaction.reply({ embeds: [embed] });
            console.log(pokemonName, Date());
        } catch (error) {
            console.error(error);
            await interaction.reply(':( are you sure you typed it correctly? i couldn\'t find that pokemon ');;
        }
    }
});

client.login(process.env.TOKEN);