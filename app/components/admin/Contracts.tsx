import { ContractList } from "./contracts/ContractList";
import type { ContractFormOptions, ContractListItem } from "@/lib/contractsData";

interface ContractsProps {
  contracts: ContractListItem[];
  options: ContractFormOptions;
}

export function Contracts({ contracts, options }: ContractsProps) {
  return <ContractList contracts={contracts} options={options} />;
}
