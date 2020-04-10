export default function SplitMoney(
   money: number,
   installments: number,
): number[] {
   const perMonth: number = Math.floor(money / installments);
   const rest: number = money - perMonth * installments;
   const splittedMoney: number[] = new Array(installments).fill(perMonth);

   splittedMoney[installments - 1] += rest;

   return splittedMoney;
}
