export function unixTimeConverter(unix_timestamp) {
    unix_timestamp = unix_timestamp * 1000;
    let timeOptions = { hour: '2-digit', minute: '2-digit'};
    return new Date(unix_timestamp).toLocaleTimeString("en-US", timeOptions).replace(/^0(?:0:0?)?/, '')
}