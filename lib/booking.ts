/**
 * Model grafiku salonu i wyliczanie dostepnosci.
 *
 * Czas jest liczba godzin dziesietnych (15.5 = 15:30). Silnik jest czysta
 * funkcja: te same rezerwacje daja zawsze te same wolne terminy, wiec da sie
 * go przeniesc 1:1 na backend.
 */

export type Company = "Firma A" | "Firma B";

export interface Service {
  id: string;
  name: string;
  group: "Ciało" | "Twarz" | "Depilacja";
  durationMin: number;
  price: number;
  company: Company;
  /** urzadzenie wymagane przez zabieg (null = zabieg bez urzadzenia) */
  deviceId: string | null;
  /** kwalifikacja, ktora musi miec pracownik */
  qualification: string;
  tone: string;
}

export interface StaffMember {
  id: string;
  name: string;
  initials: string;
  qualifications: string[];
  shiftStart: number;
  shiftEnd: number;
}

export interface Room {
  id: string;
  name: string;
}

export interface Device {
  id: string;
  name: string;
  /** urzadzenie wylaczone z uzycia, np. serwis */
  outOfService?: boolean;
}

export interface Booking {
  id: string;
  day: number;
  start: number;
  end: number;
  clientName: string;
  serviceIds: string[];
  staffId: string;
  roomId: string;
}

export const services: Service[] = [
  { id: "icoone", name: "Icoone Laser 8F", group: "Ciało", durationMin: 50, price: 610, company: "Firma A", deviceId: "icoone-2", qualification: "icoone", tone: "event-violet" },
  { id: "emtone", name: "Emtone — 2 partie", group: "Ciało", durationMin: 40, price: 550, company: "Firma B", deviceId: "emtone", qualification: "emtone", tone: "event-violet" },
  { id: "nordlys", name: "Nordlys Light & Bright", group: "Twarz", durationMin: 60, price: 480, company: "Firma A", deviceId: "nordlys", qualification: "nordlys", tone: "event-blue" },
  { id: "redtouch", name: "Red Touch — twarz", group: "Twarz", durationMin: 45, price: 420, company: "Firma A", deviceId: "redtouch", qualification: "redtouch", tone: "event-blue" },
  { id: "depilacja", name: "Depilacja laserowa — nogi", group: "Depilacja", durationMin: 60, price: 390, company: "Firma B", deviceId: "laser", qualification: "depilacja", tone: "event-green" },
  { id: "masaz", name: "Masaż modelujący", group: "Ciało", durationMin: 60, price: 260, company: "Firma B", deviceId: null, qualification: "masaz", tone: "event-green" },
];

export const staffMembers: StaffMember[] = [
  { id: "marta", name: "Marta Nowak", initials: "MN", qualifications: ["icoone", "emtone", "redtouch"], shiftStart: 9, shiftEnd: 19 },
  { id: "julia", name: "Julia Kot", initials: "JK", qualifications: ["nordlys", "depilacja", "icoone"], shiftStart: 9, shiftEnd: 18 },
  { id: "kinga", name: "Kinga Bąk", initials: "KB", qualifications: ["icoone", "redtouch", "nordlys"], shiftStart: 10, shiftEnd: 19 },
  { id: "ewa", name: "Ewa Zych", initials: "EZ", qualifications: ["emtone", "icoone", "masaz"], shiftStart: 12, shiftEnd: 20 },
];

export const rooms: Room[] = [
  { id: "g1", name: "Gabinet 1" },
  { id: "g2", name: "Gabinet 2" },
  { id: "g3", name: "Gabinet 3" },
  { id: "g4", name: "Gabinet 4" },
];

export const devices: Device[] = [
  { id: "icoone-1", name: "Icoone 1", outOfService: true },
  { id: "icoone-2", name: "Icoone 2" },
  { id: "emtone", name: "Emtone" },
  { id: "nordlys", name: "Nordlys" },
  { id: "redtouch", name: "Red Touch" },
  { id: "laser", name: "Laser depilacyjny" },
];

/** Rezerwacje istniejace w grafiku (dzien 0 = poniedzialek 17 sierpnia). */
export const existingBookings: Booking[] = [
  { id: "b1", day: 0, start: 9, end: 10, clientName: "Beata Król", serviceIds: ["nordlys"], staffId: "julia", roomId: "g1" },
  { id: "b2", day: 0, start: 12, end: 12.75, clientName: "Marta Zych", serviceIds: ["redtouch"], staffId: "marta", roomId: "g2" },
  { id: "b3", day: 1, start: 10, end: 11, clientName: "Iwona Bąk", serviceIds: ["depilacja"], staffId: "julia", roomId: "g1" },
  { id: "b4", day: 1, start: 14, end: 14.83, clientName: "Ewa Lis", serviceIds: ["icoone"], staffId: "kinga", roomId: "g2" },
  { id: "b5", day: 2, start: 9.5, end: 10.17, clientName: "Zofia Nowak", serviceIds: ["emtone"], staffId: "ewa", roomId: "g3" },
  { id: "b6", day: 2, start: 11, end: 11.75, clientName: "Julia Wrona", serviceIds: ["redtouch"], staffId: "kinga", roomId: "g2" },
  { id: "b7", day: 2, start: 13, end: 14, clientName: "Klaudia Sok", serviceIds: ["masaz"], staffId: "marta", roomId: "g4" },
  { id: "b8", day: 2, start: 14.5, end: 15.33, clientName: "Ewa Lis", serviceIds: ["icoone"], staffId: "kinga", roomId: "g2" },
  { id: "b9", day: 2, start: 15.67, end: 16.67, clientName: "Iwona Bąk", serviceIds: ["depilacja"], staffId: "julia", roomId: "g1" },
  { id: "b10", day: 2, start: 17, end: 18, clientName: "Hanna Pawlak", serviceIds: ["nordlys"], staffId: "kinga", roomId: "g1" },
  { id: "b14", day: 2, start: 16, end: 17, clientName: "Marta Zych", serviceIds: ["nordlys"], staffId: "", roomId: "g4" },
  { id: "b11", day: 3, start: 10, end: 10.75, clientName: "Alicja Mróz", serviceIds: ["redtouch"], staffId: "marta", roomId: "g2" },
  { id: "b12", day: 4, start: 13, end: 14, clientName: "Hanna Pawlak", serviceIds: ["depilacja"], staffId: "julia", roomId: "g1" },
  { id: "b13", day: 5, start: 11, end: 11.83, clientName: "Kasia Duda", serviceIds: ["icoone"], staffId: "marta", roomId: "g3" },
];

export const serviceById = (id: string) => services.find((item) => item.id === id);
export const staffById = (id: string) => staffMembers.find((item) => item.id === id);
export const roomById = (id: string) => rooms.find((item) => item.id === id);
export const deviceById = (id: string) => devices.find((item) => item.id === id);

export function formatHour(value: number): string {
  const hours = Math.floor(value);
  const minutes = Math.round((value - hours) * 60);

  return `${hours}:${String(minutes).padStart(2, "0")}`;
}

export function formatRange(start: number, end: number): string {
  return `${formatHour(start)}–${formatHour(end)}`;
}

/** Styk wizyt (koniec = poczatek) nie jest kolizja - stad tolerancja 30 sekund. */
const TOUCH_TOLERANCE = 1 / 120;

function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart < bEnd - TOUCH_TOLERANCE && bStart < aEnd - TOUCH_TOLERANCE;
}

export interface ServiceLeg {
  service: Service;
  start: number;
  end: number;
}

/** Zabiegi w wizycie ida po kolei, jeden po drugim. */
export function legsFor(serviceIds: string[], start: number): ServiceLeg[] {
  const legs: ServiceLeg[] = [];
  let cursor = start;

  for (const id of serviceIds) {
    const service = serviceById(id);

    if (!service) {
      continue;
    }

    const end = cursor + service.durationMin / 60;
    legs.push({ service, start: cursor, end });
    cursor = end;
  }

  return legs;
}

export function totalDuration(serviceIds: string[]): number {
  return serviceIds.reduce((sum, id) => sum + (serviceById(id)?.durationMin ?? 0) / 60, 0);
}

export type StaffStatus = "available" | "busy" | "unqualified" | "off-shift";

export interface StaffOption {
  staff: StaffMember;
  status: StaffStatus;
  reason: string;
}

/** Kto moze wziac te wizyte o tej godzinie i dlaczego pozostali nie moga. */
export function staffOptionsFor(
  serviceIds: string[],
  day: number,
  start: number,
  bookings: Booking[],
): StaffOption[] {
  const end = start + totalDuration(serviceIds);
  const required = serviceIds.map((id) => serviceById(id)?.qualification).filter(Boolean) as string[];

  return staffMembers.map((staff) => {
    const missing = required.filter((qualification) => !staff.qualifications.includes(qualification));

    if (missing.length > 0) {
      const names = missing
        .map((qualification) => services.find((item) => item.qualification === qualification)?.name ?? qualification)
        .join(", ");

      return { staff, status: "unqualified" as const, reason: `brak kwalifikacji: ${names}` };
    }

    if (start < staff.shiftStart || end > staff.shiftEnd) {
      return {
        staff,
        status: "off-shift" as const,
        reason: `grafik ${formatRange(staff.shiftStart, staff.shiftEnd)}`,
      };
    }

    const clash = bookings.find(
      (booking) => booking.day === day && booking.staffId === staff.id && overlaps(start, end, booking.start, booking.end),
    );

    if (clash) {
      return {
        staff,
        status: "busy" as const,
        reason: `zajęta ${formatRange(clash.start, clash.end)} — ${clash.clientName}`,
      };
    }

    return { staff, status: "available" as const, reason: "wolna w tym oknie" };
  });
}

export interface SlotEvaluation {
  start: number;
  end: number;
  feasible: boolean;
  availableStaff: StaffMember[];
  freeRooms: Room[];
  blockers: string[];
}

/** Sprawdza, czy caly zestaw zabiegow zmiesci sie od podanej godziny. */
export function evaluateSlot(
  serviceIds: string[],
  day: number,
  start: number,
  bookings: Booking[],
): SlotEvaluation {
  const legs = legsFor(serviceIds, start);
  const end = start + totalDuration(serviceIds);
  const blockers: string[] = [];

  for (const leg of legs) {
    if (!leg.service.deviceId) {
      continue;
    }

    const device = deviceById(leg.service.deviceId);

    if (!device) {
      continue;
    }

    if (device.outOfService) {
      blockers.push(`${device.name} wyłączone z użycia (serwis)`);
      continue;
    }

    for (const booking of bookings) {
      if (booking.day !== day) {
        continue;
      }

      const busy = legsFor(booking.serviceIds, booking.start).find(
        (other) => other.service.deviceId === device.id && overlaps(leg.start, leg.end, other.start, other.end),
      );

      if (busy) {
        blockers.push(
          `${device.name} zajęte ${formatRange(busy.start, busy.end)} — ${booking.clientName}`,
        );
        break;
      }
    }
  }

  const staffOptions = staffOptionsFor(serviceIds, day, start, bookings);
  const availableStaff = staffOptions.filter((option) => option.status === "available").map((option) => option.staff);

  if (availableStaff.length === 0) {
    const qualified = staffOptions.filter((option) => option.status !== "unqualified");
    blockers.push(
      qualified.length === 0
        ? "nikt w zespole nie ma wymaganych kwalifikacji"
        : "wszyscy uprawnieni kosmetolodzy są zajęci",
    );
  }

  const freeRooms = rooms.filter(
    (room) =>
      !bookings.some(
        (booking) => booking.day === day && booking.roomId === room.id && overlaps(start, end, booking.start, booking.end),
      ),
  );

  if (freeRooms.length === 0) {
    blockers.push("brak wolnego gabinetu w tym oknie");
  }

  return { start, end, feasible: blockers.length === 0, availableStaff, freeRooms, blockers };
}

/** Siatka terminow co 30 minut w godzinach pracy salonu. */
export function slotOptions(serviceIds: string[], day: number, bookings: Booking[]): SlotEvaluation[] {
  const duration = totalDuration(serviceIds);
  const slots: SlotEvaluation[] = [];

  for (let start = 9; start + duration <= 20; start += 0.5) {
    slots.push(evaluateSlot(serviceIds, day, start, bookings));
  }

  return slots;
}
