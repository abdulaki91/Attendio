export default function Input({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  disabled = false,
  readOnly = false,
}) {
  return (
    <div className="input-wrapper flex items-center justify-center  text-xs md:text-sm lg:text-base w-max ">
      {label && <label className="input-label md:w-32 lg:w-40">{label}</label>}{" "}
      <input
        type={type}
        className="input m-2 text-xs md:text-sm lg:text-base input-bordered border-blue-400 "
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        readOnly={readOnly}
        onChange={onChange}
      />
    </div>
  );
}
