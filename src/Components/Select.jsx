export default function Select({ options, label = "", onChange, value }) {
  return (
    <div className="text-xs md:text-sm lg:text-base  items-center justify-center flex flex-col md:flex-row md:items-center">
      <select
        className="select select-info  w-max border-blue-400 m-2"
        onChange={onChange}
        value={value || ""}
      >
        <option value="">{label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
