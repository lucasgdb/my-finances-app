export default function SumMoney(moneys: number[]): number {
   return moneys.length > 1
      ? moneys.reduce((money1, money2) => money1 + money2)
      : moneys.length === 1
      ? moneys[0]
      : 0;
}
