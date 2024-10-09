import dayjs from "dayjs";

export function mapDateToDateString(date: Date) {
	return dayjs(date).format('YYYY-MM-DD')
}
