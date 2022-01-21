import discord from 'discord.js';
let client: discord.Client | null = null;
const botToken = process.env.DISCORD_BOT_TOKEN || '';

const createNewClient = async (): Promise<discord.Client> => {
  return new Promise((resolve, reject) => {
    client = new discord.Client();
    const connectTimer = setTimeout(() => {
      reject(
        new Error('Failed to establish connection with Discord in 30 seconds')
      );
    }, 30000);

    client.on('ready', async () => {
      clearTimeout(connectTimer);
      resolve(client as discord.Client);
    });
    client.login(botToken);
  });
};

export const getClient = async (): Promise<discord.Client> => {
  if (client) {
    return new Promise((resolve) => {
      resolve(client as discord.Client);
    });
  } else {
    client = await createNewClient();
    return new Promise((resolve) => {
      resolve(client as discord.Client);
    });
  }
};
