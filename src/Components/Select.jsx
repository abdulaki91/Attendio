import { useState, useEffect } from "react";

export default function Select({
  options = [],
  label = "",
  value = "",
  onChange,
  placeholder = "",
  className = "",
  allowOther = true, // NEW: control whether "Other" is allowed
}) {
  const [isCustom, setIsCustom] = useState(false);
  const [customValue, setCustomValue] = useState("");

  // Sync parent value with internal state
  useEffect(() => {
    if (value && !options?.includes(value)) {
      setIsCustom(true);
      setCustomValue(value); // show custom value
    } else {
      setIsCustom(false);
      setCustomValue("");
    }
  }, [value, options]);

  const handleSelectChange = (e) => {
    const selected = e.target.value;
    if (selected === "__other__") {
      setIsCustom(true); // open input
      setCustomValue(""); // input starts empty
    } else {
      setIsCustom(false);
      onChange({ target: { value: selected } });
    }
  };

  const handleCustomInput = (e) => {
    const val = e.target.value;
    setCustomValue(val);
    onChange({ target: { value: val } });
  };

  return (
    <div
      className={`input-wrapper flex items-center w-max justify-center text-xs md:text-sm lg:text-base ${className}`}
    >
      {isCustom ? (
        <input
          type="text"
          className="input input-bordered border-blue-400 m-2 w-full text-xs md:text-sm lg:text-base"
          placeholder={`Enter ${label.toLowerCase()}`}
          value={customValue}
          onChange={handleCustomInput}
          onBlur={() => {
            if (customValue === "") setIsCustom(false);
          }}
        />
      ) : (
        <select
          className="select m-2 w-full text-xs md:text-sm lg:text-base select-bordered border-blue-400"
          value={options.includes(value) ? value : ""}
          onChange={handleSelectChange}
        >
          <option value="">{placeholder || `Select ${label}`}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
          {allowOther && <option value="__other__">Other...</option>}
        </select>
      )}
    </div>
  );
}
