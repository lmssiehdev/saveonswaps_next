export default function Input() {
  return (
    <>
      <form action={"/result"}>
        <input
          className="font-medium py-2.5 px-4 block"
          name="amount"
          required
          type="number"
        />
        <SelectCoin />
        <SelectCoin />
        <button type="submit" className="block">
          Get Best Fee
        </button>
      </form>
    </>
  );
}

function SelectCoin() {
  return (
    <select
      className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
      name="from"
    >
      <option className="font-inherit" value="btc">
        BTC
      </option>
      <option value="xmr">XMR</option>
    </select>
  );
}
