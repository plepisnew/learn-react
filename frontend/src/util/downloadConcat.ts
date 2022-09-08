import { fetchFile, FFmpeg } from '@ffmpeg/ffmpeg';
import downloadURI from './downloadURI';

/**
 * Fetches all videos provided in the array, concatenates them and downloads as a single file.
 * @param videos string array of video sources
 * @param ffmpeg instance of FFmpeg which is already loaded
 */
const downloadConcat = async (videos: string[], ffmpeg: FFmpeg) => {
    if (!ffmpeg.isLoaded())
        throw new Error('FFmpeg is not loaded. Use await ffmpeg.load()');

    // Loading video data in File System
    let textContent = '';
    for (let i = 0; i < videos.length; i++) {
        const inputData = await fetchFile(videos[i]);
        ffmpeg.FS('writeFile', `input${i}.mp4`, inputData);
        textContent += `file input${i}.mp4\n`;
    }

    // Creating text file and concatenating videos to output.mp4
    ffmpeg.FS('writeFile', 'list.txt', textContent);
    await ffmpeg.run(
        '-f',
        'concat',
        '-i',
        'list.txt',
        '-c',
        'copy',
        'output.mp4'
    );

    // Getting data from output and downloading file
    const outputData = ffmpeg.FS('readFile', 'output.mp4');
    const url = URL.createObjectURL(
        new Blob([outputData], { type: 'video/mp4' })
    );
    downloadURI(url, 'output.mp4');

    // Cleaning File System
    ffmpeg.FS('unlink', 'output.mp4');
    ffmpeg.FS('unlink', 'list.txt');
    for (let i = 0; i < videos.length; i++) {
        ffmpeg.FS('unlink', `input${i}.mp4`);
    }
};

export default downloadConcat;
