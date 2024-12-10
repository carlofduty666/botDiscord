// import { Client, GatewayIntentBits, REST, Routes } from 'discord.js'; // importa las clases necesarias

// import Pokedex from 'pokedex-promise-v2';
// const P = new Pokedex();
// import axios from 'axios';

// const  commands = [ // Define los comandos que se van a utilizar y lo que hara despues de enviar el comando
//     {
//         name: 'pokemon', // Nombre del comando
//         description: 'what pokemon are you looking for? :)', // Una vez enviado el comando se mostrara este mensaje
//     },

//     {
//         name: 'bye',
//         description: 'replies to the goodbye',
//     },

//     {
//         name: 'marino',
//         description: 'it reveals who is marino',
//     }
// ];

// const msg = [ // Define los comandos que se van a utilizar y lo que hara despues de enviar el comando
//   {
//       name: 'hi', // Nombre del comando
//       description: 'replies to the greeting', // Una vez enviado el comando se mostrara este mensaje
//   },

//   {
//       name: 'bye',
//       description: 'replies to the goodbye',
//   },

//   {
//       name: 'marino',
//       description: 'it reveals who is marino',
//   }
// ];

// const rest = new REST({ version: '10' }).setToken('MTMxNTA0NTU0MzE4MDc2MzE4Nw.Gtxjgz.UJ9VwAU82UYiXMjaHbM12ohBfmfPAL1lImTG_w'); // Crea una instancia de la clase REST y establece el token de la aplicación

// try {
//   console.log('Started refreshing application (/) commands.');

//   await rest.put( /// Llama a la función put de la clase REST y put es un metodo que se utiliza para enviar una solicitud PUT a la API de Discord
//     Routes.applicationCommands('1315045543180763187'), /// Establece la ruta de la API y el cuerpo de la solicitud
//     { body: commands }, /// Establece el cuerpo de la solicitud es decir los comandos
//   );

//   console.log('Successfully reloaded application (/) commands.');
// } catch (error) { 
//   console.error(error);
// }

// const client = new Client({ intents: [GatewayIntentBits.Guilds] }); // Crea una instancia de la clase Client y establece los intents (que son los permisos que tiene el bot)

// client.on('ready', () => { // Se ejecuta cuando el bot se conecta al servidor

//   console.log(`Logged in as ${client.user.tag}!`);

// })

// // client.on('message', msg => {
// //   console.log(msg.content); // Muestra el mensaje en la consola
// // })

// // client.on('message', async msg => {
// //   if (msg.content === 'ping') { // Si el mensaje es ping...
// //     await msg.reply('pong'); // ...responderá con pong
// //   }


// //   if (msg.content === 'bye') { // Si el mensaje es bye...
// //     msg.reply('Bye!'); // ...responderá con Bye!
// //   }
    
// //   if (msg.content === 'marino') { // Si el mensaje es marino...
// //     await msg.reply('Marino is a very good boy'); // ...responderá con este mensaje
// //   }}
// //   )

// client.on('message', async (message) => {
//   if (message.content.startsWith('/pokemon')) {
//       const args = message.content.split(' ').slice(1); // Obtener argumentos
//       const pokemonName = args.join(' '); // Unir argumentos para formar el nombre del Pokémon

//       if (!pokemonName) {
//           return message.reply('Por favor proporciona el nombre de un Pokémon.');
//       }

//       try {
//           const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
//           const pokemonData = response.data;

//           // Formatear la respuesta
//           const embed = new Discord.MessageEmbed()
//               .setTitle(`Información sobre ${pokemonData.name}`)
//               .addField('ID', pokemonData.id)
//               .addField('Altura', `${pokemonData.height / 10} m`)
//               .addField('Peso', `${pokemonData.weight / 10} kg`)
//               .setImage(pokemonData.sprites.front_default)
//               .setColor('#FF0000');

//           message.channel.send(embed);
//       } catch (error) {
//           console.error(error);
//           message.reply('No se pudo encontrar ese Pokémon. Asegúrate de que el nombre esté escrito correctamente.');
//       }
//   }
// });



// client.on('interactionCreate', async interaction => { // Se ejecuta cuando se crea una interacción la cual es un comando establecido en la constante commands

//   console.log(interaction.commandName); // Muestra la interacción en la consola

//   if (!interaction.isChatInputCommand()) return; // Si la interacción no es un comando de chat, se sale de la función

//   if (interaction.commandName === 'pokemon') { // Si el comando es Hi...
//   await interaction.reply(P.getPokemonByName([])); // ...esta será la respuesta




//   } else if (interaction.commandName === 'bye') { // Pero si el comando es Bye...
//     await interaction.reply('Goodbye! Come back soon :)'); // ...responderá con este mensaje

//   } else if (interaction.commandName === 'marino') {
//     await interaction.reply('Marino is probably the most handsome boy and the cutest human being alive in this world meant to become the King of the duke Carlos Alberto II');
//   }
// });

// client.login('MTMxNTA0NTU0MzE4MDc2MzE4Nw.Gtxjgz.UJ9VwAU82UYiXMjaHbM12ohBfmfPAL1lImTG_w'); // Inicia la sesión del bot

import { Client, GatewayIntentBits, REST, Routes, EmbedBuilder } from 'discord.js';
import axios from 'axios';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = [
    {
        name: 'pokemon',
        description: 'what pokemon are you looking for? :)',
        options: [
            {
                type: 3, // Tipo 3 es para string
                name: 'name',
                description: 'Pokemon name',
                required: true, // Este campo es obligatorio
            }
        ]
    }
];

const rest = new REST({ version: '10' }).setToken('MTMxNTA0NTU0MzE4MDc2MzE4Nw.Gtxjgz.UJ9VwAU82UYiXMjaHbM12ohBfmfPAL1lImTG_w');

(async () => {
    try {
        console.log('Empezando a refrescar los comandos de aplicación (/)');

        await rest.put(
            Routes.applicationCommands('1315045543180763187'),
            { body: commands },
        );

        console.log('Comandos de aplicación (/) recargados correctamente.');
    } catch (error) {
        console.error(error);
    }
})();

client.on('ready', () => {
    console.log(`Conectado como ${client.user.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'pokemon') {
        const pokemonName = interaction.options.getString('name'); // Captura el argumento

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

client.login('MTMxNTA0NTU0MzE4MDc2MzE4Nw.Gtxjgz.UJ9VwAU82UYiXMjaHbM12ohBfmfPAL1lImTG_w'); // Reemplaza con tu token