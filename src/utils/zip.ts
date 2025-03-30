import unzipper from 'unzipper';

export const parseZip = async (rawZip: Buffer) => {
    const unzippedArchive = await unzipper.Open.buffer(rawZip);
    
}

