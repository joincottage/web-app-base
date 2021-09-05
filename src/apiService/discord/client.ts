import discord from 'discord.js';
const client = new discord.Client();
const botToken = process.env.DISCORD_BOT_TOKEN || '';

export const getClient = async (): Promise<discord.Client> => {
  return new Promise((resolve, reject) => {
    const connectTimer = setTimeout(() => {
      reject(
        new Error('Failed to establish connection with Discord in 30 seconds')
      );
    }, 30000);

    client.on('ready', async () => {
      clearTimeout(connectTimer);
      resolve(client);
    });
    client.login(botToken);
  });
};
