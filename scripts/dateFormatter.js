fullDay = dayNumber => {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[dayNumber];
};
shortDay = dayNumber => {
  let days = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];
  return days[dayNumber];
};
shortMonth = monthNumber => {
  let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months[monthNumber];
};
hours12TrueGMT = hour => {
  let tIndex = hour.indexOf("T");
  let trueHour = hour.slice(tIndex + 1, tIndex + 3);
  return parseInt(trueHour);
};
timeConversion = time => {
  let d = new Date(time);
  let month = shortMonth(d.getMonth());
  let day = fullDay(d.getDay());
  let dayShort = shortDay(d.getDay());
  let date = d.getDate();
  let currentHour = d.getHours();
  let hours12Hour = hours12TrueGMT(time);
  let minutes = d.getUTCMinutes();
  let meridiem = "";
  let meridiem12 = "";
  meridiem = currentHour < 12? "AM":"PM";
  currentHour = currentHour > 12? currentHour - 12: currentHour;
  meridiem12 = hours12Hour < 12? "AM":"PM";
  hours12Hour = hours12Hour > 12? hours12Hour - 12: hours12Hour;

  return { month, day, dayShort, date, currentHour, hours12Hour, minutes, meridiem, meridiem12 };
}
