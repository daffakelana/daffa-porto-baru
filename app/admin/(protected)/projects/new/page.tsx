import { ProjectForm } from "@/components/admin/ProjectForm";
import { createProjectAction } from "@/lib/admin/project-actions";

export default function NewProjectPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="headline-2 text-[var(--text-color-default)]">Project baru</h1>
      <ProjectForm action={createProjectAction} submitLabel="Buat project" />
    </div>
  );
}