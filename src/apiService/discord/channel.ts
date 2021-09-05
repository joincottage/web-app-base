import { getClient } from './client';
const guildId = process.env.DISCORD_GUILD_ID || '';
const clientCategoryId = process.env.DISCORD_CLIENT_CATEGORY_ID || '';

export const createTextChannel = async (channelName: string, topic: string) => {
  try {
    const client = await getClient();
    const guild = await client.guilds.fetch(guildId);
    const channel = await guild.channels.create(channelName, {
      parent: clientCategoryId,
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
