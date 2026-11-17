import { LinkButton } from "@/components/ui/app-link";
import { PageHeader } from "@/src/app/kit";

export default function NotFound() {
  return (
    <PageHeader
      eyebrow="404"
      title="This field is empty."
      subtitle="The page you were looking for does not exist or has moved."
      actions={<LinkButton to="/dashboard">Back to dashboard</LinkButton>}
    />
  );
}
