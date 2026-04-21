export function formatPrice(value: number) {
  return new Intl.NumberFormat("uk-UA").format(value) + " грн";
}
