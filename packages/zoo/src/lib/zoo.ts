import { getRandomAnimal } from '@org/animal';
import { formatMessage } from '@org/util';



export function zoo(): string {
  const result = getRandomAnimal();
  const message = `${result.name} says ${result.sound}!`;
  return formatMessage('ZOO', message);
}