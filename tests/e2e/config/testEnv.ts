import env from 'env-var';

const wrapper: string = 'litivo';

/** TODO: Find a safer way to store and access these credentials. */
export class UserCredentials {
  public static readonly email: string = env.get(`${wrapper}Email`).required().asEmailString();
  public static readonly password: string = env.get(`${wrapper}Password`).required().asString();
  private constructor() {}
}
