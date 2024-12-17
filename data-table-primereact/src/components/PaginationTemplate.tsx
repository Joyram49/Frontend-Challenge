import { Dropdown } from "primereact/dropdown";
import { Ripple } from "primereact/ripple";
import { classNames } from "primereact/utils";

export const paginationTemplate = {
  layout:
    "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown",
  PrevPageLink: (options: any) => {
    return (
      <button
        type='button'
        className={classNames(options.className, "border-round")}
        onClick={options.onClick}
        disabled={options.disabled}
      >
        <span className='p-3'>Previous</span>
        <Ripple />
      </button>
    );
  },
  NextPageLink: (options: any) => {
    return (
      <button
        type='button'
        className={classNames(options.className, "border-round")}
        onClick={options.onClick}
        disabled={options.disabled}
      >
        <span className='p-3'>Next</span>
        <Ripple />
      </button>
    );
  },
  PageLinks: (options: any) => {
    if (
      (options.view.startPage === options.page &&
        options.view.startPage !== 0) ||
      (options.view.endPage === options.page &&
        options.page + 1 !== options.totalPages)
    ) {
      const className = classNames(options.className, { "p-disabled": true });

      return (
        <span className={className} style={{ userSelect: "none" }}>
          ...
        </span>
      );
    }

    return (
      <button
        type='button'
        className={options.className}
        onClick={options.onClick}
      >
        {options.page + 1}
        <Ripple />
      </button>
    );
  },
  RowsPerPageDropdown: (options: any) => {
    const dropdownOptions = [
      { label: 12, value: 12 },
      { label: 24, value: 24 },
      { label: 36, value: 36 },
      { label: 48, value: 48 },
      { label: "All", value: options.totalRecords },
    ];

    return (
      <Dropdown
        value={options.value}
        options={dropdownOptions}
        onChange={options.onChange}
      />
    );
  },
};
