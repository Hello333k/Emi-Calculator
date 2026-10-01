export function encodeCalculatorState(state) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(state)) {
    if (value !== undefined && value !== null && value !== '' && value !== 0 && value !== 'percentage') {
      params.append(key, String(value));
    }
  }
  // Explicitly include dp=0 when it's explicitly set to maintain backward compat
  // (the loop above skips 0 values; but dp=0 is a valid default that doesn't need to be in the URL)
  return params.toString();
}

export function decodeCalculatorState(searchString) {
  if (!searchString) return {};
  
  const params = new URLSearchParams(searchString);
  const state = {};
  
  const numFields = ['amount', 'rate', 'years', 'months', 'feeValue', 'extraMonthly', 'extraAnnual', 'extraOneTime', 'dp'];
  const stringFields = ['currency', 'feeType', 'dpMode'];
  
  for (const [key, value] of params.entries()) {
    if (numFields.includes(key)) {
      const parsed = Number(value);
      if (!isNaN(parsed) && isFinite(parsed)) {
        state[key] = parsed;
      }
    } else if (stringFields.includes(key)) {
      if (key === 'dpMode' && value !== 'amount' && value !== 'percentage') {
        continue;
      }
      state[key] = value;
    }
  }
  
  return state;
}

export function generateShareUrl(state) {
  const params = encodeCalculatorState(state);
  const baseUrl = `${window.location.origin}${window.location.pathname}`;
  return params ? `${baseUrl}?${params}` : baseUrl;
}

export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fallback below
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  
  try {
    document.execCommand('copy');
    return true;
  } catch {
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
}
