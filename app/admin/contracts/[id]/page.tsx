import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getContractById } from "@/lib/contractsData";
import { ContractDetail } from "@/app/components/contracts/ContractDetail";

export default async function ContractDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  const { id } = await params;
  const result = await getContractById(id, user.id);

  if (!result) {
    notFound();
  }

  return <ContractDetail contract={result.contract} options={result.options} />;
}
