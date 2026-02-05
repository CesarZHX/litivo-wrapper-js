import env from 'env-var';

const wrapper: string = 'LITIVO';

/** TODO: Find a safer way to store and access these credentials. */
class UserCredentials {
  public static readonly email: string = env.get(`${wrapper}_EMAIL`).required().asEmailString();
  public static readonly password: string = env.get(`${wrapper}_PASSWORD`).required().asString();
  private constructor() {}
}

export { UserCredentials };
