import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableFooter,
  TableHeader,
  TableHead,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import EyeIcon from "../assets/icons/EyeIcon";
import DeleteIcon from "../assets/icons/DeleteIcon";
import EditIcon from "../assets/icons/EditIcon";

interface TableDemoProps {
  dataTable: Record<string, any>[];
  activeTotal: boolean;
  actions?: {
    view?: boolean;
    delete?: boolean;
    edit?: boolean;
  };
}
const TableDemo: React.FC<TableDemoProps> = ({
  dataTable = [],
  activeTotal,
  actions,
}) => {
  return (
    <Table>
      <TableHeader className="bg-[#FFEFDE] sticky top-0">
        <TableRow>
          <TableHead className="text-black text-center font-semibold">
            No.
          </TableHead>
          {Object.keys(dataTable[0]).map((key) => (
            <TableHead
              key={key}
              className="text-black text-center font-semibold"
            >
              {key}
            </TableHead>
          ))}
          <TableHead className="text-black text-center font-semibold">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="max-h-full overflow-y-auto overflow-x-hidden">
        {dataTable.map((item, index) => (
          <TableRow key={index} className="table-row">
            <TableCell className="text-center font-semibold">
              {index + 1}
            </TableCell>

            {Object.entries(item).map(([key, value]) => (
              <TableCell key={key} className="text-center">
                {value}
              </TableCell>
            ))}

            <TableCell className="text-center space-x-1">
              {actions?.view && (
                <Button variant="outline" size="icon">
                  <EyeIcon />
                </Button>
              )}
              {actions?.delete && (
                <Button variant="outline" size="icon">
                  <DeleteIcon color="#D32F2F" />
                </Button>
              )}
              {actions?.edit && (
                <Button variant="outline" size="icon">
                  <EditIcon color="#FFC107" />
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>

      {activeTotal && (
        <TableFooter className="sticky bottom-0 bg-[#E4F4E6]">
          <TableRow>
            <TableCell colSpan={dataTable.length} className="font-bold">
              TOTAL:
            </TableCell>
            <TableCell className="text-center font-bold text-[#43A047]">
              $2,500.00
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableFooter>
      )}
    </Table>
  );
};

export default TableDemo;
