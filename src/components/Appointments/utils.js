
/* eslint-disable */
export function formatDate(dateStr) {
  const { date, time } = splitDateTime(dateStr);
  return `${date}T${time}`;
}

export const splitDateTimeUTC = dateTimeStr => {
  // Event Date format is: 2020-09-25T11:00:00.000Z
  const checkTime = i => {
    return i < 10 ? `0${i}` : i;
  };

  const currentDate = new Date(dateTimeStr);
  const h = checkTime(currentDate.getUTCHours());
  const m = checkTime(currentDate.getUTCMinutes());

  const time = `${h}:${m}`;

  let splitArray = [];
  splitArray = dateTimeStr.split('T');

  return {
    date: splitArray[0],
    time,
    // time: splitArray[1].substring(0, 5),
  };
};

export const splitDateTime = dateTimeStr => {
  let splitArray = [];
  splitArray = dateTimeStr.split('T');

  return {
    date: splitArray[0],
    time: splitArray[1].substring(0, 5),
  };
};

/* *************************** */
export function getDayOfWeek(dateStr) {
  const currentDate = new Date(dateStr);
  return currentDate.getDay();
}

let eventId = 0;
/* *************************** */
export function createEventId() {
  return String(eventId++);
}

/* *************************** */
export const charReducer = string => {
  const length = 7;
  const stringToReduce = string;
  return stringToReduce.substring(0, length);
};


