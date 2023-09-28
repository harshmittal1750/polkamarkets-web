import React, { useEffect, useRef, useState } from 'react';

import cn from 'classnames';
import { useTheme } from 'ui';

import { ArrowDownSmallIcon } from 'assets/icons';

import Icon from 'components/Icon';

import Text from '../Text';

type Trigger = {
  name: string;
  icon: React.ReactNode;
};

type Option = {
  value: string | number;
  name: string;
  optionalTriggers?: Trigger[];
  defaultTrigger?: number | undefined;
};

export type FilterProps = {
  description: string;
  defaultOption: string;
  options: Option[];
  onChange(change: { value: string | number; optionalTrigger?: string }): void;
  onTouch?: (_touched: boolean) => void;
  className?: string;
};

function Filter({
  description,
  defaultOption,
  options,
  onChange,
  onTouch,
  className
}: FilterProps) {
  const theme = useTheme();

  const [dropdownIsVisible, setDropdownIsVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | undefined>();
  const [selectedOptionalTrigger, setSelectedOptionalTrigger] = useState<
    Trigger | undefined
  >();

  const ref = useRef<HTMLDivElement>(null);

  function handleToggleDropdownVisibility() {
    setDropdownIsVisible(!dropdownIsVisible);
  }

  function handleCloseDropdown() {
    setDropdownIsVisible(false);
  }

  function handleClickOutside(event) {
    if (ref.current && !ref.current.contains(event.target)) {
      handleCloseDropdown();
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });

  useEffect(() => {
    const defaultSelectedOption = options.find(
      option => option.value === defaultOption
    );

    const defaultTrigger =
      defaultSelectedOption?.defaultTrigger !== undefined &&
      defaultSelectedOption?.defaultTrigger !== 1
        ? defaultSelectedOption?.defaultTrigger
        : 1;

    const defaultSelectedTrigger =
      defaultSelectedOption?.optionalTriggers?.[defaultTrigger];

    if (onTouch) {
      onTouch(false);
    }

    setSelectedOption(defaultSelectedOption);
    setSelectedOptionalTrigger(defaultSelectedTrigger || undefined);
  }, [defaultOption, onTouch, options]);

  function handleChangeOption(option: Option) {
    if (onTouch) {
      onTouch(true);
    }

    setSelectedOption(option);

    if (option.optionalTriggers) {
      const defaultTrigger = option.defaultTrigger || 0;
      setSelectedOptionalTrigger(option.optionalTriggers[defaultTrigger]);
    } else {
      setSelectedOptionalTrigger(undefined);
    }
  }

  function handleChangeOptionalTrigger(option: Option, trigger: Trigger) {
    if (onTouch) {
      onTouch(true);
    }

    setSelectedOption(option);
    setSelectedOptionalTrigger(trigger);
  }

  useEffect(() => {
    if (selectedOption) {
      onChange({
        value: selectedOption?.value,
        optionalTrigger: selectedOptionalTrigger?.name
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOption, selectedOptionalTrigger]);

  if (!selectedOption) return null;

  return (
    <div
      aria-label={description}
      role="button"
      tabIndex={0}
      className={cn('pm-c-filter', className)}
      onKeyPress={handleToggleDropdownVisibility}
      onClick={handleToggleDropdownVisibility}
    >
      <Text
        className="pm-c-filter__button"
        /* @ts-ignore */
        as="button"
        scale="tiny-uppercase"
        fontWeight="bold"
        type="button"
      >
        {theme.device.isDesktop ? (
          <>
            <span className="pm-c-filter__label">{description}</span>
            {selectedOption.name}
            <ArrowDownSmallIcon />
          </>
        ) : (
          <Icon name="Sort" />
        )}
      </Text>
      <div
        ref={ref}
        className={cn('pm-c-filter__content', {
          visible: dropdownIsVisible
        })}
      >
        {options.map(option => (
          <div key={option.value} className="pm-c-filter__group">
            <button
              type="button"
              className={
                selectedOption.value === option.value
                  ? 'pm-c-filter__item--active'
                  : 'pm-c-filter__item'
              }
              onClick={() => handleChangeOption(option)}
            >
              {option.name}
            </button>
            {selectedOption.value === option.value ? (
              <div className="pm-c-filter__optional-triggers">
                {option.optionalTriggers?.map(trigger => (
                  <button
                    key={trigger.name}
                    type="button"
                    className={
                      selectedOptionalTrigger?.name === trigger.name
                        ? 'pm-c-filter__optional-trigger--active'
                        : 'pm-c-filter__optional-trigger'
                    }
                    onClick={() => handleChangeOptionalTrigger(option, trigger)}
                  >
                    {trigger.icon}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

Filter.displayName = 'Filter';

export default React.memo(Filter);
