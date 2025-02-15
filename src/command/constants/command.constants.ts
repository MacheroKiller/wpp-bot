export enum Commands {
  KISS = 'kiss',
  PUNCH = 'punch',
  HELP = 'help',
  COIN_FLIP = 'coinflip', // !coinflip <face/seal> <money>
  BALANCE = 'balance',
  BALANCE_TOP = 'balancetop',
  MONEY = 'money',
  PASS_MONEY = 'passmoney', // !passmoney @user 100
  CREATE_ACCOUNT = 'create',
  MINE = 'mine',
  STORE = 'store',
  BUY = 'buy', // !buy <itemID>
  INFO = 'info', // !info <itemID>
  PROFILE = 'profile', // !profile
  ATTACK = 'attack', // !attack @user - !attack <empty> -> random user
}
