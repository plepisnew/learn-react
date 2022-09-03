/**
 * Converts ISO format time to HH:mm
 * @param val - string representation of time in ISO format
 * @returns string representation of time in format HH:mm
 */
const parseTime = (val: string): string => {
    const [dateTime, timeZone] = val.split('Z'); // 2022-05-19T16:11:23.299 AND ''
    const [date, timeStamp] = dateTime.split('T'); // 2022-05-19 AND 16:11:23.299
    const [time, millis] = timeStamp.split('.'); // 16:11:23 AND 299
    const hourMinute = time.substring(0, 5);
    return hourMinute;
}

export default parseTime;