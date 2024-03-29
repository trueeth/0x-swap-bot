import config from '../../config/config';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Swap Bot API documentation',
    version: '0.0.1',
    description: 'This is Swap Bot',
    license: {
      name: 'MIT',
      url: 'https://github.com/trueeth/0x-swap-bot.git',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
      description: 'Development Server',
    },
  ],
};

export default swaggerDefinition;
