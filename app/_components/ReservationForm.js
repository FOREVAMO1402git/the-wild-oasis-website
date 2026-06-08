"use client";

import Image from "next/image";
import { useReservation } from "./ReservationContext";
import { differenceInDays } from "date-fns";
import { createBooking } from "../_lib/actions";
import SubmitButton from "./SubmitButton";

function ReservationForm({ cabin, user }) {
  const { range, resetRange } = useReservation();
  const { maxCapacity, regularPrice, discount, id } = cabin;

  const startDate = range.from;
  const endDate = range.to;

  const numNights = differenceInDays(endDate, startDate);
  const cabinPrice = numNights * (regularPrice - discount);

  const bookingData = {
    startDate,
    endDate,
    numNights,
    cabinPrice,
    cabinId: id,
  };

  const createBookingWithData = createBooking.bind(null, bookingData);

  const src = user.image;
  const alt = user.name;

  // original className for the parent div was scale-[1.01]
  return (
    <div className="h-full">
      <div className="bg-primary-800 text-primary-300 flex h-1/12 items-center justify-between px-16 py-2">
        <p>Logged in as</p>

        <div className="flex items-center gap-4">
          <div className="relative aspect-square h-8">
            <Image
              // Important to display google profile images
              referrerPolicy="no-referrer"
              className="rounded-full object-cover"
              src={src}
              alt={alt}
              fill
            />
          </div>
          <p>{user.name}</p>
        </div>
      </div>

      <form
        // action={createBookingWithData}
        action={async formData => {
          await createBookingWithData(formData);
          resetRange();
        }}
        className="bg-primary-900 flex h-11/12 flex-col justify-start gap-10 px-10 py-5 text-lg xl:gap-5 xl:px-16 xl:py-10"
      >
        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests?</label>
          <select
            name="numGuests"
            id="numGuests"
            className="bg-primary-200 text-primary-800 w-full rounded-sm px-5 py-3 shadow-sm"
            required
          >
            <option value="" key="">
              Select number of guests...
            </option>
            {Array.from({ length: maxCapacity }, (_, i) => i + 1).map(x => (
              <option value={x} key={x}>
                {x} {x === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="observations">
            Anything we should know about your stay?
          </label>
          <textarea
            name="observations"
            id="observations"
            className="bg-primary-200 text-primary-800 h-50 w-full rounded-sm px-5 py-3 shadow-sm xl:h-25"
            placeholder="Any pets, allergies, special requirements, etc.?"
          />
        </div>

        <div className="mt-auto flex items-center justify-between xl:justify-end xl:gap-6">
          {!(startDate && endDate) ? (
            <p className="text-primary-300 text-base">
              Start by selecting dates
            </p>
          ) : (
            <SubmitButton
              defaultText={"Reserve now"}
              loadingText={"Reserving..."}
            />
          )}
        </div>
      </form>
    </div>
  );
}

export default ReservationForm;
