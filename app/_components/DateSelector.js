"use client";

import { differenceInDays, isPast, isSameDay, isWithinInterval } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useReservation } from "./ReservationContext";

function isAlreadyBooked(range, datesArr) {
  return (
    range.from &&
    range.to &&
    datesArr.some(date =>
      isWithinInterval(date, { start: range.from, end: range.to })
    )
  );
}

const YEARS_IN_ADVANCE = 4;

function DateSelector({ settings, cabin, bookedDates }) {
  const { range, setRange, resetRange } = useReservation();

  const displayRange = isAlreadyBooked(range, bookedDates) ? {} : range;

  const { regularPrice, discount } = cabin;
  const numNights =
    displayRange?.from && displayRange?.to ? differenceInDays(displayRange.to, displayRange.from) : 0;
  
  const cabinPrice = numNights * (regularPrice - discount);

  const startMonth = new Date();
  const bookableYears = startMonth.getFullYear() + YEARS_IN_ADVANCE;
  const endMonth = new Date(bookableYears, 11);

  // SETTINGS
  const { minBookingLength, maxBookingLength } = settings;

  return (
    <div className="flex flex-col justify-between gap-10">
      <DayPicker
        className="rdp place-self-center pt-3 pl-3 xl:pl-0"
        mode="range"
        onSelect={setRange}
        selected={displayRange}
        min={minBookingLength + 1}
        max={maxBookingLength}
        startMonth={startMonth}
        endMonth={endMonth}
        // hidden={{ before: startMonth, after: endMonth }}
        captionLayout="dropdown"
        numberOfMonths={2}
        disabled={(curDate) => isPast(curDate) || bookedDates.some(date=>isSameDay(date, curDate))}
      />

      <div className="bg-accent-500 text-primary-800 flex h-24 items-center justify-start px-2 xl:justify-evenly xl:px-8">
        <div className="flex items-baseline gap-6">
          <p className="flex items-baseline gap-2">
            {discount > 0 ? (
              <>
                <span className="text-lg xl:text-2xl">
                  ${regularPrice - discount}
                </span>
                <span className="text-primary-700 ml-0.5 font-semibold line-through xl:ml-0">
                  ${regularPrice}
                </span>
              </>
            ) : (
              <span className="text-lg xl:text-2xl">${regularPrice}</span>
            )}
            <span className="-ml-1 xl:ml-0">/night</span>
          </p>
          {numNights ? (
            <>
              <p className="bg-accent-600 px-2 py-2 text-lg xl:text-2xl">
                <span>&times;</span> <span>{numNights}</span>
              </p>
              <p>
                <span className="-ml-2 text-lg font-bold uppercase xl:ml-0">
                  Total
                </span>{" "}
                <span className="text-lg font-semibold xl:text-2xl">
                  ${cabinPrice}
                </span>
              </p>
            </>
          ) : null}
        </div>

        {range?.from || range?.to ? (
          <button
            className="border-primary-800 ml-auto border px-4 py-2 text-sm font-semibold xl:ml-0"
            onClick={resetRange}
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default DateSelector;
