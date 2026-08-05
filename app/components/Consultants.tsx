import { ConsultantList } from "./consultants/ConsultantList";
import type { ConsultantListItem } from "@/lib/consultantsData";

interface ConsultantsProps {
  consultants: ConsultantListItem[];
  countries: { id: string; name: string; code: string }[];
}

export function Consultants({ consultants, countries }: ConsultantsProps) {
  return <ConsultantList consultants={consultants} countries={countries} />;
}
