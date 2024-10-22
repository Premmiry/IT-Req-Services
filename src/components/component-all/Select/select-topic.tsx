import React, { useState, useEffect } from 'react';
import { Autocomplete } from '@mui/joy';
import { FormLabel } from '@mui/material';

interface Topic {
    topic_id: number;
    topic_name: string;
}

interface TopicOption {
    key: number;
    label: string;
}

interface SelectTopicProps {
    selectedTypeId: number | null;
    onSelectTopic: (topicId: number | null) => void;
    initialValue: number | null;
}

export default function SelectTopic({ selectedTypeId, onSelectTopic, initialValue }: SelectTopicProps) {
    const [topics, setTopics] = useState<TopicOption[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<TopicOption | null>(null); // เพิ่ม state สำหรับจัดการค่าที่เลือก
    const [loading, setLoading] = useState<boolean>(false); // เพิ่มสถานะโหลด

    useEffect(() => {
        if (selectedTypeId === null || selectedTypeId === undefined) {
            setSelectedTopic(null);
            setTopics([]);
            return;
        }

        const fetchTopics = async () => {
            setLoading(true);
            try {
                // const response = await fetch(`http://10.200.240.2:1234/topics?typeId=${selectedTypeId}`);
                const response = await fetch(`http://10.200.240.2:1234/topics?typeId=${selectedTypeId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data: Topic[] = await response.json();
                const topicsOptions: TopicOption[] = data.map(topic => ({
                    key: topic.topic_id,
                    label: topic.topic_name
                }));
                setTopics(topicsOptions);
            } catch (error) {
                console.error('Error fetching topics:', error);
                setTopics([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTopics();
    }, [selectedTypeId]);

    useEffect(() => {
        // อัปเดต selectedTopic เมื่อ initialValue เปลี่ยนไป
        if (initialValue !== null && topics.length > 0) {
            const initialTopic = topics.find(topic => topic.key === initialValue) || null;
            setSelectedTopic(initialTopic);
        }
    }, [initialValue, topics]);

    const handleTopicChange = (_event: any, value: TopicOption | null) => {
        setSelectedTopic(value); // อัปเดต state เมื่อเลือกหัวข้อใหม่
        if (onSelectTopic) {
            onSelectTopic(value ? value.key : null);
        }
    };

    return (
        <React.Fragment>
            <FormLabel>หัวข้อ</FormLabel>
            <Autocomplete
                placeholder={loading ? "กำลังโหลด..." : "เลือกหัวข้อ..."}
                options={topics}
                value={selectedTopic} // ใช้ selectedTopic จาก state
                variant="outlined"
                color="primary"
                getOptionLabel={(option: TopicOption) => option.label}
                isOptionEqualToValue={(option: TopicOption, value: TopicOption) => option.key === value?.key}
                onChange={handleTopicChange}
                disabled={selectedTypeId === null || topics.length === 0 || loading}
            />
        </React.Fragment>
    );
}
