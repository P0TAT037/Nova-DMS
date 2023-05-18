function getCurrentTime() {
    const date = new Date();
    const timezoneOffset = date.getTimezoneOffset();
    const timezoneOffsetSign = timezoneOffset > 0 ? "-" : "+";
    const timezoneOffsetHours = Math.abs(Math.floor(timezoneOffset / 60));
    const timezoneOffsetMinutes = Math.abs(timezoneOffset % 60);
    const timezoneOffsetString = `${timezoneOffsetSign}${padNumber(timezoneOffsetHours)}:${padNumber(timezoneOffsetMinutes)}`;
    const timeString = date.toISOString().replace("Z", "");
    return `${timeString}${timezoneOffsetString}`;
  }
  
  function padNumber(num) {
    return num.toString().padStart(2, "0");
  }

export {getCurrentTime}