import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import EyeIcon from "../assets/icons/EyeIcon";

interface TableDemoProps {}

const sales = [
  {
    sale: "01",
    date: "16/11/2025",
    totalAmount: "$250.00",
    actions: "Credit Card",
  },
  {
    sale: "02",
    date: "16/11/2025",
    totalAmount: "$150.00",
    actions: "PayPal",
  },
  {
    sale: "03",
    date: "16/11/2025",
    totalAmount: "$350.00",
    actions: "Bank Transfer",
  },
  {
    sale: "04",
    date: "16/11/2025",
    totalAmount: "$450.00",
    actions: "Credit Card",
  },
];

const TableDemo: React.FC<TableDemoProps> = ({}) => {
  return (
    <Table>
      <TableBody>
        {sales.map((sale) => (
          <TableRow key={sale.sale}>
            <TableCell className="font-semibold text-center">
              {sale.sale}
            </TableCell>
            <TableCell className="text-center">{sale.date}</TableCell>
            <TableCell className="text-right">{sale.totalAmount}</TableCell>
            <TableCell className="text-center">
              <Button variant="outline" size="icon" aria-label="Submit">
                <EyeIcon />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableDemo;
