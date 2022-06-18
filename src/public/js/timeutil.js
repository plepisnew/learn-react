const parseTime = (timeString) => {
    let dateTime = timeString.split('T');

    // Date quantities
    let date = dateTime[0];
    let dateArr = date.split('-');

    let year = dateArr[0];
    let month = dateArr[1];
    let day = dateArr[2];
    
    // Time quantities
    let time = dateTime[1];
    let timeArr = time.split(':');

    let hours = timeArr[0];
    let minutes = timeArr[1];
    let secondsWithMillis = timeArr[2];
    let seconds = secondsWithMillis.split('.')[0];

    return `${hours}:${minutes}`;
}

export default parseTime;