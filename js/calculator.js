export function getNumber(input) {
  const value = Number(input.value);
  return Number.isFinite(value) ? value : 0;
}

export function formatGrams(value) {
  const rounded = Math.round(value * 10) / 10;
  if (Number.isInteger(rounded)) {
    return `${rounded}g`;
  }
  return `${rounded.toFixed(1)}g`;
}

export function calculateDoughValues(values) {
  const flour = values.flour;
  const hydration = values.hydration;
  const saltPercent = values.salt;
  const yeastPercent = values.yeastEnabled ? values.yeast : 0;
  const oilPercent = values.oilEnabled ? values.oil : 0;
  const sugarPercent = values.sugarEnabled ? values.sugar : 0;
  const starterPercent = values.starterEnabled ? values.starter : 0;
  const water = flour * (hydration / 100);
  const salt = flour * (saltPercent / 100);
  const yeast = flour * (yeastPercent / 100);
  const oil = flour * (oilPercent / 100);
  const sugar = flour * (sugarPercent / 100);
  const starter = flour * (starterPercent / 100);
  const total = flour + water + salt + yeast + oil + sugar + starter;
  return {
    flour,
    water,
    salt,
    yeast,
    oil,
    sugar,
    starter,
    total,
  };
}

export function calculatePresetBatch(preset, quantity, sizeKey, customFlour) {
  let flour = 0;
  if (preset.type === "fixed-unit") {
    flour = quantity * preset.flourPerUnit;
  }
  if (preset.type === "sized-unit" || preset.type === "sized-batch") {
    const size = preset.sizes[sizeKey];
    const flourPerItem = sizeKey === "custom" ? customFlour : size.flour;
    flour = quantity * flourPerItem;
  }
  const water = flour * ((preset.hydration || 0) / 100);
  const salt = flour * ((preset.salt || 0) / 100);
  const yeast = flour * ((preset.yeast || 0) / 100);
  const oil = flour * ((preset.oil || 0) / 100);
  const sugar = flour * ((preset.sugar || 0) / 100);
  const yogurt = flour * ((preset.yogurt || 0) / 100);
  const starter = flour * ((preset.starter || 0) / 100);
  const total = flour + water + salt + yeast + oil + sugar + yogurt + starter;
  return {
    flour,
    water,
    salt,
    yeast,
    oil,
    sugar,
    yogurt,
    starter,
    total,
  };
}