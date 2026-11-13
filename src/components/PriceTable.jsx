import { DISCOUNT_RATE, DISCOUNT_THRESHOLD_MINUTES, DURATION_OPTIONS, calculateSessionPrice } from '../rules/pricingRule.js';
import { formatDuration, formatPKR } from '../utils/format.js';

// Every possible session price, including the discount, shown up front.
export default function PriceTable({ hourlyRate }) {
  return (
    <div className="table-wrap">
      <table className="price-table">
        <caption className="visually-hidden">Session prices by length</caption>
        <thead>
          <tr><th scope="col">Length</th><th scope="col">Price</th><th scope="col">Discount</th></tr>
        </thead>
        <tbody>
          {DURATION_OPTIONS.map((minutes) => {
            const price = calculateSessionPrice(hourlyRate, minutes);
            return (
              <tr key={minutes}>
                <th scope="row">{formatDuration(minutes)}</th>
                <td>{formatPKR(price.total)}</td>
                <td>{price.discountApplied ? `${DISCOUNT_RATE * 100}% off applied` : '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="hint">Sessions longer than {DISCOUNT_THRESHOLD_MINUTES} minutes get {DISCOUNT_RATE * 100}% off.</p>
    </div>
  );
}
