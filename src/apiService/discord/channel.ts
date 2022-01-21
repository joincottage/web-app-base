import { TextChannel } from 'discord.js';
import { getClient } from './client';
const guildId = process.env.DISCORD_GUILD_ID || '';

export const createTextChannel = async (
  channelName: string,
  topic: string,
  categoryId: string
) => {
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
};

export const postMessageToChannel = async (
  channelId: string,
  message: string
) => {
  try {
    console.log('Posting message to Discord channel');
    const client = await getClient();
    const guild = await client.guilds.fetch(guildId);
    const channel = guild.channels.cache.find((ch) => ch.id === channelId);
    if (channel?.isText()) {
      (channel as TextChannel).send(message);
      console.log('Message successfully posted to Discord channel');
    }
  } catch (e) {
    console.log('Failed to post message to channel');
    throw e;
  }
};

export const addUserToChannel = async (channelId: string, userId: string) => {
  try {
    console.log(`Adding user to Discord channel`);
    const client = await getClient();
    const guild = await client.guilds.fetch(guildId, true);
    console.log('Fetched guild object');
    const channel = guild.channels.cache.find((ch) => ch.id === channelId);
    console.log('Fetched channel object');
    const user = await client.users.fetch(userId);
    await channel?.createOverwrite(user, { VIEW_CHANNEL: true });
    console.log('Successfully added user to channel');
  } catch (e) {
    console.log('Failed to add user to channel');
    throw e;
  }
};

export const removeUserFromChannel = async (
  channelId: string,
  userId: string
) => {
  try {
    console.log(`Removing user from Discord channel`);
    const client = await getClient();
    const guild = await client.guilds.fetch(guildId, true);
    console.log('Fetched guild object');
    const channel = guild.channels.cache.find((ch) => ch.id === channelId);
    console.log('Fetched channel object');
    const user = await client.users.fetch(userId);
    await channel?.createOverwrite(user, { VIEW_CHANNEL: false });
    console.log('Successfully removed user to channel');
  } catch (e) {
    console.log('Failed to remove user to channel');
    throw e;
  }
};
