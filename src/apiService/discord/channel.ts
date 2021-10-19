import { TextChannel } from 'discord.js';
import { getClient } from './client';
const guildId = process.env.DISCORD_GUILD_ID || '';

export const createTextChannel = async (channelName: string, topic: string, categoryId: string) => {
  console.log(`guildId: ${guildId}`);
  console.log(`clientCategoryId: ${categoryId}`);
  console.log(`channelName: ${channelName}`);
  console.log(`topic: ${topic}`);
  try {
    const client = await getClient();
    const guild = await client.guilds.fetch(guildId);
    const channel = await guild.channels.create(channelName, {
      parent: categoryId,
      type: 'text',
      // permissionOverwrites: [ // todo figure out how to set all the permissions
      //   {
      //     type: 'role',
      //     id: guild.roles.everyone,
      //     deny: [Permissions.FLAGS.VIEW_CHANNEL],
      //   },
      // ],
      topic,
    });

    return channel;
  } catch (e) {
    throw e;
  }
};

export const postMessageToChannel = async (channelId: string, message: string) => {
  try {
    const client = await getClient();
    const guild = await client.guilds.fetch(guildId);
    const channel = await guild.channels.cache.find(ch => ch.id === channelId);
    if (channel?.isText()) {
      (channel as TextChannel).send(message);
    }
  } catch (e) {
    console.log('Failed to post message to channel');
    throw e;
  }
};

export const addUserToChannel = async (channelId: string, userId: string) => {
  try {
    const client = await getClient();
    const guild = await client.guilds.fetch(guildId);
    const channel = await guild.channels.cache.find(ch => ch.id === channelId);
    const user = await guild.members.cache.get(userId);
    console.log(`user: ${JSON.stringify(user)}`);
    console.log('creating overwrite');
    await channel?.createOverwrite(userId, { VIEW_CHANNEL: true });
  } catch (e) {
    console.log('Failed to add user to channel');
    throw e;
  }
};
