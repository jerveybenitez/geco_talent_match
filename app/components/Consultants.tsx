import { ConsultantList } from "./consultants/ConsultantList";

interface ConsultantsProps {
  countries?: Array<{
    country: string;
    countryId: string;
    code: string;
    consultants: unknown[];
  }>;
  overalls?: {
    activeContracts: number;
    totalConsultants: number;
    expiringContracts: number;
  };
  contractRenewals?: Array<{
    contractId: string;
    consultantId: string;
    consultantName: string;
    endDate: Date;
  }>;
  contractExpiration?: Array<{
    month: string;
    count: number;
  }>;
}

export function Consultants(_props: ConsultantsProps) {
  return <ConsultantList />;
}
