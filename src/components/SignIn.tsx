import NextLink from 'next/link';

export const SignIn = () => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // eslint-disable-next-line no-console
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  return (<>
    <form onSubmit={ handleSubmit }>
      <input
        required
        id="email"
        name="email"
        autoComplete="email"
        autoFocus
      />
      <input
        required
        name="password"
        type="password"
        id="password"
        autoComplete="current-password"
      />
      <input
        type="checkbox"
      />
      <div>
        Sign In
      </div>
      <div>
        <div>
          <NextLink href="/forgot-password" passHref={true}>
            <a>
              Forgot password?
            </a>
          </NextLink>
        </div>
        <div>
          <NextLink href="/signup" passHref={true}>
            <div>
              { "Don't have an account? Sign Up" }
            </div>
          </NextLink>
        </div>
      </div>
    </form>
  </>);
}
