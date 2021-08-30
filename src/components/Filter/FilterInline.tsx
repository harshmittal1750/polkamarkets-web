/* eslint-disable no-unused-vars */
import { ChangeEvent } from 'react';

import { InfoIcon } from 'assets/icons';

import Checkbox from '../Checkbox';
import Tooltip from '../Tooltip';

type FilterInlineProps = {
  label: string;
  helpText: string;
  onChange: (checked: boolean) => void;
};

function FilterInline({ label, helpText, onChange }: FilterInlineProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { checked } = event.currentTarget;
    onChange(checked);
  }

  return (
    <div className="pm-c-filter-inline">
      <Checkbox label={label} onChange={event => handleChange(event)} />
      <Tooltip text={helpText} position="top">
        <InfoIcon />
      </Tooltip>
    </div>
  );
}

export default FilterInline;
