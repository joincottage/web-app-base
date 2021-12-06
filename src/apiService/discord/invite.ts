import { GuildChannel, Role } from 'discord.js';
import { getClient } from './client';

const guildId = process.env.DISCORD_GUILD_ID || '';
const channelId = process.env.DISCORD_CHANNEL_ID || '';

export const createInviteLink = async () => {
  try {
    const client = await getClient();
    const guild = await client.guilds.fetch(guildId);
    //TODO: Hunter said this was okay, not sure what is happening, will fix later
    // @ts-ignore
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
