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
    onSelectTopic?: (topicId: number | null) => void;
}

export default function SelectTopic({ selectedTypeId, onSelectTopic }: SelectTopicProps) {
    const [topics, setTopics] = useState<TopicOption[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<TopicOption | null>(null);

    useEffect(() => {
        if (selectedTypeId === null) {
            setSelectedTopic(null);
            setTopics([]);
            return;
        }

        const fetchTopics = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:1234/topics?typeId=${selectedTypeId}`);
                const data: Topic[] = await response.json();
                const topicsOptions: TopicOption[] = data.map(topic => ({
                    key: topic.topic_id,
                    label: topic.topic_name
                }));
                setTopics(topicsOptions);
            } catch (error) {
                console.error('Error fetching topics:', error);
            }
        };

        fetchTopics();
    }, [selectedTypeId]);

    const handleTopicChange = (_event: any, value: TopicOption | null) => {
        setSelectedTopic(value);
        if (onSelectTopic) {
            onSelectTopic(value ? value.key : null);
        }
    };

    return (
        <React.Fragment>
            <FormLabel>หัวข้อ</FormLabel>
            <Autocomplete
                placeholder="เลือกหัวข้อ..."
                options={topics}
                value={selectedTopic}
                variant="outlined"
                color="primary"
                getOptionLabel={(option: TopicOption) => option.label}
                isOptionEqualToValue={(option: TopicOption, value: TopicOption) => option.key === value.key}
                onChange={handleTopicChange}
                disabled={selectedTypeId === null || topics.length === 0}
            />
        </React.Fragment>
    );
}
