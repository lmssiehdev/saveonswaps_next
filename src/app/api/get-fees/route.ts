import { getErrorMessage } from "@/utils/misc";
import axios from "axios";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";
import { websites } from "../../../data/websites";

const mock = {
  from: "xmr",
  to: "btc",
  amount: 1.2,
};

// https://exch.cx/api/rates
// https://exch.cx/api/create?from_currency=BTC&from_amount=1&refund_address=&to_currency=XMR&to_amount=&to_address=&rate_mode=dynamic&calc=1&anyamount=1
// https://majesticbank.at/api/v1/calculate?from_currency=BTC&from_amount=1&to_currency=XMR

export async function GET(req: NextRequest) {
  const { from, to, amount } = mock;

  // * amount is optional, and default to one if not sent
  // const response = await fetch(
  //   `https://xchange.me/api/v1/exchange/estimate?from_currency=xmr&to_currency=btc&amount=1`
  // );

  console.log(req);

  // const result = await Promise.allSettled([
  //   majesticBankFormatter(),
  //   xChangeFormatter(),
  //   changeNowFormatter(),
  //   letsexchangeFormatter(),
  //   exolixFormatter(),
  //   stealthExFormatter(),
  // ]);

  return NextResponse.json({
    fees: {
      working: true,
      // result,
    },
  });
}

/**
 * @see https://api.godex.io/?javascript#coin-info
 */
async function godexFormatter() {
  try {
    const { data } = await axios.post(
      "https://api.godex.io/api/v1/info",
      {
        from: "BTC",
        to: "XMR",
        amount: 1,
      },

      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    console.log(data);
    return data;
  } catch (e) {
    return getErrorMessage(e);
  }
}

async function majesticBankFormatter() {
  const website = websites["MAJESTIC_BANK"];

  const response = await axios.get("https://majesticbank.at/api/v1/calculate", {
    params: {
      from_amount: 0.1,
      from_currency: "BTC",
      receive_currency: "XMR",
    },
  });

  return { [website]: response.data };
}

async function exchFormatter() {
  const response = await axios.get("https://exch.cx/api/create", {
    params: {
      from_amount: 0.1,
      from_currency: "BTC",
      to_currency: "XMR",
      to_address:
        "88FyWSxg2ZF3hZHLUwgEkS7Dutqtaf2X9BrTUEZgf8acYLgF9qMDFBEdF6uW8fCT8eHXpAhnewEQ9LgQxWnf1xi8KGJF9Ty",
    },
    headers: {
      "X-Requested-With": "XMLHttpRequest",
    },
  });
  return response.data;
}

async function aishiftFormatter() {
  try {
    const response = await axios.post("https://sideshift.ai/api/v2/quotes", {
      headers: {
        "x-sideshift-secret": '"2d880aab08340f243c3803515f19a0ebf"',
        "x-user-ip": "1.2.3.4",
        "Content-Type": "application/json",
        data: JSON.stringify({
          depositCoin: "eth",
          depositNetwork: "arbitrum",
          settleCoin: "eth",
          settleNetwork: "mainnet",
          depositAmount: "0.14364577",
          settleAmount: null,
          affiliateId: "YQMi62XMb",
          // to_address:
          // "88FyWSxg2ZF3hZHLUwgEkS7Dutqtaf2X9BrTUEZgf8acYLgF9qMDFBEdF6uW8fCT8eHXpAhnewEQ9LgQxWnf1xi8KGJF9Ty",
        }),
      },
    });
    return response.data;
  } catch (e) {
    console.log(e);
    return getErrorMessage(e);
  }
}

/** 
 * status: waiting for email response to get fixed rate.
  @see https://documenter.getpostman.com/view/8180765/SVfTPnM8#ef213b82-c9ff-497a-baac-587deda872a1
*/
async function changeNowFormatter() {
  const API_KEY = process.env.STEALTHEX_API_KEY;

  try {
    if (!API_KEY) {
      throw new Error(" Please provide an api key ");
    }

    const response = await axios.get(
      "https://api.changenow.io/v1/exchange-amount/fixed-rate/1/btc_xmr",
      {
        params: {
          api_key: API_KEY,
        },
      }
    );
    return response.data;
  } catch (e) {
    console.error(getErrorMessage(e));
    return null;
  }
}

type Params = {
  from: string;
  to: string;
  amount: string | number;
};

/**
 *
 * @see https://partner.swapuz.com/api-docs
 */
async function swapuz({ from, to, amount }: Params) {
  try {
    const { data } = await axios.get(
      "https://api.swapuz.com/api/home/v1/rate/",
      {
        params: {
          from: "BTC",
          to: "XMR",
          amountResult: 12,
          mode: "fix",
        },
      }
    );

    return data;
  } catch (e) {
    console.error(getErrorMessage(e));
    return null;
  }
}

async function xChangeFormatter() {
  try {
    const { data } = await axios.get(
      "https://xchange.me/api/v1/exchange/estimate",
      {
        params: {
          amount: 1,
          from_currency: "BTC".toLocaleLowerCase(),
          to_currency: "XMR".toLocaleLowerCase(),
        },
      }
    );
    console.log(data);

    return data;
  } catch (e) {
    console.error(getErrorMessage(e));
    return null;
  }
}

/**
 * @see https://documenter.getpostman.com/view/11320959/T17J8mzw?version=latest
 */
async function stealthExFormatter() {
  const API_KEY = process.env.STEALTHEX_API_KEY;

  try {
    if (!API_KEY) {
      throw new Error(" Please provide an api key ");
    }

    const { data } = await axios.get(
      "https://api.stealthex.io/api/v2/estimate/btc/xmr",
      {
        params: {
          amount: 0.1,
          api_key: API_KEY,
          fixed: true,
        },
      }
    );
    return data;
  } catch (e) {
    console.erro(getErrorMessage(e));
    return;
  }
}

/**
 *
 * @see https://exolix.com/developers
 */
async function exolixFormatter() {
  try {
    const { data } = await axios.get("https://exolix.com/api/v2/rate", {
      params: {
        coinFrom: "BTC",
        coinTo: "XMR",
        amount: 1,
        rateType: "fixed",
      },
    });
    return data;
  } catch (e) {
    console.error(getErrorMessage(e));
    return null;
  }
}

/**
 *
 * @see https://api.letsexchange.io/doc
 */
async function letsexchangeFormatter() {
  const API_KEY = process.env.LETSEXCHANGE_API_KEY;

  try {
    if (!API_KEY) {
      throw new Error(" Please provide an api key ");
    }
    const { data } = await axios.post(
      "https://api.letsexchange.io/api/v1/info",
      {
        from: "BTC",
        to: "XMR",
        amount: 1,
        float: false,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  } catch (e) {
    console.error(getErrorMessage(e));
    return null;
  }
}
