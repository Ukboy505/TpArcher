// ./data.js
import { generateTradingSignal } from './signals.js';
import { generateSmcTradingSignal } from './signals-smc.js';
import { getIndicatorParams, resetInputs, refreshTable, updateWithSignal, updateTickerUI, updateStatus, initializePushNotifications } from './ui.js';
import { formatUnixTimestamp } from './utils.js';
import { validateWeights, validatePercentageInputs, validateLookback, validateHtfLimit, validateCandlePatternSettings } from './validation.js';
import { updateChartWithSignal/*, updateLatestCandleClose*/ } from './chart.js';
import * as bitmart from './exchanges/bitmart.js';
import * as bitget from './exchanges/bitget.js';
import * as mexc from './exchanges/mexc.js';
import * as binance from './exchanges/binance.js';

// Exchanges files instances map
export const exchanges = {
  'bitmart': bitmart,
  'bitget': bitget,
  'mexc': mexc,
  'binance': binance
};

export let exchangeNames = ['bitmart', 'bitget', 'mexc', 'binance'];

export const symbolsCache = {
    bitmart: [],
    bitget: [],
    mexc: [],
    binance: []
};

// Popular Symbols
export const popularSymbols = {
  'binance': [
    'BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'XRP/USDT', 'ADA/USDT',
    'SOL/USDT', 'DOGE/USDT', 'DOT/USDT', 'TRX/USDT', 'AVAX/USDT',
    'MATIC/USDT', 'LINK/USDT', 'TON/USDT', 'SHIB/USDT', 'LTC/USDT',
    'BCH/USDT', 'ALGO/USDT', 'VET/USDT', 'ICP/USDT', 'HBAR/USDT',
    'NEAR/USDT', 'XLM/USDT', 'ETC/USDT', 'FIL/USDT', 'THETA/USDT',
    'FTM/USDT', 'AAVE/USDT', 'GRT/USDT', 'EOS/USDT', 'CAKE/USDT',
    'SAND/USDT', 'MANA/USDT', 'AXS/USDT', 'CHZ/USDT', 'ENJ/USDT',
    'CRV/USDT', 'YFI/USDT', 'UNI/USDT', 'SUSHI/USDT', '1INCH/USDT',
    'ZEC/USDT', 'DASH/USDT', 'NEO/USDT', 'XTZ/USDT', 'KSM/USDT',
    'ATOM/USDT', 'IOTA/USDT', 'ORDI/USDT', 'RUNE/USDT', 'INJ/USDT'
  ],
  'mexc': [
    'BTC/USDT', 'ETH/USDT', 'XRP/USDT', 'LTC/USDT', 'BCH/USDT',
    'SOL/USDT', 'DOGE/USDT', 'ADA/USDT', 'BNB/USDT', 'TRX/USDT',
    'MATIC/USDT', 'LINK/USDT', 'TON/USDT', 'SHIB/USDT', 'AVAX/USDT',
    'DOT/USDT', 'ALGO/USDT', 'VET/USDT', 'ICP/USDT', 'HBAR/USDT',
    'NEAR/USDT', 'XLM/USDT', 'ETC/USDT', 'FIL/USDT', 'THETA/USDT',
    'FTM/USDT', 'AAVE/USDT', 'GRT/USDT', 'EOS/USDT', 'CAKE/USDT',
    'SAND/USDT', 'MANA/USDT', 'AXS/USDT', 'CHZ/USDT', 'ENJ/USDT',
    'CRV/USDT', 'YFI/USDT', 'UNI/USDT', 'SUSHI/USDT', '1INCH/USDT',
    'ZEC/USDT', 'DASH/USDT', 'NEO/USDT', 'XTZ/USDT', 'KSM/USDT',
    'ATOM/USDT', 'IOTA/USDT', 'ORDI/USDT', 'RUNE/USDT', 'INJ/USDT'
  ],
  'bitmart': [
    'BTC/USDT', 'ETH/USDT', 'XRP/USDT', 'LTC/USDT', 'DOGE/USDT',
    'SOL/USDT', 'ADA/USDT', 'BNB/USDT', 'TRX/USDT', 'MATIC/USDT',
    'LINK/USDT', 'TON/USDT', 'SHIB/USDT', 'AVAX/USDT', 'DOT/USDT',
    'ALGO/USDT', 'VET/USDT', 'ICP/USDT', 'HBAR/USDT', 'NEAR/USDT',
    'XLM/USDT', 'ETC/USDT', 'FIL/USDT', 'THETA/USDT', 'FTM/USDT',
    'AAVE/USDT', 'GRT/USDT', 'EOS/USDT', 'CAKE/USDT', 'SAND/USDT',
    'MANA/USDT', 'AXS/USDT', 'CHZ/USDT', 'ENJ/USDT', 'CRV/USDT',
    'YFI/USDT', 'UNI/USDT', 'SUSHI/USDT', '1INCH/USDT', 'ZEC/USDT',
    'DASH/USDT', 'NEO/USDT', 'XTZ/USDT', 'KSM/USDT', 'ATOM/USDT',
    'IOTA/USDT', 'ORDI/USDT', 'RUNE/USDT', 'INJ/USDT', 'AR/USDT'
  ],
  'bitget': [
    'BTC/USDT', 'ETH/USDT', 'XRP/USDT', 'DOGE/USDT', 'SOL/USDT',
    'ADA/USDT', 'BNB/USDT', 'TRX/USDT', 'MATIC/USDT', 'LINK/USDT',
    'TON/USDT', 'SHIB/USDT', 'AVAX/USDT', 'DOT/USDT', 'ALGO/USDT',
    'VET/USDT', 'ICP/USDT', 'HBAR/USDT', 'NEAR/USDT', 'XLM/USDT',
    'ETC/USDT', 'FIL/USDT', 'THETA/USDT', 'FTM/USDT', 'AAVE/USDT',
    'GRT/USDT', 'EOS/USDT', 'CAKE/USDT', 'SAND/USDT', 'MANA/USDT',
    'AXS/USDT', 'CHZ/USDT', 'ENJ/USDT', 'CRV/USDT', 'YFI/USDT',
    'UNI/USDT', 'SUSHI/USDT', '1INCH/USDT', 'ZEC/USDT', 'DASH/USDT',
    'NEO/USDT', 'XTZ/USDT', 'KSM/USDT', 'ATOM/USDT', 'IOTA/USDT',
    'ORDI/USDT', 'RUNE/USDT', 'INJ/USDT', 'AR/USDT', 'LDO/USDT'
  ]
};

// Existing exports and variables
export let currentExchange = '';
export let newSymbol = 'BTC/USDT';
export let symbol = null;
export let granularity = null;
export let baseToken = 'BTC';
export let quoteToken = 'USDT';
export let granularityMs = 3600000; // Default to 1h
export let higherGranularityMs = 14400000; // Default to 4h
export let granularityMap; // Selected exchange granularityMap
export let nextHtfGranularityMap;
// Selected exchange nextGranularityMap
export let baseVolumeTable = null;
export let quoteVolumeTable = null;
export let usdtVolumeTable = null;
export let newCandles = [];
export let globalCandles = [];
export let withHtf = false;
export let higherTimeframeCandles = [];
export let allCandles = [];
export let allHtfCandles = [];
export let tradeSize = null;
export let candlesData = [];
export let latestCandle = null;
export let htfLatestCandle = null;
export let withLatestCandle = false;
export let ticker = null;
export let initialState = {
    symbol: null,
    newSymbol: null,
    baseVolumeTable: null,
    quoteVolumeTable: null,
    granularity: null,
    higherGranularity: null,
    limit: null,
    htfLimit: 60, // Add default HTF limit
    startTime: null,
    endTime: null,
    tradeSize: null,
    feePercent: null,
    indicators: null,
    candlePatterns: null,
    chartPatterns: null,
    weightParams: null,
    priceLevelParams: null,
    candles: null,
    higherTimeframeCandles: null,
    signalResult: null,
    htfSignalResult: null
};
export let recentState = {};

export let signalResult = {};
export let htfSignalResult = {};
export let signalMarkerIndex = -1;
export let htfSignalMarkerIndex = -1;
// Tracking last signal
let lastSignalType = null;
let lastSignalStrength = null;
let lastHtfSignalType = null;
let lastHtfSignalStrength = null;
let isInitialSignalPushed = false;

// Trend strength state for detection of support and resistance
export let onlyRecent = false;
export let onlyStrong = false;

export let isBackTest = false;

// Subscription plan flags (these should ideally come from user authentication or a config)
const isBasic = true; // Default to basic account
const isPro = false;
const isPremium = false;
const isRetailer = false;
const isEnterprise = false;
const isPartner = false;

// Dynamic API call limits
const highLimitExchanges = ['binance', 'bitget'];
let OHLCV_CALLS_PER_SECOND = 1; // Default for basic account
let TICKER_CALLS_PER_SECOND = 1; // Default for basic account
const defaultRequestLimit = (withHtf) => withHtf ? 4 : 5; // Dynamic based on HTF
const highRequestLimit = 20; // 20 requests/second for high-limit exchanges

// Rate limiting variables
let apiCallCount = 0;
let lastSecondStartOHLCV = Date.now();
let tickerCallCount = 0;
let lastSecondStartTicker = Date.now();
const SECOND_MS = 1000;
let realTimeInterval = null;
let tickerInterval = null;
let isFetchingOHLCV = false;
let isFetchingTicker = false;

// New power stores for counter-based abort
let ohlcvAbortController = null;
let tickerAbortController = null;
let pendingOhlcvCalls = 0;
let pendingTickerCalls = 0;
const getMaxPendingCalls = (exchangeId) => exchangeId === 'mexc' ? 2 : 3; // Dynamic threshold: 2 for MEXC, 3 for others

// Track last candle timestamps for new candle detection
let lastLatestCandleTimestamp = 0;
let lastHtfLatestCandleTimestamp = 0;

// Set API call limits based on subscription plan
function setApiCallLimits(exchangeId, withHtf) {
    const isHighLimitExchange = highLimitExchanges.includes(exchangeId);
    const baseLimit = isHighLimitExchange ? highRequestLimit : defaultRequestLimit(withHtf);

    if (isPremium || isEnterprise || isPartner) {
        // Premium, Enterprise, and Partner plans: 5 calls/second for all exchanges
        // Enterprise can scale up to 20 for highLimitExchanges
        OHLCV_CALLS_PER_SECOND = isHighLimitExchange && isEnterprise ? 20 : 5;
        TICKER_CALLS_PER_SECOND = isHighLimitExchange && isEnterprise ? 20 : 5;
    } else if (isRetailer) {
        // Retailer plan: 3 calls/second
        OHLCV_CALLS_PER_SECOND = 3;
        TICKER_CALLS_PER_SECOND = 3;
    } else if (isPro) {
        // Pro plan: 2 calls/second
        OHLCV_CALLS_PER_SECOND = 2;
        TICKER_CALLS_PER_SECOND = 2;
    } else {
        // Basic plan: 1 call/second
        OHLCV_CALLS_PER_SECOND = 1;
        TICKER_CALLS_PER_SECOND = 1;
    }
}

// Map candles to chart format
export let mapCandlesToChartFormat = (candles) => {
    if (!candles || !Array.isArray(candles)) return [];
    return candles
        .filter(c => c && Array.isArray(c) && c.length >= 7)
        .map(c => [
            Number(c[0]),
            Number(c[1]),
            Number(c[2]),
            Number(c[3]),
            Number(c[4]),
            Number(c[5]),
            Number(c[6])
        ]);
};

// Cache all exchanges symbols
export async function cacheAllSymbols() {
  let successAmount = [];
  
  for (const exchange of exchangeNames) {
    if (symbolsCache[exchange].length === 0) {
      try {
        symbolsCache[exchange] = await exchanges[exchange].fetchSymbols();
        successAmount.push(symbolsCache[exchange].length > 0);
      } catch (error) {
        updateStatus(`Error: Check your network connection`, false);
        successAmount.push(false);
      }
    } else {
      successAmount.push(true);
    }
  }

  const allSuccessful = successAmount.every(s => s === true);
  if (allSuccessful) {
    return true;
  } else {
    return await cacheAllSymbols(); // Retry on failure
  }
}

// Modified fetchOHLCV with structured return for notifications
export async function fetchOHLCV() {
  if (isFetchingOHLCV) {
    pendingOhlcvCalls++;
    const exchangeId = document.getElementById('input-exchange')?.value || 'bitget';
    const maxPendingCalls = getMaxPendingCalls(exchangeId);
    if (pendingOhlcvCalls >= maxPendingCalls) {
     
      if (ohlcvAbortController) {
        ohlcvAbortController.abort();
        ohlcvAbortController = null;
      }
      isFetchingOHLCV = false;
      pendingOhlcvCalls = 0;
      return { success: false };
    }
    
    return { success: false };
  }
  isFetchingOHLCV = true;
  pendingOhlcvCalls = 1;
  ohlcvAbortController = new AbortController();

  try {
    recentState = null;
    const now = Date.now();
    const withHtfCheckbox = document.getElementById('with-htf-checkbox');
    const withLatestCandleCheckbox = document.getElementById('with-latest-candle');
    const realTimeCheckbox = document.getElementById('real-time-updates');
    withHtf = withHtfCheckbox?.checked || false;
    withLatestCandle = withLatestCandleCheckbox?.checked || false;
    const isRealTime = realTimeCheckbox?.checked || false;

    const exchangeId = document.getElementById('input-exchange')?.value || 'bitget';
    setApiCallLimits(exchangeId, withHtf);

    if (now - lastSecondStartOHLCV >= SECOND_MS) {
      apiCallCount = 0;
      lastSecondStartOHLCV = now;
    }
    if (apiCallCount >= OHLCV_CALLS_PER_SECOND) {
      const timeUntilNextSecond = SECOND_MS - (now - lastSecondStartOHLCV);
      await new Promise(resolve => setTimeout(resolve, timeUntilNextSecond + 10));
      isFetchingOHLCV = false;
      pendingOhlcvCalls = 0;
      return { success: false };
    }
    apiCallCount++;

    currentExchange = exchangeId.toUpperCase();
    const exchange = exchanges[exchangeId];
    if (!exchange) throw new Error(`Unsupported exchange: ${exchangeId}`);

    const symbolInput = document.getElementById("input-symbol");
    if (!symbolInput) throw new Error("Symbol input not found");
    newSymbol = symbolInput.value.trim();
    const granularityInput = document.getElementById("input-granularity");
    if (!granularityInput) throw new Error("Granularity input not found");
    granularity = granularityInput.value;
    const limitInput = document.getElementById("input-limit");
    if (!limitInput) throw new Error("Limit input not found");
    const htfLimitInput = document.getElementById("input-htf-limit");
    let htfLimit = htfLimitInput ? parseInt(htfLimitInput.value) || 60 : 60;

    let limit = parseInt(limitInput.value);
    const startTimeInput = document.getElementById("input-start-time");
    const endTimeInput = document.getElementById("input-end-time");
    const tradeSizeInput = document.getElementById("input-trade-size");
    let newTradeSize = tradeSizeInput ? parseFloat(tradeSizeInput.value) || 1000 : 1000;
    const feeInput = document.getElementById("input-fee");
    let feePercent = feeInput ? parseFloat(feeInput.value) || 0 : 0;

    if (!newSymbol) throw new Error("Symbol is required");
    if (!newSymbol.includes('/')) throw new Error("Invalid Symbol! (e.g., Correct format is BTC/USDT)");
    if (!granularity) throw new Error("Granularity is required");
    if (isNaN(limit) || limit < 200 || limit > 1000 || (exchangeId === 'mexc' && limit > 500)) {
      throw new Error("Limit must be between 200 and 1000 (500 max on MEXC)");
    }
    if (isNaN(htfLimit) || htfLimit < 1 || htfLimit > 1000) {
      throw new Error("HTF Limit must be between 1 and 1000");
    }
    if (isNaN(newTradeSize) || newTradeSize <= 0) {
      throw new Error("Trade size must be positive");
    }

    let splitSymbol = newSymbol.split('/');
    baseToken = splitSymbol[0];
    quoteToken = splitSymbol[1];
    symbol = newSymbol.replace('/', '');

    granularityMs = exchange.granularityMap[granularity];
    if (!granularityMs) throw new Error(`Invalid granularity: ${granularity}`);

    let startTime, endTime;
    if (startTimeInput && startTimeInput.value && endTimeInput && endTimeInput.value) {
      startTime = new Date(startTimeInput.value).getTime();
      endTime = new Date(endTimeInput.value).getTime();
      if (isNaN(startTime) || isNaN(endTime)) {
        throw new Error("Invalid time input");
      }
      if (startTime >= endTime) {
        throw new Error("Start time must be before end time");
      }
    } else {
      endTime = Math.ceil(Date.now() / granularityMs) * granularityMs + granularityMs;
      startTime = endTime - (exchange.granularityToSeconds(granularity) * limit * 1000);
    }

    // Always fetch all available candles up to limit
    const fetchLimit = exchangeId === 'mexc' ? Math.min(limit, 500) : limit;
    endTime = endTime + granularityMs;
    newCandles = await exchange.fetchOHLCV(newSymbol, granularity, startTime, endTime, fetchLimit, { signal: ohlcvAbortController.signal });

    const currentPeriodStart = Math.floor(Date.now() / granularityMs) * granularityMs;
    const currentPeriodEnd = currentPeriodStart + granularityMs;
    const completedCandles = newCandles.filter(c => c[0] < currentPeriodStart);
    let latest = newCandles.find(c => c[0] >= currentPeriodStart);

    const isValidCandle = (candle) => {
      if (!candle || !Array.isArray(candle) || candle.length < 6) return false;
      const [time, open, high, low, close, volume] = candle.map(Number);
      return !isNaN(time) && !isNaN(open) && !isNaN(high) && !isNaN(low) && !isNaN(close) && !isNaN(volume) &&
             high >= low && open > 0 && close > 0 && volume >= 0;
    };

    latestCandle = latest && isValidCandle(latest) ? latest : null;
    globalCandles = [...completedCandles].sort((a, b) => a[0] - b[0]).slice(-limit);

    higherTimeframeCandles = [];
    htfLatestCandle = null;
    if (withHtf) {
      const higherTimeframe = exchange.nextHtfGranularityMap[granularity];
      higherGranularityMs = exchange.granularityMap[higherTimeframe];
      if (!higherGranularityMs) {
        console.warn(`Invalid higher timeframe: ${higherTimeframe}`);
      } else {
          if (withHtf) {
        const htfCurrentPeriodStart = Math.floor(Date.now() / higherGranularityMs) * higherGranularityMs;
        const htfCurrentPeriodEnd = htfCurrentPeriodStart + higherGranularityMs;
        const higherEndTime = Math.ceil(Date.now() / higherGranularityMs) * higherGranularityMs + higherGranularityMs;
        const higherStartTime = higherEndTime - (exchange.granularityToSeconds(higherTimeframe) * (htfLimit + 1) * 1000);
        const htfCandles = await exchange.fetchOHLCV(newSymbol, higherTimeframe, higherStartTime, higherEndTime, htfLimit/*, { signal: ohlcvAbortController.signal }*/);
        higherTimeframeCandles = htfCandles.filter(c => c[0] < htfCurrentPeriodStart).slice(-htfLimit);
        htfLatestCandle = htfCandles.find(c => c[0] >= htfCurrentPeriodStart);
        htfLatestCandle = htfLatestCandle && isValidCandle(htfLatestCandle) ? htfLatestCandle : null;
      }
      }
    }

    const minMainTimestamp = globalCandles.length > 0 ? Math.min(...globalCandles.map(c => c[0])) : startTime;
    const maxMainTimestamp = globalCandles.length > 0 ? Math.max(...globalCandles.map(c => c[0])) : endTime;
    const minHtfTimestamp = higherTimeframeCandles.length > 0 ? Math.min(...higherTimeframeCandles.map(c => c[0])) : null;
    const maxHtfTimestamp = higherTimeframeCandles.length > 0 ? Math.max(...higherTimeframeCandles.map(c => c[0])) : null;

    const baseVolumeElement = document.getElementById('base-volume');
    if (baseVolumeElement) {
      baseVolumeTable = baseVolumeElement.textContent = `${baseToken} Volume` || 'BTC Volume';
    }

    const usdtVolumeElement = document.getElementById('usdt-volume');
    if (usdtVolumeElement) {
      usdtVolumeTable = usdtVolumeElement.textContent = 'USDT Volume';
    }

    const quoteVolumeElement = document.getElementById('quote-volume');
    if (quoteVolumeElement) {
      quoteVolumeTable = quoteVolumeElement.textContent = `${quoteToken} Volume` || 'USDT Volume';
    }

    const recalculateButton = document.getElementById('recalculate');
    if (recalculateButton) {
      recalculateButton.disabled = !globalCandles || globalCandles.length === 0;
    }

    refreshTable(globalCandles);

    allCandles = latestCandle ? [...globalCandles, latestCandle] : globalCandles;
    allHtfCandles = (withHtf && htfLatestCandle) ? [...higherTimeframeCandles, htfLatestCandle] : higherTimeframeCandles;

    const params = getIndicatorParams();
    const useLatestCandleForSignal = withLatestCandle;
    const candlesForSignal = useLatestCandleForSignal && latestCandle ? [...globalCandles, latestCandle] : globalCandles;
    const htfCandlesForSignal = (withHtf && useLatestCandleForSignal && htfLatestCandle) ? [...higherTimeframeCandles, htfLatestCandle] : higherTimeframeCandles;

    const useSMCOnlyToggle = document.getElementById('use-smc-only')?.checked;

    if (useSMCOnlyToggle) {
      signalResult = generateSmcTradingSignal(mapCandlesToChartFormat(candlesForSignal));
    } else {
      signalResult = generateTradingSignal(mapCandlesToChartFormat(candlesForSignal));
    }

    if (withHtf) {
      if (useSMCOnlyToggle) {
        htfSignalResult = generateSmcTradingSignal(mapCandlesToChartFormat(htfCandlesForSignal));
      } else {
        htfSignalResult = generateTradingSignal(mapCandlesToChartFormat(htfCandlesForSignal));
      }
    }

    signalMarkerIndex = useLatestCandleForSignal/* && latestCandle*/ ? allCandles.length - 1 : !useLatestCandleForSignal && latestCandle ? allCandles.length - 2 : allCandles.length - 1;
    
    htfSignalMarkerIndex = (withHtf && useLatestCandleForSignal/* && htfLatestCandle*/) ? allHtfCandles.length - 1 : withHtf && !useLatestCandleForSignal && htfLatestCandle ? allHtfCandles.length - 2 : allHtfCandles.length - 1;

    if (signalMarkerIndex < 0 || candlesForSignal.length < 2) signalMarkerIndex = candlesForSignal.length - 1;
    if (htfSignalMarkerIndex < 0 || htfCandlesForSignal.length < 2) htfSignalMarkerIndex = htfCandlesForSignal.length - 1;

    initialState = {
      exchangeId,
      newSymbol,
      symbol,
      baseToken,
      quoteToken,
      baseVolumeTable,
      quoteVolumeTable,
      granularity,
      higherTimeframe: withHtf ? exchange.nextHtfGranularityMap[granularity] : null,
      limit,
      htfLimit,
      startTime,
      endTime,
      minMainTimestamp,
      maxMainTimestamp,
      minHtfTimestamp,
      maxHtfTimestamp,
      tradeSize: newTradeSize,
      feePercent,
      indicators: getIndicatorParams().indicatorParams,
      candlePatterns: getIndicatorParams().candlePatterns,
      chartPatterns: getIndicatorParams().chartPatterns,
      weightParams: getIndicatorParams().weightParams,
      priceLevelParams: getIndicatorParams().priceLevelParams,
      allCandles,
      allHtfCandles,
      globalCandles,
      higherTimeframeCandles,
      latestCandle,
      htfLatestCandle,
      signalResult,
      htfSignalResult,
      withLatestCandle,
      withHtf,
      signalMarkerIndex,
      htfSignalMarkerIndex
    };
    
    updateWithSignal(signalResult, candlesForSignal, htfCandlesForSignal);

    updateChartWithSignal(
      signalResult,
      mapCandlesToChartFormat(allCandles),
      latestCandle,
      isRealTime,
      withHtf ? mapCandlesToChartFormat(allHtfCandles) : [],
      htfLatestCandle,
      htfSignalResult
    );

    // Notification logic
    if (isRealTime && withLatestCandle && signalResult) {
      const formattedTime = formatUnixTimestamp(Date.now());
      const signalChanged = signalResult.type !== lastSignalType || signalResult.strength !== lastSignalStrength;
      const htfSignalChanged = withHtf && htfSignalResult && (htfSignalResult.type !== lastHtfSignalType || htfSignalResult.strength !== lastHtfSignalStrength);

      if (!isInitialSignalPushed || signalChanged || htfSignalChanged) {
        let notificationMessage = `Signal for ${newSymbol} on ${exchangeId} (${granularity}) at ${formattedTime}: ${signalResult.type || 'None'} (${signalResult.strength || 'N/A'})`;
        if (withHtf && htfSignalResult) {
          notificationMessage += ` | HTF (${exchange.nextHtfGranularityMap[granularity]}): ${htfSignalResult.type || 'None'} (${htfSignalResult.strength || 'N/A'})`;
        }
        updateStatus(notificationMessage, true);
        if (typeof pushSignalNotification === 'function') {
          pushSignalNotification(notificationMessage);
        }
        isInitialSignalPushed = true;
        lastSignalType = signalResult.type;
        lastSignalStrength = signalResult.strength;
        lastHtfSignalType = htfSignalResult ? htfSignalResult.type : null;
        lastHtfSignalStrength = htfSignalResult ? htfSignalResult.strength : null;
      }
    }

    const restoreInitialButton = document.getElementById("restore-initial");
    if (restoreInitialButton) {
      restoreInitialButton.disabled = !initialState.allCandles || initialState.allCandles.length === 0;
    }

    if (globalCandles.length > 0) {
      let main = `Processed ${allCandles.length} candles for ${newSymbol} (${granularity})`;
      let htf = withHtf && higherTimeframeCandles.length > 0 ? main + ` and ${allHtfCandles.length} for ${exchange.nextHtfGranularityMap[granularity]} (HTF limit: ${htfLimit})` : main;
      
      updateStatus(htf, true);
    }

    return {
      success: true,
      signalResult,
      htfSignalResult,
      allCandles,
      allHtfCandles,
      latestCandle,
      htfLatestCandle
    };
  } catch (error) {
    if (error.message.includes('429')) {
      console.warn('MEXC rate limit exceeded, pausing for 60s...');
      await new Promise(resolve => setTimeout(resolve, 60000));
      isFetchingOHLCV = false;
      pendingOhlcvCalls = 0;
      return { success: false };
    }
    if (error.name === 'AbortError') {
      return { success: false };
    }
    globalCandles = [];
    higherTimeframeCandles = [];
    latestCandle = null;
    htfLatestCandle = null;
    allCandles = [];
    allHtfCandles = [];
    refreshTable(globalCandles);
    updateStatus(`Error: ${error.message}`, false);
    console.error('Fetch OHLCV error:', error);
    const restoreInitialButton = document.getElementById("restore");
    if (restoreInitialButton) {
      restoreInitialButton.disabled = true;
    }
    return { success: false };
  } finally {
    isFetchingOHLCV = false;
    pendingOhlcvCalls = 0;
    ohlcvAbortController = null;
  }
}

// Modified fetchTickerForUI
export async function fetchTickerForUI() {
    if (isFetchingTicker) {
        pendingTickerCalls++;
        const exchangeId = document.getElementById('input-exchange')?.value || 'bitget';
        const maxPendingCalls = getMaxPendingCalls(exchangeId);
        if (pendingTickerCalls >= maxPendingCalls) {
            if (tickerAbortController) {
                tickerAbortController.abort();
                tickerAbortController = null;
            }
            isFetchingTicker = false;
            pendingTickerCalls = 0;
            return;
        }
        return;
    }
    isFetchingTicker = true;
    pendingTickerCalls = 1;
    tickerAbortController = new AbortController();

    try {
        const now = Date.now();
        if (now - lastSecondStartTicker >= SECOND_MS) {
            tickerCallCount = 0;
            lastSecondStartTicker = now;
        }
        if (tickerCallCount >= TICKER_CALLS_PER_SECOND) {
            const timeUntilNextSecond = SECOND_MS - (now - lastSecondStartTicker);
            await new Promise(resolve => setTimeout(resolve, timeUntilNextSecond + 10));
            isFetchingTicker = false;
            pendingTickerCalls = 0;
            return fetchTickerForUI();
        }
        tickerCallCount++;

        const exchangeId = document.getElementById('input-exchange')?.value || 'bitget';
        const exchange = exchanges[exchangeId];
        if (!exchange) throw new Error(`Unsupported exchange: ${exchangeId}`);

        ticker = await exchange.fetchTicker(newSymbol, { signal: tickerAbortController.signal });
        const currentTicker = { ...ticker };
        updateTickerUI(currentTicker);

        const realTimeCheckbox = document.getElementById('real-time-updates');

        if (!withLatestCandle && realTimeCheckbox?.checked && latestCandle && ticker && ticker.lastPr && !isNaN(ticker.lastPr) && ticker.lastPr > 0) {
            if (ticker.lastPr >= ticker.low24h && ticker.lastPr <= ticker.high24h) {
                latestCandle[4] = Number(ticker.lastPr);
                if (typeof updateLatestCandleClose === 'function') {
                    updateLatestCandleClose(latestCandle);
                }
            } else {
                console.warn(`Invalid lastPr for latestCandle: ${ticker.lastPr} outside 24h range (low: ${ticker.low24h}, high: ${ticker.high24h})`);
            }
        }

        if (withHtf && htfLatestCandle && ticker && ticker.lastPr && !isNaN(ticker.lastPr) && ticker.lastPr > 0) {
            if (ticker.lastPr >= ticker.low24h && ticker.lastPr <= ticker.high24h) {
                htfLatestCandle[4] = Number(ticker.lastPr);
            } else {
                console.warn(`Invalid lastPr for htfLatestCandle: ${ticker.lastPr} outside 24h range`);
            }
        }
    } catch (error) {
        if (error.message.includes('429')) {
            console.warn('MEXC rate limit exceeded, pausing for 60s...');
            await new Promise(resolve => setTimeout(resolve, 60000));
            isFetchingTicker = false;
            pendingTickerCalls = 0;
            return fetchTickerForUI();
        }
        if (error.name === 'AbortError') {
            return;
        }
        console.error('Error fetching ticker:', error);
        updateStatus(`Error fetching ticker: ${error.message}`, false);
    } finally {
        isFetchingTicker = false;
        pendingTickerCalls = 0;
        tickerAbortController = null;
    }
}

// Modified startRealTimeUpdates
export function startRealTimeUpdates() {
    // Clear existing intervals and abort controllers
    if (realTimeInterval) clearInterval(realTimeInterval);
    if (tickerInterval) clearInterval(tickerInterval);
    if (ohlcvAbortController) {
        ohlcvAbortController.abort();
        ohlcvAbortController = null;
    }
    if (tickerAbortController) {
        tickerAbortController.abort();
        tickerAbortController = null;
    }
    pendingOhlcvCalls = 0;
    pendingTickerCalls = 0;

    const realTimeCheckbox = document.getElementById('real-time-updates');
    if (!realTimeCheckbox.checked) {
        updateStatus('Real-time updates not enabled', false);
        return;
    }

    const symbolInput = document.getElementById('input-symbol');
    const granularityInput = document.getElementById('input-granularity');
    const exchangeId = document.getElementById('input-exchange')?.value || 'bitget';
    const exchange = exchanges[exchangeId];
    if (!exchange) {
        updateStatus(`Error: Exchange ${exchangeId} not found`, false);
        return;
    }

    if (!symbolInput || !symbolInput.value.trim() || !symbolInput.value.includes('/')) {
        updateStatus('Error: Valid symbol required', false);
        return;
    }

    // Update granularity and symbol
    granularity = granularityInput.value;
    granularityMs = exchange.granularityMap[granularity] || 3600000;
    if (!granularityMs) {
        updateStatus(`Error: Invalid granularity ${granularity} for ${exchangeId}`, false);
        return;
    }

    newSymbol = symbolInput.value.trim();
    [baseToken, quoteToken] = newSymbol.split('/');
    symbol = newSymbol.replace('/', '');

    // Set API call limits
    setApiCallLimits(exchangeId, withHtf);
    const fetchIntervalMs = exchangeId === 'mexc' ? Math.max(1000 / OHLCV_CALLS_PER_SECOND * 1.5, 150) : Math.max(1000 / OHLCV_CALLS_PER_SECOND, 100);

    const withLatestCandleCheckbox = document.getElementById('with-latest-candle');
    withLatestCandle = withLatestCandleCheckbox?.checked || false;

    // Reset signal tracking for new real-time session
    isInitialSignalPushed = false;
    lastSignalType = null;
    lastSignalStrength = null;
    lastHtfSignalType = null;
    lastHtfSignalStrength = null;

    if (isBackTest) {
        // In backtest mode, only fetch ticker data for UI updates
        tickerInterval = setInterval(fetchTickerForUI, Math.max(1000 / TICKER_CALLS_PER_SECOND, 100));
        fetchTickerForUI();
        updateStatus(`Real-time ticker updates started for ${newSymbol} in backtest mode (no OHLCV fetching)`, true);
    } else {
        // In normal mode, fetch both OHLCV and ticker data
        realTimeInterval = setInterval(async () => {
            const result = await fetchOHLCV();
        }, fetchIntervalMs);
        tickerInterval = setInterval(fetchTickerForUI, Math.max(1000 / TICKER_CALLS_PER_SECOND, 100));
        fetchTickerForUI();
        updateStatus(`Real-time updates started for ${newSymbol} (${granularity}) at ${OHLCV_CALLS_PER_SECOND} OHLCV calls/second`, true);
    }
}

export function stopRealTimeUpdates() {
    if (realTimeInterval) {
        clearInterval(realTimeInterval);
        realTimeInterval = null;
    }
    if (tickerInterval) {
        clearInterval(tickerInterval);
        tickerInterval = null;
    }
    if (ohlcvAbortController) {
        ohlcvAbortController.abort();
        ohlcvAbortController = null;
    }
    if (tickerAbortController) {
        tickerAbortController.abort();
        tickerAbortController = null;
    }
    isFetchingOHLCV = false;
    isFetchingTicker = false;
    pendingOhlcvCalls = 0;
    pendingTickerCalls = 0;
    updateStatus('Real-time updates stopped, all pending requests canceled', true);
}

// recalculate
export function recalculate() {
    if (!isBackTest) {
        updateStatus('Recalculation not allowed: Backtest mode is disabled. Enable backtest mode to recalculate.', false);
        return;
    }

    try {
        // Check for exchange mismatch
        const currentExchangeId = document.getElementById('input-exchange')?.value || 'bitget';
        if (initialState.exchangeId && currentExchangeId !== initialState.exchangeId) {
            throw new Error(`Cannot recalculate: Current exchange (${currentExchangeId}) differs from initial exchange (${initialState.exchangeId}). Data is out of stored bounds. Please fetch new data.`);
        }

        // Input validations
        const symbolInput = document.getElementById("input-symbol");
        if (!symbolInput) throw new Error("Symbol input not found");
        const newSymbol = symbolInput.value.trim();
        if (!newSymbol) throw new Error("Symbol is required");
        if (!newSymbol.includes('/')) throw new Error("Invalid Symbol! (e.g., Correct format is BTC/USDT)");

        const granularityInput = document.getElementById("input-granularity");
        if (!granularityInput) throw new Error("Granularity input not found");
        const granularity = granularityInput.value;
        if (!granularity) throw new Error("Granularity is required");

        const limitInput = document.getElementById("input-limit");
        if (!limitInput) throw new Error("Limit input not found");
        const limit = Math.min(Math.max(parseInt(limitInput.value) || 200, 1), 1000);

        const tradeSizeInput = document.getElementById("input-trade-size");
        const tradeSize = tradeSizeInput ? parseFloat(tradeSizeInput.value) || 1000 : 1000;
        if (isNaN(tradeSize) || tradeSize <= 0) throw new Error("Trade size must be positive");

        const feeInput = document.getElementById("input-fee");
        const feePercent = feeInput ? parseFloat(feeInput.value) || 0 : 0;
        if (isNaN(feePercent) || feePercent < 0) throw new Error("Fee percentage cannot be negative");

        const startTimeInput = document.getElementById("input-start-time");
        const endTimeInput = document.getElementById("input-end-time");
        let startTime, endTime;
        if (startTimeInput && startTimeInput.value && endTimeInput && endTimeInput.value) {
            startTime = new Date(startTimeInput.value).getTime();
            endTime = new Date(endTimeInput.value).getTime();
            if (isNaN(startTime) || isNaN(endTime)) throw new Error("Invalid time input");
            if (startTime >= endTime) throw new Error("Start time must be before end time");
        }

        // Validate weights and other inputs
        if (!validateWeights() || !validatePercentageInputs() || !validateLookback()) {
            return; // Assume these functions handle their own warnings
        }

        // Check for available candle data
        if (!initialState.allCandles || initialState.allCandles.length === 0) {
            throw new Error("No candle data available for recalculation");
        }

        // Filter candles by time range and limit
        let candlesToUse = initialState.allCandles;
        if (startTime && endTime) {
            candlesToUse = initialState.allCandles.filter(candle => {
                let timestamp = Number(candle[0]);
                return timestamp >= startTime && timestamp <= endTime;
            });
        }
        candlesToUse = candlesToUse.slice(-limit);
        if (candlesToUse.length === 0) {
            throw new Error("No candles available for the specified time range and limit");
        }

        // Parse symbol
        const splitSymbol = newSymbol.split('/');
        const baseToken = splitSymbol[0];
        const quoteToken = splitSymbol[1];
        const symbol = newSymbol.replace('/', '');

        // Get parameters for signal generation
        const params = getIndicatorParams();
        const useSMCOnlyToggle = document.getElementById('use-smc-only')?.checked;

        let signalResult;
        if (useSMCOnlyToggle) {
            signalResult = generateSmcTradingSignal(mapCandlesToChartFormat(candlesToUse));
        } else {
            signalResult = generateTradingSignal(mapCandlesToChartFormat(candlesToUse));
        }

        let htfSignalResult = null;
        let htfCandlesToUse = initialState.allHtfCandles || [];
        if (withHtf && htfCandlesToUse.length > 0) {
            if (startTime && endTime) {
                htfCandlesToUse = initialState.allHtfCandles.filter(candle => {
                    let timestamp = Number(candle[0]);
                    return timestamp >= startTime && timestamp <= endTime;
                });
            }
            htfCandlesToUse = htfCandlesToUse.slice(-(initialState.htfLimit || 60));
            if (htfCandlesToUse.length === 0) {
                console.warn("No HTF candles available for the specified time range and limit");
            } else {
                if (useSMCOnlyToggle) {
                    htfSignalResult = generateSmcTradingSignal(mapCandlesToChartFormat(htfCandlesToUse));
                } else {
                    htfSignalResult = generateTradingSignal(mapCandlesToChartFormat(htfCandlesToUse));
                }
            }
        }

        signalMarkerIndex = candlesToUse.length - 1;
        htfSignalMarkerIndex = htfCandlesToUse.length > 0 ? htfCandlesToUse.length - 1 : -1;

        if (signalMarkerIndex < 0 || candlesToUse.length < 2) signalMarkerIndex = candlesToUse.length - 1;
        if (htfSignalMarkerIndex < 0 && htfCandlesToUse.length >= 2) htfSignalMarkerIndex = htfCandlesToUse.length - 1;

        // Store in recentState
        recentState = {
            newSymbol,
            symbol,
            baseToken,
            quoteToken,
            granularity,
            limit,
            htfLimit: initialState.htfLimit || 60,
            startTime,
            endTime,
            tradeSize,
            feePercent,
            candleTypes: params.candleTypes,
            candlePatterns: params.candlePatterns,
            chartPatterns: params.chartPatterns,
            indicatorParams: params.indicatorParams || {}, // Ensure indicatorParams is never null
            weightParams: params.weightParams,
            priceLevelParams: params.priceLevelParams,
            candlePatternSettings: params.candlePatternSettings,
            allCandles: candlesToUse,
            allHtfCandles: htfCandlesToUse,
            signalResult,
            htfSignalResult,
            useSMCOnly: useSMCOnlyToggle,
            withHtf,
            withLatestCandle,
            signalMarkerIndex,
            htfSignalMarkerIndex
        };

        updateWithSignal(signalResult, candlesToUse, htfCandlesToUse);
        updateChartWithSignal(
            signalResult,
            mapCandlesToChartFormat(candlesToUse),
            null,
            document.getElementById('real-time-updates')?.checked,
            withHtf ? mapCandlesToChartFormat(htfCandlesToUse) : [],
            null,
            htfSignalResult
        );

        updateStatus(`Recalculation successful for ${newSymbol} (${granularity}) on ${currentExchangeId}`, true);

        // Enable restore recent button
        const restoreRecentButton = document.getElementById('restore-recent');
        if (restoreRecentButton) {
            restoreRecentButton.disabled = false;
        }
    } catch (error) {
        updateStatus(`Recalculation error: ${error.message}`, false);
        console.error('Recalculate error:', error);
    }
}

// Restore last fetched data and inputs
export function restoreInitialAnalysis() {
    try {
        if (!initialState || !initialState.allCandles || initialState.allCandles.length === 0) {
            throw new Error('No initial data available');
        }

        // Restore exchange
        if (initialState.exchangeId) {
            document.getElementById('input-exchange').value = initialState.exchangeId;
        }

        // Restore basic inputs
        document.getElementById('input-symbol').value = initialState.newSymbol || '';
        document.getElementById('input-granularity').value = initialState.granularity || '';
        document.getElementById('input-limit').value = initialState.limit || 200;
        document.getElementById('input-htf-limit').value = initialState.htfLimit || 60;
        document.getElementById('input-fee').value = initialState.feePercent || '';
        document.getElementById('input-trade-size').value = initialState.tradeSize || '';
        document.getElementById('input-start-time').value = initialState.startTime 
            ? new Date(initialState.startTime).toISOString().slice(0, 16) 
            : '';
        document.getElementById('input-end-time').value = initialState.endTime 
            ? new Date(initialState.endTime).toISOString().slice(0, 16) 
            : '';
        document.getElementById('with-htf-checkbox').checked = !!initialState.higherTimeframe;
        document.getElementById('with-latest-candle').checked = !!initialState.latestCandle;

        // Restore weight parameters
        if (initialState.weightParams) {
            document.getElementById('candle-weight').value = initialState.weightParams.candle || 20;
            document.getElementById('chart-weight').value = initialState.weightParams.chart || 35;
            document.getElementById('indicator-weight').value = initialState.weightParams.indicator || 45;
        }

        // Restore price level parameters
        if (initialState.priceLevelParams) {
            document.getElementById('support-resistance-lookback').value = initialState.priceLevelParams.supportResistanceLookback || 20;
            document.getElementById('trend-strength-candles').value = initialState.priceLevelParams.trendStrengthCandles || 4;
            document.getElementById('only-recent-checkbox').checked = initialState.priceLevelParams.onlyRecentCheckbox || false;
            document.getElementById('stop-loss-very-weak-buy').value = initialState.priceLevelParams.stopLossVeryWeakBuy || 1;
            document.getElementById('stop-loss-weak-buy').value = initialState.priceLevelParams.stopLossWeakBuy || 1;
            document.getElementById('stop-loss-moderate-buy').value = initialState.priceLevelParams.stopLossModerateBuy || 1;
            document.getElementById('stop-loss-strong-buy').value = initialState.priceLevelParams.stopLossStrongBuy || 1;
            document.getElementById('stop-loss-very-weak-sell').value = initialState.priceLevelParams.stopLossVeryWeakSell || 0.5;
            document.getElementById('stop-loss-weak-sell').value = initialState.priceLevelParams.stopLossWeakSell || 0.5;
            document.getElementById('stop-loss-moderate-sell').value = initialState.priceLevelParams.stopLossModerateSell || 0.5;
            document.getElementById('stop-loss-strong-sell').value = initialState.priceLevelParams.stopLossStrongSell || 0.5;
            document.getElementById('stop-loss-multiplier-buy').value = initialState.priceLevelParams.stopLossMultiplierBuy || 1.5;
            document.getElementById('stop-loss-multiplier-sell').value = initialState.priceLevelParams.stopLossMultiplierSell || 1.0;
            /*document.getElementById('entry-multiplier-very-weak-buy').value = initialState.priceLevelParams.entryMultiplierVeryWeakBuy || 1;
            document.getElementById('entry-multiplier-weak-buy').value = initialState.priceLevelParams.entryMultiplierWeakBuy || 0;
            document.getElementById('entry-multiplier-moderate-buy').value = initialState.priceLevelParams.entryMultiplierModerateBuy || 0.5;
            document.getElementById('entry-multiplier-strong-buy').value = initialState.priceLevelParams.entryMultiplierStrongBuy || 0;
            document.getElementById('entry-multiplier-very-weak-sell').value = initialState.priceLevelParams.entryMultiplierVeryWeakSell || 1;
            document.getElementById('entry-multiplier-weak-sell').value = initialState.priceLevelParams.entryMultiplierWeakSell || 0;
            document.getElementById('entry-multiplier-moderate-sell').value = initialState.priceLevelParams.entryMultiplierModerateSell || 0.5;
            document.getElementById('entry-multiplier-strong-sell').value = initialState.priceLevelParams.entryMultiplierStrongSell || 0;*/
            document.getElementById('take-profit-very-weak-buy').value = initialState.priceLevelParams.takeProfitVeryWeakBuy || 0.3;
            document.getElementById('take-profit-weak-buy').value = initialState.priceLevelParams.takeProfitWeakBuy || 0.4;
            document.getElementById('take-profit-moderate-buy').value = initialState.priceLevelParams.takeProfitModerateBuy || 0.5;
            document.getElementById('take-profit-strong-buy').value = initialState.priceLevelParams.takeProfitStrongBuy || 0.6;
            document.getElementById('take-profit-very-weak-sell').value = initialState.priceLevelParams.takeProfitVeryWeakSell || 0.3;
            document.getElementById('take-profit-weak-sell').value = initialState.priceLevelParams.takeProfitWeakSell || 0.2;
            document.getElementById('take-profit-moderate-sell').value = initialState.priceLevelParams.takeProfitModerateSell || 0.1;
            document.getElementById('take-profit-strong-sell').value = initialState.priceLevelParams.takeProfitStrongSell || 0;
            document.getElementById('take-profit-multiplier-buy').value = initialState.priceLevelParams.takeProfitMultiplierBuy || 2.0;
            document.getElementById('take-profit-multiplier-sell').value = initialState.priceLevelParams.takeProfitMultiplierSell || 1.0;
        }

        // Restore candlestick pattern weights
        if (initialState.candlePatterns) {
            for (const pattern in initialState.candlePatterns) {
                const element = document.getElementById(`candle-pattern-${pattern}-weight`);
                if (element) {
                    element.value = initialState.candlePatterns[pattern] || '';
                }
            }
        }

        // Restore chart pattern weights
        if (initialState.chartPatterns) {
            for (const pattern in initialState.chartPatterns) {
                const element = document.getElementById(`chart-pattern-${pattern}-weight`);
                if (element) {
                    element.value = initialState.chartPatterns[pattern] || '';
                }
            }
        }

        // Restore indicator parameters
        if (initialState.indicatorParams) {
            for (const indicator in initialState.indicatorParams) {
                const params = initialState.indicatorParams[indicator];
                document.getElementById(`${indicator}-enabled`).checked = params.enabled || false;
                if (params.period) document.getElementById(`${indicator}-period`).value = params.period;
                if (params.short) document.getElementById(`${indicator}-short`).value = params.short;
                if (params.long) document.getElementById(`${indicator}-long`).value = params.long;
                if (params.fast) document.getElementById(`${indicator}-fast`).value = params.fast;
                if (params.slow) document.getElementById(`${indicator}-slow`).value = params.slow;
                if (params.signal) document.getElementById(`${indicator}-signal`).value = params.signal;
                if (params.deviation) document.getElementById(`${indicator}-deviation`).value = params.deviation;
                if (params.k) document.getElementById(`${indicator}-k`).value = params.k;
                if (params.d) document.getElementById(`${indicator}-d`).value = params.d;
                if (params.smooth) document.getElementById(`${indicator}-smooth`).value = params.smooth;
                if (params.tenkan) document.getElementById(`${indicator}-tenkan`).value = params.tenkan;
                if (params.kijun) document.getElementById(`${indicator}-kijun`).value = params.kijun;
                if (params.senkou) document.getElementById(`${indicator}-senkou`).value = params.senkou;
                if (params.displacement) document.getElementById(`${indicator}-displacement`).value = params.displacement;
                if (params.step) document.getElementById(`${indicator}-step`).value = params.step;
                if (params.max) document.getElementById(`${indicator}-max`).value = params.max;
                if (params.multiplier) document.getElementById(`${indicator}-multiplier`).value = params.multiplier;
                document.getElementById(`${indicator}-weight-strong`).value = params.weightStrong;
                document.getElementById(`${indicator}-weight-weak`).value = params.weightWeak;
            }
        }

        // Restore candle types
        if (initialState.candleTypes) {
            document.getElementById('ha-candlestick-checkbox').checked = initialState.candleTypes.ha || false;
        }

        // Restore candlestick pattern settings
        if (initialState.candlePatternSettings) {
            document.getElementById('candle-pattern-max-patterns').value = initialState.candlePatternSettings.maxPatterns || 3;
            document.getElementById('candle-pattern-min-index').value = initialState.candlePatternSettings.minCandleIndex || 0;
        }

        // Restore global data
        allCandles = initialState.allCandles || [];
        allHtfCandles = initialState.allHtfCandles || [];
        globalCandles = initialState.globalCandles || [];
        higherTimeframeCandles = initialState.higherTimeframeCandles || [];
        latestCandle = initialState.latestCandle || null;
        htfLatestCandle = initialState.htfLatestCandle || null;
        withHtf = !!initialState.higherTimeframe;
        withLatestCandle = !!initialState.latestCandle;

        // Refresh table and recalculate signals
        refreshTable(initialState.allCandles);
        recalculate();

        // Validate inputs after restoration
        validateWeights();
        validatePercentageInputs();
        validateLookback();
        validateHtfLimit();
        validateCandlePatternSettings();

        updateStatus(`Successfully restored initial analysis for ${initialState.newSymbol || 'unknown symbol'} (${initialState.granularity || 'unknown granularity'}) on exchange ${initialState.exchangeId || 'unknown exchange'}`, true);
        const restoreInitialButton = document.getElementById('restore-initial');
        const restoreRecentButton = document.getElementById('restore-recent');
        if (restoreInitialButton) {
            restoreInitialButton.disabled = !initialState.allCandles || initialState.allCandles.length === 0 || !recentState.indicatorParams;
        }
        if (restoreRecentButton) {
            restoreRecentButton.disabled = !recentState || !recentState.allCandles || recentState.allCandles.length === 0;
        }
    } catch (error) {
        updateStatus(`Error: ${error.message}`, false);
        console.error('Restore initial analysis error:', error);
        const restoreInitialButton = document.getElementById('restore-initial');
        const restoreRecentButton = document.getElementById('restore-recent');
        if (restoreInitialButton) restoreInitialButton.disabled = true;
        if (restoreRecentButton) restoreRecentButton.disabled = true;
    }
}

// Restore last recalculated analysis
export function restoreRecentAnalysis() {
    try {
        // Check if recentState and its candles exist
        if (!recentState || !recentState.allCandles || recentState.allCandles.length === 0) {
            throw new Error('No recent recalculation data available');
        }

        // Check if indicatorParams is available
        if (!recentState.indicatorParams) {
            console.warn('No indicator parameters available in recentState');
            recentState.indicatorParams = {}; // Initialize as empty object to prevent null errors
        }

        // Restore exchange (must match initialState.exchangeId)
        if (initialState.exchangeId) {
            const exchangeInput = document.getElementById('input-exchange');
            if (exchangeInput) {
                exchangeInput.value = initialState.exchangeId;
            }
        }

        // Restore basic inputs
        const symbolInput = document.getElementById('input-symbol');
        if (symbolInput) symbolInput.value = recentState.newSymbol || '';
        
        const granularityInput = document.getElementById('input-granularity');
        if (granularityInput) granularityInput.value = recentState.granularity || '';
        
        const limitInput = document.getElementById('input-limit');
        if (limitInput) limitInput.value = recentState.limit || 200;
        
        const htfLimitInput = document.getElementById('input-htf-limit');
        if (htfLimitInput) htfLimitInput.value = recentState.htfLimit || 60;
        
        const feeInput = document.getElementById('input-fee');
        if (feeInput) feeInput.value = recentState.feePercent || '';
        
        const tradeSizeInput = document.getElementById('input-trade-size');
        if (tradeSizeInput) tradeSizeInput.value = recentState.tradeSize || '';
        
        const startTimeInput = document.getElementById('input-start-time');
        if (startTimeInput) {
            startTimeInput.value = recentState.startTime 
                ? new Date(recentState.startTime).toISOString().slice(0, 16) 
                : '';
        }
        
        const endTimeInput = document.getElementById('input-end-time');
        if (endTimeInput) {
            endTimeInput.value = recentState.endTime 
                ? new Date(recentState.endTime).toISOString().slice(0, 16) 
                : '';
        }
        
        const withHtfCheckbox = document.getElementById('with-htf-checkbox');
        if (withHtfCheckbox) withHtfCheckbox.checked = recentState.withHtf || false;
        
        const withLatestCandleCheckbox = document.getElementById('with-latest-candle');
        if (withLatestCandleCheckbox) withLatestCandleCheckbox.checked = recentState.withLatestCandle || false;
        
        signalMarkerIndex = recentState.signalMarkerIndex;
        htfSignalMarkerIndex = recentState.htfSignalMarkerIndex;
        
        const useSmcOnlyCheckbox = document.getElementById('use-smc-only');
        if (useSmcOnlyCheckbox) useSmcOnlyCheckbox.checked = recentState.useSMCOnly || false;

        // Restore weight parameters
        if (recentState.weightParams) {
            const candleWeightInput = document.getElementById('candle-weight');
            if (candleWeightInput) candleWeightInput.value = recentState.weightParams.candle || 20;
            
            const chartWeightInput = document.getElementById('chart-weight');
            if (chartWeightInput) chartWeightInput.value = recentState.weightParams.chart || 35;
            
            const indicatorWeightInput = document.getElementById('indicator-weight');
            if (indicatorWeightInput) indicatorWeightInput.value = recentState.weightParams.indicator || 45;
        }

        // Restore price level parameters
        if (recentState.priceLevelParams) {
            const supportResistanceLookbackInput = document.getElementById('support-resistance-lookback');
            if (supportResistanceLookbackInput) supportResistanceLookbackInput.value = recentState.priceLevelParams.supportResistanceLookback || 20;
            
            const trendStrengthCandlesInput = document.getElementById('trend-strength-candles');
            if (trendStrengthCandlesInput) trendStrengthCandlesInput.value = recentState.priceLevelParams.trendStrengthCandles || 4;
            
            const onlyRecentCheckbox = document.getElementById('only-recent-checkbox');
            if (onlyRecentCheckbox) onlyRecentCheckbox.checked = recentState.priceLevelParams.onlyRecentCheckbox || false;
            
            const stopLossVeryWeakBuyInput = document.getElementById('stop-loss-very-weak-buy');
            if (stopLossVeryWeakBuyInput) stopLossVeryWeakBuyInput.value = recentState.priceLevelParams.stopLossVeryWeakBuy || 1;
            
            const stopLossWeakBuyInput = document.getElementById('stop-loss-weak-buy');
            if (stopLossWeakBuyInput) stopLossWeakBuyInput.value = recentState.priceLevelParams.stopLossWeakBuy || 1;
            
            const stopLossModerateBuyInput = document.getElementById('stop-loss-moderate-buy');
            if (stopLossModerateBuyInput) stopLossModerateBuyInput.value = recentState.priceLevelParams.stopLossModerateBuy || 1;
            
            const stopLossStrongBuyInput = document.getElementById('stop-loss-strong-buy');
            if (stopLossStrongBuyInput) stopLossStrongBuyInput.value = recentState.priceLevelParams.stopLossStrongBuy || 1;
            
            const stopLossVeryWeakSellInput = document.getElementById('stop-loss-very-weak-sell');
            if (stopLossVeryWeakSellInput) stopLossVeryWeakSellInput.value = recentState.priceLevelParams.stopLossVeryWeakSell || 0.5;
            
            const stopLossWeakSellInput = document.getElementById('stop-loss-weak-sell');
            if (stopLossWeakSellInput) stopLossWeakSellInput.value = recentState.priceLevelParams.stopLossWeakSell || 0.5;
            
            const stopLossModerateSellInput = document.getElementById('stop-loss-moderate-sell');
            if (stopLossModerateSellInput) stopLossModerateSellInput.value = recentState.priceLevelParams.stopLossModerateSell || 0.5;
            
            const stopLossStrongSellInput = document.getElementById('stop-loss-strong-sell');
            if (stopLossStrongSellInput) stopLossStrongSellInput.value = recentState.priceLevelParams.stopLossStrongSell || 0.5;
            
            const stopLossMultiplierBuyInput = document.getElementById('stop-loss-multiplier-buy');
            if (stopLossMultiplierBuyInput) stopLossMultiplierBuyInput.value = recentState.priceLevelParams.stopLossMultiplierBuy || 1.5;
            
            const stopLossMultiplierSellInput = document.getElementById('stop-loss-multiplier-sell');
            if (stopLossMultiplierSellInput) stopLossMultiplierSellInput.value = recentState.priceLevelParams.stopLossMultiplierSell || 1.0;
            
            const takeProfitVeryWeakBuyInput = document.getElementById('take-profit-very-weak-buy');
            if (takeProfitVeryWeakBuyInput) takeProfitVeryWeakBuyInput.value = recentState.priceLevelParams.takeProfitVeryWeakBuy || 0.3;
            
            const takeProfitWeakBuyInput = document.getElementById('take-profit-weak-buy');
            if (takeProfitWeakBuyInput) takeProfitWeakBuyInput.value = recentState.priceLevelParams.takeProfitWeakBuy || 0.4;
            
            const takeProfitModerateBuyInput = document.getElementById('take-profit-moderate-buy');
            if (takeProfitModerateBuyInput) takeProfitModerateBuyInput.value = recentState.priceLevelParams.takeProfitModerateBuy || 0.5;
            
            const takeProfitStrongBuyInput = document.getElementById('take-profit-strong-buy');
            if (takeProfitStrongBuyInput) takeProfitStrongBuyInput.value = recentState.priceLevelParams.takeProfitStrongBuy || 0.6;
            
            const takeProfitVeryWeakSellInput = document.getElementById('take-profit-very-weak-sell');
            if (takeProfitVeryWeakSellInput) takeProfitVeryWeakSellInput.value = recentState.priceLevelParams.takeProfitVeryWeakSell || 0.3;
            
            const takeProfitWeakSellInput = document.getElementById('take-profit-weak-sell');
            if (takeProfitWeakSellInput) takeProfitWeakSellInput.value = recentState.priceLevelParams.takeProfitWeakSell || 0.2;
            
            const takeProfitModerateSellInput = document.getElementById('take-profit-moderate-sell');
            if (takeProfitModerateSellInput) takeProfitModerateSellInput.value = recentState.priceLevelParams.takeProfitModerateSell || 0.1;
            
            const takeProfitStrongSellInput = document.getElementById('take-profit-strong-sell');
            if (takeProfitStrongSellInput) takeProfitStrongSellInput.value = recentState.priceLevelParams.takeProfitStrongSell || 0;
            
            const takeProfitMultiplierBuyInput = document.getElementById('take-profit-multiplier-buy');
            if (takeProfitMultiplierBuyInput) takeProfitMultiplierBuyInput.value = recentState.priceLevelParams.takeProfitMultiplierBuy || 2.0;
            
            const takeProfitMultiplierSellInput = document.getElementById('take-profit-multiplier-sell');
            if (takeProfitMultiplierSellInput) takeProfitMultiplierSellInput.value = recentState.priceLevelParams.takeProfitMultiplierSell || 1.0;
        }

        // Restore candlestick pattern weights
        if (recentState.candlePatterns) {
            for (const pattern in recentState.candlePatterns) {
                const element = document.getElementById(`candle-pattern-${pattern}-weight`);
                if (element) {
                    element.value = recentState.candlePatterns[pattern] || '';
                } else {
                    console.warn(`Candle pattern input not found: candle-pattern-${pattern}-weight`);
                }
            }
        }

        // Restore chart pattern weights
        if (recentState.chartPatterns) {
            for (const pattern in recentState.chartPatterns) {
                const element = document.getElementById(`chart-pattern-${pattern}-weight`);
                if (element) {
                    element.value = recentState.chartPatterns[pattern] || '';
                } else {
                    console.warn(`Chart pattern input not found: chart-pattern-${pattern}-weight`);
                }
            }
        }

        // Restore indicator parameters with safety check
        if (recentState.indicatorParams && typeof recentState.indicatorParams === 'object') {
            for (const indicator in recentState.indicatorParams) {
                const params = recentState.indicatorParams[indicator];
                if (params && typeof params === 'object') {
                    const enabledInput = document.getElementById(`${indicator}-enabled`);
                    if (enabledInput) {
                        enabledInput.checked = params.enabled || false;
                    } else {
                        console.warn(`Indicator enabled input not found: ${indicator}-enabled`);
                    }

                    if (params.period) {
                        const periodInput = document.getElementById(`${indicator}-period`);
                        if (periodInput) periodInput.value = params.period;
                    }
                    if (params.short) {
                        const shortInput = document.getElementById(`${indicator}-short`);
                        if (shortInput) shortInput.value = params.short;
                    }
                    if (params.long) {
                        const longInput = document.getElementById(`${indicator}-long`);
                        if (longInput) longInput.value = params.long;
                    }
                    if (params.fast) {
                        const fastInput = document.getElementById(`${indicator}-fast`);
                        if (fastInput) fastInput.value = params.fast;
                    }
                    if (params.slow) {
                        const slowInput = document.getElementById(`${indicator}-slow`);
                        if (slowInput) slowInput.value = params.slow;
                    }
                    if (params.signal) {
                        const signalInput = document.getElementById(`${indicator}-signal`);
                        if (signalInput) signalInput.value = params.signal;
                    }
                    if (params.deviation) {
                        const deviationInput = document.getElementById(`${indicator}-deviation`);
                        if (deviationInput) deviationInput.value = params.deviation;
                    }
                    if (params.k) {
                        const kInput = document.getElementById(`${indicator}-k`);
                        if (kInput) kInput.value = params.k;
                    }
                    if (params.d) {
                        const dInput = document.getElementById(`${indicator}-d`);
                        if (dInput) dInput.value = params.d;
                    }
                    if (params.smooth) {
                        const smoothInput = document.getElementById(`${indicator}-smooth`);
                        if (smoothInput) smoothInput.value = params.smooth;
                    }
                    if (params.tenkan) {
                        const tenkanInput = document.getElementById(`${indicator}-tenkan`);
                        if (tenkanInput) tenkanInput.value = params.tenkan;
                    }
                    if (params.kijun) {
                        const kijunInput = document.getElementById(`${indicator}-kijun`);
                        if (kijunInput) kijunInput.value = params.kijun;
                    }
                    if (params.senkou) {
                        const senkouInput = document.getElementById(`${indicator}-senkou`);
                        if (senkouInput) senkouInput.value = params.senkou;
                    }
                    if (params.displacement) {
                        const displacementInput = document.getElementById(`${indicator}-displacement`);
                        if (displacementInput) displacementInput.value = params.displacement;
                    }
                    if (params.step) {
                        const stepInput = document.getElementById(`${indicator}-step`);
                        if (stepInput) stepInput.value = params.step;
                    }
                    if (params.max) {
                        const maxInput = document.getElementById(`${indicator}-max`);
                        if (maxInput) maxInput.value = params.max;
                    }
                    if (params.multiplier) {
                        const multiplierInput = document.getElementById(`${indicator}-multiplier`);
                        if (multiplierInput) multiplierInput.value = params.multiplier;
                    }
                    const weightStrongInput = document.getElementById(`${indicator}-weight-strong`);
                    if (weightStrongInput) weightStrongInput.value = params.weightStrong || '';
                    const weightWeakInput = document.getElementById(`${indicator}-weight-weak`);
                    if (weightWeakInput) weightWeakInput.value = params.weightWeak || '';
                }
            }
        }

        // Restore candle types
        if (recentState.candleTypes) {
            const haCandlestickCheckbox = document.getElementById('ha-candlestick-checkbox');
            if (haCandlestickCheckbox) haCandlestickCheckbox.checked = recentState.candleTypes.ha || false;
        }

        // Restore candlestick pattern settings
        if (recentState.candlePatternSettings) {
            const maxPatternsInput = document.getElementById('candle-pattern-max-patterns');
            if (maxPatternsInput) maxPatternsInput.value = recentState.candlePatternSettings.maxPatterns || 3;
            const minIndexInput = document.getElementById('candle-pattern-min-index');
            if (minIndexInput) minIndexInput.value = recentState.candlePatternSettings.minCandleIndex || 0;
        }

        // Restore global data
        allCandles = recentState.allCandles || [];
        allHtfCandles = recentState.allHtfCandles || [];
        globalCandles = recentState.allCandles ? recentState.allCandles.filter(c => c[0] < Math.floor(Date.now() / granularityMs) * granularityMs) : [];
        higherTimeframeCandles = recentState.allHtfCandles ? recentState.allHtfCandles.filter(c => c[0] < Math.floor(Date.now() / higherGranularityMs) * higherGranularityMs) : [];
        latestCandle = recentState.allCandles && recentState.allCandles.length > 0 ? recentState.allCandles.find(c => c[0] >= Math.floor(Date.now() / granularityMs) * granularityMs) : null;
        htfLatestCandle = recentState.allHtfCandles && recentState.allHtfCandles.length > 0 ? recentState.allHtfCandles.find(c => c[0] >= Math.floor(Date.now() / higherGranularityMs) * higherGranularityMs) : null;
        withHtf = recentState.withHtf || false;
        withLatestCandle = recentState.withLatestCandle || false;

        // Refresh table with candles
        refreshTable(recentState.allCandles);

        // Update chart with signals
        updateChartWithSignal(
            recentState.signalResult || {},
            mapCandlesToChartFormat(recentState.allCandles),
            null,
            document.getElementById('real-time-updates')?.checked,
            withHtf ? mapCandlesToChartFormat(recentState.allHtfCandles) : [],
            null,
            recentState.htfSignalResult || {}
        );

        // Update UI with signal results
        updateWithSignal(recentState.signalResult || {}, recentState.allCandles, recentState.allHtfCandles);

        // Validate inputs after restoration
        validateWeights();
        validatePercentageInputs();
        validateLookback();
        validateHtfLimit();
        validateCandlePatternSettings();

        // Update button states
        const restoreInitialButton = document.getElementById('restore-initial');
        const restoreRecentButton = document.getElementById('restore-recent');
        if (restoreInitialButton) {
            restoreInitialButton.disabled = !initialState.allCandles || initialState.allCandles.length === 0;
        }
        if (restoreRecentButton) {
            restoreRecentButton.disabled = !recentState.allCandles || recentState.allCandles.length === 0;
        }

        updateStatus(`Successfully restored recent analysis for ${recentState.newSymbol || 'unknown symbol'} (${recentState.granularity || 'unknown granularity'}) on exchange ${initialState.exchangeId || 'unknown exchange'}`, true);
    } catch (error) {
        updateStatus(`Error restoring recent analysis: ${error.message}`, false);
        console.error('Restore recent analysis error:', error);
        const restoreInitialButton = document.getElementById('restore-initial');
        const restoreRecentButton = document.getElementById('restore-recent');
        if (restoreInitialButton) restoreInitialButton.disabled = true;
        if (restoreRecentButton) restoreRecentButton.disabled = true;
    }
}

// Modified initializeData
export async function initializeData() {
    const symbolInput = document.getElementById('input-symbol');
    const granularityInput = document.getElementById('input-granularity');
    const realTimeCheckbox = document.getElementById('real-time-updates');
    const exchangeInput = document.getElementById('input-exchange');
    const symbolSearchInput = document.getElementById('symbol-search');
    const symbolResultsList = document.getElementById('symbol-results-list');
    const collapseResultsButton = document.getElementById('collapse-results');
    const granularityButtonsContainer = document.getElementById('granularity-buttons');
    const withLatestCandleCheckbox = document.getElementById('with-latest-candle');
    const withHtfCheckbox = document.getElementById('with-htf-checkbox');
    const backTestCheckbox = document.getElementById('back-test-checkbox');
    const htfLimitInput = document.getElementById('input-htf-limit');
    const recalculateButton = document.getElementById('recalculate');
    const requestButton = document.getElementById('request');

    if (!symbolInput || !granularityInput || !realTimeCheckbox || !exchangeInput || !symbolSearchInput || !symbolResultsList || !collapseResultsButton || !granularityButtonsContainer || !withLatestCandleCheckbox || !withHtfCheckbox || !backTestCheckbox || !htfLimitInput || !recalculateButton || !requestButton) {
        console.warn('Required input elements not found');
        return;
    }
    
    try {
    let allSymbolsFetched = await cacheAllSymbols();
    } catch (error) {
        updateStatus('Failed to cache all pairs', false);
    }
    
    let exchange = exchanges['mexc'];
    let exchangeId = exchangeInput.value || 'mexc';

    const updateDropdowns = async (selectedExchangeId) => {
        exchangeId = selectedExchangeId;
        exchange = exchanges[exchangeId];
        if (!exchange) {
            console.error(`Exchange ${exchangeId} not found.`);
            return;
        }

        try {
            await populateSymbolDropdown(exchange, exchangeId);
            await populateGranularityDropdown(exchange);
        } catch (error) {
            updateStatus(`Failed to populate dropdowns for ${exchangeId}`, false);
        }

        granularityMs = exchange.granularityMap[granularityInput.value] || 3600000;
        higherGranularityMs = exchange.granularityMap[exchange.nextHtfGranularityMap[granularityInput.value]] || 14400000;

        if (symbolInput.value.trim().includes('/')) {
            newSymbol = symbolInput.value.trim();
            [baseToken, quoteToken] = newSymbol.split('/');
            if (!isBackTest) {
                fetchOHLCV();
            } else {
                recalculate();
            }
        }
    };

    // Initialize HTF limit input
    htfLimitInput.value = initialState.htfLimit || 60;
    htfLimitInput.addEventListener('change', () => {
        const htfLimit = parseInt(htfLimitInput.value) || 60;
        if (isNaN(htfLimit) || htfLimit < 1 || htfLimit > 1000) {
            updateStatus('HTF Limit must be between 1 and 1000', false);
            htfLimitInput.value = 60;
        }
        if (newSymbol.includes('/')) {
            [baseToken, quoteToken] = newSymbol.split('/');
            if (!isBackTest) {
                fetchOHLCV();
            } else {
                recalculate();
            }
        }
    });

    // Backtest checkbox event listener
    backTestCheckbox.addEventListener('change', () => {
        isBackTest = backTestCheckbox.checked;
        // Update button states
        recalculateButton.disabled = !isBackTest || !initialState.allCandles || initialState.allCandles.length === 0;
        requestButton.disabled = isBackTest;
        // Handle real-time updates
        if (realTimeCheckbox.checked) {
            stopRealTimeUpdates(); // Clear any existing intervals
            startRealTimeUpdates(); // Restart with appropriate intervals based on isBackTest
        }
        updateStatus(isBackTest ? 'Backtest mode enabled: Use cached data with recalculate button' : 'Backtest mode disabled: Fetching new data', true);
        if (isBackTest && newSymbol.includes('/')) {
            recalculate();
        } else if (!isBackTest && newSymbol.includes('/')) {
            fetchOHLCV();
        }
    });

    // Initialize button states based on isBackTest
    recalculateButton.disabled = !isBackTest || !initialState.allCandles || initialState.allCandles.length === 0;
    requestButton.disabled = isBackTest;

    // Search functionality with alphabetical ordering
    const updateSearchResults = () => {
        symbolResultsList.innerHTML = '';
        const searchTerm = symbolSearchInput.value.trim().toLowerCase();
        const availableSymbols = (symbolsCache[exchangeId].length > 0 ? symbolsCache[exchangeId] : popularSymbols[exchangeId] || []).sort();
        const searchResults = searchTerm
            ? availableSymbols.filter(symbol => symbol.toLowerCase().includes(searchTerm))
            : availableSymbols;

        if (searchResults.length === 0 && searchTerm) {
            const noResultsItem = document.createElement('li');
            noResultsItem.textContent = 'No pair found';
            noResultsItem.className = 'symbol-result-message no-results';
            symbolResultsList.appendChild(noResultsItem);
        } else {
            if (searchResults.length > 0) {
                const resultsHeader = document.createElement('li');
                resultsHeader.textContent = searchTerm ? `Found ${searchResults.length} ${searchResults.length > 1 ? 'pairs' : 'pair'}` : `Active pairs (${availableSymbols.length})`;
                resultsHeader.className = 'symbol-result-message';
                symbolResultsList.appendChild(resultsHeader);
            }
            searchResults.forEach(symbol => {
                const listItem = document.createElement('li');
                listItem.textContent = symbol;
                listItem.className = 'symbol-result-item';
                symbolResultsList.appendChild(listItem);

                listItem.addEventListener('click', () => {
                    symbolInput.value = symbol;
                    newSymbol = symbol;
                    [baseToken, quoteToken] = newSymbol.split('/');
                    symbolResultsList.innerHTML = '';
                    symbolSearchInput.value = '';
                    if (!isBackTest) {
                        fetchOHLCV();
                    } else {
                        recalculate();
                    }
                });
            });
        }
    };

    symbolSearchInput.addEventListener('input', updateSearchResults);
    collapseResultsButton.addEventListener('click', () => {
        symbolResultsList.innerHTML = '';
        symbolSearchInput.value = '';
    });

    granularityButtonsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('granularity-button')) {
            const timeframe = event.target.dataset.timeframe;
            granularityInput.value = timeframe;
            granularityMs = exchange.granularityMap[timeframe] || 3600000;
            higherGranularityMs = exchange.granularityMap[exchange.nextHtfGranularityMap[timeframe]] || 14400000;
            document.querySelectorAll('.granularity-button').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            if (newSymbol.includes('/')) {
                [baseToken, quoteToken] = newSymbol.split('/');
                if (!isBackTest) {
                    fetchOHLCV();
                } else {
                    recalculate();
                }
            }
        }
    });

    await updateDropdowns(exchangeId);

    exchangeInput.addEventListener('change', async () => {
        localStorage.setItem('granularityExpanded', granularityButtonsContainer.dataset.expanded);
        await updateDropdowns(exchangeInput.value);
        symbolSearchInput.value = '';
        symbolResultsList.innerHTML = '';
    });

    symbolInput.addEventListener('change', () => {
        newSymbol = symbolInput.value.trim();
        if (newSymbol.includes('/')) {
            [baseToken, quoteToken] = newSymbol.split('/');
            if (!isBackTest) {
                fetchOHLCV();
            } else {
                recalculate();
            }
        }
    });

    granularityInput.addEventListener('change', () => {
        granularityMs = exchange.granularityMap[granularityInput.value] || 3600000;
        higherGranularityMs = exchange.granularityMap[exchange.nextHtfGranularityMap[granularityInput.value]] || 14400000;
        document.querySelectorAll('.granularity-button').forEach(btn => btn.classList.remove('active'));
        const selectedButton = document.querySelector(`.granularity-button[data-timeframe="${granularityInput.value}"]`);
        if (selectedButton) {
            selectedButton.classList.add('active');
        }
        const defaultTimeframes = ['1m', '15m', '1h', '4h', '1d'].filter(tf => Object.keys(exchange.timeframes).includes(tf));
        if (!defaultTimeframes.includes(granularityInput.value) && granularityButtonsContainer.dataset.expanded !== 'true') {
            const timeframesToShow = [...defaultTimeframes, granularityInput.value].filter(tf => Object.keys(exchange.timeframes).includes(tf));
            populateGranularityDropdown(exchange, timeframesToShow);
        }
        if (!isBackTest) {
            fetchOHLCV();
        } else {
            recalculate();
        }
    });

    realTimeCheckbox.addEventListener('change', () => {
        if (realTimeCheckbox.checked) {
            startRealTimeUpdates();
        } else {
            stopRealTimeUpdates();
        }
    });

    withLatestCandleCheckbox.addEventListener('change', () => {
        withLatestCandle = withLatestCandleCheckbox.checked;
        if (realTimeCheckbox.checked) {
            stopRealTimeUpdates();
            startRealTimeUpdates();
        } else if (!isBackTest) {
            fetchOHLCV();
        } else {
            recalculate();
        }
    });

    withHtfCheckbox.addEventListener('change', () => {
        withHtf = withHtfCheckbox.checked;
        if (realTimeCheckbox.checked) {
            stopRealTimeUpdates();
            startRealTimeUpdates();
        } else if (!isBackTest) {
            fetchOHLCV();
        } else {
            recalculate();
        }
    });

    const onlyRecentCheckbox = document.getElementById('only-recent-checkbox');
    const onlyStrongCheckbox = document.getElementById('only-strong-checkbox');

    if (onlyRecentCheckbox) {
        onlyRecentCheckbox.addEventListener('change', () => {
            onlyRecent = onlyRecentCheckbox.checked;
            if (onlyRecent) {
                onlyStrongCheckbox.checked = false;
                onlyStrong = false;
                updateStatus('Using Only-Recent reversal for Support and Resistance', true);
                let lookbackInput = document.getElementById('support-resistance-lookback');
                let lookback = Math.min(Number(lookbackInput.value) || 25, 10);
                if (lookback > 10) {
                    console.error('Lookback period exceeds maximum of 10 candles for onlyRecent mode');
                    updateStatus('Maximum of 10 lookback candles allowed for Only-Recent mode', false);
                    lookbackInput.value = 10;
                    if (lookbackInput.value === 10) {
                        updateStatus('Lookback updated to 10 max', true);
                    }
                }
            } else {
                updateStatus('Only-Recent mode disabled', true);
            }
        });
    }

    if (onlyStrongCheckbox) {
        onlyStrongCheckbox.addEventListener('change', () => {
            onlyStrong = onlyStrongCheckbox.checked;
            if (onlyStrong) {
                onlyRecentCheckbox.checked = false;
                onlyRecent = false;
                updateStatus('Using Only-Strong trend reversal for Support and Resistance', true);
            } else {
                updateStatus('Only-Strong mode disabled', true);
            }
        });
    }

    const pushButton = document.getElementById('enable-push-notifications');
    if (pushButton) {
        pushButton.addEventListener('click', async () => {
            const success = await initializePushNotifications();
            if (success) {
                pushButton.disabled = true;
                updateStatus('Push notifications enabled', true);
            } else {
                updateStatus('Failed to enable push notifications', false);
            }
        });
    }

    if (realTimeCheckbox.checked) {
        startRealTimeUpdates();
    }
}

// Populate granularity dropdown
export async function populateGranularityDropdown(exchange, initialTimeframes = null) {
    const supportedTimeframes = Object.keys(exchange.timeframes);
    const granularityInput = document.getElementById('input-granularity');
    const granularityButtonsContainer = document.getElementById('granularity-buttons');
    const moreButton = document.getElementById('more-timeframes');
    const collapseButton = document.getElementById('collapse-timeframes');

    if (!granularityInput || !granularityButtonsContainer || !moreButton || !collapseButton) {
        console.warn('Granularity input, buttons container, or buttons not found');
        return;
    }

    const defaultTimeframes = ['1m', '15m', '1h', '4h', '1d'].filter(tf => supportedTimeframes.includes(tf));
    const allTimeframes = supportedTimeframes.sort((a, b) => {
        const timeToMs = (tf) => exchange.granularityMap[tf] || 3600000;
        return timeToMs(a) - timeToMs(b);
    });

    const populateButtons = (timeframes, isExpanded = false) => {
        granularityButtonsContainer.innerHTML = '';
        timeframes.forEach(tf => {
            const button = document.createElement('button');
            button.textContent = tf;
            button.className = 'granularity-button';
            button.dataset.timeframe = tf;
            if (tf === granularityInput.value) {
                button.classList.add('active');
            }
            button.addEventListener('click', () => {
                granularityInput.value = tf;
                granularityMs = exchange.granularityMap[tf] || 3600000;
                higherGranularityMs = exchange.granularityMap[exchange.nextHtfGranularityMap[tf]] || 14400000;
                document.querySelectorAll('.granularity-button').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                if (newSymbol.includes('/')) {
                    [baseToken, quoteToken] = newSymbol.split('/');
                    fetchOHLCV();
                }
            });
            granularityButtonsContainer.appendChild(button);
        });

        moreButton.style.display = isExpanded ? 'none' : (allTimeframes.length > defaultTimeframes.length ? 'inline-block' : 'none');
        collapseButton.style.display = isExpanded ? 'inline-block' : 'none';
        granularityButtonsContainer.appendChild(moreButton);
        granularityButtonsContainer.appendChild(collapseButton);
    };

    const isExpanded = localStorage.getItem('granularityExpanded') === 'true';
    granularityButtonsContainer.dataset.expanded = isExpanded.toString();
    const timeframesToShow = initialTimeframes || (isExpanded ? allTimeframes : defaultTimeframes.includes(granularityInput.value) ? defaultTimeframes : [...defaultTimeframes, granularityInput.value].filter(tf => supportedTimeframes.includes(tf)));
    populateButtons(timeframesToShow, isExpanded);

    moreButton.replaceWith(moreButton);
    collapseButton.replaceWith(collapseButton);

    moreButton.onclick = () => {
        populateButtons(allTimeframes, true);
        granularityButtonsContainer.dataset.expanded = 'true';
        localStorage.setItem('granularityExpanded', 'true');
    };

    collapseButton.onclick = () => {
        const timeframesToShow = defaultTimeframes.includes(granularityInput.value)
            ? defaultTimeframes
            : [...defaultTimeframes, granularityInput.value].filter(tf => supportedTimeframes.includes(tf));
        populateButtons(timeframesToShow, false);
        granularityButtonsContainer.dataset.expanded = 'false';
        localStorage.setItem('granularityExpanded', 'false');
    };

    granularityInput.innerHTML = '';
    supportedTimeframes.forEach(tf => {
        const option = document.createElement('option');
        option.value = tf;
        option.textContent = tf;
        granularityInput.appendChild(option);
    });

    if (!initialTimeframes) {
        const currentGranularity = granularity;
        granularityInput.value = supportedTimeframes.includes(currentGranularity)
            ? currentGranularity
            : supportedTimeframes.includes('1h')
            ? '1h'
            : supportedTimeframes[0];
    }

    const selectedButton = document.querySelector(`.granularity-button[data-timeframe="${granularityInput.value}"]`);
    document.querySelectorAll('.granularity-button').forEach(btn => btn.classList.remove('active'));
    if (selectedButton) {
        selectedButton.classList.add('active');
    }
}

// Populate symbol dropdown
export async function populateSymbolDropdown(exchange, exchangeId) {
    const symbolInput = document.getElementById('input-symbol');
    if (!symbolInput) {
        console.warn('Symbol input not found');
        return;
    }

    symbolInput.innerHTML = '<option value="" selected>Select Symbol</option>';
    const availableSymbols = (symbolsCache[exchangeId].length > 0 ? symbolsCache[exchangeId] : popularSymbols[exchangeId] || ['BTC/USDT', 'ETH/USDT']).sort();
    availableSymbols.forEach(symbol => {
        const option = document.createElement('option');
        option.value = symbol;
        option.textContent = symbol;
        symbolInput.appendChild(option);
    });

    symbolInput.value = availableSymbols.includes(newSymbol) ? newSymbol : availableSymbols.includes('ORDI/USDT') ? 'ORDI/USDT' : availableSymbols.includes('BTC/USDT') ? 'BTC/USDT' : availableSymbols[0];
}

// This handles the All Signals page update
export async function fetchOHLCVForSignals(symbol, timeframe, since, endTime, limit) {
    try {
        const exchange = this;
        const candles = await exchange.fetchOHLCV(symbol, timeframe, since, limit);
        return candles;
    } catch (error) {
        console.error(`Error fetching OHLCV for ${symbol} on ${timeframe}:`, error);
        throw error;
    }
}

// Reset analysis to clear states
export function resetAnalysis() {
    try {
        stopRealTimeUpdates();

        // Clear global data
        allCandles = [];
        allHtfCandles = [];
        globalCandles = [];
        higherTimeframeCandles = [];
        latestCandle = null;
        htfLatestCandle = null;
        signalResult = {};
        htfSignalResult = {};
        signalMarkerIndex = -1;
        htfSignalMarkerIndex = -1;
        ticker = null;
        initialState = {
            symbol: null,
            newSymbol: null,
            baseVolumeTable: null,
            quoteVolumeTable: null,
            granularity: null,
            higherTimeframe: null,
            limit: null,
            htfLimit: 60,
            startTime: null,
            endTime: null,
            tradeSize: null,
            feePercent: null,
            indicators: null,
            candlePatterns: null,
            chartPatterns: null,
            weightParams: null,
            priceLevelParams: null,
            candles: null,
            higherTimeframeCandles: null,
            signalResult: null,
            htfSignalResult: null
        };
        recentState = null;

        // Reset UI inputs
        resetInputs();

        // Clear table
        refreshTable([]);

        // Update chart
        updateChartWithSignal({}, [], null, false, [], null, {});

        // Update button states
        const recalculateButton = document.getElementById('recalculate');
        const restoreInitialButton = document.getElementById('restore-initial');
        const restoreRecentButton = document.getElementById('restore-recent');
        if (recalculateButton) recalculateButton.disabled = true;
        if (restoreInitialButton) restoreInitialButton.disabled = true;
        if (restoreRecentButton) restoreRecentButton.disabled = true;

        updateStatus('Analysis reset successfully', true);
    } catch (error) {
        updateStatus(`Error resetting analysis: ${error.message}`, false);
        console.error('Reset analysis error:', error);
    }
}