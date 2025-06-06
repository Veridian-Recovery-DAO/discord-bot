import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('service')
  .setDescription('Learn how you can contribute to the Veridian Recovery DAO.');

export async function execute(interaction: CommandInteraction) {
  const embed = new EmbedBuilder()
    .setColor(0x7289DA) // Discord Blurple
    .setTitle('Contribute to Veridian Recovery DAO')
    .setDescription(
`We welcome contributions in many forms! Your skills and passion can help us grow and support more individuals in recovery. Here are some ways to get involved:

**Content & Psychoeducation:**
* Help curate or create recovery literature summaries.
* Share your story (if comfortable) in designated safe spaces.
* Suggest topics for psychoeducational materials.

**Development & Tech:**
* Contribute to this bot or other DAO tools (check our GitHub!).
* Help with website development or maintenance.
* Propose new tech solutions to support DAO goals.

**Community & Moderation:**
* Become a peer supporter (training may be required).
* Help moderate DAO discussion channels.
* Organize or facilitate recovery meetings.

**Outreach & Awareness:**
* Help spread the word about Veridian Recovery DAO.
* Share our resources with those who might benefit.

**How to Start:**
1.  Join our discussion channels and introduce yourself.
2.  Check our [GitHub Repository/Project Board Link] for open tasks.
3.  Reach out to a DAO admin or moderator to discuss your interests.

Thank you for considering contributing!`)
    .setFooter({ text: "Every contribution, big or small, makes a difference." });

  await interaction.reply({ embeds: [embed] });
}
