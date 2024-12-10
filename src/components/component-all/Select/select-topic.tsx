import React, { useState, useEffect } from 'react';
import { Autocomplete } from '@mui/joy';
import { FormLabel } from '@mui/material';
import URLAPI from '../../../URLAPI';

interface Topic {
    topic_id: number;
    topic_name: string;
    description: string;
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
    const [selectedTopic, setSelectedTopic] = useState<TopicOption | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const isOptionEqualToValue = (option: TopicOption, value: TopicOption | null): boolean => {
        if (!option || !value) return false;
        return option.key === value.key && option.label === value.label;
    };

    useEffect(() => {
        if (selectedTypeId === null || selectedTypeId === undefined) {
            setSelectedTopic(null);
            setTopics([]);
            return;
        }

        const fetchTopics = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${URLAPI}/topics?typeId=${selectedTypeId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data: Topic[] = await response.json();
                const topicsOptions: TopicOption[] = data.map(topic => ({
                    key: topic.topic_id,
                    label: topic.topic_name
                }));
                setTopics(topicsOptions);

                if (initialValue !== null) {
                    const matchingTopic = topicsOptions.find(topic => topic.key === initialValue);
                    setSelectedTopic(matchingTopic || null);
                }
            } catch (error) {
                console.error('Error fetching topics:', error);
                setTopics([]);
                setSelectedTopic(null);
            } finally {
                setLoading(false);
            }
        };

        fetchTopics();
    }, [selectedTypeId, initialValue]);

    const handleTopicChange = (_event: any, value: TopicOption | null) => {
        setSelectedTopic(value);
        onSelectTopic(value?.key ?? null);
    };

    const validSelectedTopic = selectedTopic && topics.some(topic => 
        isOptionEqualToValue(topic, selectedTopic)
    ) ? selectedTopic : null;

    return (
        <React.Fragment>
            <FormLabel>หัวข้อ</FormLabel>
            <Autocomplete
                placeholder={loading ? "กำลังโหลด..." : "เลือกหัวข้อ..."}
                options={topics}
                value={validSelectedTopic}
                variant="outlined"
                color="primary"
                getOptionLabel={(option: TopicOption) => option.label}
                isOptionEqualToValue={isOptionEqualToValue}
                onChange={handleTopicChange}
                disabled={selectedTypeId === null || topics.length === 0 || loading}
                slotProps={{
                    listbox: {
                        sx: { maxHeight: '300px' }
                    }
                }}
                sx={{
                    minWidth: '200px',
                    '& .MuiAutocomplete-input': {
                        padding: '8px 12px'
                    }
                }}
            />
        </React.Fragment>
    );
}