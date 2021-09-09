import { GuildChannel } from 'discord.js';
import { getClient } from './client';

const guildId = process.env.DISCORD_GUILD_ID || '';
const channelId = process.env.DISCORD_CHANNEL_ID || '';

export const createInviteLink = async () => {
  try {
    const client = await getClient();
    const guild = await client.guilds.fetch(guildId);
    const channel = (await guild.channels.cache.get(channelId)) as GuildChannel;
    const invite = await channel.createInvite({
      maxAge: 600, // 10 minutes
      maxUses: 1,
      unique: true,
    });
    return `https://discord.gg/${invite.code}`;
  } catch (e) {
    throw e;
  }
};

export const addUserToServer = async (roles: string[]) => {
  // todo use guild.addMember() in future so we can map discord to cottage accounts
  // https://discord.js.org/#/docs/main/v12/class/Guild?scrollTo=addMember
  try {
    const client = await getClient();
    const guild = await client.guilds.fetch(guildId);
    //guild.addMember()
  } catch (e) {
    throw e;
  }
};
