import { Button } from "@/components/ui/button";
import PreviewIcon from "@icons/PreviewIcon";
import EditIcon from "@icons/EditIcon";
import DeleteIcon from "@icons/DeleteIcon";
import { useModal } from "@context/ModalContext";
import { ModalSales } from "@/components/modals/ModalSales";
import type { RecentSalesPaid } from "@typesm/sales";

type Props = {
  row: RecentSalesPaid;
  actions?: {
    view?: boolean;
    edit?: boolean;
    delete?: boolean;
  };
};

export function RowActions({ row, actions }: Props) {
  const { setModal } = useModal();

  const handleView = () => {
    setModal(<ModalSales sale={row} />);
  };

  const handleEdit = () => {
    console.log("EDIT:", row.id);
  };

  const handleDelete = () => {
    console.log("DELETE:", row.id);
  };

  return (
    <div className="flex justify-center items-center space-x-2">
      {actions?.view && (
        <Button variant="outline" size="icon" onClick={handleView}>
          <PreviewIcon />
        </Button>
      )}

      {actions?.edit && (
        <Button variant="outline" size="icon" onClick={handleEdit}>
          <EditIcon color="#F57C00" />
        </Button>
      )}

      {actions?.delete && (
        <Button variant="outline" size="icon" onClick={handleDelete}>
          <DeleteIcon color="#D32F2F" />
        </Button>
      )}
    </div>
  );
}
