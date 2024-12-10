import React, { useState, useEffect } from 'react';
import { Autocomplete } from '@mui/joy';
import URLAPI from '../../../URLAPI';

interface Subtopic {
    subtopic_id: number;
    subtopic_name: string;
    pattern: string;
    topic_id: number;
    check_m: number;
    check_d: number;
    check_it_m: number;
    check_it_d: number;
}

interface SubtopicOption {
    key: number;
    label: string;
    pattern: string;
    topic_id: number;
    check_m: number;
    check_d: number;
    check_it_m: number;
    check_it_d: number;
}

interface SelectSubtopicProps {
    onSubtopicChange: (subtopic: SubtopicOption | null) => void;
    initialValue: SubtopicOption | null;
    selectedTopicId: number;
}

export default function SelectSubtopic({ onSubtopicChange, initialValue, selectedTopicId }: SelectSubtopicProps) {
    const [subtopics, setSubtopics] = useState<SubtopicOption[]>([]);
    const [selectedSubtopic, setSelectedSubtopic] = useState<SubtopicOption | null>(initialValue);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setSelectedSubtopic(null);
        onSubtopicChange(null);
        
        if (!selectedTopicId) {
            setSubtopics([]);
            return;
        }

        const fetchSubtopics = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${URLAPI}/subtopic/${selectedTopicId}`);
                const data: Subtopic[] = await response.json();
                const subtopicOptions: SubtopicOption[] = data.map(sub => ({
                    key: sub.subtopic_id,
                    label: sub.subtopic_name,
                    pattern: sub.pattern,
                    topic_id: sub.topic_id,
                    check_m: sub.check_m,
                    check_d: sub.check_d,
                    check_it_m: sub.check_it_m,
                    check_it_d: sub.check_it_d
                }));
                setSubtopics(subtopicOptions);
                // console.log('subtopicOptions', subtopicOptions);
                if (initialValue) {
                    const initialSubtopic = subtopicOptions.find(sub => sub.key === initialValue.key);
                    if (initialSubtopic) {
                        setSelectedSubtopic(initialSubtopic);
                        onSubtopicChange(initialSubtopic);
                    }
                }
            } catch (error) {
                console.error('Error fetching subtopics:', error);
                setSubtopics([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSubtopics();
    }, [selectedTopicId, onSubtopicChange]);

    useEffect(() => {
        if (selectedSubtopic) {
            // console.log('Selected Subtopic Pattern:', selectedSubtopic.pattern);
        }
    }, [selectedSubtopic]);

    return (
        <React.Fragment>
            
            <Autocomplete
                key={`subtopic-${selectedTopicId}`}
                placeholder={loading ? "กำลังโหลด..." : "เลือกเรื่อง..."}
                options={subtopics}
                value={selectedSubtopic}
                variant="outlined"
                color="primary"
                readOnly={false}
                disabled={!selectedTopicId || loading}
                getOptionLabel={(option: SubtopicOption) => option.label}
                isOptionEqualToValue={(option: SubtopicOption, value: SubtopicOption) => option.key === value.key}
                onChange={(_event, value) => {
                    setSelectedSubtopic(value);
                    onSubtopicChange(value);
                }}
            />
        </React.Fragment>
    );
}
