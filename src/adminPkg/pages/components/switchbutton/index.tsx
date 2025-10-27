import { Switch } from '@tarojs/components';
import { CommonEventFunction } from '@tarojs/components/types/common';
import { SwitchProps } from '@tarojs/components/types/Switch';
import './index.scss';

interface CustomSwitchProps {
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}

export default function SwitchButton({
  checked = false,
  disabled = false,
  onChange
}: CustomSwitchProps) {
  const handleChange: CommonEventFunction<SwitchProps.onChangeEventDetail> = (e) => {
    if (onChange) {
      onChange(e.detail.value);
    }
  };

  return (
    <Switch 
      className="custom-switch"
      checked={checked}
      disabled={disabled}
	  color="#018BBC"
      onChange={handleChange}
    />
  );
}