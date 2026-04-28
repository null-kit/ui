<template>
  <fieldset id="utils">
    <legend>Utils</legend>

    <div class="flex flex-wrap gap-10">
      <div>
        <div class="text-sm opacity-30">formatDate</div>
        <div>{{ formatDate(new Date(), { year: true }) }}</div>
      </div>

      <div>
        <div class="text-sm opacity-30">formatNumber</div>
        <div>{{ formatNumber(1234567890) }}</div>
      </div>

      <div>
        <div class="text-sm opacity-30">formatISO</div>
        <div>{{ formatISO(new Date()) }}</div>
      </div>

      <div>
        <div class="text-sm opacity-30">formatSafeISO</div>
        <div>{{ formatSafeISO(new Date()) }}</div>
      </div>

      <div>
        <div class="text-sm opacity-30">setDate, -1 day</div>
        <div>{{ formatDate(setDate(new Date(), -1)) }}</div>
      </div>

      <div>
        <div class="text-sm opacity-30">setDateRange</div>
        <div>{{ setDateRange(setDate(new Date(), -2), new Date()).map(formatISO) }}</div>
      </div>

      <div>
        <div class="text-sm opacity-30">formatCurrency</div>
        <div>{{ formatCurrency(345567) }}</div>
      </div>

      <div>
        <div class="text-sm opacity-30">calcTotal</div>
        <div>{{ calcTotal([23, 57, 120, 49]) }}</div>
      </div>

      <div>
        <div class="text-sm opacity-30">calcAvg</div>
        <div>{{ calcAvg([23, 57, 120, 49]) }}</div>
      </div>

      <div>
        <div class="text-sm opacity-30">calcDiffPercentage</div>
        <div>{{ calcDiffPercentage(8352.7, 3824.5) }}</div>
      </div>

      <div>
        <div class="text-sm opacity-30">toFixedNumber</div>
        <div>{{ toFixedNumber(23.5999) }}</div>
      </div>

      <div>
        <div class="text-sm opacity-30">toSeparatedArray</div>
        <div>{{ toSeparatedArray('apple, banana, cherry', ',') }}</div>
      </div>

      <div>
        <div class="text-sm opacity-30">toSeparatedString</div>
        <div>{{ toSeparatedString(['apple', 'banana', 'cherry'], ',') }}</div>
      </div>

      <div>
        <div class="text-sm opacity-30">generateRandomString</div>
        <div>{{ generateRandomString() }}</div>
      </div>
    </div>
  </fieldset>
</template>
