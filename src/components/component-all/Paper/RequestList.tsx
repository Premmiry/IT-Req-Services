// import { useNavigate } from 'react-router-dom';
import List_Request from '../Table/List_Request';

// const getChipColor = (dept: string) => {
//     switch (dept) {
//         case 'แผนกพัฒนาโปรแกรม':
//             return '#ffdb9b'; // สีที่กำหนดสำหรับแผนกพัฒนาโปรแกรม
//         case 'แผนกซ่อมบำรุงคอมพิวเตอร์':
//             return '#b0fbf2'; // สีที่กำหนดสำหรับแผนกซ่อมบำรุงคอมพิวเตอร์
//         case 'แผนกควบคุมระบบปฏิบัติงาน':
//             return '#d1fbb0'; // สีที่กำหนดสำหรับแผนกควบคุมระบบปฏิบัติงาน
//         default:
//             return '#d8d8d8'; // สีเริ่มต้น
//     }
// };

// const options = [
//     { value: '1', label: 'พี่พล', position: 'หัวหน้าแผนก', dep: 'พัฒนาโปรแกรม', src: '/static/images/avatar/1.jpg' },
//     { value: '2', label: 'เปรม', position: 'เจ้าหน้าที่', dep: 'พัฒนาโปรแกรม', src: '/static/images/avatar/2.jpg' },
//     { value: '3', label: 'วิค', position: 'เจ้าหน้าที่', dep: 'พัฒนาโปรแกรม', src: '/static/images/avatar/3.jpg' },
//     { value: '4', label: 'ท็อป', position: 'เจ้าหน้าที่', dep: 'พัฒนาโปรแกรม', src: '/static/images/avatar/3.jpg' },
//     { value: '5', label: 'พี่จเด็ด', position: 'หัวหน้าแผนก', dep: 'ซ่อมบำรุงคอมพิวเตอร์', src: '/static/images/avatar/1.jpg' },
//     { value: '6', label: 'พี่เหน่ง', position: 'เจ้าหน้าที่', dep: 'ซ่อมบำรุงคอมพิวเตอร์', src: '/static/images/avatar/2.jpg' },
//     { value: '7', label: 'พี่แจ็ค', position: 'เจ้าหน้าที่', dep: 'ซ่อมบำรุงคอมพิวเตอร์', src: '/static/images/avatar/3.jpg' },
//     { value: '8', label: 'พี่ต้า', position: 'เจ้าหน้าที่', dep: 'ซ่อมบำรุงคอมพิวเตอร์', src: '/static/images/avatar/3.jpg' },
//     { value: '9', label: 'เอิร์ท', position: 'เจ้าหน้าที่', dep: 'ซ่อมบำรุงคอมพิวเตอร์', src: '/static/images/avatar/3.jpg' },
//     { value: '10', label: 'ปูน', position: 'เจ้าหน้าที่', dep: 'ซ่อมบำรุงคอมพิวเตอร์', src: '/static/images/avatar/3.jpg' },
//     { value: '11', label: 'พี่นิด', position: 'หัวหน้าแผนก', dep: 'ควมคุมระบบคอมพิวเตอร์', src: '/static/images/avatar/3.jpg' },
//     { value: '12', label: 'พี่ตา', position: 'เจ้าหน้าที่', dep: 'ควมคุมระบบคอมพิวเตอร์', src: '/static/images/avatar/3.jpg' },
// ];

// const groupedOptions = options.reduce((acc, curr) => {
//     if (!acc[curr.dep]) {
//         acc[curr.dep] = [];
//     }
//     acc[curr.dep].push(curr);
//     return acc;
// }, {} as { [dep: string]: typeof options });

export default function ListServices() {
    // const navigate = useNavigate();

    return (
        <List_Request />
    );
}
