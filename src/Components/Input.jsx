export default function Input({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  disabled = false,
  readOnly = false,
  ...props
}) {
  return (
    <div className="input-wrapper flex flex-col sm:flex-row items-start sm:items-center justify-center w-full max-w-xs sm:max-w-sm md:max-w-md gap-2 text-xs sm:text-sm md:text-base">
      {label && (
        <label className="font-medium text-xs sm:text-sm md:text-base text-base-content sm:w-32 md:w-40">
          {label}
        </label>
      )}
      <input
        type={type}
        className="input input-bordered border-blue-400 w-full text-xs sm:text-sm md:text-base"
        placeholder={placeholder}
        value={value}
        {...props}
        disabled={disabled}
        readOnly={readOnly}
        onChange={onChange}
      />
    </div>
  );
}
