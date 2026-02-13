import React from "react";
import { Calendar, Check } from "lucide-react";
import "./DateRangePicker.css";

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onChange: (startDate: string, endDate: string) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
}) => {
  const [tempDates, setTempDates] = React.useState({
    startDate,
    endDate,
  });

  React.useEffect(() => {
    setTempDates({ startDate, endDate });
  }, [startDate, endDate]);

  const presets = [
    { label: "Hoje", days: 0 },
    { label: "7 dias", days: 7 },
    { label: "30 dias", days: 30 },
    { label: "90 dias", days: 90 },
    { label: "Tudo", days: -1 },
  ];

  const handleApply = () => {
    onChange(tempDates.startDate, tempDates.endDate);
  };

  const handlePresetClick = (days: number) => {
    const end = new Date();
    let start = new Date();

    if (days === -1) {
      start = new Date("2024-01-01");
    } else {
      start.setDate(start.getDate() - days);
    }

    const newEnd = end.toISOString().split("T")[0];
    const newStart = start.toISOString().split("T")[0];

    onChange(newStart, newEnd);
  };

  const hasChanges =
    tempDates.startDate !== startDate || tempDates.endDate !== endDate;

  return (
    <div className="date-range-picker">
      <div className="date-range-inputs">
        <div className="date-input-group">
          <label>
            <Calendar size={16} />
            Data Inicial
          </label>
          <input
            type="date"
            value={tempDates.startDate}
            onChange={(e) =>
              setTempDates((prev) => ({ ...prev, startDate: e.target.value }))
            }
            max={tempDates.endDate}
          />
        </div>

        <div className="date-input-group">
          <label>
            <Calendar size={16} />
            Data Final
          </label>
          <input
            type="date"
            value={tempDates.endDate}
            onChange={(e) =>
              setTempDates((prev) => ({ ...prev, endDate: e.target.value }))
            }
            min={tempDates.startDate}
            max={new Date().toISOString().split("T")[0]}
          />
        </div>

        <button
          className={`apply-button ${hasChanges ? "pending" : ""}`}
          onClick={handleApply}
          disabled={!hasChanges}
        >
          <Check size={18} />
          <span>Aplicar</span>
        </button>
      </div>

      <div className="date-range-presets">
        {presets.map((preset) => {
          let checkStart = new Date();
          if (preset.days === -1) {
            checkStart = new Date("2024-01-01");
          } else {
            checkStart.setDate(checkStart.getDate() - preset.days);
          }
          const isSelected =
            startDate === checkStart.toISOString().split("T")[0];

          return (
            <button
              key={preset.label}
              className={`preset-button ${isSelected ? "active" : ""}`}
              onClick={() => handlePresetClick(preset.days)}
            >
              {preset.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DateRangePicker;
