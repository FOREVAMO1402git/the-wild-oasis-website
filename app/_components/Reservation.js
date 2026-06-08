import { auth } from "@/app/_lib/auth";
import { getBookedDatesByCabinId, getSettings } from "@/app/_lib/data-service";
import DateSelector from "./DateSelector";
import LoginMessage from "./LoginMessage";
import ReservationForm from "./ReservationForm";

const Reservation = async ({ cabin }) => {
  const [settings, bookedDates] = await Promise.all([
    getSettings(),
    getBookedDatesByCabinId(cabin.id),
  ]);
  const session = await auth();

  return (
    <div className="border-primary-800 grid h-[46.4rem] grid-cols-2 border xl:h-fit">
      <DateSelector settings={settings} cabin={cabin} bookedDates={bookedDates} />
      {session?.user ?  <ReservationForm user={session?.user} bookedDates={bookedDates} cabin={cabin} /> : <LoginMessage />}
    </div>
  );
};

export default Reservation;
