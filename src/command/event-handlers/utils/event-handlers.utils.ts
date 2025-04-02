import * as fs from 'fs';
import * as path from 'path';

export const getRandomImage = (pathFile: string): string => {
  const files = fs.readdirSync(pathFile);
  const image = files.filter((file) =>
    /\.(png|jpg|jpeg|gif|webp)$/i.test(file),
  );
  if (image.length === 0) return '';
  return path.join(pathFile, image[Math.floor(Math.random() * image.length)]);
};

export const getRandomNumber = (): number => {
  const time = new Date().getTime();
  return time;
};

export const getNumberFromString = (
  numberString: string | undefined,
): { amount: number; isNumber: boolean } => {
  if (numberString === undefined) return { amount: 50, isNumber: false };

  const regex = /^\d+(\.\d+)?[KM]?$/i;

  const isNumber = regex.test(numberString);
  if (!isNumber) return { amount: 0, isNumber: false };

  // Get the number and the unit (if exists)
  const value = parseFloat(numberString);
  const multiplier = numberString.toUpperCase().endsWith('K')
    ? 1_000
    : numberString.toUpperCase().endsWith('M')
      ? 1_000_000
      : 1;

  return { amount: Math.floor(value * multiplier), isNumber: true };
};

export const getNumberListFromStringList = (
  numberString: string[],
): { amount: number[]; isNumber: boolean } => {
  const regex = /^\d+(\.\d+)?[KM]?$/i;

  const amount: number[] = [];
  const isNumber = numberString.every((number) => regex.test(number));
  if (!isNumber) return { amount, isNumber: false };

  // Get the number and the unit (if exists)
  numberString.forEach((number) => {
    const value = parseFloat(number);
    const multiplier = number.toUpperCase().endsWith('K')
      ? 1_000
      : number.toUpperCase().endsWith('M')
        ? 1_000_000
        : 1;
    amount.push(Math.floor(value * multiplier));
  });

  return { amount, isNumber: true };
};

export const getFormatedNumber = (number: number): string => {
  return (
    '$' + Intl.NumberFormat('es-ES').format(number).replace(/\./g, "'") + 'MP'
  );
};
