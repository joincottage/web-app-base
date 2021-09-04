/**
 * This module generates a one-time use invite to a server.
 * Currently using discord.js v12 as v13 requires NodeJS 16+
 * which is not yet supported on Vercel
 *
 * v12 docs: https://discord.js.org/#/docs/main/v12/general/welcome
 */
import discord, { GuildChannel } from 'discord.js';
import { NextApiRequest, NextApiResponse } from 'next';
const client = new discord.Client();
const guildId = process.env.COTTAGE_DISCORD_GUILD_ID || '';
const channelId = process.env.COTTAGE_DISCORD_CHANNEL_ID || '';
const botToken = process.env.DISCORD_BOT_TOKEN || '';

const getInviteLink = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    client.on('ready', async () => {
      try {
        const guild = await client.guilds.fetch(guildId);
        // todo use guild.addMember() in future so we can map discord to cottage accounts
        // https://discord.js.org/#/docs/main/v12/class/Guild?scrollTo=addMember
        const channel = (await guild.channels.cache.get(
          channelId
        )) as GuildChannel;
        const invite = await channel.createInvite({
          maxAge: 600, // 10 minutes
          maxUses: 1,
          unique: true,
        });
        resolve(`https://discord.gg/${invite.code}`);
      } catch (e) {
        reject(e);
      }
    });
    client.login(botToken);
  });
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'GET': {
      try {
        const inviteLink = await getInviteLink();
        res.redirect(inviteLink);
      } catch (e) {
        console.error(`Failed to get discord invite link`, e);
        res.status(500).end();
      }
      break;
    }
    default: {
      console.error(
        `Unsupported method type ${req.method} made to endpoint ${req.url}`
      );
      res.status(404).end();
      break;
    }
  }
};

export default handler;
