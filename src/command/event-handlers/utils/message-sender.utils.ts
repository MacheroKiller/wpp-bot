import { Commands } from 'src/command/constants/command.constants';
import { getFormatedNumber } from 'src/command/event-handlers/utils/event-handlers.utils';
import { GroupMember } from 'src/group/models/group-member.model';
import { ItemsStore } from 'src/group/models/items-store.model';

// Account Handler
export const accountAlreadyExists = 'You already have an account.';

export const newAccountCreated = (balance: number) =>
  `New account created with *${getFormatedNumber(balance)}*`;

export const noAccountCreated = `First create an account with the command *!${Commands.CREATE_ACCOUNT}*`;

export const noUserFound = `The target user does not have an account.`;

export const needMentionSomeone = `Maybe if you mention someone...`;

export const antiSpamMessage = (secondsLeft: number) =>
  `*Police anti-spam:* NOT SO FAST! Wait *${secondsLeft} seconds* to use the next command!`;

// Balance Handler

export const userBalance = (user: GroupMember) =>
  `${user.name} balance is *${getFormatedNumber(user.balance)}*`;

export const errorAmountMessage = `You need to pass an amount of money duuuh!`;

export const errorInsufficientFunds = `You don't have that money bruh.`;

export const passMoneySuccessMessage = (
  user: GroupMember,
  amount: number,
  target: GroupMember,
) => `*${user.name}* passed *${getFormatedNumber(amount)}* to *${target.name}*`;

// Buy Handler

export const theGreatPiggyNin = '*The great piggy Nin 🐽:*';

export const errorItemNoFoundMessage = `${theGreatPiggyNin} Buy... what?? `;

export const errorNotEnoughMoneyMessage = `${theGreatPiggyNin} Bruh... no money = no item `;

export const errorSameItemMessage = `${theGreatPiggyNin} Uh?!? Why do you want to acquire the same item?`;

export const errorDowngradeMessage = `${theGreatPiggyNin}  No downgrade in my presence!`;

export const itemBoughtMessage = (item: ItemsStore, newBalance: number) =>
  `${theGreatPiggyNin} Neeeeewwww adquisition!!!  
  *${item.name}* for *${getFormatedNumber(item.price)}*.
  Your new balance is *${getFormatedNumber(newBalance)}*`;

// Coin Flip Handler

export const coinFlip = ['face', 'seal'];

export const coinFlipResultMessage = (result: string) =>
  `The result is: *${result}*.`;

export const errorBetMessage = `Wtf? A number would be ideal!!`;

export const errorPredictionMessage = `Dumb! You can only predict "face" or "seal".`;

export const errorNotEnoughMoneyToBetMessage = (balance: number) =>
  `You dont have enough money to bet: *${getFormatedNumber(balance)}*`;

export const correctPredictionMessage = (amount: number, result: string) =>
  `${coinFlipResultMessage(result)}..
Nice prediction! You won *+${getFormatedNumber(amount)}*!!`;

export const failPredictionMessage = (amount: number, result: string) =>
  `${coinFlipResultMessage(result)}..
Good luck next time! You lost *-${getFormatedNumber(amount)}*!!`;

// Info Handler

export const butterGod = '*Butter God 🧈:*';

export const userProfile = (
  user: GroupMember,
  userTool: ItemsStore,
  userWeapon: ItemsStore,
) =>
  `${butterGod} Human ${user.name}! Your stats are:
- Balance: *${getFormatedNumber(user.balance)}*
- Tool: *${userTool?.name}*
- Weapon: *${userWeapon?.name}*`;

export const errorIdItemNotFoundMessage = `${butterGod} Stupid human! What item is that?`;

export const itemProfile = (item: ItemsStore) =>
  `${butterGod} The item's stats are:
- *Name:* ${item.name}
- *Price:* ${getFormatedNumber(item.price)}
- *Multiplier:* ${item.multiplier}
- *Type:* ${item.type}
- *Description:* ${item.description}`;

// Mine Handler

export const dragonMessage = (minedAmount: number) =>
  `Oh no! 🔥A dragon has burned your precious rocks to ashes🔥!
*Your lost ${getFormatedNumber(minedAmount)}*`;

export const mineSuccessMessage = (minedAmount: number) =>
  `No dragons here! You found some precious rocks 🌋! 
*You won ${getFormatedNumber(minedAmount)}*`;

// Store Handler

export const infoExtraMessage = `
- Use *!buy <id>* to buy an item
- Use *!info <id>* to see the item info`;

export const storeMessage = `🐽 Welcome to ${theGreatPiggyNin}
- ID   -  Item   -   Price`;

export const toolStoreMessage = `${storeMessage}
- (WP) - Wooden Pickaxe: *$10'000 MP*
- (SP) - Stone Pickaxe: *$50'000 MP*
- (GP) - Gold Pickaxe: *$200'000 MP*
- (IP) - Iron Pickaxe: *$700'000 MP*
- (DP) - Diamond Pickaxe: *$3.5M MP*
- (NP) - Netherite Pickaxe: *$10M MP*
${infoExtraMessage}`;

export const weaponStoreMessage = `${storeMessage}
- (SS) - Stone Sword: *$10'000 MP*
- (GS) - Gold Sword: *$50'000 MP*
- (IS) - Iron Sword: *$100'000 MP*
- (OS) - Obsidian Sword: *$500'000 MP*
- (DS) - Diamond Sword: *$1M MP*
- (NS) - Netherite Sword: *$10M MP*
${infoExtraMessage}`;

export const errorStoreMessage = `🐽 ${theGreatPiggyNin} What are you trying to buy?
- !store <tools/weapons>`;

export const storeSide = ['tools', 'weapons'];

// Attack Handler
export const attackSuccessMessage = (
  resultAttack: number,
  target: GroupMember,
) =>
  `Nice steal! You got *${getFormatedNumber(resultAttack)}* from *${target.name}*.`;

export const attackFailMessage = (resultAttack: number, target: GroupMember) =>
  `The police caught you trying to steal from *${target.name}*! and made you pay him *${getFormatedNumber(resultAttack)}*`;

// Roulette Handler

export const rouletteHelperMessage = `The command is: *!roulette <amount> p:<color/number> p:<color/number> ...*`;

export const rouletteHelperBetMessage = `Error: You need to write the color or number for just one bet. Example: *!roulette 100 p:red p:12*`;

export const rouletteHelperPredictionMessage = `You need to write *p:* before the color or number, like this: *p:red* or *p:12*`;

export const rouletteErrorPredictionMessage = `Only numbers from *0 to 36* are allowed and the colors *red* and *black*`;

export const rouletteColor = ['p:red', 'p:black'];

export const rouletteColorWithoutP = ['red', 'black'];

export const rouletteNumbers = Array.from({ length: 37 }, (_, i) => i);
