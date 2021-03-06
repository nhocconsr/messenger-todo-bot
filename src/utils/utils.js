const { DAY_OF_WEEK, SERVER_TIMEZONE_OFFSET } = require('./constant');
const moment = require('moment');

const paddingLeft = value => {
  return `${value < 10 ? '0' : ''}${value}`;
};

const replaceArrayItemByIndex = (array, idx, newItem) => {
  const ret = array.slice(0);
  ret[idx] = newItem;
  return ret;
};

const getTimestampFromReminder = (reminder, timezone) => {
  if (reminder.split(' ').length !== 2) return false;
  const [date, time] = reminder.split(' ');
  let year;
  let month;
  let day;
  let hour;
  let minute;
  if (/(today)|(t)|(tmr)|(r)/i.test(date)) {
    year = new Date().getFullYear();
    month = new Date().getMonth() + 1;
    day = new Date().getDate();
    if (/(tmr)|(r)/i.test(date)) day += 1;
  } else if (moment(date, 'YYYY/M/D', true).isValid()) {
    [year, month, day] = date.split('/');
  } else if (!isNaN(date)) {
    year = new Date().getFullYear();
    month = new Date().getMonth() + 1;
    day = new Date().getDate() + Number(date);
  } else {
    return false;
  }

  if (moment(time, 'H:m', true).isValid()) {
    [hour, minute] = time.split(':');
  } else if (!isNaN(time)) {
    hour = new Date().getHours() + Number(time);
    minute = new Date().getMinutes();
  } else {
    return false;
  }

  const timeStamp = new Date(
    year,
    month - 1,
    day,
    hour - timezone - SERVER_TIMEZONE_OFFSET,
    minute
  );
  if (timeStamp.getTime() < new Date().getTime()) return false;

  return timeStamp;
};

const renderReminder = (reminder, timezone) => {
  const timeStamp = new Date(reminder);
  timeStamp.setHours(timeStamp.getHours() + timezone + SERVER_TIMEZONE_OFFSET);
  const year = timeStamp.getFullYear();
  const month = paddingLeft(timeStamp.getMonth() + 1);
  const date = paddingLeft(timeStamp.getDate());
  const day = DAY_OF_WEEK[timeStamp.getDay()];
  const hour = paddingLeft(timeStamp.getHours());
  const minute = paddingLeft(timeStamp.getMinutes());

  return year === new Date().getFullYear()
    ? `${month}/${date} (${day}) ${hour}:${minute}`
    : `${year}/${month}/${date} (${day}) ${hour}:${minute}`;
};

const isCorrectTimeFormat = timeString => {
  return moment(timeString, 'H:m', true).isValid();
};

const constructTodoSubtitle = ({ reminder, note }, timezone) => {
  let subtitle = '';
  subtitle += reminder ? `Remind me at ${renderReminder(reminder, timezone)}\n` : `No reminder\n`;
  if (note) subtitle += `Note: ${note}`;
  return subtitle;
};

const constructShortCutTodoList = todos =>
  todos.map(({ title }, idx) => `${idx + 1}. ${title}`).join('\n');

const constructTodoReminderKey = (userId, todoTitle) => {
  return JSON.stringify({ id: userId, title: todoTitle });
};

const constructDailyReminderKey = userId => {
  return JSON.stringify({ id: userId });
};

module.exports = {
  replaceArrayItemByIndex,
  getTimestampFromReminder,
  renderReminder,
  isCorrectTimeFormat,
  constructTodoSubtitle,
  constructShortCutTodoList,
  constructTodoReminderKey,
  constructDailyReminderKey,
};
