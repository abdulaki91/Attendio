export default function Select({ options, label = "", onChange, value, placeholder = "", className = "" }) {
  return (
    <div className={`input-wrapper flex items-center w-max justify-center text-xs md:text-sm lg:text-base ${className} `}>
      <select
        className={`select m-2  w-full text-xs md:text-sm lg:text-base select-bordered border-blue-400 `}
        onChange={onChange}
        value={value || ""}
      >
        <option value="">{placeholder || label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>   
        ))}
      </select>
    </div>
  );
}
