import { serialize, CookieSerializeOptions } from 'cookie';
import { NextPageContext } from 'next';

/**
 * This sets `cookie` using the `res` object
 */

export const setCookie = (
  ctx: NextPageContext,
  name: string,
  value: unknown,
  options: CookieSerializeOptions = {}
) => {
  if (!ctx || !ctx.res) {
    return;
  }

  const stringValue =
    typeof value === 'object' ? 'j:' + JSON.stringify(value) : String(value);

  if (options.maxAge) {
    options.expires = new Date(Date.now() + options.maxAge);
    options.maxAge /= 1000;
  }

  ctx.res.setHeader('Set-Cookie', serialize(name, stringValue, options));
};
