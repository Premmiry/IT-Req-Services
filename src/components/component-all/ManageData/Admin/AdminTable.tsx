import { 
    Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, IconButton, TablePagination 
} from '@mui/material';
import { Block as BlockIcon, Check as CheckIcon } from '@mui/icons-material';
import { Admin } from './admin.types';

interface AdminTableProps {
    admins: Admin[];
    page: number;
    onPageChange: (event: unknown, newPage: number) => void;
    onStatusChange: (admin: Admin) => void;
}

export const AdminTable = ({ 
    admins = [], 
    page = 0,
    onPageChange,
    onStatusChange
}: AdminTableProps) => {
    const rowsPerPage = 5;
    const paginatedAdmins = admins.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align="center" width="15%">ลำดับ</TableCell>
                        <TableCell>ชื่อผู้ใช้</TableCell>
                        <TableCell align="center" width="15%">สถานะ</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {paginatedAdmins.map((admin, index) => (
                        <TableRow key={admin.id_admin}>
                            <TableCell align="center">{page * rowsPerPage + index + 1}</TableCell>
                            <TableCell>
                                {`${admin.username} - ${admin.name_employee}`}
                            </TableCell>
                            <TableCell align="center">
                                <IconButton
                                    color={admin.del_flag === 'N' ? 'success' : 'error'}
                                    onClick={() => onStatusChange(admin)}
                                >
                                    {admin.del_flag === 'N' ? <CheckIcon /> : <BlockIcon />}
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <TablePagination
                component="div"
                count={admins.length}
                page={page}
                onPageChange={onPageChange}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[5]}
            />
        </TableContainer>
    );
};
