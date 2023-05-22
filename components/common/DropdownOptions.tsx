import { FC, ReactNode, useState } from "react";

export type dropdownOptions =
  { label: string; onClick(): void }[]

interface Props {
  options: dropdownOptions;
  head: ReactNode;
}

const DropdownOptions: FC<Props> = ({ head, options }): JSX.Element => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <button className="relative" onMouseDown={() => { setShowOptions(!showOptions) }} onBlur={() => { setShowOptions(false) }}>
      {head}
      {showOptions && <div className="absolute z-40 mt-4 text-left border-2 rounded min-w-max top-full right-2 border-primary-dark dark:border-primary bg-primary dark:bg-primary-dark">
        <ul className="p-3 space-y-3">
          {options.map(({ label, onClick }, index) => {
            return <li key={label + index} onMouseDown={onClick} className="text-primary-dark dark:text-primary">{label}</li>
          })}
        </ul>
      </div>}
    </button>
  );
};

export default DropdownOptions;
