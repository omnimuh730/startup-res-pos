export interface CalendarDay {
  isoDate: string;
  day: number;
  inCurrentMonth: boolean;
}

export function buildMonthGrid(year: number, monthZeroBased: number): CalendarDay[] {
  const firstDay = new Date(year, monthZeroBased, 1);
  const daysInMonth = new Date(year, monthZeroBased + 1, 0).getDate();
  const startWeekday = firstDay.getDay();
  const prevMonthDays = new Date(year, monthZeroBased, 0).getDate();
  const grid: CalendarDay[] = [];

  for (let i = startWeekday - 1; i >= 0; i -= 1) {
    const day = prevMonthDays - i;
    const d = new Date(year, monthZeroBased - 1, day);
    grid.push({ isoDate: d.toISOString().slice(0, 10), day, inCurrentMonth: false });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const d = new Date(year, monthZeroBased, day);
    grid.push({ isoDate: d.toISOString().slice(0, 10), day, inCurrentMonth: true });
  }

  while (grid.length < 42) {
    const day = grid.length - (startWeekday + daysInMonth) + 1;
    const d = new Date(year, monthZeroBased + 1, day);
    grid.push({ isoDate: d.toISOString().slice(0, 10), day, inCurrentMonth: false });
  }

  return grid;
}
