import { Badge } from "@/components/ui/Badge";
import { getStatusColor } from "@/utils/helpers";

export function StatusBadge({ status }) {
  const color = getStatusColor(status);
  return (
    <Badge color={color}>
      {status?.charAt(0).toUpperCase() + status?.slice(1)}
    </Badge>
  );
}

export function ScheduleBadge({ startTime, endTime }) {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  let label, color;
  if (now < start) {
    label = "Scheduled";
    color = "purple";
  } else if (now > end) {
    label = "Expired";
    color = "gray";
  } else {
    label = "Active";
    color = "green";
  }

  return <Badge color={color}>{label}</Badge>;
}
