export const configuration = () => ({
  NODE_ENV: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10) || 3333,
  MONGODB_URL: process.env.MONGODB_URL,
  JWT_ACCESS_TOKEN_SECRET:
    process.env.JWT_ACCESS_TOKEN_SECRET || 'lakjsdkfgadkaglfasdkgakgkasdhglak',
  JWT_ACCESS_TOKEN_SECRET_LIFETIME:
    process.env.JWT_ACCESS_TOKEN_SECRET_LIFETIME || '200d',

  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET_LIFETIME:
    process.env.JWT_REFRESH_TOKEN_SECRET_LIFETIME,

  JWT_CONFIRM_EMAIL_SECRET:
    process.env.JWT_CONFIRM_EMAIL_SECRET || 'secretconfirmemail',
  JWT_CONFIRM_EMAIL_LIFETIME: process.env.JWT_CONFIRM_EMAIL_LIFETIME || '100d',

  MAIL_HOST: process.env.MAIL_HOST || 'smtp.example.com',
  MAIL_USER: process.env.MAIL_USER || 'user@example.com',
  MAIL_PASSWORD: process.env.MAIL_PASSWORD || 'topsecretpassWOrd',
  MAIL_FROM: process.env.MAIL_FROM || 'noreply@example.com',
});
