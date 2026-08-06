"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ConfigTableSection } from "./config/ConfigTableSection";
import type { ConfigRow } from "./config/types";
import type {
  ClientRow,
  ContractTypeRow,
  CountryRow,
  IndustryRow,
  JobRow,
  LanguageRow,
  SkillRow,
} from "@/lib/configTablesData";

interface ConfigTablesProps {
  clients: ClientRow[];
  contractTypes: ContractTypeRow[];
  countries: CountryRow[];
  languages: LanguageRow[];
  industries: IndustryRow[];
  skills: SkillRow[];
  jobs: JobRow[];
}

export function ConfigTables({ clients, contractTypes, countries, languages, industries, skills, jobs }: ConfigTablesProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Config Tables</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage the reference data used across clients, contracts and consultant profiles
        </p>
      </div>

      <Tabs defaultValue="clients">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="contract-types">Contract Types</TabsTrigger>
          <TabsTrigger value="countries">Country</TabsTrigger>
          <TabsTrigger value="languages">Languages</TabsTrigger>
          <TabsTrigger value="industries">Industries</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="clients" className="pt-4">
          <ConfigTableSection
            title="Clients"
            singularLabel="Client"
            apiPath="/api/config/clients"
            columns={[
              { key: "name", label: "Client" },
              { key: "contractsCount", label: "# Contracts" },
            ]}
            fields={[{ key: "name", label: "Client Name" }]}
            rows={clients as unknown as ConfigRow[]}
          />
        </TabsContent>

        <TabsContent value="contract-types" className="pt-4">
          <ConfigTableSection
            title="Contract Types"
            singularLabel="Contract Type"
            apiPath="/api/config/contract-types"
            columns={[
              { key: "name", label: "Contract Type" },
              { key: "description", label: "Description", render: (row) => (row.description as string | null) || "—" },
              { key: "contractsCount", label: "# Contracts" },
            ]}
            fields={[
              { key: "name", label: "Contract Type Name" },
              { key: "description", label: "Description", type: "textarea", required: false },
            ]}
            rows={contractTypes as unknown as ConfigRow[]}
          />
        </TabsContent>

        <TabsContent value="countries" className="pt-4">
          <ConfigTableSection
            title="Country"
            singularLabel="Country"
            apiPath="/api/config/countries"
            columns={[
              { key: "name", label: "Country Name" },
              { key: "countryCode", label: "Country Code" },
              { key: "phone", label: "Phone" },
            ]}
            fields={[
              { key: "name", label: "Country Name" },
              { key: "countryCode", label: "Country Code", placeholder: "e.g. SG" },
              { key: "phone", label: "Phone", placeholder: "e.g. +65" },
            ]}
            rows={countries as unknown as ConfigRow[]}
          />
        </TabsContent>

        <TabsContent value="languages" className="pt-4">
          <ConfigTableSection
            title="Languages"
            singularLabel="Language"
            apiPath="/api/config/languages"
            columns={[{ key: "name", label: "Language" }]}
            fields={[{ key: "name", label: "Language Name" }]}
            rows={languages as unknown as ConfigRow[]}
          />
        </TabsContent>

        <TabsContent value="industries" className="pt-4">
          <ConfigTableSection
            title="Industries"
            singularLabel="Industry"
            apiPath="/api/config/industries"
            columns={[{ key: "name", label: "Industry" }]}
            fields={[{ key: "name", label: "Industry Name" }]}
            rows={industries as unknown as ConfigRow[]}
          />
        </TabsContent>

        <TabsContent value="skills" className="pt-4">
          <ConfigTableSection
            title="Skills"
            singularLabel="Skill"
            apiPath="/api/config/skills"
            columns={[{ key: "name", label: "Skill" }]}
            fields={[{ key: "name", label: "Skill Name" }]}
            rows={skills as unknown as ConfigRow[]}
          />
        </TabsContent>

        <TabsContent value="jobs" className="pt-4">
          <ConfigTableSection
            title="Jobs"
            singularLabel="Role/Job"
            apiPath="/api/config/jobs"
            columns={[{ key: "name", label: "Role/Job" }]}
            fields={[{ key: "name", label: "Role/Job Name" }]}
            rows={jobs as unknown as ConfigRow[]}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
