export default function ParseMoney(money: string): number {
   return Number(money.replace(/\D/g, ''));
}
