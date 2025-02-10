import { PathFile } from 'src/whatsapp-client/constants/whatsapp-client.constants';
import * as fs from 'fs';
import * as path from 'path';

export const getRandomKissImage = (): string => {
  const files = fs.readdirSync(PathFile.IMAGE_KISS_PATH);
  const image = files.filter((file) =>
    /\.(png|jpg|jpeg|gif|webp)$/i.test(file),
  );
  if (image.length === 0) return '';
  return path.join(
    PathFile.IMAGE_KISS_PATH,
    image[Math.floor(Math.random() * image.length)],
  );
};

export const getRandomNumber = (): number => {
  const time = new Date().getTime();
  return time;
};

export const getNumberFromString = (
  numberString: string | undefined,
): { userBet: number; isNumber: boolean } => {
  if (numberString === undefined) return { userBet: 50, isNumber: true };
  const regex = /^\d+$/;
  const isNumber = regex.test(numberString);
  if (isNumber) return { userBet: parseInt(numberString), isNumber: true };
  return { userBet: 0, isNumber: false };
};
