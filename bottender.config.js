const { POSTBACK_TITLE } = require('./src/utils/constant');
const { helpText } = require('./src/utils/wording');

module.exports = {
  session: {
    driver: 'mongo',
    stores: {
      memory: {
        maxSize: 500,
      },
      file: {
        dirname: '.session',
      },
      redis: {
        port: 6379,
        host: '127.0.0.1',
        password: 'auth',
        db: 0,
      },
      mongo: {
        url: `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`,
        collectionName: 'sessions',
      },
    },
  },
  initialState: {
    todos: [],
    isWaitingUserInput: false,
    isInitialSetUp: true,
    userInput: null,
    prefs: { dailyReminder: null, timezone: 8 },
  },
  channels: {
    messenger: {
      enabled: true,
      path: '/webhooks/messenger',
      pageId: process.env.MESSENGER_PAGE_ID,
      accessToken: process.env.MESSENGER_ACCESS_TOKEN,
      appId: process.env.MESSENGER_APP_ID,
      appSecret: process.env.MESSENGER_APP_SECRET,
      verifyToken: process.env.MESSENGER_VERIFY_TOKEN,
      profile: {
        getStarted: {
          payload: 'GET_STARTED',
        },
        greeting: [
          {
            locale: 'default',
            text: helpText,
          },
        ],
        persistentMenu: [
          {
            locale: 'default',
            composer_input_disabled: false,
            call_to_actions: [
              {
                type: 'postback',
                title: POSTBACK_TITLE.ADD_TODO,
                payload: POSTBACK_TITLE.ADD_TODO,
              },
              {
                type: 'postback',
                title: POSTBACK_TITLE.LIST_TODO,
                payload: POSTBACK_TITLE.LIST_TODO,
              },
              {
                type: 'postback',
                title: POSTBACK_TITLE.SETTINGS,
                payload: POSTBACK_TITLE.SETTINGS,
              },
            ],
          },
        ],
      },
    },
    line: {
      enabled: false,
      path: '/webhooks/line',
      accessToken: process.env.LINE_ACCESS_TOKEN,
      channelSecret: process.env.LINE_CHANNEL_SECRET,
    },
    telegram: {
      enabled: false,
      path: '/webhooks/telegram',
      accessToken: process.env.TELEGRAM_ACCESS_TOKEN,
    },
    slack: {
      enabled: false,
      path: '/webhooks/slack',
      accessToken: process.env.SLACK_ACCESS_TOKEN,
      verificationToken: process.env.SLACK_VERIFICATION_TOKEN,
    },
    viber: {
      enabled: false,
      path: '/webhooks/viber',
      accessToken: process.env.VIBER_ACCESS_TOKEN,
      sender: {
        name: 'xxxx',
      },
    },
  },
};
