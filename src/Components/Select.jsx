import { useState, useEffect } from "react";
import Input from "./Input";

export default function Select({
  options = [],
  label = "",
  value = "",
  onChange,
  placeholder = "",
  className = "",
  allowOther = true,
}) {
  const [isCustom, setIsCustom] = useState(false);
  const [customValue, setCustomValue] = useState("");

  useEffect(() => {
    if (value && !options?.includes(value)) {
      setIsCustom(true);
      setCustomValue(value);
    } else {
      setIsCustom(false);
      setCustomValue("");
    }
  }, [value, options]);

  const handleSelectChange = (e) => {
    const selected = e.target.value;
    if (selected === "__other__") {
      setIsCustom(true);
      setCustomValue("");
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
      className={`input-wrapper flex flex-col  max-w-xs sm:max-w-sm md:max-w-md justify-center gap-2 text-xs sm:text-sm md:text-base ${className}`}
    >
      {isCustom ? (
        <Input
          type="text"
          className="input input-bordered border-blue-400 w-full text-xs sm:text-sm md:text-base"
          placeholder={`Enter ${label.toLowerCase()}`}
          value={customValue}
          onChange={handleCustomInput}
          onBlur={() => {
            if (customValue === "") setIsCustom(false);
          }}
        />
      ) : (
        <select
          className="select w-full text-xs sm:text-sm md:text-base select-bordered border-blue-400"
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
