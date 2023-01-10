const { SlashCommandBuilder } = require("@discordjs/builders");

/**
 * Trigger of the command
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 * @example
 * trigger(interaction)
 */
async function trigger(interaction) {
    // TODO: Make it working
    const row = new ActionRowBuilder().addComponents(
        new SelectMenuBuilder()
            .setCustomId("jeu_selection")
            .setPlaceholder("Aucun jeu sélectionné")
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions([
                {
                    label: "Juste Prix",
                    description:
                        "5 essais pour trouver un nombre entre 1 et 100",
                    value: "jp",
                },
                {
                    label: "Pierre feuille ciseau",
                    description:
                        "En Best-Of 3. Celui qui a le meilleur score gagne.",
                    value: "pfc",
                },
                //{
                //	label: 'Puissance 4',
                //	description: 'Une grille, comme le puissance 4',
                //	value: 'p4',
                //},
            ])
    );

    await interaction.reply({
        content: "Selectionnez votre jeu :",
        components: [row],
    });
}

/**
 * Start the selected game
 * @param {import("discord.js").Interaction} [interaction] THE interaction
 * @param {Array<String>} [path] Path of the interaction
 * @example
 * onSelectMenu(interaction,path)
 */
async function onSelectMenu(interaction,path) {
    // TODO: Rewrite with DB
    if (interaction.values[0] === "jp") {
        game_jp(interaction.user);
    }
    if (interaction.values[0] == "pfc") {
        game_pfc(interaction.user);
    }
    if (interaction.values[0] == "p4") {
        game_p4(interaction.user);
    }
    interaction.deferUpdate();
}
const definition = new SlashCommandBuilder()
    .setName("launchgame")
    .setDescription("Lancer un jeu");

module.exports = {
    trigger,
    definition,
    onSelectMenu,
};