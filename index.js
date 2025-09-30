// 🌐  Unit Converter

// --- Populate units based on selected category ---
function updateUnits() {
  const category = document.getElementById("category").value;
  const fromUnit = document.getElementById("fromUnit");
  const toUnit = document.getElementById("toUnit");

  // Clear existing options
  fromUnit.innerHTML = "";
  toUnit.innerHTML = "";

  // Populate dropdowns with available units for the selected category
  units[category].forEach((u) => {
    let option1 = document.createElement("option");
    option1.value = u.value;
    option1.textContent = u.label;

    // Clone option for 'toUnit'
    let option2 = option1.cloneNode(true);

    fromUnit.appendChild(option1);
    toUnit.appendChild(option2);
  });

  // Ensure "toUnit" is different from "fromUnit" by default
  if (toUnit.options.length > 1) {
    toUnit.selectedIndex = 1;
  }

  convert(); // Auto trigger conversion on load/change
}

// --- Prevent selecting the same unit in both dropdowns ---
function preventSameUnit(changedSelect) {
  const fromUnit = document.getElementById("fromUnit");
  const toUnit = document.getElementById("toUnit");

  if (fromUnit.value === toUnit.value) {
    if (changedSelect === "from") {
      // Adjust 'toUnit' if conflict occurs
      for (let i = 0; i < toUnit.options.length; i++) {
        if (toUnit.options[i].value !== fromUnit.value) {
          toUnit.selectedIndex = i;
          break;
        }
      }
    } else {
      // Adjust 'fromUnit' if conflict occurs
      for (let i = 0; i < fromUnit.options.length; i++) {
        if (fromUnit.options[i].value !== toUnit.value) {
          fromUnit.selectedIndex = i;
          break;
        }
      }
    }
  }
}

// --- Main Conversion Logic ---
function convert() {
  const category = document.getElementById("category").value;
  const input = parseFloat(document.getElementById("fromValue").value);
  const fromUnit = document.getElementById("fromUnit").value;
  const toUnit = document.getElementById("toUnit").value;
  let result = input;

  const resultBox = document.getElementById("resultText");

  // Handle empty input → hide result box
  if (isNaN(input)) {
    document.getElementById("toValue").value = "";
    resultBox.style.display = "none";
    return;
  }

  // Categories that must not accept negative input
  const nonNegativeCategories = [
    "length",
    "mass",
    "area",
    "volume",
    "time",
    "frequency",
    "angle",
    "force",
    "pressure",
    "energy",
    "power",
    "electric_current",
    "voltage",
    "resistance",
    "digital_storage",
    "fuel_consumption",
    "speed", // remove if negative speeds are allowed
  ];

  // Validation → prevent negative values
  if (nonNegativeCategories.includes(category) && input < 0) {
    document.getElementById("toValue").value = "";
    resultBox.style.display = "block";
    resultBox.style.backgroundColor = "red"; // highlight error
    resultBox.textContent = "⚠️ Please enter a positive value";
    return;
  }

  // --- Unit conversion logic ---
  switch (category) {
    case "length":
      const lengthFactors = {
        millimeter: 0.001,
        centimeter: 0.01,
        meter: 1,
        kilometer: 1000,
        inch: 0.0254,
        foot: 0.3048,
        yard: 0.9144,
        mile: 1609.34,
      };
      result = (input * lengthFactors[fromUnit]) / lengthFactors[toUnit];
      break;

    case "mass":
      const massFactors = {
        milligram: 0.001,
        gram: 1,
        kilogram: 1000,
        tonne: 1e6,
        ounce: 28.3495,
        pound: 453.592,
      };
      result = (input * massFactors[fromUnit]) / massFactors[toUnit];
      break;

    case "temperature":
      let celsius;
      if (fromUnit === "celsius") celsius = input;
      if (fromUnit === "fahrenheit") celsius = ((input - 32) * 5) / 9;
      if (fromUnit === "kelvin") celsius = input - 273.15;
      if (fromUnit === "rankine") celsius = ((input - 491.67) * 5) / 9;

      if (toUnit === "celsius") result = celsius;
      if (toUnit === "fahrenheit") result = (celsius * 9) / 5 + 32;
      if (toUnit === "kelvin") result = celsius + 273.15;
      if (toUnit === "rankine") result = ((celsius + 273.15) * 9) / 5;
      break;

    case "speed":
      const speedFactors = {
        mps: 1,
        kph: 0.277778,
        mph: 0.44704,
        knot: 0.514444,
      };
      result = (input * speedFactors[fromUnit]) / speedFactors[toUnit];
      break;

    case "volume":
      const volumeFactors = {
        ml: 0.001,
        liter: 1,
        cubic_meter: 1000,
        gallon: 3.78541,
        pint: 0.473176,
      };
      result = (input * volumeFactors[fromUnit]) / volumeFactors[toUnit];
      break;

    case "area":
      const areaFactors = {
        sq_meter: 1,
        sq_kilometer: 1e6,
        sq_mile: 2.59e6,
        sq_yard: 0.836127,
        sq_foot: 0.092903,
        hectare: 10000,
        acre: 4046.86,
      };
      result = (input * areaFactors[fromUnit]) / areaFactors[toUnit];
      break;

    case "time":
      const timeFactors = {
        second: 1,
        minute: 60,
        hour: 3600,
        day: 86400,
        week: 604800,
        year: 31536000,
      };
      result = (input * timeFactors[fromUnit]) / timeFactors[toUnit];
      break;

    case "frequency":
      const freqFactors = {
        hertz: 1,
        kilohertz: 1000,
        megahertz: 1e6,
        gigahertz: 1e9,
      };
      result = (input * freqFactors[fromUnit]) / freqFactors[toUnit];
      break;

    case "angle":
      const angleFactors = {
        degree: Math.PI / 180,
        radian: 1,
        gradian: Math.PI / 200,
      };
      result = (input * angleFactors[fromUnit]) / angleFactors[toUnit];
      break;

    case "force":
      const forceFactors = {
        newton: 1,
        kilonewton: 1000,
        dyne: 1e-5,
        pound_force: 4.44822,
      };
      result = (input * forceFactors[fromUnit]) / forceFactors[toUnit];
      break;

    case "pressure":
      const pressureFactors = {
        pascal: 1,
        bar: 100000,
        psi: 6894.76,
        atm: 101325,
        torr: 133.322,
      };
      result = (input * pressureFactors[fromUnit]) / pressureFactors[toUnit];
      break;

    case "energy":
      const energyFactors = {
        joule: 1,
        kilojoule: 1000,
        calorie: 4.184,
        kilocalorie: 4184,
        watt_hour: 3600,
        kilowatt_hour: 3.6e6,
      };
      result = (input * energyFactors[fromUnit]) / energyFactors[toUnit];
      break;

    case "power":
      const powerFactors = {
        watt: 1,
        kilowatt: 1000,
        horsepower: 745.7,
      };
      result = (input * powerFactors[fromUnit]) / powerFactors[toUnit];
      break;

    case "electric_current":
      const currentFactors = {
        ampere: 1,
        milliampere: 0.001,
      };
      result = (input * currentFactors[fromUnit]) / currentFactors[toUnit];
      break;

    case "voltage":
      const voltageFactors = {
        volt: 1,
        millivolt: 0.001,
        kilovolt: 1000,
      };
      result = (input * voltageFactors[fromUnit]) / voltageFactors[toUnit];
      break;

    case "resistance":
      const resistanceFactors = {
        ohm: 1,
        kiloohm: 1000,
        megaohm: 1e6,
      };
      result =
        (input * resistanceFactors[fromUnit]) / resistanceFactors[toUnit];
      break;

    case "digital_storage":
      const storageFactors = {
        bit: 1,
        byte: 8,
        kilobyte: 8192,
        megabyte: 8.39e6,
        gigabyte: 8.59e9,
        terabyte: 8.8e12,
      };
      result = (input * storageFactors[fromUnit]) / storageFactors[toUnit];
      break;

    case "fuel_consumption":
      if (fromUnit === "km_per_liter") {
        if (toUnit === "liter_per_100km") result = 100 / input;
        else if (toUnit === "mpg") result = input * 2.35215;
      }
      if (fromUnit === "liter_per_100km") {
        if (toUnit === "km_per_liter") result = 100 / input;
        else if (toUnit === "mpg") result = 235.215 / input;
      }
      if (fromUnit === "mpg") {
        if (toUnit === "km_per_liter") result = input / 2.35215;
        else if (toUnit === "liter_per_100km") result = 235.215 / input;
      }
      break;
  }

  // Update output value
  document.getElementById("toValue").value = result;

  // Display result in styled box
  resultBox.style.display = "block";
  resultBox.style.backgroundColor = "#007bff"; // blue background
  resultBox.textContent = `${input} ${fromUnit.replace(
    /_/g,
    " "
  )} = ${result} ${toUnit.replace(/_/g, " ")}`;
}

// --- Swap fromUnit and toUnit including values ---
function swapUnits() {
  const fromUnit = document.getElementById("fromUnit");
  const toUnit = document.getElementById("toUnit");
  const fromValue = document.getElementById("fromValue");
  const toValue = document.getElementById("toValue");

  // Swap unit values
  [fromUnit.value, toUnit.value] = [toUnit.value, fromUnit.value];

  // Swap entered values
  [fromValue.value, toValue.value] = [toValue.value, fromValue.value];

  convert(); // Recalculate after swap
}

// --- Event Listeners ---
document.getElementById("fromValue").addEventListener("input", convert);
document.getElementById("fromUnit").addEventListener("change", function () {
  preventSameUnit("from");
  convert();
});
document.getElementById("toUnit").addEventListener("change", function () {
  preventSameUnit("to");
  convert();
});
document.getElementById("category").addEventListener("change", updateUnits);

// --- Initialize default state ---
updateUnits();
