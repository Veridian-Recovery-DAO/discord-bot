// Add as another subcommand in the 'com' command structure
// In discord-bot/src/commands/com/tokenInfo.ts (or a new file for subcommands)

// ... (inside the main 'com' command builder)
// .addSubcommand(subcommand =>
//   subcommand
//     .setName('transfer')
//     .setDescription('Initiate a token transfer (guides you through the process).')
//     .addUserOption(option => option.setName('recipient').setDescription('The user to transfer tokens to.').setRequired(true))
//     .addNumberOption(option => option.setName('amount').setDescription('Amount of tokens to transfer.').setRequired(true)))
// ...

// Inside the execute function, after 'info' handling:
// else if (subcommand === 'transfer') {
//   const recipientUser = interaction.options.getUser('recipient', true);
//   const amount = interaction.options.getNumber('amount', true);

//   // THIS IS A SIMPLIFIED EXAMPLE - DO NOT USE FOR REAL TRANSFERS WITHOUT EXTREME CAUTION & SECURITY AUDITS
//   // Ideally, this links to a secure web interface where the user connects their wallet.
//   const embed = new EmbedBuilder()
//     .setColor(0xFF8C00)
//     .setTitle('Token Transfer Guide')
//     .setDescription(
`To transfer ${amount} [TOKEN_SYMBOL] to ${recipientUser.username}:

1.  Open your preferred wallet (e.g., MetaMask, Trust Wallet).
2.  Ensure you are on the correct network ([YOUR_NETWORK_NAME]).
3.  Initiate a transfer of [TOKEN_SYMBOL].
4.  Enter the recipient's address: \`[LOOKUP_RECIPIENT_WALLET_ADDRESS_IF_STORED_SECURELY_OR_ASK_USER_TO_PROVIDE_IT]\`
    *You may need to ask ${recipientUser.username} for their wallet address.*
5.  Enter the amount: ${amount}.
6.  Review transaction details and confirm.

:warning: **Never share your private keys or seed phrase. The DAO will never ask for them.**
:link: *[Optional: Link to your DAO's secure transfer DApp or a trusted DEX/wallet interface]*`
//     )
//     .setFooter({ text: "This bot does not handle private keys or execute transactions directly for security reasons."});
//   await interaction.reply({ embeds: [embed], ephemeral: true });
// }
