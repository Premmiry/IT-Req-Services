import { ReactNode } from 'react';

export interface UserYanhee {
    phone: ReactNode;
    nickname: ReactNode;
    username: string;
    name_employee: string;
    code_employee: string;  
}

export interface Employee {
    id_emp: number;
    username: string;
    emp_name: string;
    code_emp: string;
    phone: string;
    nickname: string;
    name_department: string;
}
