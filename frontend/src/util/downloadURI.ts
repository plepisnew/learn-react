/**
 * Downloads a file from a given URI
 * @param uri source of the blob/file
 * @param fileName name to be assigned to the file
 */
const downloadURI = (uri: string, fileName: string) => {
    const link = document.createElement('a');
    link.download = fileName;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export default downloadURI;
