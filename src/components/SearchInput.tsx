interface SearchInputProps {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}

const SearchInput = ({ value, placeholder, onChange }: SearchInputProps) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white px-4 py-2 shadow-sm">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
      />
    </div>
  );
};

export default SearchInput;
